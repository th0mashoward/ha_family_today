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

# ---- calendar-backed school dates (the calendar is a list of days off)
D = date
term_events = [
    (D(2026, 11, 2), D(2026, 12, 19), "Autumn Term 2"),       # used for the term name
    (D(2026, 11, 6), D(2026, 11, 7), "INSET Day"),
    (D(2026, 12, 7), D(2026, 12, 8), "Half term (staff)"),   # break wins over "term"
    (D(2026, 12, 19), D(2027, 1, 4), "Christmas Holidays"),
    (D(2026, 11, 20), D(2026, 11, 21), "Cake sale"),          # unclassified, ignored
]
cal = mod.build_school_calendar(term_events)
assert [t.name for t in cal.terms] == ["Autumn Term 2"]
assert cal.terms[0].end == D(2026, 12, 18)                    # exclusive end -> inclusive
assert D(2026, 11, 6) in cal.break_days and D(2026, 12, 7) in cal.break_days
assert D(2026, 11, 20) not in cal.break_days

sc = mod.Schedule(school_calendar=cal)
assert sc.is_school_day(D(2026, 11, 9))          # ordinary weekday
assert not sc.is_school_day(D(2026, 11, 6))      # INSET from calendar
assert not sc.is_school_day(D(2026, 11, 14))     # Saturday
assert not sc.is_school_day(D(2026, 12, 22))     # calendar holiday
assert sc.is_school_day(D(2027, 1, 5))           # back after the holiday
assert sc.term_on(D(2026, 11, 9)).name == "Autumn Term 2"
assert sc.term_on(D(2026, 12, 22)) is None       # outside the term span

# Single-day "Term starts"/"Term ends" markers must not become one-day terms
# (that used to make every other day "No school").
markers = [
    (D(2026, 9, 2), D(2026, 9, 3), "Term starts"),
    (D(2026, 10, 26), D(2026, 10, 31), "Half term"),
    (D(2026, 11, 2), D(2026, 11, 3), "Term starts"),
    (D(2026, 12, 18), D(2026, 12, 19), "Term ends"),
]
marker_cal = mod.build_school_calendar(markers)
assert not marker_cal.terms
ms = mod.Schedule(school_calendar=marker_cal)
assert ms.is_school_day(D(2026, 11, 16))         # ordinary Monday
assert not ms.is_school_day(D(2026, 10, 27))     # half term
assert not ms.is_school_day(D(2026, 11, 21))     # Saturday

# Empty calendar still defaults to school (weekends stay off).
empty = mod.Schedule(school_calendar=mod.build_school_calendar([]))
assert empty.is_school_day(D(2026, 11, 16))
assert not empty.is_school_day(D(2026, 11, 15))

# holiday-only calendar: term implied
hol = mod.build_school_calendar([(D(2026, 12, 19), D(2027, 1, 4), "Christmas Holidays")])
sh = mod.Schedule(school_calendar=hol)
assert sh.is_school_day(D(2026, 12, 16))
assert not sh.is_school_day(D(2026, 12, 22))
assert sh.is_school_day(D(2027, 1, 5))
assert not sh.is_school_day(D(2026, 12, 19))     # Saturday

# nothing classifiable -> nothing learned
assert not mod.build_school_calendar([(D(2026, 11, 20), D(2026, 11, 21), "Cake sale")]).has_data

# custom keywords
custom = mod.build_school_calendar(
    [(D(2026, 11, 2), D(2026, 12, 19), "Michaelmas"), (D(2026, 11, 9), D(2026, 11, 10), "Mufti day off")],
    term_keywords=["michaelmas"], break_keywords=["day off"])
assert custom.terms and D(2026, 11, 9) in custom.break_days

# fallback: no school calendar -> manual terms (original schedule `s`)
assert s.school_calendar is None and s.is_school_day(D(2026, 11, 9))
assert not s.is_school_day(D(2026, 12, 21))      # manual term boundary still applies

# ---- bin colours/icons
assert mod.guess_bin_icon("Recycling") == "mdi:recycle"
assert mod.guess_bin_icon("Garden waste") == "mdi:leaf"
assert mod.guess_bin_icon("Food waste") == "mdi:food-apple-outline"
assert mod.guess_bin_icon("General waste") == "mdi:trash-can"
assert mod.guess_bin_icon("Glass bottles") == "mdi:bottle-wine-outline"
assert mod.guess_bin_icon("Mystery") == "mdi:delete"

styled = mod.Schedule.from_options({
    "bins": [
        {"name": "General waste", "weekday": 3, "every_n_weeks": 1,
         "anchor": "2026-11-12", "colour": "brown"},
        {"name": "Recycling", "weekday": 3, "every_n_weeks": 2, "anchor": "2026-11-19"},
    ],
    "bin_appearance": {
        "general waste": {"colour": "grey", "icon": "mdi:trash-can"},  # case-insensitive
        "Recycling": {"colour": "#2563eb"},                            # icon guessed
        "Unknown bin": {"icon": "mdi:help"},
    },
})
meta = styled.bin_meta(["General waste", "Recycling", "Unknown bin", "Glass"])
assert meta["General waste"] == {"colour": "grey", "icon": "mdi:trash-can"}  # config wins over rule
assert meta["Recycling"] == {"colour": "#2563eb", "icon": "mdi:recycle"}
assert meta["Unknown bin"] == {"icon": "mdi:help"}
assert meta["Glass"] == {"icon": "mdi:bottle-wine-outline"}

# a manual rule's colour is used when no appearance is configured
rules_only = mod.Schedule.from_options({"bins": [
    {"name": "General waste", "weekday": 3, "every_n_weeks": 1,
     "anchor": "2026-11-12", "colour": "brown"},
]})
assert rules_only.bin_meta(["General waste"]) == {
    "General waste": {"colour": "brown", "icon": "mdi:trash-can"},
}

# hand-edited options may give a bare colour string
legacy = mod.Schedule.from_options({"bin_appearance": {"Recycling": "blue"}})
assert legacy.bin_meta(["Recycling"])["Recycling"]["colour"] == "blue"

# ---- per-child school calendars (same rules, different feeds)
sibling_a = mod.build_school_calendar([
    (D(2026, 11, 2), D(2026, 12, 19), "Autumn Term 2"),
    (D(2026, 11, 6), D(2026, 11, 7), "INSET Day"),
])
sibling_b = mod.build_school_calendar([
    (D(2026, 11, 2), D(2026, 12, 19), "Autumn Term 2"),
    (D(2026, 11, 9), D(2026, 11, 10), "INSET Day"),
])
base = mod.Schedule()
a = base.with_school_calendar(sibling_a)
b = base.with_school_calendar(sibling_b)
assert base.school_calendar is None, "per-child views do not mutate the shared rules"

a_status = a.school_status(D(2026, 11, 6))
b_status = b.school_status(D(2026, 11, 6))
assert not a_status.is_school_day and a_status.reason == "INSET Day"
assert b_status.is_school_day
assert b_status.next_break == "INSET Day"
assert b_status.days_until_next_break == 3
assert a_status.back_to_school == D(2026, 11, 9)

# the siblings disagree on the Monday, so one has school and one does not
assert a.is_school_day(D(2026, 11, 9))
assert not b.is_school_day(D(2026, 11, 9))
assert b.break_reason(D(2026, 11, 9)) == "INSET Day"

# ---- term progress (actual school days) and upcoming-break timeline
progress_cal = mod.build_school_calendar([
    (D(2026, 11, 2), D(2026, 11, 14), "Autumn Term 2"),   # ends Fri 13 Nov
    (D(2026, 11, 6), D(2026, 11, 7), "INSET Day"),
    (D(2026, 11, 16), D(2026, 11, 29), "Half term (staff)"),
    (D(2026, 11, 30), D(2026, 12, 19), "Winter Term"),    # ends Fri 18 Dec
    (D(2026, 12, 4), D(2026, 12, 5), "INSET Day"),
    (D(2026, 12, 19), D(2027, 1, 5), "Christmas Holidays"),
    (D(2027, 1, 5), D(2027, 2, 14), "Spring Term"),
])
progress = mod.Schedule(
    inset_days=frozenset({D(2026, 11, 24)})  # already covered by half term
).with_school_calendar(progress_cal)

pst = progress.school_status(D(2026, 11, 10))
assert pst.term == "Autumn Term 2" and pst.term_start == D(2026, 11, 2)
assert pst.days_until_term_end == 3
# 10 weekdays in the term minus the Fri 6 Nov INSET; done through Tue 10 Nov
assert (pst.term_school_days, pst.term_school_days_done) == (9, 6)
assert pst.term_progress == 67
assert pst.upcoming_breaks[0].name == "Half term (staff)"
assert pst.upcoming_breaks[0].start == D(2026, 11, 16)
assert pst.upcoming_breaks[0].end == D(2026, 11, 28)
assert pst.upcoming_breaks[0].days == 13
assert pst.upcoming_breaks[0].days_until == 6
assert pst.upcoming_breaks[0].kind == "holiday"
assert pst.upcoming_breaks[1].name == "INSET Day"
assert pst.upcoming_breaks[1].start == D(2026, 12, 4)
assert pst.upcoming_breaks[1].days == 1
assert pst.upcoming_breaks[1].kind == "inset"
assert pst.upcoming_breaks[2].name == "Christmas Holidays"
assert pst.upcoming_breaks[2].start == D(2026, 12, 19)
assert pst.upcoming_breaks[2].end == D(2027, 1, 4)
assert pst.upcoming_breaks[3].name == "School holiday"  # next term end, no feed event
assert pst.upcoming_breaks[3].start == D(2027, 2, 14)

progress_dict = pst.as_dict()
assert progress_dict["term_start"] == "2026-11-02"
assert progress_dict["term_progress"] == 67
assert progress_dict["upcoming_breaks"][0]["start"] == "2026-11-16"
assert progress_dict["upcoming_breaks"][0]["days"] == 13

# progress keeps working on an INSET day inside the term
inset_day = progress.school_status(D(2026, 12, 4))
assert not inset_day.is_school_day and inset_day.reason == "INSET Day"
assert inset_day.term == "Winter Term"
assert (inset_day.term_school_days, inset_day.term_school_days_done) == (14, 4)
assert inset_day.term_progress == 29

# manual terms: gaps between terms become "School holiday" entries
manual_progress = mod.Schedule.from_options({
    "terms": [
        {"name": "Autumn 2", "start": "2026-11-02", "end": "2026-11-13"},
        {"name": "Spring 1", "start": "2026-11-30", "end": "2026-12-18"},
    ],
    "inset_days": ["2026-11-06", "2026-12-04"],
})
mst = manual_progress.school_status(D(2026, 11, 10))
assert (mst.term_school_days, mst.term_school_days_done, mst.term_progress) == (9, 6, 67)
assert mst.upcoming_breaks[0].name == "School holiday"
assert mst.upcoming_breaks[0].start == D(2026, 11, 14)
assert mst.upcoming_breaks[0].end == D(2026, 11, 29)
assert mst.upcoming_breaks[1].name == "INSET day"
assert mst.upcoming_breaks[1].start == D(2026, 12, 4)
assert mst.upcoming_breaks[2].name == "School holiday"
assert mst.upcoming_breaks[2].start == D(2026, 12, 19)

print("all schedule tests passed")
