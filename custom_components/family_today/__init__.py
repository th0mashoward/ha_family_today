"""Family Today: one merged 'today' view across your calendars."""
from __future__ import annotations

import json
from datetime import datetime
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.const import STATE_UNAVAILABLE, STATE_UNKNOWN
from homeassistant.core import Event, HomeAssistant
from homeassistant.helpers.event import (
    async_track_state_change_event,
    async_track_time_change,
)
from homeassistant.helpers.start import async_at_started
from homeassistant.helpers.typing import ConfigType

from .actions import BINS_OUT_ACTION
from .const import CARD_URL, DOMAIN, EVENT_BINS_OUT
from .coordinator import FamilyTodayCoordinator
from .services import async_setup_services

PLATFORMS = ["sensor", "binary_sensor"]

NOTIFICATION_ACTION_EVENT = "mobile_app_notification_action"

type FamilyTodayConfigEntry = ConfigEntry[FamilyTodayCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the bundled card and load it on every dashboard (runs once per start)."""
    card = Path(__file__).parent / "www" / "family-today-card.js"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(card), cache_headers=False)]
    )
    # Version query string busts the browser cache on every release.
    manifest = json.loads(
        (Path(__file__).parent / "manifest.json").read_text(encoding="utf-8")
    )
    add_extra_js_url(hass, f"{CARD_URL}?v={manifest['version']}")

    # The companion app broadcasts the button press. Acknowledgement is shared
    # by every instance that has a collection tomorrow, so the listener is set
    # up once rather than once per config entry.
    async def _bins_out_event(event: Event) -> None:
        await _handle_bins_out_action(hass, event)

    hass.bus.async_listen(NOTIFICATION_ACTION_EVENT, _bins_out_event)
    return True


async def _handle_bins_out_action(hass: HomeAssistant, event: Event) -> None:
    """Handle the 'Bins are out' button attached to a notification."""
    if event.data.get("action") != BINS_OUT_ACTION:
        return

    for coordinator in list(hass.data.get(DOMAIN, {}).values()):
        data = coordinator.data
        if data is None or not data.bins_tomorrow:
            continue
        bins = list(data.bins_tomorrow)
        await coordinator.async_acknowledge_bins()
        hass.bus.async_fire(
            EVENT_BINS_OUT,
            {"entry": coordinator.entry_title, "bins": bins},
        )


async def async_setup_entry(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> bool:
    async_setup_services(hass)

    coordinator = FamilyTodayCoordinator(hass, entry)
    await coordinator.async_load_bins_ack()
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator
    hass.data.setdefault(DOMAIN, {})[entry.entry_id] = coordinator

    # Roll over to the new day promptly instead of waiting for the next poll.
    async def _midnight(_now: datetime) -> None:
        await coordinator.async_request_refresh()

    entry.async_on_unload(
        async_track_time_change(hass, _midnight, hour=0, minute=0, second=5)
    )
    entry.async_on_unload(entry.add_update_listener(_reload_on_options))

    # Calendar entities can still be loading when this entry is set up during
    # startup, so the first refresh may see no events. Refresh once HA has
    # fully started, and again if a calendar recovers from unavailable/unknown.
    async def _refresh_after_start(_hass: HomeAssistant) -> None:
        await coordinator.async_request_refresh()

    async def _calendar_ready(event: Event) -> None:
        old = event.data.get("old_state")
        new = event.data.get("new_state")
        if new is None or new.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            return
        if old is None or old.state in (STATE_UNAVAILABLE, STATE_UNKNOWN):
            await coordinator.async_request_refresh()

    entry.async_on_unload(async_at_started(hass, _refresh_after_start))
    if coordinator.calendars:
        entry.async_on_unload(
            async_track_state_change_event(
                hass, list(coordinator.calendars), _calendar_ready
            )
        )

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _reload_on_options(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> bool:
    unloaded = await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
    if unloaded:
        hass.data.get(DOMAIN, {}).pop(entry.entry_id, None)
        coordinator = getattr(entry, "runtime_data", None)
        if coordinator is not None:
            coordinator.clear_issues()
    return unloaded
