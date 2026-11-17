"""Pure scheduling logic for school days and bin collections.

No Home Assistant imports here, so it can be unit tested on its own.
"""
from __future__ import annotations

from dataclasses import dataclass, field, replace
from datetime import date, timedelta
from typing import Any, Iterable, Mapping

DEFAULT_SCHOOL_WEEKDAYS = frozenset({0, 1, 2, 3, 4})
DEFAULT_TERM_KEYWORDS = ("term",)
DEFAULT_BREAK_KEYWORDS = (
    "holiday", "half term", "half-term", "inset", "closed",
    "break", "bank holiday", "training day",
)
MAX_BREAK_DAYS = 120  # guard against runaway multi-month ranges


DEFAULT_BIN_ICON = "mdi:delete"
# First keyword match wins, so specific bins come before the generic ones.
BIN_ICON_HINTS: tuple[tuple[tuple[str, ...], str], ...] = (
    (("recycl",), "mdi:recycle"),
    (("garden", "green"), "mdi:leaf"),
    (("food",), "mdi:food-apple-outline"),
    (("glass", "bottle"), "mdi:bottle-wine-outline"),
    (("paper", "cardboard", "card"), "mdi:package-variant-closed"),
    (("textile", "clothes", "clothing"), "mdi:tshirt-crew-outline"),
    (("battery",), "mdi:battery"),
    (("electric", "electronic", "weee"), "mdi:power-plug-outline"),
    (("compost",), "mdi:compost"),
    (("general", "refuse", "rubbish", "trash", "waste"), "mdi:trash-can"),
)


def guess_bin_icon(name: str) -> str:
    """Pick a sensible icon for a bin name when none is configured."""
    text = name.lower()
    for keywords, icon in BIN_ICON_HINTS:
        if any(keyword in text for keyword in keywords):
            return icon
    return DEFAULT_BIN_ICON


def _to_date(value: Any) -> date:
    return value if isinstance(value, date) else date.fromisoformat(str(value))


@dataclass(frozen=True)
class Term:
    name: str
    start: date
    end: date


def _iso(value: date | None) -> str | None:
    return value.isoformat() if value else None


@dataclass(frozen=True)
class SchoolBreak:
    """A holiday or INSET run, as shown on the school card."""

    name: str
    start: date
    end: date | None = None  # inclusive; None when the next term is unknown
    days_until: int | None = None

    @property
    def kind(self) -> str:
        text = self.name.lower()
        if "inset" in text or "training day" in text:
            return "inset"
        return "holiday"

    @property
    def days(self) -> int | None:
        """Inclusive length in calendar days, when the end is known."""
        return (self.end - self.start).days + 1 if self.end else None

    def as_dict(self) -> dict[str, Any]:
        return {
            "name": self.name,
            "start": _iso(self.start),
            "end": _iso(self.end),
            "days": self.days,
            "days_until": self.days_until,
            "kind": self.kind,
        }


@dataclass(frozen=True)
class BinRule:
    name: str
    weekday: int          # Monday=0
    every_n_weeks: int    # 1 = weekly, 2 = fortnightly...
    anchor: date          # any date this bin is known to be collected
    colour: str | None = None


@dataclass(frozen=True)
class SchoolCalendar:
    """School dates learned from a calendar.

    The calendar is treated as a list of days off: anything it marks as a
    break (holiday, half term, INSET...) is a non-school day, and every other
    weekday is a school day. Term spans are only used to name the current term.
    """

    terms: tuple[Term, ...] = ()
    break_days: frozenset[date] = frozenset()
    # day -> the calendar event that made it a break, for "why no school?".
    break_names: dict[date, str] = field(default_factory=dict)

    @property
    def has_data(self) -> bool:
        return bool(self.terms or self.break_days)


@dataclass(frozen=True)
class SchoolStatus:
    """Display-friendly snapshot of one day's school status.

    Dates stay as `date` here (and are serialised in `as_dict`) so the pure
    logic stays testable; the card reads the JSON-friendly attributes.
    """

    is_school_day: bool
    reason: str | None = None
    term: str | None = None
    term_start: date | None = None
    term_end: date | None = None
    days_until_term_end: int | None = None
    # Progress through the current term, counted in actual school days.
    term_school_days: int | None = None
    term_school_days_done: int | None = None
    term_progress: int | None = None
    next_term: str | None = None
    next_term_start: date | None = None
    days_until_next_term: int | None = None
    next_break: str | None = None
    next_break_start: date | None = None
    days_until_next_break: int | None = None
    back_to_school: date | None = None
    days_until_school: int | None = None
    upcoming_breaks: tuple[SchoolBreak, ...] = ()

    def as_dict(self) -> dict[str, Any]:
        return {
            "is_school_day": self.is_school_day,
            "reason": self.reason,
            "term": self.term,
            "term_start": _iso(self.term_start),
            "term_end": _iso(self.term_end),
            "days_until_term_end": self.days_until_term_end,
            "term_school_days": self.term_school_days,
            "term_school_days_done": self.term_school_days_done,
            "term_progress": self.term_progress,
            "next_term": self.next_term,
            "next_term_start": _iso(self.next_term_start),
            "days_until_next_term": self.days_until_next_term,
            "next_break": self.next_break,
            "next_break_start": _iso(self.next_break_start),
            "days_until_next_break": self.days_until_next_break,
            "back_to_school": _iso(self.back_to_school),
            "days_until_school": self.days_until_school,
            "upcoming_breaks": [brk.as_dict() for brk in self.upcoming_breaks],
        }


@dataclass
class Schedule:
    terms: tuple[Term, ...] = ()
    inset_days: frozenset[date] = frozenset()
    school_weekdays: frozenset[int] = DEFAULT_SCHOOL_WEEKDAYS
    bins: tuple[BinRule, ...] = ()
    # original date -> new date (None = skipped)
    bin_moves: dict[date, date | None] = field(default_factory=dict)
    # When not None, collections come from here (date -> bin names) instead
    # of the weekday/anchor rules. Populated from a calendar entity.
    calendar_days: dict[date, list[str]] | None = None
    # When not None, school terms/breaks come from here instead of `terms`.
    school_calendar: SchoolCalendar | None = None
    # Display name -> {"colour": ..., "icon": ...}. Works for calendar-backed
    # and manual bins alike because it is matched on the displayed name.
    bin_appearance: dict[str, dict[str, str]] = field(default_factory=dict)

    # ---- construction -------------------------------------------------
    @classmethod
    def from_options(cls, options: Mapping[str, Any]) -> "Schedule":
        terms = tuple(
            Term(t["name"], _to_date(t["start"]), _to_date(t["end"]))
            for t in options.get("terms", [])
        )
        bins = tuple(
            BinRule(
                name=b["name"],
                weekday=int(b["weekday"]),
                every_n_weeks=max(1, int(b.get("every_n_weeks", 1))),
                anchor=_to_date(b["anchor"]),
                colour=b.get("colour"),
            )
            for b in options.get("bins", [])
        )
        moves = {
            _to_date(m["date"]): (_to_date(m["moved_to"]) if m.get("moved_to") else None)
            for m in options.get("bin_moves", [])
        }
        appearance: dict[str, dict[str, str]] = {}
        for name, cfg in (options.get("bin_appearance") or {}).items():
            values = {"colour": cfg} if isinstance(cfg, str) else dict(cfg or {})
            clean = {
                key: str(values[key]).strip()
                for key in ("colour", "icon")
                if values.get(key)
            }
            if clean:
                appearance[str(name)] = clean
        return cls(
            terms=terms,
            inset_days=frozenset(_to_date(d) for d in options.get("inset_days", [])),
            school_weekdays=frozenset(
                int(d) for d in options.get("school_weekdays", DEFAULT_SCHOOL_WEEKDAYS)
            ),
            bins=bins,
            bin_moves=moves,
            bin_appearance=appearance,
        )

    # ---- school -------------------------------------------------------
    def with_school_calendar(self, calendar: SchoolCalendar | None) -> "Schedule":
        """View of the same rules with a different school feed (per child)."""
        return replace(self, school_calendar=calendar)

    def term_on(self, day: date) -> Term | None:
        """Name of the term containing `day`, for display only."""
        cal = self.school_calendar
        if cal is not None:
            if term := next((t for t in cal.terms if t.start <= day <= t.end), None):
                return term
        return next((t for t in self.terms if t.start <= day <= t.end), None)

    def is_school_day(self, day: date) -> bool:
        """School by default; only weekends, INSET and calendar breaks close it."""
        if day.weekday() not in self.school_weekdays or day in self.inset_days:
            return False
        cal = self.school_calendar
        if cal is not None:
            return day not in cal.break_days
        # No school calendar configured: fall back to the manual term dates.
        return self.term_on(day) is not None

    def break_reason(self, day: date) -> str | None:
        """Why `day` is not a school day, or None when it is one."""
        if self.is_school_day(day):
            return None
        if day in self.inset_days:
            return "INSET day"
        cal = self.school_calendar
        if cal is not None and day in cal.break_days:
            return cal.break_names.get(day) or "School holiday"
        if day.weekday() not in self.school_weekdays:
            return "Weekend" if day.weekday() >= 5 else "Day off"
        if cal is None and not self.terms:
            return "No term dates set"
        return "School holiday"

    def next_term(self, day: date) -> Term | None:
        """First term starting after `day` (used for back-to-school countdowns)."""
        cal = self.school_calendar
        terms = cal.terms if cal is not None and cal.terms else self.terms
        return next(
            (t for t in sorted(terms, key=lambda t: t.start) if t.start > day), None
        )

    def next_break(self, day: date) -> tuple[date, str] | None:
        """Next holiday/INSET after `day`, ignoring ordinary weekends."""
        starts: dict[date, str] = {}

        def add(when: date, label: str) -> None:
            # A named break beats the generic "School holiday" on the same day.
            if when not in starts or starts[when] == "School holiday":
                starts[when] = label

        cal = self.school_calendar
        if term := self.term_on(day):
            if term.end >= day:
                start = term.end + timedelta(days=1)
                label = "School holiday"
                if cal is not None:
                    # The holiday event often starts a day or two after the last
                    # school day, so borrow its name for the term-end marker.
                    for when, name in sorted(cal.break_names.items()):
                        if start <= when <= start + timedelta(days=7):
                            label = name
                            break
                add(start, label)
        if cal is not None:
            for when, name in sorted(cal.break_names.items()):
                if when > day:
                    add(when, name)
                    break
        for inset in sorted(self.inset_days):
            if inset > day:
                add(inset, "INSET day")
                break
        return min(starts.items()) if starts else None

    def next_school_day(self, day: date, horizon_days: int = 366) -> date | None:
        """First school day strictly after `day`."""
        for offset in range(1, horizon_days + 1):
            candidate = day + timedelta(days=offset)
            if self.is_school_day(candidate):
                return candidate
        return None

    def upcoming_breaks(self, day: date, limit: int = 6) -> tuple[SchoolBreak, ...]:
        """Next named holidays/INSET days, earliest first.

        Weekend-only gaps are not listed. A term end without a named calendar
        event still makes a "School holiday" entry so the card can always show
        the next long break.
        """
        runs = self._calendar_break_runs()
        covered = (
            set(self.school_calendar.break_days)
            if self.school_calendar is not None
            else set()
        )
        runs.extend(self._inset_runs(covered))

        candidates: dict[date, SchoolBreak] = {
            brk.start: brk for brk in runs if brk.start >= day
        }

        cal = self.school_calendar
        terms = cal.terms if cal is not None and cal.terms else self.terms
        for term in sorted(terms, key=lambda t: t.start):
            start = term.end + timedelta(days=1)
            if start < day:
                continue
            # A named holiday close to the term end already describes this
            # break; don't add a duplicate "School holiday" marker. An INSET
            # day alone does not mask the surrounding holiday.
            if any(
                start <= brk.start <= start + timedelta(days=7)
                and brk.kind == "holiday"
                for brk in candidates.values()
            ):
                continue
            following = self.next_term(term.end)
            end = following.start - timedelta(days=1) if following else None
            candidates.setdefault(start, SchoolBreak("School holiday", start, end))

        ordered = sorted(candidates.values(), key=lambda brk: brk.start)
        return tuple(
            replace(brk, days_until=(brk.start - day).days)
            for brk in ordered[: max(0, limit)]
        )

    def _calendar_break_runs(self) -> list[SchoolBreak]:
        """Group consecutive calendar break days, splitting when names change."""
        cal = self.school_calendar
        if cal is None:
            return []
        runs: list[SchoolBreak] = []
        start = prev = None
        name = ""
        for day in sorted(cal.break_days):
            day_name = cal.break_names.get(day) or "School holiday"
            if prev is not None and day == prev + timedelta(days=1) and day_name == name:
                prev = day
                continue
            if start is not None and prev is not None:
                runs.append(SchoolBreak(name, start, prev))
            start = prev = day
            name = day_name
        if start is not None and prev is not None:
            runs.append(SchoolBreak(name, start, prev))
        return runs

    def _inset_runs(self, covered: set[date]) -> list[SchoolBreak]:
        """Manual INSET days not already described by the school calendar."""
        runs: list[SchoolBreak] = []
        start = prev = None
        for day in sorted(self.inset_days):
            if day in covered:
                continue
            if prev is not None and day == prev + timedelta(days=1):
                prev = day
                continue
            if start is not None and prev is not None:
                runs.append(SchoolBreak("INSET day", start, prev))
            start = prev = day
        if start is not None and prev is not None:
            runs.append(SchoolBreak("INSET day", start, prev))
        return runs

    def _term_school_days(self, term: Term, day: date) -> tuple[int, int]:
        """(school days done through `day`, total school days) for a term."""
        done = total = 0
        for offset in range((term.end - term.start).days + 1):
            candidate = term.start + timedelta(days=offset)
            if not self.is_school_day(candidate):
                continue
            total += 1
            if candidate <= day:
                done += 1
        return done, total

    def school_status(self, day: date) -> SchoolStatus:
        """Everything the card needs to explain today's school flag."""
        is_school = self.is_school_day(day)
        term = self.term_on(day)
        upcoming = self.next_term(day)

        reason = None
        next_break = next_break_start = days_until_break = None
        back_to_school = days_until_school = None
        term_done = term_school_days = term_progress = None

        if term is not None:
            term_done, term_school_days = self._term_school_days(term, day)
            if term_school_days:
                term_progress = round(term_done * 100 / term_school_days)

        if is_school:
            if found := self.next_break(day):
                next_break_start, next_break = found
                days_until_break = (next_break_start - day).days
        else:
            reason = self.break_reason(day)
            if back := self.next_school_day(day):
                back_to_school = back
                days_until_school = (back - day).days

        return SchoolStatus(
            is_school_day=is_school,
            reason=reason,
            term=term.name if term else None,
            term_start=term.start if term else None,
            term_end=term.end if term else None,
            days_until_term_end=(term.end - day).days if term else None,
            term_school_days=term_school_days,
            term_school_days_done=term_done,
            term_progress=term_progress,
            next_term=upcoming.name if upcoming else None,
            next_term_start=upcoming.start if upcoming else None,
            days_until_next_term=(upcoming.start - day).days if upcoming else None,
            next_break=next_break,
            next_break_start=next_break_start,
            days_until_next_break=days_until_break,
            back_to_school=back_to_school,
            days_until_school=days_until_school,
            upcoming_breaks=self.upcoming_breaks(day),
        )

    # ---- bins ---------------------------------------------------------
    @staticmethod
    def _rule_matches(rule: BinRule, day: date) -> bool:
        if day.weekday() != rule.weekday:
            return False
        # Compare Monday-of-week so the anchor needn't share the weekday.
        week = day - timedelta(days=day.weekday())
        anchor_week = rule.anchor - timedelta(days=rule.anchor.weekday())
        return ((week - anchor_week).days // 7) % rule.every_n_weeks == 0

    def _regular_on(self, day: date) -> list[BinRule]:
        return [r for r in self.bins if self._rule_matches(r, day)]

    def collections_on(self, day: date) -> list[BinRule]:
        """Bins collected on `day`, after applying bank-holiday style moves."""
        found: dict[str, BinRule] = {}
        if day not in self.bin_moves:
            for rule in self._regular_on(day):
                found[rule.name] = rule
        for original, moved_to in self.bin_moves.items():
            if moved_to == day:
                for rule in self._regular_on(original):
                    found[rule.name] = rule
        return sorted(found.values(), key=lambda r: r.name)

    def next_collection(
        self, from_day: date, horizon_days: int = 90
    ) -> tuple[date, list[BinRule]] | None:
        for offset in range(horizon_days + 1):
            day = from_day + timedelta(days=offset)
            if bins := self.collections_on(day):
                return day, bins
        return None

    # ---- appearance ----------------------------------------------------
    def bin_meta(self, names: Iterable[str]) -> dict[str, dict[str, str]]:
        """Colour/icon metadata for `names`, matched case-insensitively.

        Precedence: configured appearance, then a manual rule's colour, then
        an icon guessed from the name.
        """
        appearance = {
            k.strip().lower(): v for k, v in self.bin_appearance.items()
        }
        rule_colours = {
            r.name.strip().lower(): r.colour for r in self.bins if r.colour
        }
        meta: dict[str, dict[str, str]] = {}
        for name in names:
            key = name.strip().lower()
            cfg = appearance.get(key, {})
            entry = {"icon": cfg.get("icon") or guess_bin_icon(name)}
            if colour := cfg.get("colour") or rule_colours.get(key):
                entry["colour"] = colour
            meta[name] = entry
        return meta

    # ---- unified view (calendar-backed or rule-based) ------------------
    def names_on(self, day: date) -> list[str]:
        """Names of bins collected on `day`, from the calendar if available."""
        if self.calendar_days is not None:
            return sorted(self.calendar_days.get(day, []))
        return [r.name for r in self.collections_on(day)]

    def next_names(
        self, from_day: date, horizon_days: int = 90
    ) -> tuple[date, list[str]] | None:
        for offset in range(horizon_days + 1):
            day = from_day + timedelta(days=offset)
            if names := self.names_on(day):
                return day, names
        return None


def build_calendar_days(
    events: Iterable[tuple[date, date, str]],
    aliases: Mapping[str, str] | None = None,
) -> dict[date, list[str]]:
    """Turn (start, end_exclusive, summary) calendar events into date -> bin names.

    Summaries are stripped and matched case-insensitively against `aliases`
    so e.g. "Refuse" can display as "General waste". Multi-day events are
    expanded (capped at 7 days to guard against runaway ranges).
    """
    alias_map = {k.strip().lower(): v for k, v in (aliases or {}).items()}
    days: dict[date, list[str]] = {}
    for start, end, summary in events:
        name = alias_map.get(summary.strip().lower(), summary.strip())
        if not name:
            continue
        span = max(1, min((end - start).days, 7))
        for offset in range(span):
            bucket = days.setdefault(start + timedelta(days=offset), [])
            if name not in bucket:
                bucket.append(name)
    return days


def build_school_calendar(
    events: Iterable[tuple[date, date, str]],
    term_keywords: Iterable[str] | None = None,
    break_keywords: Iterable[str] | None = None,
) -> SchoolCalendar:
    """Classify (start, end_exclusive, summary) events as term spans or breaks.

    Break keywords are checked first, so "Half term" is a break even though it
    contains "term". Events matching neither are ignored. Single-day term
    events ("Term starts", "Term ends") are markers rather than spans, so they
    are ignored instead of becoming one-day terms.

    Break event names are kept per day so the card can say *why* there is no
    school. When a single-day event (e.g. an INSET day) falls inside a longer
    holiday, the shorter, more specific event wins.
    """
    term_kw = [k.lower() for k in (term_keywords or DEFAULT_TERM_KEYWORDS)]
    break_kw = [k.lower() for k in (break_keywords or DEFAULT_BREAK_KEYWORDS)]
    terms: list[Term] = []
    breaks: dict[date, tuple[str, int]] = {}
    for start, end, summary in events:
        text = summary.lower()
        span = max(1, min((end - start).days, MAX_BREAK_DAYS))
        if any(k in text for k in break_kw):
            name = summary.strip() or "School holiday"
            for offset in range(span):
                day = start + timedelta(days=offset)
                previous = breaks.get(day)
                if previous is None or span < previous[1]:
                    breaks[day] = (name, span)
        elif any(k in text for k in term_kw) and (end - start).days > 1:
            terms.append(Term(summary.strip(), start, end - timedelta(days=1)))
    terms.sort(key=lambda t: t.start)
    return SchoolCalendar(
        tuple(terms),
        frozenset(breaks),
        {day: name for day, (name, _span) in breaks.items()},
    )
