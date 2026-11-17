"""Config and options flow for Family Today."""
from __future__ import annotations

import re
from typing import Any

import voluptuous as vol

from homeassistant.config_entries import ConfigEntry, ConfigFlow, OptionsFlow
from homeassistant.core import callback
from homeassistant.helpers.selector import (
    EntitySelector,
    EntitySelectorConfig,
    SelectOptionDict,
    SelectSelector,
    SelectSelectorConfig,
    SelectSelectorMode,
    TextSelector,
    TextSelectorConfig,
)

from .const import (
    CONF_BIN_ALIASES,
    CONF_BIN_APPEARANCE,
    CONF_BIN_CALENDAR,
    CONF_BIN_MOVES,
    CONF_BINS,
    CONF_CALENDARS,
    CONF_INSET_DAYS,
    CONF_NAME,
    CONF_SCHOOL_BREAK_KEYWORDS,
    CONF_SCHOOL_CALENDAR,
    CONF_SCHOOL_TERM_KEYWORDS,
    CONF_SCHOOL_WEEKDAYS,
    CONF_SCHOOLS,
    CONF_TERMS,
    DEFAULT_NAME,
    DOMAIN,
)
from .parsing import (
    ParseError,
    format_aliases,
    format_bin_appearance,
    format_bin_rules,
    format_dates,
    format_keywords,
    format_moves,
    format_people,
    format_terms,
    parse_aliases,
    parse_bin_rules,
    parse_dates,
    parse_keywords,
    parse_moves,
    parse_people,
    parse_terms,
)

CONF_PEOPLE = "people"  # form field only; stored as CONF_CALENDARS mapping

_CAL_SELECTOR = EntitySelector(EntitySelectorConfig(domain="calendar", multiple=True))
_TEXT = TextSelector(TextSelectorConfig(multiline=True))
_WEEKDAYS = SelectSelector(
    SelectSelectorConfig(
        options=[
            SelectOptionDict(value=str(i), label=name)
            for i, name in enumerate(
                ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
            )
        ],
        multiple=True,
        mode=SelectSelectorMode.LIST,
    )
)


def _default_name(hass, entity_id: str) -> str:
    state = hass.states.get(entity_id)
    if state and state.attributes.get("friendly_name"):
        return str(state.attributes["friendly_name"])
    return entity_id.split(".", 1)[1].replace("_", " ").title()


def _slugify(value: str) -> str:
    """Stable unique id from a display name (so entries can coexist)."""
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_") or DOMAIN


class FamilyTodayConfigFlow(ConfigFlow, domain=DOMAIN):
    """Initial setup: name the instance, pick calendars, then name each person."""

    VERSION = 1

    def __init__(self) -> None:
        self._calendars: list[str] = []
        self._name = DEFAULT_NAME

    async def async_step_user(self, user_input: dict[str, Any] | None = None):
        if user_input is not None:
            name = str(user_input.get(CONF_NAME) or DEFAULT_NAME).strip() or DEFAULT_NAME
            # Name-based unique id also lets one household run several instances.
            await self.async_set_unique_id(_slugify(name))
            self._abort_if_unique_id_configured()
            self._name = name
            self._calendars = list(user_input[CONF_CALENDARS])
            return await self.async_step_people()

        return self.async_show_form(
            step_id="user",
            data_schema=vol.Schema(
                {
                    vol.Required(CONF_NAME, default=DEFAULT_NAME): TextSelector(),
                    vol.Required(CONF_CALENDARS): _CAL_SELECTOR,
                }
            ),
        )

    async def async_step_people(self, user_input: dict[str, Any] | None = None):
        errors: dict[str, str] = {}
        if user_input is not None:
            try:
                mapping = parse_people(user_input[CONF_PEOPLE], self._calendars)
            except ParseError as err:
                errors[CONF_PEOPLE] = "invalid_people"
                placeholders = {"error": str(err)}
            else:
                return self.async_create_entry(
                    title=self._name, data={}, options={CONF_CALENDARS: mapping}
                )
        else:
            placeholders = {"error": ""}

        suggested = {
            CONF_PEOPLE: format_people(
                {e: _default_name(self.hass, e) for e in self._calendars}
            )
        }
        schema = self.add_suggested_values_to_schema(
            vol.Schema({vol.Required(CONF_PEOPLE): _TEXT}), suggested
        )
        return self.async_show_form(
            step_id="people",
            data_schema=schema,
            errors=errors,
            description_placeholders=placeholders,
        )

    @staticmethod
    @callback
    def async_get_options_flow(config_entry: ConfigEntry) -> OptionsFlow:
        return FamilyTodayOptionsFlow()


class FamilyTodayOptionsFlow(OptionsFlow):
    """Menu of sections; changes accumulate and are saved on 'Done'."""

    def __init__(self) -> None:
        self._options: dict[str, Any] | None = None
        self._pending_calendars: list[str] = []

    @property
    def opts(self) -> dict[str, Any]:
        if self._options is None:
            self._options = dict(self.config_entry.options)
        return self._options

    async def async_step_init(self, user_input: dict[str, Any] | None = None):
        return self.async_show_menu(
            step_id="init", menu_options=["calendars", "school", "bins", "done"]
        )

    async def async_step_done(self, user_input: dict[str, Any] | None = None):
        return self.async_create_entry(data=self.opts)

    # ---- calendars -> people -------------------------------------------
    async def async_step_calendars(self, user_input: dict[str, Any] | None = None):
        if user_input is not None:
            self._pending_calendars = list(user_input[CONF_CALENDARS])
            return await self.async_step_people()

        schema = self.add_suggested_values_to_schema(
            vol.Schema({vol.Required(CONF_CALENDARS): _CAL_SELECTOR}),
            {CONF_CALENDARS: list(self.opts.get(CONF_CALENDARS, {}))},
        )
        return self.async_show_form(step_id="calendars", data_schema=schema)

    async def async_step_people(self, user_input: dict[str, Any] | None = None):
        errors: dict[str, str] = {}
        placeholders = {"error": ""}
        if user_input is not None:
            try:
                self.opts[CONF_CALENDARS] = parse_people(
                    user_input[CONF_PEOPLE], self._pending_calendars
                )
            except ParseError as err:
                errors[CONF_PEOPLE] = "invalid_people"
                placeholders = {"error": str(err)}
            else:
                return await self.async_step_init()

        existing = self.opts.get(CONF_CALENDARS, {})
        suggested = {
            CONF_PEOPLE: format_people(
                {e: existing.get(e) or _default_name(self.hass, e) for e in self._pending_calendars}
            )
        }
        schema = self.add_suggested_values_to_schema(
            vol.Schema({vol.Required(CONF_PEOPLE): _TEXT}), suggested
        )
        return self.async_show_form(
            step_id="people",
            data_schema=schema,
            errors=errors,
            description_placeholders=placeholders,
        )

    # ---- school ---------------------------------------------------------
    async def async_step_school(self, user_input: dict[str, Any] | None = None):
        errors: dict[str, str] = {}
        placeholders = {"error": ""}
        if user_input is not None:
            try:
                terms = parse_terms(user_input.get(CONF_TERMS))
            except ParseError as err:
                errors[CONF_TERMS] = "invalid_terms"
                placeholders = {"error": str(err)}
            else:
                try:
                    inset = parse_dates(user_input.get(CONF_INSET_DAYS))
                except ParseError as err:
                    errors[CONF_INSET_DAYS] = "invalid_dates"
                    placeholders = {"error": str(err)}
                else:
                    self.opts[CONF_TERMS] = terms
                    self.opts[CONF_INSET_DAYS] = inset
                    self.opts[CONF_SCHOOL_TERM_KEYWORDS] = parse_keywords(
                        user_input.get(CONF_SCHOOL_TERM_KEYWORDS)
                    )
                    self.opts[CONF_SCHOOL_BREAK_KEYWORDS] = parse_keywords(
                        user_input.get(CONF_SCHOOL_BREAK_KEYWORDS)
                    )
                    if school_cal := user_input.get(CONF_SCHOOL_CALENDAR):
                        self.opts[CONF_SCHOOL_CALENDAR] = school_cal
                    else:
                        self.opts.pop(CONF_SCHOOL_CALENDAR, None)
                    self.opts[CONF_SCHOOL_WEEKDAYS] = sorted(
                        int(d) for d in user_input.get(CONF_SCHOOL_WEEKDAYS, [])
                    ) or [0, 1, 2, 3, 4]
                    return await self.async_step_init()

        suggested = {
            CONF_TERMS: format_terms(self.opts.get(CONF_TERMS, [])),
            CONF_INSET_DAYS: format_dates(self.opts.get(CONF_INSET_DAYS, [])),
            CONF_SCHOOL_CALENDAR: self.opts.get(CONF_SCHOOL_CALENDAR),
            CONF_SCHOOL_TERM_KEYWORDS: format_keywords(
                self.opts.get(CONF_SCHOOL_TERM_KEYWORDS, [])
            ),
            CONF_SCHOOL_BREAK_KEYWORDS: format_keywords(
                self.opts.get(CONF_SCHOOL_BREAK_KEYWORDS, [])
            ),
            CONF_SCHOOL_WEEKDAYS: [
                str(d) for d in self.opts.get(CONF_SCHOOL_WEEKDAYS, [0, 1, 2, 3, 4])
            ],
        }
        schema = self.add_suggested_values_to_schema(
            vol.Schema(
                {
                    vol.Optional(CONF_TERMS): _TEXT,
                    vol.Optional(CONF_INSET_DAYS): _TEXT,
                    vol.Optional(CONF_SCHOOL_WEEKDAYS): _WEEKDAYS,
                    vol.Optional(CONF_SCHOOL_CALENDAR): EntitySelector(
                        EntitySelectorConfig(domain="calendar")
                    ),
                    vol.Optional(CONF_SCHOOL_TERM_KEYWORDS): TextSelector(),
                    vol.Optional(CONF_SCHOOL_BREAK_KEYWORDS): TextSelector(),
                }
            ),
            suggested,
        )
        return self.async_show_form(
            step_id="school",
            data_schema=schema,
            errors=errors,
            description_placeholders=placeholders,
        )

    # ---- bins -----------------------------------------------------------
    async def async_step_bins(self, user_input: dict[str, Any] | None = None):
        errors: dict[str, str] = {}
        placeholders = {"error": ""}
        if user_input is not None:
            parsed: dict[str, Any] = {}
            for field, parser, code in (
                (CONF_BIN_ALIASES, parse_aliases, "invalid_aliases"),
                (CONF_BINS, parse_bin_rules, "invalid_bins"),
                (CONF_BIN_MOVES, parse_moves, "invalid_moves"),
            ):
                try:
                    parsed[field] = parser(user_input.get(field))
                except ParseError as err:
                    errors[field] = code
                    placeholders = {"error": str(err)}
                    break
            if not errors:
                self.opts.update(parsed)
                if calendar := user_input.get(CONF_BIN_CALENDAR):
                    self.opts[CONF_BIN_CALENDAR] = calendar
                else:
                    self.opts.pop(CONF_BIN_CALENDAR, None)
                return await self.async_step_init()

        suggested = {
            CONF_BIN_CALENDAR: self.opts.get(CONF_BIN_CALENDAR),
            CONF_BIN_ALIASES: format_aliases(self.opts.get(CONF_BIN_ALIASES, {})),
            CONF_BINS: format_bin_rules(self.opts.get(CONF_BINS, [])),
            CONF_BIN_MOVES: format_moves(self.opts.get(CONF_BIN_MOVES, [])),
        }
        schema = self.add_suggested_values_to_schema(
            vol.Schema(
                {
                    vol.Optional(CONF_BIN_CALENDAR): EntitySelector(
                        EntitySelectorConfig(domain="calendar")
                    ),
                    vol.Optional(CONF_BIN_ALIASES): _TEXT,
                    vol.Optional(CONF_BINS): _TEXT,
                    vol.Optional(CONF_BIN_MOVES): _TEXT,
                }
            ),
            suggested,
        )
        return self.async_show_form(
            step_id="bins",
            data_schema=schema,
            errors=errors,
            description_placeholders=placeholders,
        )
