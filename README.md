# Family Today for Home Assistant

[![Validate](https://github.com/th0mashoward/ha_family_today/actions/workflows/validate.yml/badge.svg?branch=master)](https://github.com/th0mashoward/ha_family_today/actions/workflows/validate.yml)
[![GitHub release](https://img.shields.io/github/v/release/th0mashoward/ha_family_today?sort=semver)](https://github.com/th0mashoward/ha_family_today/releases)
[![License](https://img.shields.io/github/license/th0mashoward/ha_family_today)](LICENSE)
[![HACS Custom](https://img.shields.io/badge/HACS-Custom-41BDF5.svg)](https://github.com/hacs/integration)

[![Open your Home Assistant instance and open a repository inside the Home Assistant Community Store.](https://my.home-assistant.io/badges/hacs_repository.svg)](https://my.home-assistant.io/redirect/hacs_repository/?owner=th0mashoward&repository=ha_family_today&category=integration)

One merged "today" view across your calendars: a per-person agenda, a school
day flag, bin collections (from a [Waste Collection Schedule] calendar or manual
rules), and bundled Lovelace cards for the day and for school terms.

## Screenshots

| Day card | School card |
| :---: | :---: |
| ![Day card](https://raw.githubusercontent.com/th0mashoward/ha_family_today/master/assets/screenshots/today-overview.png) | ![School card](https://raw.githubusercontent.com/th0mashoward/ha_family_today/master/assets/screenshots/school-card.png) |


## Install

The button above opens this repository inside HACS. It only works once the
repository has been added, so for a first install:

### HACS (custom repository)
1. HACS > ⋮ > **Custom repositories**.
2. Add `https://github.com/th0mashoward/ha_family_today`, category **Integration**.
3. Download **Family Today**, then restart Home Assistant.
4. Settings > Devices & services > **Add integration** > Family Today.
5. Pick your calendars and name their owners. Use **Configure** for school terms and bins.
6. Add the card (hard-reload the browser the first time). Click an event to see
   its details, including the description, time, location and person:

```yaml
type: custom:family-today-card
layout: lanes      # or "list" (default)
hide_past: true    # optional
colors:            # optional
  Tom: "#4285f4"
```

For a school-focused view there is a second card with term progress (counted in
actual school days), back-to-school countdowns and a timeline of upcoming
holidays and INSET days. It shows one section per child when per-child school
calendars are configured:

```yaml
type: custom:family-today-school-card
title: School          # optional
max_breaks: 3          # optional, 1-6
```

To run more than one view (for example a second dashboard or another household),
add the integration again with a different **Name**. Each instance gets its own
device, entities and calendar settings.

### Manual install
Copy `custom_components/family_today` into your HA `config/custom_components/` and restart.

## Entities
- `sensor.family_today_today`: event count; attributes `agenda`, `by_person`, `people`, `next_event`, `school_day`, `term`, `break_reason`, `school`, `school_by_person`, `school_overrides`, `school_source`, `bin_source` (calendar or manual/rules), `bins_today`, `bins_tomorrow`, `bin_meta`, `calendar_status`, `calendars_ok`, `calendars_total`
- `sensor.family_today_next_bin_collection`
- `binary_sensor.family_today_school_day`
- `binary_sensor.family_today_<child>_school_day` (one per child with a school override)
- `binary_sensor.family_today_bins_out_tonight`

### School badge
Click the school badge on the card for the detail behind it: the reason when
there's no school (`Half term`, `INSET day`, `Weekend`, or the calendar event's
own title), the current term, term end, next break, next term and back-to-school
dates with day counts. When per-child school calendars are configured, the card
shows a badge per child and each one opens that child's details. The same data
is available to templates as `break_reason`, a `school` attribute and a
`school_by_person` mapping (ISO dates + `days_until_*` numbers) on the sensors
above. The `school` object also carries `term_start`, `term_progress` (actual
school days done), `term_school_days`, `term_school_days_done` and
`upcoming_breaks` (name, start/end, length, days until and kind) for the
`family-today-school-card`.

### Reliability
- Calendars are fetched concurrently, each with a 20 second timeout, so one slow
  or broken feed doesn't hold up the rest.
- School feeds are also read 200 days back, so term progress can count actual
  school days across the current term (not calendar days).
- A failed calendar keeps **today's** last good events (never yesterday's). Bins
  and school dates keep their last good fetch until the source recovers.
- The card shows a muted **Showing saved events** or **Calendar unavailable**
  banner naming the affected calendars.
- After 3 consecutive failures a **Repairs** issue appears with the last error;
  it clears automatically on the next successful fetch.
- Long event descriptions are truncated at 1000 characters so attributes stay
  comfortably inside Home Assistant's state-size limit.
- Settings > Devices & services > Family Today > **Download diagnostics** gives
  the options, per-calendar health and today's summary (personal names redacted).

## Actions and notifications
Family Today exposes its data as actions, so automations stay short and scripts
can read events for any date range. Every action accepts an optional entity
target (for example `target: {entity_id: sensor.family_today_today}`) when you
run more than one Family Today instance; without a target it applies to every
instance.

- **`family_today.get_events`** returns `{"events": [...]}` for an arbitrary
  range. `start` defaults to the beginning of today and `end` to 24 hours later.
  A date-only `end` includes that whole day (`2026-11-18` means up to, but not
  including, the 19th); a datetime `end` is exclusive. Filter with `person` or
  `calendar`, and cap the response with `limit` (1–500). Naive datetimes are
  read as local time. Ranges are capped at 366 days.
- **`family_today.refresh`** forces a fetch straight away, e.g. after an
  automation edits a calendar, instead of waiting for the next five-minute poll.
- **`family_today.announce`** sends a message through `notify.send_message`.
  Name a `notify_entity` in the call, or set a default under **Configure >
  Notifications**. It supports `title`, `tag`, companion-app `actions` and extra
  `data` (image, url, group...). When `tag`, `actions` or extra `data` are
  supplied, the selected notify entity must also expose a matching notify
  service (as mobile-app notify services do); Home Assistant's generic
  `notify.send_message` entity action does not accept custom notification data.
- **`family_today.acknowledge_bins`** marks today's bins as out. The bins sensor
  then stays off for the rest of the day.

```yaml
- service: family_today.get_events
  data:
    start: "2026-11-18"
    end: "2026-11-25"
    person: Tom
  response_variable: agenda
- service: family_today.announce
  data:
    title: This week
    message: "{{ agenda.events | length }} events for Tom"
```

### Bins are out button
The bins reminder blueprint adds a **Bins are out** button to the notification.
Pressing it fires the `family_today_bins_out` event (`entry` and `bins` data) and
clears `binary_sensor.family_today_bins_out_tonight` until the next day, so the
reminder stays quiet. The action name is
`FAMILY_TODAY_BINS_OUT`; the same acknowledgement is available to scripts as
`family_today.acknowledge_bins`.

### Blueprints
Two blueprints cover the obvious automations. Import them from **Settings >
Automations & scenes > Blueprints > Import blueprint** with these raw URLs:

- Morning briefing — *school today, bins tonight, first event 08:40*:<br>
  `https://raw.githubusercontent.com/th0mashoward/ha_family_today/master/blueprints/automation/family_today/morning_briefing.yaml`
- Bins-out reminder — with the **Bins are out** button:<br>
  `https://raw.githubusercontent.com/th0mashoward/ha_family_today/master/blueprints/automation/family_today/bins_out_reminder.yaml`

Both default their entity inputs to the default Family Today instance and take
an optional notify entity; leave it empty to use the default configured in the
integration. The briefing is sent every day and says "no school today" on
weekends and holidays.

## Configuration (Configure button)
- **School calendar (optional):** pick a calendar entity, e.g. an ICS feed of school
  dates. It is treated as a list of **days off**: events whose title contains a
  *break keyword* (default `holiday`, `half term`, `inset`, `closed`, `break`...)
  make those days non-school days. Multi-day seasonal events named just
  `Easter`, `Christmas`, `Summer` or `Autumn` (as SchoolHolidays.org.uk feeds do)
  also count as breaks; a single `Summer Fair` does not. Every other configured
  school weekday is a school day; weekends and the manual INSET dates are always
  off. Term-span events (title contains a *term keyword*, default `term`) name
  the current term, and single-day "term starts" / "term ends" markers are
  ignored. With a holiday-only feed, terms are inferred from the gaps between
  half terms and longer breaks and named `Autumn Term 2`, `Spring Term 1`, etc.
  Gaps between terms are *not* assumed to be holidays: the feed must mark
  holidays with a break keyword or a seasonal name. If the calendar can't be
  read, the manual terms below are the fallback.
- **Per-child school calendars:** use **Configure > School terms > Per-child
  school calendar** to give a child their own school feed and optional keyword
  overrides. This is for siblings at different schools with different INSET days
  or term dates. Weekdays, manual terms and INSET days stay shared; a child with
  no override uses the shared settings. Each override also adds a
  `<child> school day` binary sensor.
- **Manual terms (fallback):** one per line, `2026-11-02 to 2026-12-18 Autumn 2`; INSET days as dates
  (INSET days listed here apply on top of a school calendar too).
- **Bins:** pick a Waste Collection Schedule calendar, rename titles with
  `Refuse = General waste`, or use manual rules `General waste | thu | 2 | 2026-11-12`
  and holiday moves `2026-12-24 -> 2026-12-23` (or `-> skip`).
- **Bin colours/icons:** one per line, `General waste | grey | mdi:trash-can`.
  Colour and icon are both optional, and names match the *displayed* name (so
  aliases apply). Colours can be a name (`grey`, `blue`...), `#hex`, `rgb()` or
  `hsl()`. Icons default from the name (`recycling` → recycle, `garden` → leaf,
  `food` → apple...). The card uses them for the bin banners; other templates can
  read the `bin_meta` attribute of `sensor.family_today_today`, the next-bin
  sensor and the bins-out binary sensor.
- **Notifications:** choose the default notify entity for
  `family_today.announce` and the blueprints. Leave it empty to require an
  explicit `notify_entity` on each call.

## Development
- Python logic tests: `python3 tests/test_schedule.py && python3 tests/test_parsing.py && python3 tests/test_sources.py && python3 tests/test_actions.py`
- Card: `cd frontend && npm install && npm run build && npm test`
  (writes `custom_components/family_today/www/family-today-card.js`, which is committed because HACS doesn't build)
- Card text: both cards load the integration's `common` strings at runtime with
  `hass.loadBackendTranslation("common", "family_today")`. Add new UI text to the
  `common` section of `strings.json` and `translations/en.json` using a
  `family_today_` or `family_today_school_` key prefix, then reference it through
  `translate()` in `frontend/src/`. English fallbacks live in the card source.
- Brand icon: `python3 assets/make_icon.py`
  (writes `custom_components/family_today/brand/icon.png` and `icon@2x.png`; HA 2026.3+ picks these up automatically)
- Release: set `version` in `custom_components/family_today/manifest.json` and tag
  the release with the same version prefixed with `v` (e.g. `v0.2.2`). HACS offers
  the release tag while Home Assistant shows the manifest version, so keep them in
  sync. The card cache-buster is read from the manifest automatically.

Status: early (0.3.0). The pure logic and card have unit/smoke tests, and it is
running on a live Home Assistant instance.

[Waste Collection Schedule]: https://github.com/mampfes/hacs_waste_collection_schedule
