"""Actions (services) for Family Today.

The integration stays out of the automation business: these actions expose the
data it already has and send messages through whichever notify entity you pick.
"""
from __future__ import annotations

import asyncio
from datetime import datetime

import voluptuous as vol

from homeassistant.const import ATTR_ENTITY_ID
from homeassistant.core import (
    HomeAssistant,
    ServiceCall,
    ServiceResponse,
    SupportsResponse,
)
from homeassistant.exceptions import ServiceValidationError
from homeassistant.helpers import config_validation as cv, entity_registry as er
from homeassistant.util import dt as dt_util, slugify

from .actions import (
    NotificationError,
    RangeError,
    build_notification_payload,
    parse_range,
)
from .const import DOMAIN
from .coordinator import FamilyTodayCoordinator

SERVICE_GET_EVENTS = "get_events"
SERVICE_REFRESH = "refresh"
SERVICE_ANNOUNCE = "announce"
SERVICE_ACKNOWLEDGE_BINS = "acknowledge_bins"

_ACTION_SCHEMA = vol.Schema(
    {
        vol.Required("action"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("uri"): cv.string,
    }
)

GET_EVENTS_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTITY_ID): cv.entity_ids,
        vol.Optional("start"): cv.string,
        vol.Optional("end"): cv.string,
        vol.Optional("person"): cv.string,
        vol.Optional("calendar"): cv.entity_id,
        vol.Optional("limit"): vol.All(vol.Coerce(int), vol.Range(min=1, max=500)),
    }
)

TARGET_ONLY_SCHEMA = vol.Schema({vol.Optional(ATTR_ENTITY_ID): cv.entity_ids})

ANNOUNCE_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_ENTITY_ID): cv.entity_ids,
        vol.Required("message"): cv.string,
        vol.Optional("title"): cv.string,
        vol.Optional("notify_entity"): vol.Any(cv.entity_id, cv.entity_ids),
        vol.Optional("tag"): cv.string,
        vol.Optional("actions"): vol.All(cv.ensure_list, [_ACTION_SCHEMA]),
        vol.Optional("data"): dict,
    }
)


def _coordinators(hass: HomeAssistant) -> dict[str, FamilyTodayCoordinator]:
    return hass.data.get(DOMAIN, {})


def _selected(hass: HomeAssistant, call: ServiceCall) -> list[FamilyTodayCoordinator]:
    """Instances targeted by the call, or every instance when none is named."""
    store = _coordinators(hass)
    if not store:
        raise ServiceValidationError("Family Today is not set up")

    raw = call.data.get(ATTR_ENTITY_ID)
    if not raw:
        return list(store.values())

    entity_ids = raw if isinstance(raw, list) else [raw]
    registry = er.async_get(hass)
    entry_ids = {
        entry.config_entry_id
        for entity_id in entity_ids
        if (entry := registry.async_get(entity_id)) and entry.config_entry_id
    }
    selected = [
        coordinator
        for entry_id, coordinator in store.items()
        if entry_id in entry_ids
    ]
    if not selected:
        raise ServiceValidationError(
            "No Family Today instance owns "
            + ", ".join(sorted(str(entity_id) for entity_id in entity_ids))
        )
    return selected


def _legacy_notify_service(hass: HomeAssistant, target: str) -> str | None:
    """Find the legacy notify action for an entity that needs custom data."""
    service = target.partition(".")[2]
    if hass.services.has_service("notify", service):
        return service

    entity = er.async_get(hass).async_get(target)
    if (
        entity is None
        or entity.platform != "mobile_app"
        or entity.config_entry_id is None
    ):
        return None

    config_entry = hass.config_entries.async_get_entry(entity.config_entry_id)
    if config_entry is None or config_entry.domain != "mobile_app":
        return None

    device_name = config_entry.data.get("device_name")
    if not isinstance(device_name, str) or not device_name:
        return None

    service = slugify(f"mobile_app_{device_name}")
    return service if hass.services.has_service("notify", service) else None


def _localise(value: datetime) -> datetime:
    """Naive input is taken as local time, which is what a calendar expects."""
    if value.tzinfo is None:
        return value.replace(tzinfo=dt_util.DEFAULT_TIME_ZONE)
    return dt_util.as_local(value)


async def _async_get_events(call: ServiceCall) -> ServiceResponse:
    hass = call.hass
    coordinators = _selected(hass, call)
    try:
        start, end = parse_range(
            call.data.get("start"), call.data.get("end"), dt_util.now()
        )
    except RangeError as err:
        raise ServiceValidationError(str(err)) from err

    start, end = _localise(start), _localise(end)
    person = call.data.get("person") or None
    calendar = call.data.get("calendar") or None
    try:
        results = await asyncio.gather(
            *(
                coordinator.async_get_events(
                    start, end, person=person, calendar=calendar
                )
                for coordinator in coordinators
            )
        )
    except Exception as err:  # noqa: BLE001 - report the failing calendar
        raise ServiceValidationError(f"Could not read events: {err}") from err
    found = [
        (coordinator, event)
        for coordinator, events in zip(coordinators, results)
        for event in events
    ]
    found.sort(key=lambda pair: (not pair[1].all_day, pair[1].start, pair[1].summary))

    limit = call.data.get("limit")
    if limit:
        found = found[:limit]

    multiple = len(coordinators) > 1
    rows = []
    for coordinator, event in found:
        row = event.as_dict()
        if multiple:
            row["entry"] = coordinator.entry_title
        rows.append(row)
    return {"events": rows}


async def _async_refresh(call: ServiceCall) -> ServiceResponse:
    coordinators = _selected(call.hass, call)
    await asyncio.gather(*(coordinator.async_request_refresh() for coordinator in coordinators))
    return {"refreshed": [coordinator.entry_title for coordinator in coordinators]}


async def _async_announce(call: ServiceCall) -> ServiceResponse:
    hass = call.hass
    coordinators = _selected(hass, call)

    raw_targets = call.data.get("notify_entity")
    if raw_targets:
        targets = list(raw_targets) if isinstance(raw_targets, list) else [raw_targets]
    else:
        targets = [
            coordinator.notify_entity
            for coordinator in coordinators
            if coordinator.notify_entity
        ]
    targets = list(dict.fromkeys(target for target in targets if target))
    if not targets:
        raise ServiceValidationError(
            "No notify entity: name one in the action, or set a default under "
            "Configure > Notifications"
        )

    try:
        payload = build_notification_payload(
            call.data["message"],
            title=call.data.get("title"),
            actions=call.data.get("actions"),
            data=call.data.get("data"),
            tag=call.data.get("tag"),
        )
    except NotificationError as err:
        raise ServiceValidationError(str(err)) from err

    for target in targets:
        if "data" in payload:
            notify_service = _legacy_notify_service(hass, target)
            if notify_service is None:
                raise ServiceValidationError(
                    f"Notify entity '{target}' has no compatible legacy notify "
                    "service, which is required for custom notification data"
                )
            await hass.services.async_call(
                "notify",
                notify_service,
                payload,
                blocking=True,
            )
            continue

        await hass.services.async_call(
            "notify",
            "send_message",
            payload,
            target={"entity_id": target},
            blocking=True,
        )
    return {"sent_to": targets}


async def _async_acknowledge_bins(call: ServiceCall) -> ServiceResponse:
    coordinators = _selected(call.hass, call)
    for coordinator in coordinators:
        await coordinator.async_acknowledge_bins()
    return {"acknowledged": [coordinator.entry_title for coordinator in coordinators]}


def async_setup_services(hass: HomeAssistant) -> None:
    """Register the Family Today actions once per Home Assistant run."""
    if hass.services.has_service(DOMAIN, SERVICE_REFRESH):
        return

    hass.services.async_register(
        DOMAIN,
        SERVICE_GET_EVENTS,
        _async_get_events,
        schema=GET_EVENTS_SCHEMA,
        supports_response=SupportsResponse.ONLY,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_REFRESH,
        _async_refresh,
        schema=TARGET_ONLY_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ANNOUNCE,
        _async_announce,
        schema=ANNOUNCE_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
    hass.services.async_register(
        DOMAIN,
        SERVICE_ACKNOWLEDGE_BINS,
        _async_acknowledge_bins,
        schema=TARGET_ONLY_SCHEMA,
        supports_response=SupportsResponse.OPTIONAL,
    )
