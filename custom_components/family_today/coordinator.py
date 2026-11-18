"""Coordinator: merges today's events from several calendar entities."""
from __future__ import annotations

import asyncio
from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
import logging
import re
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers import issue_registry as ir
from homeassistant.helpers.storage import Store
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    BIN_LOOKAHEAD_DAYS,
    CALENDAR_TIMEOUT,
    CONF_BIN_ALIASES,
    CONF_BIN_CALENDAR,
    CONF_CALENDARS,
    CONF_NOTIFY_ENTITY,
    CONF_SCHOOL_BREAK_KEYWORDS,
    CONF_SCHOOL_CALENDAR,
    CONF_SCHOOL_TERM_KEYWORDS,
    CONF_SCHOOLS,
    DOMAIN,
    MAX_EVENT_DESCRIPTION,
    SCHOOL_LOOKAHEAD_DAYS,
    SCHOOL_PAST_DAYS,
    UPDATE_INTERVAL,
)
from .schedule import (
    SchoolCalendar,
    SchoolStatus,
    Schedule,
    build_calendar_days,
    build_school_calendar,
)
from .sources import EventCache, SourceHealth

_LOGGER = logging.getLogger(__name__)

ISSUE_CALENDAR_UNAVAILABLE = "calendar_unavailable"


def _error_text(err: Exception) -> str:
    """Short, log-safe description of a fetch failure."""
    text = str(err).strip() or err.__class__.__name__
    return text[:200]


@dataclass(frozen=True)
class FamilyEvent:
    """A single event normalised for the today view."""

    calendar: str
    person: str
    summary: str
    start: datetime
    end: datetime
    all_day: bool
    location: str | None = None
    description: str | None = None

    def as_dict(self) -> dict[str, Any]:
        return {
            "calendar": self.calendar,
            "person": self.person,
            "summary": self.summary,
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "all_day": self.all_day,
            "location": self.location,
            "description": self.description,
        }


@dataclass
class TodayData:
    """What the coordinator hands to entities."""

    events: list[FamilyEvent] = field(default_factory=list)
    by_person: dict[str, list[FamilyEvent]] = field(default_factory=dict)
    next_event: FamilyEvent | None = None
    school_day: bool = False
    term_name: str | None = None
    school: SchoolStatus | None = None
    # Per-person status; the legacy fields above follow the first child.
    school_by_person: dict[str, SchoolStatus] = field(default_factory=dict)
    school_overrides: list[str] = field(default_factory=list)
    bins_today: list[str] = field(default_factory=list)
    bins_tomorrow: list[str] = field(default_factory=list)
    next_bin_date: date | None = None
    next_bin_names: list[str] = field(default_factory=list)
    # name -> {"colour": ..., "icon": ...} for every bin shown today/tomorrow/next
    bin_meta: dict[str, dict[str, str]] = field(default_factory=dict)
    school_source: str = "manual"
    bin_source: str = "rules"
    # True once "Bins are out" has been acknowledged today, so the reminder and
    # its binary sensor stay quiet until tomorrow.
    bins_acknowledged: bool = False
    # {entity_id: health dict}; includes the bin/school calendars as extra roles.
    calendar_status: dict[str, dict[str, Any]] = field(default_factory=dict)
    calendars_ok: int = 0
    calendars_total: int = 0


class FamilyTodayCoordinator(DataUpdateCoordinator[TodayData]):
    """Fetch and merge today's events."""

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        super().__init__(
            hass,
            _LOGGER,
            name=DOMAIN,
            config_entry=entry,
            update_interval=UPDATE_INTERVAL,
        )
        self.entry_id = entry.entry_id
        # Used as the device name, so multiple entries are distinguishable.
        self.entry_title = entry.title or "Family Today"
        # Default notify entity for the `family_today.announce` action.
        self.notify_entity: str | None = entry.options.get(CONF_NOTIFY_ENTITY) or None
        # {calendar_entity_id: person_name}
        self.calendars: dict[str, str] = dict(entry.options.get(CONF_CALENDARS, {}))
        self.schedule = Schedule.from_options(entry.options)
        self.bin_calendar: str | None = entry.options.get(CONF_BIN_CALENDAR) or None
        self.bin_aliases: dict[str, str] = dict(entry.options.get(CONF_BIN_ALIASES, {}))
        # Last good calendar fetch, so a flaky council source doesn't blank the bins.
        self._bin_days_cache: dict[date, list[str]] | None = None
        self.school_calendar_entity: str | None = (
            entry.options.get(CONF_SCHOOL_CALENDAR) or None
        )
        self.school_term_keywords: list[str] = list(
            entry.options.get(CONF_SCHOOL_TERM_KEYWORDS, [])
        )
        self.school_break_keywords: list[str] = list(
            entry.options.get(CONF_SCHOOL_BREAK_KEYWORDS, [])
        )
        # Per-person school overrides, keyed by the person's display name.
        self.schools: dict[str, dict[str, Any]] = {
            str(person): dict(cfg)
            for person, cfg in (entry.options.get(CONF_SCHOOLS) or {}).items()
            if isinstance(cfg, dict)
        }
        people = set(self.calendars.values())
        self.school_overrides: list[str] = sorted(
            person for person in self.schools if person in people
        )
        # Last good raw items per school calendar; keywords are applied per child.
        self._school_items_cache: dict[str, list[tuple[date, date, str]]] = {}
        # Built calendar per person, plus "__global__" for the no-people fallback.
        self._school_cal_cache: dict[str, SchoolCalendar] = {}

        # The date the bins were last acknowledged, persisted so a restart (or
        # an integration reload) doesn't bring the reminder back the same day.
        self._bins_ack: date | None = None
        self._bins_ack_store: Store[dict[str, Any]] = Store(
            hass, 1, f"{DOMAIN}.{entry.entry_id}_bins_ack"
        )

        # Today's events, so a transient failure keeps the agenda populated.
        self._event_cache = EventCache()
        self._health: dict[tuple[str, str], SourceHealth] = {}
        self._issues: set[str] = set()
        for entity_id, person in self.calendars.items():
            self._health[("person", entity_id)] = SourceHealth(
                entity_id, role="person", person=person
            )

    async def _async_update_data(self) -> TodayData:
        day_start = dt_util.start_of_local_day()
        day_end = day_start + timedelta(days=1)
        today = day_start.date()
        now = dt_util.now()

        # One call per calendar, concurrently, so a slow or unavailable source
        # doesn't delay the others or blank the whole view.
        groups = await asyncio.gather(
            *(
                self._async_fetch_person(entity_id, person, day_start, day_end, today)
                for entity_id, person in self.calendars.items()
            )
        )
        events = [event for group in groups for event in group]

        # All-day first, then by start time.
        events.sort(key=lambda e: (not e.all_day, e.start, e.summary))

        by_person: dict[str, list[FamilyEvent]] = {}
        for event in events:
            by_person.setdefault(event.person, []).append(event)

        next_event = next(
            (e for e in events if not e.all_day and e.start >= now), None
        )

        # Bin and school feeds are independent, so refresh them together too.
        tasks = []
        if self.bin_calendar:
            tasks.append(self._async_refresh_bins(day_start))
        if self.school_calendar_entity or self.school_overrides:
            tasks.append(self._async_refresh_schools(day_start))
        if tasks:
            await asyncio.gather(*tasks)

        sched = self.schedule
        people = list(dict.fromkeys(self.calendars.values()))
        school_by_person = {
            person: sched.with_school_calendar(
                self._school_cal_for(person)
            ).school_status(today)
            for person in people
        }
        # Keep the legacy single-school fields meaningful: follow the first
        # child (or the shared feed when there are no people configured).
        default_person = people[0] if people else None
        default_cal = self._school_cal_for(default_person)
        sched.school_calendar = default_cal
        school = sched.school_status(today)
        nxt = sched.next_names(today)
        bins_today = sched.names_on(today)
        bins_tomorrow = sched.names_on(today + timedelta(days=1))
        next_bin_names = nxt[1] if nxt else []
        bin_meta = sched.bin_meta(
            sorted({*bins_today, *bins_tomorrow, *next_bin_names})
        )
        person_health = [
            health for (role, _), health in self._health.items() if role == "person"
        ]
        return TodayData(
            events=events,
            by_person=by_person,
            next_event=next_event,
            school_day=school.is_school_day,
            term_name=school.term,
            school=school,
            school_by_person=school_by_person,
            school_overrides=self.school_overrides,
            bins_today=bins_today,
            bins_tomorrow=bins_tomorrow,
            next_bin_date=nxt[0] if nxt else None,
            next_bin_names=next_bin_names,
            bin_meta=bin_meta,
            school_source="calendar" if default_cal is not None else "manual",
            bin_source="calendar" if sched.calendar_days is not None else "rules",
            bins_acknowledged=self._bins_ack == today,
            calendar_status=self._statuses(),
            calendars_ok=sum(1 for health in person_health if health.ok),
            calendars_total=len(person_health),
        )

    # ---- calendar fetching ------------------------------------------------
    async def _async_get_events(
        self, entity_id: str, start: datetime, end: datetime
    ) -> list[dict[str, Any]]:
        """Read a calendar's events, raising on failure or timeout."""
        response = await asyncio.wait_for(
            self.hass.services.async_call(
                "calendar",
                "get_events",
                {
                    "entity_id": entity_id,
                    "start_date_time": start,
                    "end_date_time": end,
                },
                blocking=True,
                return_response=True,
            ),
            timeout=CALENDAR_TIMEOUT,
        )
        return list((response or {}).get(entity_id, {}).get("events") or [])

    async def async_get_events(
        self,
        start: datetime,
        end: datetime,
        *,
        person: str | None = None,
        calendar: str | None = None,
    ) -> list[FamilyEvent]:
        """Read events in an arbitrary range for actions and templates."""
        if calendar is not None and calendar not in self.calendars:
            raise ValueError(f"{calendar} is not one of this instance's calendars")

        targets = {
            entity_id: owner
            for entity_id, owner in self.calendars.items()
            if (calendar is None or entity_id == calendar)
            and (person is None or owner == person)
        }
        groups = await asyncio.gather(
            *(
                self._async_range_events(entity_id, owner, start, end)
                for entity_id, owner in targets.items()
            )
        )
        return [event for group in groups for event in group]

    async def _async_range_events(
        self, entity_id: str, person: str, start: datetime, end: datetime
    ) -> list[FamilyEvent]:
        raws = await self._async_get_events(entity_id, start, end)
        return [
            event
            for raw in raws
            if (event := self._parse(raw, entity_id, person)) is not None
        ]

    async def async_load_bins_ack(self) -> None:
        """Load the persisted bins acknowledgement before the first refresh."""
        stored = await self._bins_ack_store.async_load()
        raw = (stored or {}).get("date")
        if not raw:
            return
        parsed = dt_util.parse_date(str(raw))
        if parsed is not None:
            self._bins_ack = parsed

    async def async_acknowledge_bins(self) -> None:
        """Mark today's bins as out, hiding the reminder until tomorrow."""
        today = dt_util.start_of_local_day().date()
        self._bins_ack = today
        await self._bins_ack_store.async_save({"date": today.isoformat()})
        if self.data is not None:
            self.data.bins_acknowledged = True
            # Notify the entities without re-reading every calendar.
            self.async_set_updated_data(self.data)

    async def _async_fetch_person(
        self,
        entity_id: str,
        person: str,
        day_start: datetime,
        day_end: datetime,
        today: date,
    ) -> list[FamilyEvent]:
        """Today's events for one person, falling back to today's saved copy."""
        health = self._health_for("person", entity_id, person)
        try:
            raws = await self._async_get_events(entity_id, day_start, day_end)
        except Exception as err:  # noqa: BLE001 - keep the other calendars
            error = _error_text(err)
            cached = self._event_cache.get(entity_id, today)
            health.record_failure(dt_util.now(), error, cached=cached is not None)
            self._sync_repair(health)
            if cached is not None:
                _LOGGER.warning(
                    "Could not read %s (%s); showing today's saved events",
                    entity_id,
                    error,
                )
                return cached
            _LOGGER.warning("Could not read %s: %s", entity_id, error)
            return []

        parsed = [
            event
            for raw in raws
            if (event := self._parse(raw, entity_id, person)) is not None
        ]
        self._event_cache.store(entity_id, today, parsed)
        health.record_success(dt_util.now())
        self._clear_repair(health)
        return parsed

    async def _async_fetch_items(
        self, entity_id: str, day_start: datetime, days: int, past_days: int = 0
    ) -> tuple[list[tuple[date, date, str]] | None, str | None]:
        """Read (start, end_exclusive, summary) items from a calendar entity.

        Returns (None, error) on failure so callers can keep their last good data.
        """
        try:
            raws = await self._async_get_events(
                entity_id,
                day_start - timedelta(days=past_days),
                day_start + timedelta(days=days),
            )
        except Exception as err:  # noqa: BLE001 - keep the last good data
            error = _error_text(err)
            _LOGGER.warning("Could not read calendar %s: %s", entity_id, error)
            return None, error

        items: list[tuple[date, date, str]] = []
        for raw in raws:
            event = self._parse(raw, entity_id, "calendar")
            if event is None:
                continue
            start_d = event.start.date()
            end_d = event.end.date() if event.all_day else start_d + timedelta(days=1)
            items.append((start_d, end_d, event.summary))
        return items, None

    async def _async_refresh_bins(self, day_start: datetime) -> None:
        assert self.bin_calendar is not None
        health = self._health_for("bins", self.bin_calendar)
        items, error = await self._async_fetch_items(
            self.bin_calendar, day_start, BIN_LOOKAHEAD_DAYS
        )
        if error is None:
            assert items is not None
            self._bin_days_cache = build_calendar_days(items, self.bin_aliases)
            health.record_success(dt_util.now())
            self._clear_repair(health)
        else:
            health.record_failure(
                dt_util.now(), error, cached=self._bin_days_cache is not None
            )
            self._sync_repair(health)
        # None here means "no good fetch yet": fall back to manual rules.
        self.schedule.calendar_days = self._bin_days_cache

    def _school_cal_for(self, person: str | None) -> SchoolCalendar | None:
        """Calendar for a person: their override, else the shared feed."""
        if person is not None and person in self.schools:
            return self._school_cal_cache.get(person)
        return self._school_cal_cache.get("__global__")

    def _school_entity_for(self, person: str) -> str | None:
        override = self.schools.get(person) or {}
        entity = override.get("calendar")
        if isinstance(entity, str) and entity:
            return entity
        return self.school_calendar_entity

    @staticmethod
    def _keywords(value: Any, fallback: list[str]) -> list[str]:
        if not isinstance(value, list):
            return list(fallback)
        words = [str(word) for word in value if str(word).strip()]
        return words or list(fallback)

    def _school_keywords_for(self, person: str) -> tuple[list[str], list[str]]:
        override = self.schools.get(person) or {}
        return (
            self._keywords(override.get("term_keywords"), self.school_term_keywords),
            self._keywords(
                override.get("break_keywords"), self.school_break_keywords
            ),
        )

    async def _async_refresh_schools(self, day_start: datetime) -> None:
        """Fetch each unique school feed, then build one calendar per child."""
        entities: list[str] = []
        if self.school_calendar_entity:
            entities.append(self.school_calendar_entity)
        for person in self.school_overrides:
            entity = self._school_entity_for(person)
            if entity and entity not in entities:
                entities.append(entity)

        if entities:
            results = await asyncio.gather(
                *(
                    self._async_fetch_items(
                        entity, day_start, SCHOOL_LOOKAHEAD_DAYS, SCHOOL_PAST_DAYS
                    )
                    for entity in entities
                )
            )
            for entity, (items, error) in zip(entities, results):
                health = self._health_for("school", entity)
                if error is None:
                    assert items is not None
                    # A successful fetch is trusted even with no events in
                    # range, so the default stays "school".
                    self._school_items_cache[entity] = items
                    health.record_success(dt_util.now())
                    self._clear_repair(health)
                else:
                    health.record_failure(
                        dt_util.now(),
                        error,
                        cached=entity in self._school_items_cache,
                    )
                    self._sync_repair(health)

        # Rebuild from the latest good items. On failure the previous per-child
        # calendar stays in place instead of reverting to manual terms.
        for person in sorted(set(self.calendars.values())):
            entity = self._school_entity_for(person)
            items = self._school_items_cache.get(entity) if entity else None
            if items is None:
                continue
            term_kw, break_kw = self._school_keywords_for(person)
            self._school_cal_cache[person] = build_school_calendar(
                items, term_kw, break_kw
            )

        if self.school_calendar_entity and (
            items := self._school_items_cache.get(self.school_calendar_entity)
        ) is not None:
            self._school_cal_cache["__global__"] = build_school_calendar(
                items, self.school_term_keywords, self.school_break_keywords
            )

    # ---- source health / repairs -----------------------------------------
    def _health_for(
        self, role: str, entity_id: str, person: str | None = None
    ) -> SourceHealth:
        key = (role, entity_id)
        health = self._health.get(key)
        if health is None:
            health = SourceHealth(entity_id, role=role, person=person)
            self._health[key] = health
        return health

    def _statuses(self) -> dict[str, dict[str, Any]]:
        """JSON-friendly health for every configured calendar."""
        statuses: dict[str, dict[str, Any]] = {}
        for (role, entity_id), health in self._health.items():
            # Person calendars keep their familiar entity_id key; extra roles
            # are prefixed so the same entity can be used for more than one job.
            key = entity_id if role == "person" else f"{role}:{entity_id}"
            statuses[key] = health.as_dict()
        return statuses

    def _issue_id(self, health: SourceHealth) -> str:
        slug = re.sub(r"[^a-z0-9]+", "_", health.entity_id.lower()).strip("_")
        return f"{self.entry_id}_{health.role}_{slug}"

    def _sync_repair(self, health: SourceHealth) -> None:
        if not health.needs_repair:
            return
        issue_id = self._issue_id(health)
        self._issues.add(issue_id)
        ir.async_create_issue(
            self.hass,
            DOMAIN,
            issue_id,
            is_fixable=False,
            severity=ir.IssueSeverity.WARNING,
            translation_key=ISSUE_CALENDAR_UNAVAILABLE,
            translation_placeholders={
                "entity_id": health.entity_id,
                "error": health.last_error or "unknown error",
            },
        )

    def _clear_repair(self, health: SourceHealth) -> None:
        issue_id = self._issue_id(health)
        self._issues.discard(issue_id)
        # Also clears an issue left in the registry by a previous HA run.
        ir.async_delete_issue(self.hass, DOMAIN, issue_id)

    def clear_issues(self) -> None:
        """Remove this entry's repair issues when it is unloaded."""
        for health in self._health.values():
            ir.async_delete_issue(self.hass, DOMAIN, self._issue_id(health))
        self._issues.clear()

    # ---- parsing ----------------------------------------------------------
    @staticmethod
    def _parse(raw: dict[str, Any], calendar: str, person: str) -> FamilyEvent | None:
        """Turn a get_events item into a FamilyEvent.

        All-day events arrive as 'YYYY-MM-DD' strings (end is exclusive);
        timed events arrive as ISO datetimes.
        """
        try:
            start_raw, end_raw = str(raw["start"]), str(raw["end"])
            all_day = "T" not in start_raw and " " not in start_raw
            if all_day:
                start_d: date | None = dt_util.parse_date(start_raw)
                end_d: date | None = dt_util.parse_date(end_raw)
                if start_d is None or end_d is None:
                    return None
                start = dt_util.start_of_local_day(start_d)
                end = dt_util.start_of_local_day(end_d)
            else:
                start = dt_util.parse_datetime(start_raw)
                end = dt_util.parse_datetime(end_raw)
                if start is None or end is None:
                    return None
                start = dt_util.as_local(start)
                end = dt_util.as_local(end)
        except (KeyError, ValueError):
            return None

        description = raw.get("description") or None
        if description is not None:
            description = str(description)
            if len(description) > MAX_EVENT_DESCRIPTION:
                description = description[:MAX_EVENT_DESCRIPTION] + "…"

        return FamilyEvent(
            calendar=calendar,
            person=person,
            summary=raw.get("summary") or "(no title)",
            start=start,
            end=end,
            all_day=all_day,
            location=raw.get("location") or None,
            description=description,
        )
