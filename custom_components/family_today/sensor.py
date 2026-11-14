"""Sensors for Family Today."""
from __future__ import annotations

from datetime import date
from typing import Any

from homeassistant.components.sensor import SensorDeviceClass, SensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback
from homeassistant.util import dt as dt_util

from . import FamilyTodayConfigEntry
from .entity import FamilyTodayEntity


async def async_setup_entry(
    hass: HomeAssistant,
    entry: FamilyTodayConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    async_add_entities(
        [
            FamilyTodaySensor(coordinator, entry.entry_id, "today"),
            NextBinSensor(coordinator, entry.entry_id, "next_bin"),
        ]
    )


class FamilyTodaySensor(FamilyTodayEntity, SensorEntity):
    """State = number of events today; attributes hold everything the card needs."""

    _attr_name = "Today"
    _attr_icon = "mdi:calendar-today"
    _attr_native_unit_of_measurement = "events"

    @property
    def native_value(self) -> int:
        return len(self.coordinator.data.events)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        d = self.coordinator.data
        return {
            "agenda": [e.as_dict() for e in d.events],
            "by_person": {p: [e.as_dict() for e in evs] for p, evs in d.by_person.items()},
            "people": sorted(set(self.coordinator.calendars.values())),
            "next_event": d.next_event.as_dict() if d.next_event else None,
            "school_day": d.school_day,
            "term": d.term_name,
            "school_source": d.school_source,
            "bin_source": d.bin_source,
            "bins_today": d.bins_today,
            "bins_tomorrow": d.bins_tomorrow,
        }


class NextBinSensor(FamilyTodayEntity, SensorEntity):
    """Date of the next bin collection; attributes list which bins."""

    _attr_name = "Next bin collection"
    _attr_icon = "mdi:delete-empty"
    _attr_device_class = SensorDeviceClass.DATE

    @property
    def native_value(self) -> date | None:
        return self.coordinator.data.next_bin_date

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        d = self.coordinator.data
        days_until = (
            (d.next_bin_date - dt_util.now().date()).days if d.next_bin_date else None
        )
        return {"bins": d.next_bin_names, "days_until": days_until}
