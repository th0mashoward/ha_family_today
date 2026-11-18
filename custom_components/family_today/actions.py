"""Pure helpers for the Family Today actions.

No Home Assistant imports here, so the date-range and notification logic can be
unit tested on its own.
"""
from __future__ import annotations

from datetime import datetime, timedelta
from typing import Any, Iterable, Mapping

# Guard against a runaway service call that reads years of calendar history.
MAX_RANGE_DAYS = 366

# Action name the shipped bins-reminder blueprint attaches to its button. The
# mobile app fires it back as a `mobile_app_notification_action` event.
BINS_OUT_ACTION = "FAMILY_TODAY_BINS_OUT"


class RangeError(ValueError):
    """The requested get_events range is invalid."""


class NotificationError(ValueError):
    """The requested announcement is invalid."""


def _parse_moment(value: str, *, inclusive_date: bool = False) -> datetime:
    """Parse an ISO date or datetime.

    A date-only value has no time part, so an `end` date is treated as inclusive
    (the whole day is included) by moving the exclusive bound to the next day.
    """
    text = str(value).strip()
    if not text:
        raise RangeError("Expected an ISO date or datetime, got an empty value")
    try:
        parsed = datetime.fromisoformat(text.replace("Z", "+00:00"))
    except ValueError as err:
        raise RangeError(f"'{text}' is not an ISO date or datetime") from err
    if inclusive_date and len(text) == 10:
        parsed += timedelta(days=1)
    return parsed


def parse_range(
    start: str | None, end: str | None, now: datetime
) -> tuple[datetime, datetime]:
    """Resolve a requested range into an inclusive start and exclusive end.

    `start` defaults to the beginning of today and `end` to 24 hours later, so
    calling the action with no fields reads today's events. A date-only `end`
    includes that whole day; a datetime `end` is already exclusive.
    """
    start_dt = (
        _parse_moment(start)
        if start is not None
        else now.replace(hour=0, minute=0, second=0, microsecond=0)
    )
    if end is not None:
        end_dt = _parse_moment(end, inclusive_date=True)
    else:
        end_dt = start_dt + timedelta(days=1)

    # A caller may mix a naive datetime with an aware one; compare in whichever
    # timezone was supplied rather than raising a TypeError.
    if start_dt.tzinfo is None and end_dt.tzinfo is not None:
        start_dt = start_dt.replace(tzinfo=end_dt.tzinfo)
    elif start_dt.tzinfo is not None and end_dt.tzinfo is None:
        end_dt = end_dt.replace(tzinfo=start_dt.tzinfo)

    if end_dt <= start_dt:
        raise RangeError("'end' must be after 'start'")
    if end_dt - start_dt > timedelta(days=MAX_RANGE_DAYS):
        raise RangeError(f"The range is limited to {MAX_RANGE_DAYS} days")
    return start_dt, end_dt


def build_notification_payload(
    message: str,
    *,
    title: str | None = None,
    actions: Iterable[Mapping[str, Any]] | None = None,
    data: Mapping[str, Any] | None = None,
    tag: str | None = None,
) -> dict[str, Any]:
    """Build the payload for `notify.send_message`.

    `actions` become companion-app notification buttons; each needs an `action`
    and may set a `title` and `uri`. `data` is merged through so callers can use
    app-specific keys (image, url, group...).
    """
    text = str(message or "").strip()
    if not text:
        raise NotificationError("'message' is required")

    payload: dict[str, Any] = {"message": text}
    if name := str(title or "").strip():
        payload["title"] = name

    block: dict[str, Any] = dict(data or {})
    if slug := str(tag or "").strip():
        block["tag"] = slug

    if actions:
        buttons: list[dict[str, str]] = []
        for item in actions:
            action = str(item.get("action") or "").strip()
            if not action:
                raise NotificationError("Each notification action needs an 'action'")
            button = {"action": action, "title": str(item.get("title") or action)}
            if uri := str(item.get("uri") or "").strip():
                button["uri"] = uri
            buttons.append(button)
        block["actions"] = buttons

    if block:
        payload["data"] = block
    return payload
