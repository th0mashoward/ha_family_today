// Smoke test: renders the built bundle in jsdom with a mock `hass`.
import { JSDOM } from "jsdom";
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, resolve } from "node:path";
import assert from "node:assert/strict";

const here = dirname(fileURLToPath(import.meta.url));
const bundle = readFileSync(
  resolve(here, process.env.BUNDLE ?? "../../custom_components/family_today/www/family-today-card.js"),
  "utf8",
);

const dom = new JSDOM("<!doctype html><body></body>", { runScripts: "outside-only", pretendToBeVisual: true });
const { window } = dom;
window.eval(bundle);

const now = Date.now();
const iso = (ms) => new Date(now + ms).toISOString();
const H = 3600_000;
const ev = (person, summary, startMs, endMs, extra = {}) => ({
  calendar: "calendar." + person.toLowerCase(), person, summary,
  start: iso(startMs), end: iso(endMs), all_day: false, location: null, ...extra,
});
const past = ev("Tom", "Early meeting", -3 * H, -2 * H);
const current = ev("Sam", "Swimming", -0.5 * H, 0.5 * H, { location: "Leisure centre" });
const upcoming = ev("Tom", "Parents evening", 2 * H, 3 * H);
const allDay = ev("Family", "Book day", 0, 0, { all_day: true });
const agenda = [allDay, past, current, upcoming];

const attrs = (over = {}) => ({
  agenda,
  by_person: { Tom: [past, upcoming], Sam: [current], Family: [allDay] },
  people: ["Tom", "Sam", "Family", "Alex"],
  next_event: upcoming,
  school_day: true, term: "Autumn 2",
  bins_today: [], bins_tomorrow: ["General waste", "Food waste"],
  ...over,
});
const mkHass = (a, extra = {}) => ({
  language: "en-GB", locale: { language: "en-GB", time_format: "24" },
  states: { "sensor.family_today_today": { state: String(a.agenda.length), attributes: a }, ...extra },
});

async function render(config, hass) {
  const el = window.document.createElement("family-today-card");
  el.setConfig(config);
  el.hass = hass;
  window.document.body.appendChild(el);
  await el.updateComplete;
  return el;
}
const text = (el) => el.shadowRoot.textContent.replace(/\s+/g, " ");

// --- list layout
let el = await render({ entity: "sensor.family_today_today" }, mkHass(attrs()));
let t = text(el);
assert.match(t, /School day/);
assert.match(t, /Bins out tonight/);
assert.match(t, /General waste, Food waste/);
assert.match(t, /Next: Parents evening/);
assert.match(t, /in 2h/);
assert.match(t, /Book day/);
assert.match(t, /Leisure centre/);
assert.ok(el.shadowRoot.querySelector(".event.past"), "past event dimmed");
assert.ok(el.shadowRoot.querySelector(".event.now"), "current event highlighted");

// --- hide_past
el = await render({ entity: "sensor.family_today_today", hide_past: true }, mkHass(attrs()));
assert.doesNotMatch(text(el), /Early meeting/);

// --- lanes layout includes people with no events
el = await render({ entity: "sensor.family_today_today", layout: "lanes" }, mkHass(attrs()));
t = text(el);
assert.match(t, /Alex/);
assert.match(t, /Nothing on/);
assert.equal(el.shadowRoot.querySelectorAll(".lane").length, 4);

// --- no school + next bin fallback
const quiet = attrs({ school_day: false, bins_tomorrow: [], bins_today: [] });
el = await render({}, mkHass(quiet, {
  "sensor.family_today_next_bin_collection": {
    state: "2026-11-19", attributes: { bins: ["Recycling"], days_until: 5 },
  },
}));
t = text(el);
assert.match(t, /No school/);
assert.match(t, /Next bins/);
assert.match(t, /Recycling \(in 5 days\)/);

// --- auto-discovers the entity when none configured and default id differs
const hass = mkHass(attrs());
hass.states = { "sensor.my_family": hass.states["sensor.family_today_today"] };
el = await render({}, hass);
assert.match(text(el), /School day/);

// --- bins today banner, title override, empty state
el = await render({ title: "Our day", entity: "sensor.family_today_today" },
  mkHass(attrs({ agenda: [], by_person: {}, bins_today: ["Recycling"], bins_tomorrow: [], next_event: null })));
t = text(el);
assert.match(t, /Our day/);
assert.match(t, /Bin day today/);
assert.match(t, /Nothing scheduled today/);

// --- missing entity message
el = await render({ entity: "sensor.nope" }, { language: "en", states: {} });
assert.match(text(el), /not found/);

// --- bad config rejected; editor + registry present
const bad = window.document.createElement("family-today-card");
assert.throws(() => bad.setConfig({ layout: "grid" }));
assert.ok(window.customElements.get("family-today-card-editor"));
assert.equal(window.customCards[0].type, "family-today-card");

console.log("card smoke tests passed");
window.close();
