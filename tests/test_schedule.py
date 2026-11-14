"""Run with: python3 tests/test_schedule.py  (no Home Assistant needed)."""
import importlib.util
from datetime import date
from pathlib import Path

path = Path(__file__).parent.parent / "custom_components/family_today/schedule.py"
spec = importlib.util.spec_from_file_location("schedule", path)
mod = importlib.util.module_from_spec(spec)
import sys; sys.modules["schedule"] = mod
spec.loader.exec_module(mod)

s = mod.Schedule.from_options({
    "terms": [{"name": "Autumn 2", "start": "2026-11-02", "end": "2026-12-18"}],
    "inset_days": ["2026-11-06"],
    "bins": [
        {"name": "General waste", "weekday": 3, "every_n_weeks": 2, "anchor": "2026-11-12"},
        {"name": "Recycling",     "weekday": 3, "every_n_weeks": 2, "anchor": "2026-11-19"},
        {"name": "Food waste",    "weekday": 3, "every_n_weeks": 1, "anchor": "2026-11-12"},
    ],
    "bin_moves": [{"date": "2026-12-24", "moved_to": "2026-12-23"}],
})
names = lambda d: sorted(b.name for b in s.collections_on(d))

# school days
assert s.is_school_day(date(2026, 11, 9))        # Monday in term
assert not s.is_school_day(date(2026, 11, 14))   # Saturday
assert not s.is_school_day(date(2026, 11, 6))    # INSET Friday
assert not s.is_school_day(date(2026, 12, 21))   # after term
assert not s.is_school_day(date(2026, 10, 30))   # half term, before term start window

# bins alternate
assert names(date(2026, 11, 12)) == ["Food waste", "General waste"]
assert names(date(2026, 11, 19)) == ["Food waste", "Recycling"]
assert names(date(2026, 11, 26)) == ["Food waste", "General waste"]
assert names(date(2026, 11, 13)) == []

# bank holiday style move
assert names(date(2026, 12, 24)) == []
assert names(date(2026, 12, 23)) == ["Food waste", "General waste"]

# next collection
nxt = s.next_collection(date(2026, 11, 14))
assert nxt[0] == date(2026, 11, 19) and sorted(b.name for b in nxt[1]) == ["Food waste", "Recycling"]

# ---- calendar-backed mode (e.g. Waste Collection Schedule events)
days = mod.build_calendar_days(
    [
        (date(2026, 11, 19), date(2026, 11, 20), "Recycling"),
        (date(2026, 11, 19), date(2026, 11, 20), " refuse "),
        (date(2026, 11, 26), date(2026, 11, 27), "Refuse"),
        (date(2026, 11, 26), date(2026, 11, 27), "Refuse"),   # duplicate collapses
    ],
    aliases={"Refuse": "General waste"},
)
assert days[date(2026, 11, 19)] == ["Recycling", "General waste"]
assert days[date(2026, 11, 26)] == ["General waste"]

s.calendar_days = days
assert s.names_on(date(2026, 11, 19)) == ["General waste", "Recycling"]
assert s.names_on(date(2026, 11, 12)) == []          # calendar wins over rules
assert s.next_names(date(2026, 11, 14)) == (date(2026, 11, 19), ["General waste", "Recycling"])

s.calendar_days = None                                # fallback to rules
assert s.names_on(date(2026, 11, 12)) == ["Food waste", "General waste"]

# ---- calendar-backed school dates
D = date
term_events = [
    (D(2026, 11, 2), D(2026, 12, 19), "Autumn Term 2"),
    (D(2026, 11, 6), D(2026, 11, 7), "INSET Day"),
    (D(2026, 12, 7), D(2026, 12, 8), "Half term (staff)"),   # break wins over "term"
    (D(2026, 11, 20), D(2026, 11, 21), "Cake sale"),          # unclassified, ignored
]
cal = mod.build_school_calendar(term_events)
assert [t.name for t in cal.terms] == ["Autumn Term 2"]
assert cal.terms[0].end == D(2026, 12, 18)                    # exclusive end -> inclusive
assert D(2026, 11, 6) in cal.break_days and D(2026, 12, 7) in cal.break_days
assert D(2026, 11, 20) not in cal.break_days

sc = mod.Schedule(school_calendar=cal)
assert sc.is_school_day(D(2026, 11, 9))
assert not sc.is_school_day(D(2026, 11, 6))      # INSET from calendar
assert not sc.is_school_day(D(2026, 12, 21))     # after term
assert not sc.is_school_day(D(2026, 11, 14))     # Saturday
assert sc.term_on(D(2026, 11, 9)).name == "Autumn Term 2"

# holiday-only calendar: term implied
hol = mod.build_school_calendar([(D(2026, 12, 19), D(2027, 1, 4), "Christmas Holidays")])
sh = mod.Schedule(school_calendar=hol)
assert sh.is_school_day(D(2026, 12, 16))
assert not sh.is_school_day(D(2026, 12, 22))
assert sh.is_school_day(D(2027, 1, 5))
assert not sh.is_school_day(D(2026, 12, 19))     # Saturday

# nothing classifiable -> has_data False so the coordinator falls back
assert not mod.build_school_calendar([(D(2026, 11, 20), D(2026, 11, 21), "Cake sale")]).has_data

# custom keywords
custom = mod.build_school_calendar(
    [(D(2026, 11, 2), D(2026, 12, 19), "Michaelmas"), (D(2026, 11, 9), D(2026, 11, 10), "Mufti day off")],
    term_keywords=["michaelmas"], break_keywords=["day off"])
assert custom.terms and D(2026, 11, 9) in custom.break_days

# fallback: no school calendar -> manual terms (original schedule `s`)
assert s.school_calendar is None and s.is_school_day(D(2026, 11, 9))

print("all schedule tests passed")
