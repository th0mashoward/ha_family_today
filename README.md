# Family Today for Home Assistant

One merged "today" view across your calendars: a per-person agenda, a school
day flag, bin collections (from a [Waste Collection Schedule] calendar or manual
rules), and a bundled Lovelace card.

## Install with HACS (custom repository)
1. HACS > ⋮ > **Custom repositories**.
2. Add `https://github.com/th0mashoward/ha_family_today`, category **Integration**.
3. Download **Family Today**, then restart Home Assistant.
4. Settings > Devices & services > **Add integration** > Family Today.
5. Pick your calendars and name their owners. Use **Configure** for school terms and bins.
6. Add the card (hard-reload the browser the first time):

```yaml
type: custom:family-today-card
layout: lanes      # or "list" (default)
hide_past: true    # optional
colors:            # optional
  Tom: "#4285f4"
```

### Manual install
Copy `custom_components/family_today` into your HA `config/custom_components/` and restart.

## Entities
- `sensor.family_today_today`: event count; attributes `agenda`, `by_person`, `people`, `next_event`, `school_day`, `term`, `school_source`, `bin_source` (calendar or manual/rules), `bins_today`, `bins_tomorrow`
- `sensor.family_today_next_bin_collection`
- `binary_sensor.family_today_school_day`
- `binary_sensor.family_today_bins_out_tonight`

## Configuration (Configure button)
- **School calendar (optional):** pick a calendar entity, e.g. an ICS feed of term
  dates added through a remote/ICS calendar integration. Two shapes work:
  term-span events (title contains a *term keyword*, default `term`) and/or
  holiday events (title contains a *break keyword*, default `holiday`, `half term`,
  `inset`, `closed`, `break`...). Break keywords win, so "Half term" is a break.
  If the calendar has no usable events, or hasn't loaded yet, the manual terms below are used.
  Single-day "term starts" / "term ends" events aren't understood yet.
- **Manual terms (fallback):** one per line, `2026-11-02 to 2026-12-18 Autumn 2`; INSET days as dates
  (INSET days listed here apply on top of a school calendar too).
- **Bins:** pick a Waste Collection Schedule calendar, rename titles with
  `Refuse = General waste`, or use manual rules `General waste | thu | 2 | 2026-11-12`
  and holiday moves `2026-12-24 -> 2026-12-23` (or `-> skip`).

## Development
- Python logic tests: `python3 tests/test_schedule.py && python3 tests/test_parsing.py`
- Card: `cd frontend && npm install && npm run build && npm test`
  (writes `custom_components/family_today/www/family-today-card.js`, which is committed because HACS doesn't build)

Status: early (0.1.0). The pure logic and card have unit/smoke tests; it has not
yet been run on a live Home Assistant instance.

[Waste Collection Schedule]: https://github.com/mampfes/hacs_waste_collection_schedule
