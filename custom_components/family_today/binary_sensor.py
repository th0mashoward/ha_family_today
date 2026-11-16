"""Binary sensors for Family Today."""
from __future__ import annotations

from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

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
            SchoolDayBinarySensor(coordinator, entry.entry_id, "school_day"),
            BinsTomorrowBinarySensor(coordinator, entry.entry_id, "bins_tomorrow"),
        ]
    )


class SchoolDayBinarySensor(FamilyTodayEntity, BinarySensorEntity):
    """On when today is a school day (not a weekend, calendar break or INSET)."""

    _attr_name = "School day"
    _attr_icon = "mdi:school"

    @property
    def is_on(self) -> bool:
        return self.coordinator.data.school_day

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"term": self.coordinator.data.term_name}


class BinsTomorrowBinarySensor(FamilyTodayEntity, BinarySensorEntity):
    """On when there's a collection tomorrow, i.e. put the bins out tonight."""

    _attr_name = "Bins out tonight"
    _attr_icon = "mdi:trash-can"

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.data.bins_tomorrow)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        return {"bins": self.coordinator.data.bins_tomorrow}
