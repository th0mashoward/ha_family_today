"""Pure scheduling logic for school days and bin collections.

No Home Assistant imports here, so it can be unit tested on its own.
"""
from __future__ import annotations

from dataclasses import dataclass, field
from datetime import date, timedelta
from typing import Any, Iterable, Mapping

DEFAULT_SCHOOL_WEEKDAYS = frozenset({0, 1, 2, 3, 4})
DEFAULT_TERM_KEYWORDS = ("term",)
DEFAULT_BREAK_KEYWORDS = (
    "holiday", "half term", "half-term", "inset", "closed",
    "break", "bank holiday", "training day",
)
MAX_BREAK_DAYS = 120  # guard against runaway multi-month ranges


def _to_date(value: Any) -> date:
    return value if isinstance(value, date) else date.fromisoformat(str(value))


@dataclass(frozen=True)
class Term:
    name: str
    start: date
    end: date


@dataclass(frozen=True)
class BinRule:
    name: str
    weekday: int          # Monday=0
    every_n_weeks: int    # 1 = weekly, 2 = fortnightly...
    anchor: date          # any date this bin is known to be collected
    colour: str | None = None


@dataclass(frozen=True)
class SchoolCalendar:
    """School dates learned from a calendar (term spans and/or break days)."""

    terms: tuple[Term, ...] = ()
    break_days: frozenset[date] = frozenset()

    @property
    def has_data(self) -> bool:
        return bool(self.terms or self.break_days)


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
        return cls(
            terms=terms,
            inset_days=frozenset(_to_date(d) for d in options.get("inset_days", [])),
            school_weekdays=frozenset(
                int(d) for d in options.get("school_weekdays", DEFAULT_SCHOOL_WEEKDAYS)
            ),
            bins=bins,
            bin_moves=moves,
        )

    # ---- school -------------------------------------------------------
    def term_on(self, day: date) -> Term | None:
        cal = self.school_calendar
        if cal is not None:
            if term := next((t for t in cal.terms if t.start <= day <= t.end), None):
                return term
            if cal.terms:
                return None
            # Holiday-only calendar: no term names, so use manual terms for the name.
        return next((t for t in self.terms if t.start <= day <= t.end), None)

    def is_school_day(self, day: date) -> bool:
        if day.weekday() not in self.school_weekdays or day in self.inset_days:
            return False
        cal = self.school_calendar
        if cal is not None:
            if day in cal.break_days:
                return False
            if cal.terms:
                return self.term_on(day) is not None
            return True  # holiday-only calendar: any non-break weekday is a school day
        return self.term_on(day) is not None

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
    contains "term". Events matching neither are ignored.
    """
    term_kw = [k.lower() for k in (term_keywords or DEFAULT_TERM_KEYWORDS)]
    break_kw = [k.lower() for k in (break_keywords or DEFAULT_BREAK_KEYWORDS)]
    terms: list[Term] = []
    breaks: set[date] = set()
    for start, end, summary in events:
        text = summary.lower()
        if any(k in text for k in break_kw):
            for offset in range(max(1, min((end - start).days, MAX_BREAK_DAYS))):
                breaks.add(start + timedelta(days=offset))
        elif any(k in text for k in term_kw):
            terms.append(Term(summary.strip(), start, max(start, end - timedelta(days=1))))
    terms.sort(key=lambda t: t.start)
    return SchoolCalendar(tuple(terms), frozenset(breaks))
