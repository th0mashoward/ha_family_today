"""Text <-> options parsing for the config UI. Pure Python, no HA imports.

Each parse_* raises ParseError with a message naming the offending line, and
each format_* turns stored options back into the text shown for editing.
Lines that are blank or start with '#' are ignored.
"""
from __future__ import annotations

import re
from datetime import date
from typing import Any, Iterable, Mapping

WEEKDAY_NAMES = ["mon", "tue", "wed", "thu", "fri", "sat", "sun"]


class ParseError(ValueError):
    """Bad user input; the message says which line and why."""


def _lines(text: str | None) -> list[tuple[int, str]]:
    return [
        (n, line.strip())
        for n, line in enumerate((text or "").splitlines(), 1)
        if line.strip() and not line.strip().startswith("#")
    ]


def _date(value: str, lineno: int | None = None) -> str:
    where = f"line {lineno}: " if lineno else ""
    try:
        return date.fromisoformat(value.strip()).isoformat()
    except ValueError:
        raise ParseError(f"{where}'{value.strip()}' is not a YYYY-MM-DD date") from None


# ---- terms: "2026-11-02 to 2026-12-18 Autumn 2" ------------------------
_TERM_RE = re.compile(r"^(\S+)\s+to\s+(\S+)\s*(.*)$", re.IGNORECASE)


def parse_terms(text: str | None) -> list[dict[str, str]]:
    out = []
    for n, line in _lines(text):
        m = _TERM_RE.match(line)
        if not m:
            raise ParseError(f"line {n}: expected 'YYYY-MM-DD to YYYY-MM-DD Name'")
        start, end = _date(m[1], n), _date(m[2], n)
        if end < start:
            raise ParseError(f"line {n}: end date is before start date")
        out.append({"name": m[3].strip() or "Term", "start": start, "end": end})
    return out


def format_terms(terms: Iterable[Mapping[str, Any]]) -> str:
    return "\n".join(f"{t['start']} to {t['end']} {t['name']}" for t in terms)


# ---- dates: comma / space / newline separated -------------------------
def parse_dates(text: str | None) -> list[str]:
    tokens = [t for t in re.split(r"[,\s]+", text or "") if t]
    return sorted({_date(t) for t in tokens})


def format_dates(dates: Iterable[str]) -> str:
    return ", ".join(dates)


# ---- aliases: "Refuse = General waste" --------------------------------
def parse_aliases(text: str | None) -> dict[str, str]:
    out = {}
    for n, line in _lines(text):
        if "=" not in line:
            raise ParseError(f"line {n}: expected 'Calendar title = Display name'")
        key, _, value = line.partition("=")
        if not key.strip() or not value.strip():
            raise ParseError(f"line {n}: both sides of '=' are required")
        out[key.strip()] = value.strip()
    return out


def format_aliases(aliases: Mapping[str, str]) -> str:
    return "\n".join(f"{k} = {v}" for k, v in aliases.items())


# ---- people: "calendar.family = Family" -------------------------------
def parse_people(text: str | None, expected: Iterable[str]) -> dict[str, str]:
    expected_set = set(expected)
    out: dict[str, str] = {}
    for n, line in _lines(text):
        if "=" not in line:
            raise ParseError(f"line {n}: expected 'calendar.entity = Person'")
        entity, _, person = line.partition("=")
        entity, person = entity.strip(), person.strip()
        if entity not in expected_set:
            raise ParseError(f"line {n}: '{entity}' is not one of the selected calendars")
        if not person:
            raise ParseError(f"line {n}: name is empty")
        out[entity] = person
    missing = expected_set - set(out)
    if missing:
        raise ParseError(f"missing a name for: {', '.join(sorted(missing))}")
    return out


def format_people(people: Mapping[str, str]) -> str:
    return "\n".join(f"{e} = {p}" for e, p in people.items())


# ---- manual bin rules: "General waste | thu | 2 | 2026-11-12" ----------
def parse_bin_rules(text: str | None) -> list[dict[str, Any]]:
    out = []
    for n, line in _lines(text):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) != 4:
            raise ParseError(f"line {n}: expected 'Name | weekday | every N weeks | anchor date'")
        name, wd, every, anchor = parts
        if not name:
            raise ParseError(f"line {n}: name is empty")
        if wd[:3].lower() not in WEEKDAY_NAMES:
            raise ParseError(f"line {n}: '{wd}' is not a weekday (mon..sun)")
        if not every.isdigit() or int(every) < 1:
            raise ParseError(f"line {n}: 'every N weeks' must be a whole number, 1 or more")
        out.append(
            {
                "name": name,
                "weekday": WEEKDAY_NAMES.index(wd[:3].lower()),
                "every_n_weeks": int(every),
                "anchor": _date(anchor, n),
            }
        )
    return out


def format_bin_rules(rules: Iterable[Mapping[str, Any]]) -> str:
    return "\n".join(
        f"{r['name']} | {WEEKDAY_NAMES[int(r['weekday'])]} | {r.get('every_n_weeks', 1)} | {r['anchor']}"
        for r in rules
    )


# ---- bin appearance: "General waste | grey | mdi:trash-can" ------------
_COLOUR_RE = re.compile(
    r"^(#[0-9a-fA-F]{3,8}|(?:rgb|hsl)a?\([^)]*\)|[a-zA-Z][a-zA-Z0-9-]*)$"
)
_ICON_RE = re.compile(r"^[a-z0-9]+:[a-z0-9-]+$")


def parse_bin_appearance(text: str | None) -> dict[str, dict[str, str]]:
    """Parse `Name | colour | icon` lines; colour and icon are both optional.

    The name is the *displayed* bin name, so it matches after aliases.
    """
    out: dict[str, dict[str, str]] = {}
    for n, line in _lines(text):
        parts = [p.strip() for p in line.split("|")]
        if len(parts) > 3:
            raise ParseError(f"line {n}: expected 'Name | colour | mdi:icon'")
        name = parts[0]
        colour = parts[1] if len(parts) > 1 else ""
        icon = parts[2] if len(parts) > 2 else ""
        if not name:
            raise ParseError(f"line {n}: name is empty")
        if not colour and not icon:
            raise ParseError(f"line {n}: give a colour, an icon, or both")
        if colour and not _COLOUR_RE.match(colour):
            raise ParseError(
                f"line {n}: '{colour}' is not a colour (name, #hex, rgb() or hsl())"
            )
        if icon and not _ICON_RE.match(icon):
            raise ParseError(f"line {n}: '{icon}' is not an icon like mdi:trash-can")
        out[name] = {k: v for k, v in (("colour", colour), ("icon", icon)) if v}
    return out


def format_bin_appearance(appearance: Mapping[str, Mapping[str, str]]) -> str:
    return "\n".join(
        f"{name} | {cfg.get('colour', '')} | {cfg.get('icon', '')}"
        for name, cfg in appearance.items()
    )


# ---- bin moves: "2026-12-24 -> 2026-12-23" or "2026-12-24 -> skip" ----
def parse_moves(text: str | None) -> list[dict[str, str | None]]:
    out = []
    for n, line in _lines(text):
        if "->" not in line:
            raise ParseError(f"line {n}: expected 'YYYY-MM-DD -> YYYY-MM-DD' or '-> skip'")
        left, _, right = line.partition("->")
        moved = None if right.strip().lower() == "skip" else _date(right, n)
        out.append({"date": _date(left, n), "moved_to": moved})
    return out


def format_moves(moves: Iterable[Mapping[str, Any]]) -> str:
    return "\n".join(f"{m['date']} -> {m.get('moved_to') or 'skip'}" for m in moves)


# ---- keywords: "term, school" ------------------------------------------
def parse_keywords(text: str | None) -> list[str]:
    seen: list[str] = []
    for token in re.split(r"[,\n]+", text or ""):
        word = token.strip().lower()
        if word and word not in seen:
            seen.append(word)
    return seen


def format_keywords(words: Iterable[str]) -> str:
    return ", ".join(words)
