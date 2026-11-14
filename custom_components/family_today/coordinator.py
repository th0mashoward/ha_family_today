"""Coordinator: merges today's events from several calendar entities."""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, datetime, timedelta
import logging
from typing import Any

from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.exceptions import HomeAssistantError
from homeassistant.helpers.update_coordinator import DataUpdateCoordinator
from homeassistant.util import dt as dt_util

from .const import (
    BIN_LOOKAHEAD_DAYS,
    CONF_BIN_ALIASES,
    CONF_BIN_CALENDAR,
    CONF_CALENDARS,
    CONF_SCHOOL_BREAK_KEYWORDS,
    CONF_SCHOOL_CALENDAR,
    CONF_SCHOOL_TERM_KEYWORDS,
    DOMAIN,
    SCHOOL_LOOKAHEAD_DAYS,
    UPDATE_INTERVAL,
)
from .schedule import SchoolCalendar, Schedule, build_calendar_days, build_school_calendar

_LOGGER = logging.getLogger(__name__)


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

    def as_dict(self) -> dict[str, Any]:
        return {
            "calendar": self.calendar,
            "person": self.person,
            "summary": self.summary,
            "start": self.start.isoformat(),
            "end": self.end.isoformat(),
            "all_day": self.all_day,
            "location": self.location,
        }


@dataclass
class TodayData:
    """What the coordinator hands to entities."""

    events: list[FamilyEvent] = field(default_factory=list)
    by_person: dict[str, list[FamilyEvent]] = field(default_factory=dict)
    next_event: FamilyEvent | None = None
    school_day: bool = False
    term_name: str | None = None
    bins_today: list[str] = field(default_factory=list)
    bins_tomorrow: list[str] = field(default_factory=list)
    next_bin_date: date | None = None
    next_bin_names: list[str] = field(default_factory=list)
    school_source: str = "manual"
    bin_source: str = "rules"


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
        self._school_cal_cache: SchoolCalendar | None = None

    async def _async_update_data(self) -> TodayData:
        day_start = dt_util.start_of_local_day()
        day_end = day_start + timedelta(days=1)

        events: list[FamilyEvent] = []
        # One call per calendar so a single unavailable calendar
        # doesn't blank the whole view.
        for entity_id, person in self.calendars.items():
            try:
                response = await self.hass.services.async_call(
                    "calendar",
                    "get_events",
                    {
                        "entity_id": entity_id,
                        "start_date_time": day_start,
                        "end_date_time": day_end,
                    },
                    blocking=True,
                    return_response=True,
                )
            except HomeAssistantError as err:
                _LOGGER.warning("Could not read %s: %s", entity_id, err)
                continue

            for raw in response.get(entity_id, {}).get("events", []):
                if (event := self._parse(raw, entity_id, person)) is not None:
                    events.append(event)

        # All-day first, then by start time.
        events.sort(key=lambda e: (not e.all_day, e.start, e.summary))

        by_person: dict[str, list[FamilyEvent]] = {}
        for event in events:
            by_person.setdefault(event.person, []).append(event)

        now = dt_util.now()
        next_event = next(
            (e for e in events if not e.all_day and e.start >= now), None
        )
        if self.bin_calendar:
            if (days := await self._async_fetch_bin_days(day_start)) is not None:
                self._bin_days_cache = days
            # None here means "no good fetch yet": fall back to manual rules.
            self.schedule.calendar_days = self._bin_days_cache

        if self.school_calendar_entity:
            items = await self._async_fetch_items(
                self.school_calendar_entity, day_start, SCHOOL_LOOKAHEAD_DAYS
            )
            if items is not None:
                cal = build_school_calendar(
                    items, self.school_term_keywords, self.school_break_keywords
                )
                # No usable events -> fall back to manual terms rather than
                # claiming every weekday is a school day.
                self._school_cal_cache = cal if cal.has_data else None
            self.schedule.school_calendar = self._school_cal_cache

        today = dt_util.now().date()
        sched = self.schedule
        term = sched.term_on(today)
        nxt = sched.next_names(today)
        return TodayData(
            events=events,
            by_person=by_person,
            next_event=next_event,
            school_day=sched.is_school_day(today),
            term_name=term.name if term else None,
            bins_today=sched.names_on(today),
            bins_tomorrow=sched.names_on(today + timedelta(days=1)),
            next_bin_date=nxt[0] if nxt else None,
            next_bin_names=nxt[1] if nxt else [],
            school_source="calendar" if sched.school_calendar is not None else "manual",
            bin_source="calendar" if sched.calendar_days is not None else "rules",
        )

    async def _async_fetch_items(
        self, entity_id: str, day_start: datetime, days: int
    ) -> list[tuple[date, date, str]] | None:
        """Read (start, end_exclusive, summary) items from a calendar entity.

        Returns None on failure so callers can keep their last good data.
        """
        try:
            response = await self.hass.services.async_call(
                "calendar",
                "get_events",
                {
                    "entity_id": entity_id,
                    "start_date_time": day_start,
                    "end_date_time": day_start + timedelta(days=days),
                },
                blocking=True,
                return_response=True,
            )
        except HomeAssistantError as err:
            _LOGGER.warning("Could not read calendar %s: %s", entity_id, err)
            return None

        items: list[tuple[date, date, str]] = []
        for raw in response.get(entity_id, {}).get("events", []):
            event = self._parse(raw, entity_id, "calendar")
            if event is None:
                continue
            start_d = event.start.date()
            end_d = event.end.date() if event.all_day else start_d + timedelta(days=1)
            items.append((start_d, end_d, event.summary))
        return items

    async def _async_fetch_bin_days(
        self, day_start: datetime
    ) -> dict[date, list[str]] | None:
        assert self.bin_calendar is not None
        items = await self._async_fetch_items(
            self.bin_calendar, day_start, BIN_LOOKAHEAD_DAYS
        )
        return None if items is None else build_calendar_days(items, self.bin_aliases)

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

        return FamilyEvent(
            calendar=calendar,
            person=person,
            summary=raw.get("summary") or "(no title)",
            start=start,
            end=end,
            all_day=all_day,
            location=raw.get("location") or None,
        )
