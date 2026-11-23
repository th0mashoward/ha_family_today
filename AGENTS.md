# AGENTS.md

Guidance for AI coding agents working in this repository. Read this before
changing code; it explains the architecture, the conventions that keep the
integration testable, and the commands CI runs.

## What this repository is

A **Home Assistant custom integration** plus two bundled **Lovelace cards**:

- `custom_components/family_today/` — the integration (Python).
- `frontend/` — TypeScript/Lit source for the cards, bundled with esbuild.
- `blueprints/automation/family_today/` — importable automation blueprints.
- `custom_components/family_today/www/family-today-card.js` — the committed,
  minified browser bundle.

It is not a standalone app and has no backend service. Home Assistant loads it
from `config/custom_components/` (HACS or manual copy). The integration fetches
calendar events, works out school days, term progress and bin collections, and
exposes the result as entities and actions. The cards render those entities.

At the time of writing the version is `0.3.0`; always read
`custom_components/family_today/manifest.json` for the current value.

## Fast facts

| Item | Value |
| --- | --- |
| Domain | `family_today` |
| Minimum Home Assistant | `2024.11.0` (`hacs.json`) |
| Python target | Home Assistant's runtime; uses Python 3.12 syntax (for example `type X = ...`) |
| Frontend stack | Lit 3, TypeScript (strict), esbuild, jsdom smoke tests |
| Card bundle | Committed; HACS users do not build it |
| Default branch | `master` |
| CI | `.github/workflows/validate.yml` (hassfest, HACS, Python scripts, TypeScript, card smoke tests) |
| Package manager | npm for the frontend; no Python packaging or pytest setup |

## Repository map

| Path | Responsibility |
| --- | --- |
| `custom_components/family_today/__init__.py` | Integration setup, card static path, `hass.data` coordinator registry, notification-action listener, entry unload. |
| `coordinator.py` | `DataUpdateCoordinator`: fetches calendars concurrently, builds `TodayData`, handles bin/school caches, source health, bin acknowledgement, arbitrary-range event reads. **Home Assistant dependent.** |
| `schedule.py` | Pure school-term, bin-rule and calendar-day logic. **No HA imports.** |
| `sources.py` | Pure last-good event cache and per-source health bookkeeping. **No HA imports.** |
| `parsing.py` | Pure parse/format helpers for the options-flow text fields. **No HA imports.** |
| `actions.py` | Pure helpers for the service layer: date-range parsing, notification payloads, `BINS_OUT_ACTION`. **No HA imports.** |
| `services.py` | Registers and implements `family_today.*` actions; HA glue around `actions.py`. |
| `config_flow.py` | Initial config flow and the options menu (calendars, school, bins, notifications). |
| `sensor.py` / `binary_sensor.py` | Entity classes and the attribute payload the cards consume. |
| `entity.py` | Shared coordinator-entity base and device info. |
| `diagnostics.py` | Redacted diagnostics download. |
| `const.py` | Option keys, defaults, limits, event names, card URL. |
| `strings.json` + `translations/en.json` | UI strings. **Keep the two files in sync.** |
| `services.yaml` | Action names, descriptions, field selectors for the HA UI. |
| `manifest.json` | Integration metadata, dependencies and version. |
| `frontend/src/` | Card source: `card.ts`, `school-card.ts`, editors, helpers, shared types. |
| `frontend/test/smoke.mjs` | Renders the built bundle in jsdom with a mock `hass`. |
| `tests/test_*.py` | Plain Python scripts using `assert`; they import pure modules directly, with no Home Assistant installed. |
| `blueprints/automation/family_today/` | Shipped automation blueprints; imported by raw GitHub URL. |
| `assets/` | Icon generator and README screenshots (referenced by raw GitHub URL, so do not move them). |

## Architecture and data flow

```
configured calendar entities
        │  calendar.get_events (concurrent, 20 s timeout)
        ▼
FamilyTodayCoordinator._async_update_data()
        │  FamilyEvent objects + schedule/bin/school logic
        ▼
TodayData snapshot
        │
        ├── sensor.family_today_today / next-bin sensor
        ├── binary_sensor.family_today_* (school, bins)
        └── family-today-card / family-today-school-card
```

Key points:

- **All state for one config entry lives on its coordinator.** Multiple entries
  (a second household or dashboard) are supported; never assume one global
  instance. Each entry gets its own device and entity IDs.
- `hass.data[DOMAIN][entry_id]` holds the coordinators for service and
  notification handling. Add/remove entries there in `async_setup_entry` /
  `async_unload_entry`.
- `TodayData` is rebuilt on each refresh. Entities and cards read it through
  `coordinator.data`.
- Bins and school feeds have their own **last-good caches**; a transient
  failure must not blank the view. `sources.py` holds the reusable cache/health
  primitives.
- A successful refresh clears Repairs issues; three consecutive failures create
  one. Do not remove that behaviour without a replacement.
- Calendar reads are concurrent and time-limited. Avoid adding blocking work to
  the event loop or serialising independent fetches.

## The entity/card contract

`FamilyEvent.as_dict()` in `coordinator.py` and the attributes returned by
`FamilyTodaySensor` / the binary sensors are the public API used by
`frontend/src/types.ts` and the cards. When you change a payload:

1. Change the Python dataclass/attribute.
2. Mirror it in `frontend/src/types.ts`.
3. Update the card(s) that use it.
4. Add or update a smoke-test assertion.
5. Rebuild the bundle and update the README if it is user-visible.

Prefer **additive** attribute changes. Removing or renaming an attribute is a
breaking change for existing dashboards and templates.

## Working rules

### Keep pure logic HA-free

`schedule.py`, `sources.py`, `parsing.py` and `actions.py` must not import Home
Assistant or `voluptuous`. They are the only modules the local Python tests can
import. If logic can be expressed without HA, put it there and test it directly;
keep `coordinator.py`, `services.py`, `config_flow.py`, entity modules and
`__init__.py` as thin HA glue.

### Options, not repeated setup

Per-entry settings live in `config_entry.options` as plain JSON-friendly values.
The options flow accumulates changes in `self.opts` and saves on **Done**. Any
text field with a custom syntax should have a matching `parse_*` / `format_*`
pair in `parsing.py`, plus a test.

### Strings must match

When adding an options step, menu entry, error or issue, edit **both**
`strings.json` and `translations/en.json`. They are intentionally duplicated.

### Multi-instance by default

- Do not hardcode `sensor.family_today_today` in integration code.
- Service target selection uses the entity registry to find the owning config
  entry; an untargeted service applies to every instance.
- Blueprint defaults may name the default instance's entity IDs because users
  can override them.
- The `family_today_bins_out` notification button intentionally acknowledges
  every instance that has a collection tomorrow.

### Never hand-edit the built bundle

`custom_components/family_today/www/family-today-card.js` is generated by
`npm run build`. Edit `frontend/src/`, then rebuild. The bundle is committed
because HACS does not run a build.

### Version bumps are release decisions

Ask before bumping. When bumping, keep these in sync:

- `custom_components/family_today/manifest.json`
- `frontend/package.json`
- `frontend/package-lock.json`
- the version banner in `frontend/src/index.ts`
- the status line in `README.md`
- the git release tag (`vX.Y.Z`), if one is being created

The card URL cache-buster is read from the manifest automatically.

### Privacy and state size

- Diagnostics redact personal data (`TO_REDACT` in `diagnostics.py`). Add new
  personal/free-text fields there too.
- Event descriptions are truncated (`MAX_EVENT_DESCRIPTION`) because attributes
  are stored by the recorder. Do not remove that cap.
- Avoid logging event titles, descriptions or names at info level.

### Git hygiene

- Check `git status` and `git log` before staging; user commits may interleave.
- Do not push, tag or open releases unless explicitly asked.
- Do not discard unrelated working-tree changes.
- Prefix commit messages by change type:
  - `feat: ...` for a new feature.
  - `chore: ...` for a bug fix, documentation change or other minor update.
- Keep the subject short and imperative after the prefix, for example
  `feat: add actions, notifications and automation blueprints`.

## Commands

### Python logic tests

These are plain scripts, not pytest:

```sh
python3 tests/test_schedule.py
python3 tests/test_parsing.py
python3 tests/test_sources.py
python3 tests/test_actions.py
```

CI runs exactly these four in `.github/workflows/validate.yml`. When adding a
pure module, add a matching script test and a CI step.

### Frontend

```sh
cd frontend
npm install
npm run typecheck   # tsc --noEmit
npm run build       # writes custom_components/family_today/www/family-today-card.js
npm test            # node test/smoke.mjs
```

**Important:** `npm test` reads the existing built bundle by default. Run
`npm run build` first after changing source, or the smoke test will exercise the
old code. You can point it at another bundle with
`BUNDLE=/path/to/file.js npm test`.

### CI

`.github/workflows/validate.yml` runs:

1. `hassfest` (manifest/translations/services validation)
2. HACS integration validation
3. the four Python scripts
4. `npm install`, `npm run typecheck`, `npm test`

Note that CI does **not** rebuild the card. A frontend change is incomplete
until the rebuilt bundle is committed.

### Syntax and data checks

```sh
# JSON (strings, translations, manifest)
python3 -m json.tool custom_components/family_today/strings.json > /dev/null
python3 -m json.tool custom_components/family_today/translations/en.json > /dev/null

# YAML syntax (PyYAML is not installed by default on macOS; Ruby's Psych is)
ruby -ryaml -e 'Psych.parse_file("custom_components/family_today/services.yaml")'
ruby -ryaml -e 'Psych.parse_file("blueprints/automation/family_today/bins_out_reminder.yaml")'

# Python compile check. Use Python 3.12 for the whole package; a 3.9
# interpreter cannot parse the `type` alias in __init__.py.
python3 -m compileall -q custom_components/family_today
```

If your default `python3` is 3.9, compile individual modules that do not use the
3.12 alias, and rely on CI for the rest.

There is no Home Assistant package installed locally, so importing
`coordinator.py`, `sensor.py`, `services.py` or `config_flow.py` will fail in the
test scripts. Keep testable logic out of those modules.

## Common tasks

### Add or change pure logic

1. Put it in `schedule.py`, `sources.py`, `parsing.py` or `actions.py`.
2. Keep the module free of HA/voluptuous imports.
3. Add assertions to the matching `tests/test_*.py` script.
4. Run the script and add it to CI if it is a new file.

### Add a sensor attribute

1. Add a field to `TodayData`.
2. Populate it in `FamilyTodayCoordinator._async_update_data()`.
3. Expose it from `sensor.py` or `binary_sensor.py`.
4. Mirror the type in `frontend/src/types.ts`.
5. Use it in the card and add a smoke assertion.
6. Rebuild and test the bundle; update the README entity list.

### Add an option

1. Add the key and a comment to `const.py`.
2. Add the field to a step in `config_flow.py` (and to the `init` menu if it is a
   new section).
3. If it is a text format, add `parse_*` / `format_*` helpers in `parsing.py`.
4. Mirror the labels/descriptions in `strings.json` and
   `translations/en.json`.
5. Read it in `FamilyTodayCoordinator.__init__` (option changes reload the
   entry automatically through the update listener).
6. Document it in the README's Configuration section.

### Add an action (service)

1. Put parsing/building logic in `actions.py` and test it.
2. Add the handler and schema to `services.py`; register it in
   `async_setup_services()`.
3. Add the action to `services.yaml` with descriptions and selectors.
4. Document it in the README's Actions section.
5. If it is triggered by a companion-app notification button, add the constant
   in `actions.py`/`const.py` and the listener in `__init__.py`, and make sure
   the shipped blueprint uses the same action string. `tests/test_actions.py`
   cross-checks this for the bins button.

### Add a blueprint

1. Put it in `blueprints/automation/family_today/`.
2. Prefer the integration actions (`family_today.announce`,
   `family_today.get_events`, etc.) instead of putting notification logic in
   the blueprint.
3. Give entity inputs sensible defaults for the default instance, and keep an
   optional notify-entity input that falls back to the integration default.
4. Validate the YAML and render any non-trivial Jinja templates with sample
   data.
5. Link the raw GitHub URL in the README Blueprints section.

### Change the cards

- Source only in `frontend/src/`; update `types.ts` with any payload changes.
- Respect Home Assistant's `hass` object and localisation helpers in
  `helpers.ts`.
- Card UI strings live in the integration's `common` section, loaded at runtime
  with `hass.loadBackendTranslation("common", "family_today")` and resolved as
  `component.family_today.common.<key>`. Do **not** add a top-level `card`
  section: hassfest rejects it and the frontend will not load it.
- Add smoke coverage in `frontend/test/smoke.mjs`.
- Run `npm run typecheck && npm run build && npm test`.
- Commit both the source and the rebuilt bundle.

## Definition of done

Before finishing a change:

- [ ] Relevant Python script tests pass, and any new pure module has one.
- [ ] `npm run typecheck` passes for frontend changes.
- [ ] `npm run build` has been run and the bundle is committed.
- [ ] `npm test` passes against the **rebuilt** bundle.
- [ ] JSON files parse; changed YAML parses.
- [ ] `strings.json` and `translations/en.json` match.
- [ ] `services.yaml` matches any changed service schema.
- [ ] New public behaviour is documented in the README.
- [ ] `git diff --check` is clean.
- [ ] No unrelated files, secrets, personal data or build artefacts are staged.
