"""Shared entity base."""
from __future__ import annotations

from homeassistant.helpers.update_coordinator import CoordinatorEntity

from .const import DOMAIN
from .coordinator import FamilyTodayCoordinator


class FamilyTodayEntity(CoordinatorEntity[FamilyTodayCoordinator]):
    _attr_has_entity_name = True

    def __init__(self, coordinator: FamilyTodayCoordinator, entry_id: str, key: str) -> None:
        super().__init__(coordinator)
        self._attr_unique_id = f"{entry_id}_{key}"
        self._attr_device_info = {
            "identifiers": {(DOMAIN, entry_id)},
            "name": "Family Today",
        }
