"""Fetch bookkeeping: last-good event cache and per-source health.

No Home Assistant imports here, so both can be unit tested directly.
"""
from __future__ import annotations

from dataclasses import dataclass
from datetime import date, datetime
from typing import Any

# How many consecutive failed refreshes before a source is worth a repair.
DEFAULT_FAILURE_THRESHOLD = 3


class EventCache:
    """Last successful event list per calendar, for one day at a time.

    A transient source failure reuses the same day's events instead of blanking
    the agenda; a cache from an earlier day is never reused.
    """

    def __init__(self) -> None:
        self._entries: dict[str, tuple[date, list[Any]]] = {}

    def store(self, key: str, day: date, events: list[Any]) -> None:
        self._entries[key] = (day, list(events))

    def get(self, key: str, day: date) -> list[Any] | None:
        entry = self._entries.get(key)
        if entry is None or entry[0] != day:
            return None
        return list(entry[1])

    def drop(self, key: str) -> None:
        self._entries.pop(key, None)


@dataclass
class SourceHealth:
    """Success/failure bookkeeping for one calendar entity."""

    entity_id: str
    role: str = "person"  # person | bins | school
    person: str | None = None
    failure_threshold: int = DEFAULT_FAILURE_THRESHOLD
    last_attempt: datetime | None = None
    last_success: datetime | None = None
    last_error: str | None = None
    consecutive_failures: int = 0
    using_cache: bool = False

    def record_success(self, at: datetime) -> None:
        self.last_attempt = at
        self.last_success = at
        self.last_error = None
        self.consecutive_failures = 0
        self.using_cache = False

    def record_failure(self, at: datetime, error: str, *, cached: bool) -> None:
        self.last_attempt = at
        self.last_error = error
        self.consecutive_failures += 1
        self.using_cache = cached

    @property
    def ok(self) -> bool:
        return self.last_error is None

    @property
    def needs_repair(self) -> bool:
        return self.consecutive_failures >= self.failure_threshold

    def as_dict(self) -> dict[str, Any]:
        return {
            "entity_id": self.entity_id,
            "role": self.role,
            "person": self.person,
            "ok": self.ok,
            "using_cache": self.using_cache,
            "consecutive_failures": self.consecutive_failures,
            "last_attempt": _iso(self.last_attempt),
            "last_success": _iso(self.last_success),
            "last_error": self.last_error,
        }


def _iso(value: datetime | None) -> str | None:
    return value.isoformat() if value else None
