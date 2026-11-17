"""Run with: python3 tests/test_parsing.py  (no Home Assistant needed)."""
import importlib.util, sys
from pathlib import Path

path = Path(__file__).parent.parent / "custom_components/family_today/parsing.py"
spec = importlib.util.spec_from_file_location("parsing", path)
p = importlib.util.module_from_spec(spec); sys.modules["parsing"] = p
spec.loader.exec_module(p)


def raises(fn, *a):
    try:
        fn(*a)
    except p.ParseError as e:
        return str(e)
    raise AssertionError("expected ParseError")


# terms
terms = p.parse_terms("# comment\n2026-11-02 to 2026-12-18 Autumn 2\n2027-01-05 to 2027-02-12\n")
assert terms[0] == {"name": "Autumn 2", "start": "2026-11-02", "end": "2026-12-18"}
assert terms[1]["name"] == "Term"
assert p.parse_terms(p.format_terms(terms)) == terms
assert "before start" in raises(p.parse_terms, "2026-12-18 to 2026-11-02 X")
assert "line 2" in raises(p.parse_terms, "2026-11-02 to 2026-12-18 ok\nnonsense")
assert "not a YYYY-MM-DD" in raises(p.parse_terms, "2026-13-40 to 2026-12-18")

# dates
assert p.parse_dates("2026-11-06, 2026-10-30\n2026-11-06") == ["2026-10-30", "2026-11-06"]
assert p.parse_dates("") == []
raises(p.parse_dates, "2026-11-06, soon")

# aliases
al = p.parse_aliases("Refuse = General waste\nGarden=Garden waste")
assert al == {"Refuse": "General waste", "Garden": "Garden waste"}
assert p.parse_aliases(p.format_aliases(al)) == al
raises(p.parse_aliases, "Refuse")
raises(p.parse_aliases, "Refuse = ")

# people
ppl = p.parse_people("calendar.a = Tom\ncalendar.b = Sam", ["calendar.a", "calendar.b"])
assert ppl == {"calendar.a": "Tom", "calendar.b": "Sam"}
assert "missing" in raises(p.parse_people, "calendar.a = Tom", ["calendar.a", "calendar.b"])
assert "not one of" in raises(p.parse_people, "calendar.z = X", ["calendar.a"])

# bin rules
rules = p.parse_bin_rules("General waste | Thursday | 2 | 2026-11-12\nFood | thu | 1 | 2026-11-12")
assert rules[0] == {"name": "General waste", "weekday": 3, "every_n_weeks": 2, "anchor": "2026-11-12"}
assert p.parse_bin_rules(p.format_bin_rules(rules)) == rules
raises(p.parse_bin_rules, "General | someday | 2 | 2026-11-12")
raises(p.parse_bin_rules, "General | thu | 0 | 2026-11-12")
raises(p.parse_bin_rules, "General | thu | 2")

# moves
mv = p.parse_moves("2026-12-24 -> 2026-12-23\n2026-12-25 -> skip")
assert mv == [{"date": "2026-12-24", "moved_to": "2026-12-23"}, {"date": "2026-12-25", "moved_to": None}]
assert p.parse_moves(p.format_moves(mv)) == mv
raises(p.parse_moves, "2026-12-24")

# bin appearance
ap = p.parse_bin_appearance(
    "General waste | grey | mdi:trash-can\nRecycling | blue\nGarden | | mdi:leaf\nX | #fff | mdi:delete"
)
assert ap == {
    "General waste": {"colour": "grey", "icon": "mdi:trash-can"},
    "Recycling": {"colour": "blue"},
    "Garden": {"icon": "mdi:leaf"},
    "X": {"colour": "#fff", "icon": "mdi:delete"},
}
assert p.parse_bin_appearance(p.format_bin_appearance(ap)) == ap
assert p.parse_bin_appearance("# comment\n") == {}
raises(p.parse_bin_appearance, "General waste")
raises(p.parse_bin_appearance, "General waste | | ")
raises(p.parse_bin_appearance, "General waste | not a colour | mdi:trash-can")
raises(p.parse_bin_appearance, "General waste | grey | trash-can")
raises(p.parse_bin_appearance, "a | b | c | d")

# keywords
assert p.parse_keywords("Term, school ,TERM\nholiday,") == ["term", "school", "holiday"]
assert p.parse_keywords("") == []
assert p.parse_keywords(p.format_keywords(["a", "b"])) == ["a", "b"]

print("all parsing tests passed")
