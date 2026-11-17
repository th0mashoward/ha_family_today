"""Constants for Family Today."""
from datetime import timedelta

DOMAIN = "family_today"

# Config entry name (needed so several Family Today instances can coexist).
CONF_NAME = "name"
DEFAULT_NAME = "Family Today"

# Config entry option: {calendar_entity_id: person_name}
CONF_CALENDARS = "calendars"

UPDATE_INTERVAL = timedelta(minutes=5)

# A calendar service call that hangs would block the whole refresh, so cap it.
CALENDAR_TIMEOUT = 20  # seconds

# Attributes are stored in the recorder and capped at ~16 KB, so keep long
# event descriptions from bloating every state update.
MAX_EVENT_DESCRIPTION = 1000

# Schedule options (all stored as plain JSON-friendly values)
# terms:          [{"name": "Autumn 2", "start": "2026-11-02", "end": "2026-12-18"}]
# inset_days:     ["2026-11-06"]            non-school days inside a term
# school_weekdays:[0, 1, 2, 3, 4]           Monday=0
# bins:           [{"name": "Recycling", "weekday": 3, "every_n_weeks": 2,
#                   "anchor": "2026-11-19"}]   (a "colour" key is also honoured)
# bin_moves:      [{"date": "2026-12-24", "moved_to": "2026-12-23"}]
#                 moved_to null/omitted = that day's whole round is skipped
CONF_TERMS = "terms"
CONF_INSET_DAYS = "inset_days"
CONF_SCHOOL_WEEKDAYS = "school_weekdays"
CONF_BINS = "bins"
CONF_BIN_MOVES = "bin_moves"

# Calendar-backed bins (e.g. a Waste Collection Schedule calendar entity).
# When set, collections come from this calendar and the manual `bins` rules
# are only used as a fallback until the first successful fetch.
# bin_calendar: "calendar.waste_collection_schedule"
# bin_aliases:  {"Refuse": "General waste", "Garden": "Garden waste"}
CONF_BIN_CALENDAR = "bin_calendar"
CONF_BIN_ALIASES = "bin_aliases"
BIN_LOOKAHEAD_DAYS = 60

# Bin colours/icons, matched on the displayed name (so aliases apply too):
# bin_appearance: {"General waste": {"colour": "grey", "icon": "mdi:trash-can"}}
# Either field may be omitted; a missing icon is guessed from the name.
CONF_BIN_APPEARANCE = "bin_appearance"

# Frontend card, served by the integration itself (no manual resource entry).
# The cache-busting version comes from manifest.json, so it always matches the
# integration release.
CARD_URL = "/family_today/family-today-card.js"

# Calendar-backed school terms (e.g. a Remote Calendar / ICS feed of term dates).
# school_calendar:       "calendar.school_terms"
# school_term_keywords:  ["term"]                     events that span a term
# school_break_keywords: ["holiday", "half term", "inset"]   non-school days
# Either shape works: term-span events, or holiday/INSET events only.
CONF_SCHOOL_CALENDAR = "school_calendar"
CONF_SCHOOL_TERM_KEYWORDS = "school_term_keywords"
CONF_SCHOOL_BREAK_KEYWORDS = "school_break_keywords"
# Per-person overrides, keyed by the display name used in CONF_CALENDARS:
# schools: {"Tom": {"calendar": "calendar.tom_school",
#                   "term_keywords": ["term"],
#                   "break_keywords": ["holiday", "inset"]}}
# Any missing field falls back to the shared school settings above.
CONF_SCHOOLS = "schools"
# Long enough to cover a whole holiday, so "back to school" countdowns stay
# correct across a six-week summer break.
SCHOOL_LOOKAHEAD_DAYS = 120
# Look back over the current term so progress can count actual school days
# (a term is shorter than this, including its breaks).
SCHOOL_PAST_DAYS = 200
