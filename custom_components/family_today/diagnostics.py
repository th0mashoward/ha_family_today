"""Diagnostics support for Family Today."""
from __future__ import annotations

from typing import Any

from homeassistant.components.diagnostics import async_redact_data
from homeassistant.core import HomeAssistant

from . import FamilyTodayConfigEntry

# Person names, aliases and term labels are personal; diagnostics often end up
# in public issues, so redact the free-text options.
TO_REDACT = {
    "calendars",
    "bin_aliases",
    "terms",
    "person",
    "schools",
    "notify_entity",
}


async def async_get_config_entry_diagnostics(
    hass: HomeAssistant, entry: FamilyTodayConfigEntry
) -> dict[str, Any]:
    """Return config, source health and today's summary."""
    coordinator = getattr(entry, "runtime_data", None)
    data = coordinator.data if coordinator is not None else None

    diagnostics: dict[str, Any] = {
        "entry": {
            "title": entry.title,
            "version": entry.version,
            "state": entry.state.name if hasattr(entry.state, "name") else entry.state,
        },
        "config": {
            "calendar_entities": sorted(coordinator.calendars) if coordinator else [],
            "bin_calendar": coordinator.bin_calendar if coordinator else None,
            "school_calendar": (
                coordinator.school_calendar_entity if coordinator else None
            ),
        },
        "options": dict(entry.options),
        "sources": {
            "bin_source": data.bin_source if data else None,
            "school_source": data.school_source if data else None,
            "calendar_status": data.calendar_status if data else {},
            "calendars_ok": data.calendars_ok if data else 0,
            "calendars_total": data.calendars_total if data else 0,
        },
        "today": {
            "event_count": len(data.events) if data else 0,
            "next_event": (
                {
                    "start": data.next_event.start.isoformat(),
                    "all_day": data.next_event.all_day,
                }
                if data and data.next_event
                else None
            ),
            "school_day": data.school_day if data else None,
            "school": data.school.as_dict() if data and data.school else None,
            "school_by_person": [
                {"person": person, "status": status.as_dict()}
                for person, status in (data.school_by_person if data else {}).items()
            ],
            "school_override_count": len(data.school_overrides) if data else 0,
            "bins_today": data.bins_today if data else [],
            "bins_tomorrow": data.bins_tomorrow if data else [],
            "bins_acknowledged": data.bins_acknowledged if data else None,
            "next_bin_date": (
                data.next_bin_date.isoformat() if data and data.next_bin_date else None
            ),
            "next_bin_names": data.next_bin_names if data else [],
        },
    }
    return async_redact_data(diagnostics, TO_REDACT)
