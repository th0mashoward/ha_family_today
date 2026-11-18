"""Run with: python3 tests/test_actions.py  (no Home Assistant needed)."""
import importlib.util
from datetime import datetime, timedelta, timezone
from pathlib import Path

path = Path(__file__).parent.parent / "custom_components/family_today/actions.py"
spec = importlib.util.spec_from_file_location("family_today_actions", path)
mod = importlib.util.module_from_spec(spec)
spec.loader.exec_module(mod)

# The shipped blueprint and the notification listener must agree on this name.
assert mod.BINS_OUT_ACTION == "FAMILY_TODAY_BINS_OUT"
blueprint = (
    Path(__file__).parent.parent
    / "blueprints/automation/family_today/bins_out_reminder.yaml"
)
assert mod.BINS_OUT_ACTION in blueprint.read_text(encoding="utf-8")


def raises(call, expected=ValueError):
    try:
        call()
    except expected:
        return
    raise AssertionError(f"{call} did not raise {expected.__name__}")


# ---- parse_range ---------------------------------------------------------
now = datetime(2026, 11, 18, 9, 30)

start, end = mod.parse_range(None, None, now)
assert start == datetime(2026, 11, 18)
assert end == datetime(2026, 11, 19)

# A date-only end includes that whole day.
start, end = mod.parse_range("2026-11-18", "2026-11-18", now)
assert start == datetime(2026, 11, 18)
assert end == datetime(2026, 11, 19)

# A datetime end is already exclusive.
start, end = mod.parse_range("2026-11-18T08:00:00", "2026-11-18T12:00:00", now)
assert start == datetime(2026, 11, 18, 8)
assert end == datetime(2026, 11, 18, 12)

# The range works across a month boundary.
start, end = mod.parse_range("2026-11-30", "2026-12-02", now)
assert start == datetime(2026, 11, 30)
assert end == datetime(2026, 12, 3)

# UTC input is preserved rather than silently treated as local, and a date-only
# end still includes the whole of that day.
start, end = mod.parse_range("2026-11-18T00:00:00Z", "2026-11-18", now)
assert start.tzinfo is not None
assert end.tzinfo == start.tzinfo
assert end - start == timedelta(days=1)

# Mixing naive and aware values doesn't raise a TypeError.
start, end = mod.parse_range(
    "2026-11-18T00:00:00", "2026-11-18T12:00:00+00:00", now
)
assert start.tzinfo is not None and end.tzinfo is not None

raises(lambda: mod.parse_range("2026-11-18", "2026-11-17", now), mod.RangeError)
raises(lambda: mod.parse_range("2026-11-18", "2026-11-18T00:00:00", now), mod.RangeError)
raises(lambda: mod.parse_range("not-a-date", None, now), mod.RangeError)
raises(lambda: mod.parse_range("", None, now), mod.RangeError)
raises(lambda: mod.parse_range(None, "not-a-date", now), mod.RangeError)

# Exactly the cap is fine; a day more is not. A date-only end is inclusive, so
# it needs to be the day before the exclusive bound.
start, end = mod.parse_range(
    "2026-01-01",
    (datetime(2026, 1, 1) + timedelta(days=mod.MAX_RANGE_DAYS - 1)).date().isoformat(),
    now,
)
assert end - start == timedelta(days=mod.MAX_RANGE_DAYS)
raises(
    lambda: mod.parse_range(
        "2026-01-01",
        (datetime(2026, 1, 1) + timedelta(days=mod.MAX_RANGE_DAYS)).date().isoformat(),
        now,
    ),
    mod.RangeError,
)

# ---- build_notification_payload -----------------------------------------
payload = mod.build_notification_payload("  School today  ")
assert payload == {"message": "School today"}

payload = mod.build_notification_payload("Bins tonight", title="  Reminder ")
assert payload == {"message": "Bins tonight", "title": "Reminder"}

payload = mod.build_notification_payload(
    "Bins tonight",
    tag="  family_today_bins ",
    data={"url": "/lovelace/bins"},
)
assert payload["data"] == {"tag": "family_today_bins", "url": "/lovelace/bins"}

payload = mod.build_notification_payload(
    "Bins tonight",
    actions=[
        {"action": "FAMILY_TODAY_BINS_OUT", "title": "Bins are out", "uri": "/bins"},
        {"action": "OPEN_AGENDA"},
    ],
)
assert payload["data"]["actions"] == [
    {"action": "FAMILY_TODAY_BINS_OUT", "title": "Bins are out", "uri": "/bins"},
    {"action": "OPEN_AGENDA", "title": "OPEN_AGENDA"},
]

# Caller data is copied, not mutated.
data = {"image": "/local/bins.png"}
payload = mod.build_notification_payload("Bins", data=data, tag="bins")
assert payload["data"] == {"image": "/local/bins.png", "tag": "bins"}
assert data == {"image": "/local/bins.png"}

raises(lambda: mod.build_notification_payload("   "), mod.NotificationError)
raises(lambda: mod.build_notification_payload(None), mod.NotificationError)
raises(
    lambda: mod.build_notification_payload(
        "Bins", actions=[{"title": "No action"}]
    ),
    mod.NotificationError,
)

print("action helper tests passed")
