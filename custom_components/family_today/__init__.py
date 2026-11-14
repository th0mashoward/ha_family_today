"""Family Today: one merged 'today' view across your calendars."""
from __future__ import annotations

from datetime import datetime
from pathlib import Path

from homeassistant.components.frontend import add_extra_js_url
from homeassistant.components.http import StaticPathConfig
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.event import async_track_time_change

from homeassistant.helpers.typing import ConfigType

from .const import CARD_URL, CARD_VERSION
from .coordinator import FamilyTodayCoordinator

PLATFORMS = ["sensor", "binary_sensor"]

type FamilyTodayConfigEntry = ConfigEntry[FamilyTodayCoordinator]


async def async_setup(hass: HomeAssistant, config: ConfigType) -> bool:
    """Serve the bundled card and load it on every dashboard (runs once per start)."""
    card = Path(__file__).parent / "www" / "family-today-card.js"
    await hass.http.async_register_static_paths(
        [StaticPathConfig(CARD_URL, str(card), cache_headers=False)]
    )
    # Version query string busts the browser cache when the card changes.
    add_extra_js_url(hass, f"{CARD_URL}?v={CARD_VERSION}")
    return True


async def async_setup_entry(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> bool:
    coordinator = FamilyTodayCoordinator(hass, entry)
    await coordinator.async_config_entry_first_refresh()
    entry.runtime_data = coordinator

    # Roll over to the new day promptly instead of waiting for the next poll.
    async def _midnight(_now: datetime) -> None:
        await coordinator.async_request_refresh()

    entry.async_on_unload(
        async_track_time_change(hass, _midnight, hour=0, minute=0, second=5)
    )
    entry.async_on_unload(entry.add_update_listener(_reload_on_options))

    await hass.config_entries.async_forward_entry_setups(entry, PLATFORMS)
    return True


async def _reload_on_options(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> None:
    await hass.config_entries.async_reload(entry.entry_id)


async def async_unload_entry(hass: HomeAssistant, entry: FamilyTodayConfigEntry) -> bool:
    return await hass.config_entries.async_unload_platforms(entry, PLATFORMS)
