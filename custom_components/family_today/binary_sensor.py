"""Binary sensors for Family Today."""
from __future__ import annotations

import re
from typing import Any

from homeassistant.components.binary_sensor import BinarySensorEntity
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from . import FamilyTodayConfigEntry
from .coordinator import FamilyTodayCoordinator
from .entity import FamilyTodayEntity


def _slug(value: str) -> str:
    return re.sub(r"[^a-z0-9]+", "_", value.lower()).strip("_") or "school"


async def async_setup_entry(
    hass: HomeAssistant,
    entry: FamilyTodayConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    coordinator = entry.runtime_data
    entities: list[BinarySensorEntity] = [
        SchoolDayBinarySensor(coordinator, entry.entry_id, "school_day"),
        BinsTomorrowBinarySensor(coordinator, entry.entry_id, "bins_tomorrow"),
    ]
    entities.extend(
        PersonSchoolDayBinarySensor(coordinator, entry.entry_id, person)
        for person in coordinator.school_overrides
    )
    async_add_entities(entities)


class SchoolDayBinarySensor(FamilyTodayEntity, BinarySensorEntity):
    """On when today is a school day (not a weekend, calendar break or INSET)."""

    _attr_name = "School day"
    _attr_icon = "mdi:school"

    @property
    def is_on(self) -> bool:
        return self.coordinator.data.school_day

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        d = self.coordinator.data
        return {
            "term": d.term_name,
            "reason": d.school.reason if d.school else None,
            "school": d.school.as_dict() if d.school else None,
        }


class PersonSchoolDayBinarySensor(FamilyTodayEntity, BinarySensorEntity):
    """On when this child has school today (from their calendar override)."""

    _attr_icon = "mdi:school"

    def __init__(
        self, coordinator: FamilyTodayCoordinator, entry_id: str, person: str
    ) -> None:
        super().__init__(coordinator, entry_id, f"school_day_{_slug(person)}")
        self._person = person
        self._attr_name = f"{person} school day"

    def _status(self):
        return self.coordinator.data.school_by_person.get(self._person)

    @property
    def is_on(self) -> bool:
        status = self._status()
        return bool(status and status.is_school_day)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        status = self._status()
        return {
            "person": self._person,
            "term": status.term if status else None,
            "reason": status.reason if status else None,
            "school": status.as_dict() if status else None,
        }


class BinsTomorrowBinarySensor(FamilyTodayEntity, BinarySensorEntity):
    """On when there's a collection tomorrow, i.e. put the bins out tonight."""

    _attr_name = "Bins out tonight"
    _attr_icon = "mdi:trash-can"

    @property
    def is_on(self) -> bool:
        return bool(self.coordinator.data.bins_tomorrow)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        d = self.coordinator.data
        return {
            "bins": d.bins_tomorrow,
            "bin_meta": {n: d.bin_meta[n] for n in d.bins_tomorrow if n in d.bin_meta},
        }
