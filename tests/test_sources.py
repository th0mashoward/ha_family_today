"""Run with: python3 tests/test_sources.py  (no Home Assistant needed)."""
import importlib.util
import sys
from datetime import date, datetime, timezone
from pathlib import Path

path = Path(__file__).parent.parent / "custom_components/family_today/sources.py"
spec = importlib.util.spec_from_file_location("sources", path)
mod = importlib.util.module_from_spec(spec)
sys.modules["sources"] = mod
spec.loader.exec_module(mod)

today = date(2026, 11, 17)
tomorrow = date(2026, 11, 18)
now = datetime(2026, 11, 17, 8, 30, tzinfo=timezone.utc)

# ---- EventCache
cache = mod.EventCache()
assert cache.get("calendar.tom", today) is None

cache.store("calendar.tom", today, ["dentist"])
assert cache.get("calendar.tom", today) == ["dentist"]
assert cache.get("calendar.tom", tomorrow) is None, "never reuse yesterday's events"
assert cache.get("calendar.sam", today) is None

# callers get a copy, so accidental mutation can't corrupt the cache
saved = cache.get("calendar.tom", today)
saved.append("leaked")
assert cache.get("calendar.tom", today) == ["dentist"]

cache.drop("calendar.tom")
assert cache.get("calendar.tom", today) is None
cache.drop("calendar.nobody")  # dropping an unknown key is harmless

# a later success replaces the same day's events
cache.store("calendar.tom", today, ["dentist", "swimming"])
assert cache.get("calendar.tom", today) == ["dentist", "swimming"]

# ---- SourceHealth
health = mod.SourceHealth("calendar.tom", role="person", person="Tom")
assert health.ok and not health.using_cache and not health.needs_repair
assert health.as_dict()["entity_id"] == "calendar.tom"
assert health.as_dict()["person"] == "Tom"
assert health.as_dict()["role"] == "person"
assert health.as_dict()["last_attempt"] is None

health.record_failure(now, "timeout", cached=False)
assert not health.ok
assert health.consecutive_failures == 1
assert not health.needs_repair
assert health.as_dict()["last_error"] == "timeout"
assert health.as_dict()["last_attempt"] == now.isoformat()
assert health.as_dict()["last_success"] is None

# a cached retry still counts as a failure for the repair threshold
health.record_failure(now, "timeout", cached=True)
assert health.using_cache
assert health.ok is False
assert health.consecutive_failures == 2
assert not health.needs_repair

health.record_failure(now, "timeout", cached=True)
assert health.needs_repair, "three consecutive failures raise a repair"

later = datetime(2026, 11, 17, 8, 35, tzinfo=timezone.utc)
health.record_success(later)
assert health.ok and not health.using_cache and not health.needs_repair
assert health.consecutive_failures == 0
assert health.last_error is None
assert health.as_dict()["last_success"] == later.isoformat()

# custom thresholds are honoured
strict = mod.SourceHealth("calendar.bins", role="bins", failure_threshold=1)
strict.record_failure(now, "404", cached=False)
assert strict.needs_repair
assert strict.as_dict()["role"] == "bins"

print("all source health/cache tests passed")
