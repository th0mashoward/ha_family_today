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
const current = ev("Sam", "Swimming", -0.5 * H, 0.5 * H, {
  location: "Leisure centre", description: "Bring goggles",
});
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
  bin_meta: {
    "General waste": { colour: "grey", icon: "mdi:trash-can" },
    "Food waste": { icon: "mdi:food-apple-outline" },
  },
  ...over,
});
const mkHass = (a, extra = {}) => ({
  language: "en-GB",
  locale: { language: "en-GB", time_format: "24" },
  // Real Home Assistant exposes `hass.localize`, not `hass.translate`, and
  // returns "" for keys the frontend does not know about.
  localize: (key) => {
    const dict = {
      "ui.card.family_today.sensor_not_found": "Family Today sensor not found",
      "ui.card.family_today.school_day": "School day",
      "ui.card.family_today.no_school": "No school",
      "ui.card.family_today.bins_out_tonight": "Bins out tonight",
      "ui.card.family_today.next": "Next",
      "ui.card.family_today.tomorrow": "tomorrow",
      "ui.card.family_today.bin_day_today": "Bin day today",
      "ui.card.family_today.details_for": "Details for",
      "ui.card.family_today.nothing_scheduled_today": "Nothing scheduled today",
      "ui.card.family_today.nothing_on": "Nothing on",
      "ui.card.family_today.next_bins": "Next bins",
      "ui.card.family_today.show_details": "Show details",
      "ui.card.family_today.today_events_from": "Today's events from",
      "ui.card.family_today.calendar_unavailable": "Calendar unavailable",
      "ui.card.family_today.showing_saved_events": "Showing saved events",
      "ui.card.family_today.today": "Today",
      "ui.card.family_today.close": "Close",
      "ui.card.family_today.from_earlier_refresh": "are from an earlier refresh",
      "ui.card.family_today.term_ends": "Term ends",
      "ui.card.family_today.next_break": "Next break",
      "ui.card.family_today.back_to_school": "Back to school",
      "ui.card.family_today.next_term": "Next term",
      "ui.card.family_today.no_term_dates_configured": "No term dates configured.",
      // School card translations
      "ui.card.family_today_school.sensor_not_found": "Family Today sensor not found",
      "ui.card.family_today_school.school": "School",
      "ui.card.family_today_school.school_day": "School day",
      "ui.card.family_today_school.no_school": "No school",
      "ui.card.family_today_school.no_school_data_yet": "No school data yet.",
      "ui.card.family_today_school.no_school_breaks_in_calendar_yet": "No school breaks in the calendar yet.",
      "ui.card.family_today_school.no_term_dates_configured": "No term dates configured.",
      "ui.card.family_today_school.back_to_school": "Back to school",
      "ui.card.family_today_school.next_term": "Next term",
      "ui.card.family_today_school.upcoming_breaks": "Upcoming breaks",
    };
    return dict[key] ?? "";
  },
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
assert.match(t, /General waste/);
assert.match(t, /Food waste/);
assert.match(t, /Next: Parents evening/);
assert.match(t, /in 2h/);
assert.match(t, /Book day/);
assert.match(t, /Leisure centre/);
assert.ok(el.shadowRoot.querySelector(".event.past"), "past event dimmed");
assert.ok(el.shadowRoot.querySelector(".event.now"), "current event highlighted");
assert.equal(el.shadowRoot.querySelectorAll(".person").length, 0, "no name chip on event rows");

// --- clicking an event opens its details instead of the sensor more-info
let moreInfo = 0;
el.addEventListener("hass-more-info", () => moreInfo++);
el.shadowRoot.querySelector(".event.now").click();
await el.updateComplete;
assert.ok(el.shadowRoot.querySelector(".overlay"), "event dialog opens");
t = text(el);
assert.match(t, /Bring goggles/);
assert.match(t, /Leisure centre/);
assert.match(t, /Sam/);
assert.equal(moreInfo, 0, "event click does not open sensor more-info");
el.shadowRoot.querySelector(".dialog .close").click();
await el.updateComplete;
assert.equal(el.shadowRoot.querySelector(".overlay"), null, "dialog closes");

el.shadowRoot.querySelector(".event.now").click();
await el.updateComplete;
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
await el.updateComplete;
assert.equal(el.shadowRoot.querySelector(".overlay"), null, "Escape closes the dialog");

el.shadowRoot.querySelector(".next").click();
await el.updateComplete;
assert.match(el.shadowRoot.querySelector(".dialog-title").textContent, /Parents evening/);
el.shadowRoot.querySelector(".dialog .close").click();
await el.updateComplete;

// --- school chip opens a details dialog with the break reason + countdowns
const schoolOff = attrs({
  school_day: false,
  term: "Autumn 2",
  break_reason: "Half term",
  school: {
    is_school_day: false, reason: "Half term", term: "Autumn 2",
    term_end: null, days_until_term_end: null,
    next_term: "Autumn 2", next_term_start: "2026-11-02", days_until_next_term: 10,
    next_break: null, next_break_start: null, days_until_next_break: null,
    back_to_school: "2026-11-02", days_until_school: 10,
  },
});
let schoolMoreInfo = 0;
el = await render({ entity: "sensor.family_today_today" }, mkHass(schoolOff));
el.addEventListener("hass-more-info", () => schoolMoreInfo++);
const schoolChip = el.shadowRoot.querySelector(".chip");
assert.equal(schoolChip.getAttribute("role"), "button", "school chip is interactive");
schoolChip.click();
await el.updateComplete;
let schoolDialog = el.shadowRoot.querySelector(".school-dialog");
assert.ok(schoolDialog, "school dialog opens");
let schoolText = schoolDialog.textContent.replace(/\s+/g, " ");
assert.match(schoolText, /Half term/);
assert.match(schoolText, /Autumn 2/);
assert.match(schoolText, /Back to school/);
assert.match(schoolText, /in 10 days/);
assert.equal(schoolMoreInfo, 0, "school chip does not open sensor more-info");

// --- school day shows term end and next break countdowns
el = await render({ entity: "sensor.family_today_today" }, mkHass(attrs({
  school: {
    is_school_day: true, reason: null, term: "Autumn 2",
    term_end: "2026-12-18", days_until_term_end: 24,
    next_term: "Spring 1", next_term_start: "2027-01-05", days_until_next_term: 42,
    next_break: "Half term", next_break_start: "2026-10-26", days_until_next_break: 3,
    back_to_school: null, days_until_school: null,
  },
})));
el.shadowRoot.querySelector(".chip").click();
await el.updateComplete;
schoolDialog = el.shadowRoot.querySelector(".school-dialog");
assert.ok(schoolDialog, "school dialog opens on a school day");
schoolText = schoolDialog.textContent.replace(/\s+/g, " ");
assert.match(schoolText, /School day/);
assert.match(schoolText, /Term ends/);
assert.match(schoolText, /in 24 days/);
assert.match(schoolText, /Next break/);
assert.match(schoolText, /Half term/);
assert.match(schoolText, /in 3 days/);
schoolDialog.querySelector(".close").click();
await el.updateComplete;
assert.equal(el.shadowRoot.querySelector(".school-dialog"), null, "close button closes school dialog");

// --- per-child school calendars: one chip per child, each with its own status
const tomSchool = {
  is_school_day: true, reason: null, term: "Autumn 2",
  term_end: "2026-12-18", days_until_term_end: 24,
  next_term: "Spring 1", next_term_start: "2027-01-05", days_until_next_term: 42,
  next_break: "Half term", next_break_start: "2026-10-26", days_until_next_break: 3,
  back_to_school: null, days_until_school: null,
};
const samSchool = {
  is_school_day: false, reason: "INSET Day", term: "Autumn 2",
  term_end: "2026-12-18", days_until_term_end: 24,
  next_term: "Spring 1", next_term_start: "2027-01-05", days_until_next_term: 42,
  next_break: null, next_break_start: null, days_until_next_break: null,
  back_to_school: "2026-11-09", days_until_school: 3,
};
el = await render(
  { entity: "sensor.family_today_today" },
  mkHass(attrs({
    school_day: true, term: "Autumn 2", school: tomSchool,
    school_by_person: { Tom: tomSchool, Sam: samSchool },
    school_overrides: ["Sam"],
  })),
);
let childChips = el.shadowRoot.querySelectorAll(".school-chips .chip");
assert.equal(childChips.length, 2, "one school chip per child");
t = text(el);
assert.match(t, /Tom · School day/);
assert.match(t, /Sam · INSET Day/);
let childMoreInfo = 0;
el.addEventListener("hass-more-info", () => childMoreInfo++);
childChips[1].click();
await el.updateComplete;
let childDialog = el.shadowRoot.querySelector(".school-dialog");
assert.ok(childDialog, "per-child school dialog opens");
let childText = childDialog.textContent.replace(/\s+/g, " ");
assert.match(childText, /INSET Day/);
assert.match(childText, /Sam/);
assert.match(childText, /Back to school/);
assert.match(childText, /in 3 days/);
assert.equal(childMoreInfo, 0, "per-child chip does not open sensor more-info");
window.dispatchEvent(new window.KeyboardEvent("keydown", { key: "Escape" }));
await el.updateComplete;
assert.equal(el.shadowRoot.querySelector(".school-dialog"), null, "Escape closes per-child dialog");

// --- dedicated school card: term progress + upcoming breaks
const breakInfo = (name, start, end, daysUntil, kind = "holiday") => ({
  name, start, end, days: null, days_until: daysUntil, kind,
});
const termStatus = {
  is_school_day: true, reason: null, term: "Autumn 2",
  term_start: "2026-11-02", term_end: "2026-12-18", days_until_term_end: 24,
  term_school_days: 34, term_school_days_done: 23, term_progress: 68,
  next_term: "Spring 1", next_term_start: "2027-01-05", days_until_next_term: 42,
  next_break: "Half term", next_break_start: "2026-10-26", days_until_next_break: 3,
  back_to_school: null, days_until_school: null,
  upcoming_breaks: [
    breakInfo("Half term", "2026-10-26", "2026-10-30", 3),
    breakInfo("INSET Day", "2026-11-20", "2026-11-20", 28, "inset"),
    breakInfo("Christmas Holidays", "2026-12-19", "2027-01-04", 57),
  ],
};
async function renderSchool(config, hass) {
  const card = window.document.createElement("family-today-school-card");
  card.setConfig(config);
  card.hass = hass;
  window.document.body.appendChild(card);
  await card.updateComplete;
  return card;
}

let schoolCard = await renderSchool(
  { entity: "sensor.family_today_today" },
  mkHass(attrs({ school: termStatus, school_day: true, term: "Autumn 2" })),
);
let schoolText2 = text(schoolCard);
assert.match(schoolText2, /School/);
assert.match(schoolText2, /Autumn 2/);
assert.match(schoolText2, /68%/);
assert.match(schoolText2, /23 of 34 school days/);
assert.match(schoolText2, /ends Fri 18 Dec/);
assert.match(schoolText2, /Upcoming breaks/);
assert.match(schoolText2, /Half term/);
assert.match(schoolText2, /INSET Day/);
assert.match(schoolText2, /in 28 days/);
let progressBar = schoolCard.shadowRoot.querySelector('[role="progressbar"]');
assert.equal(progressBar.getAttribute("aria-valuenow"), "68");
assert.match(progressBar.querySelector(".bar-fill").getAttribute("style"), /width:\s*68%/);
let insetRow = schoolCard.shadowRoot.querySelector(".break.inset");
assert.ok(insetRow, "INSET breaks get their own style");
assert.equal(insetRow.querySelector("ha-icon").getAttribute("icon"), "mdi:book-open");

// holiday state: mid-term breaks say "Back to school", not the next term
schoolCard = await renderSchool(
  { entity: "sensor.family_today_today" },
  mkHass(attrs({
    school_day: false, term: "Autumn 2", break_reason: "Half term",
    school: {
      ...termStatus, is_school_day: false, reason: "Half term",
      term: null, term_start: null, term_end: null, days_until_term_end: null,
      term_school_days: null, term_school_days_done: null, term_progress: null,
      next_term: "Spring 1", next_term_start: "2027-01-05", days_until_next_term: 49,
      back_to_school: "2026-11-02", days_until_school: 6,
      upcoming_breaks: [breakInfo("Half term", "2026-10-26", "2026-10-30", 0)],
    },
  })),
);
schoolText2 = text(schoolCard);
assert.match(schoolText2, /Half term/);
assert.match(schoolText2, /Back to school/);
assert.match(schoolText2, /in 6 days/);
assert.doesNotMatch(schoolText2, /Spring 1 starts/);
assert.equal(schoolCard.shadowRoot.querySelector('[role="progressbar"]'), null, "no progress bar during a holiday");

// a gap between terms is labelled with the term that starts
schoolCard = await renderSchool(
  { entity: "sensor.family_today_today" },
  mkHass(attrs({
    school_day: false, term: null, break_reason: "Summer holiday",
    school: {
      ...termStatus, is_school_day: false, reason: "Summer holiday",
      term: null, term_start: null, term_end: null, days_until_term_end: null,
      term_school_days: null, term_school_days_done: null, term_progress: null,
      next_term: "Autumn 1", next_term_start: "2027-09-01", days_until_next_term: 20,
      back_to_school: "2027-09-01", days_until_school: 20, upcoming_breaks: [],
    },
  })),
);
schoolText2 = text(schoolCard);
assert.match(schoolText2, /Autumn 1 starts/);
assert.match(schoolText2, /in 20 days/);

// no term data at all: a hint instead of an empty section
schoolCard = await renderSchool(
  { entity: "sensor.family_today_today" },
  mkHass(attrs({ school: null, school_day: true, term: null, break_reason: null })),
);
assert.match(text(schoolCard), /No term dates configured/);

// per-child sections, each with its own progress and breaks
const samTerm = {
  ...termStatus, term: "Autumn 2", term_progress: 40,
  term_school_days: 30, term_school_days_done: 12,
  upcoming_breaks: [breakInfo("INSET Day", "2026-11-09", "2026-11-09", 0, "inset")],
};
schoolCard = await renderSchool(
  { entity: "sensor.family_today_today", max_breaks: 2 },
  mkHass(attrs({
    school: termStatus,
    school_by_person: { Tom: termStatus, Sam: samTerm },
    school_overrides: ["Sam"],
  })),
);
schoolText2 = text(schoolCard);
assert.equal(schoolCard.shadowRoot.querySelectorAll(".section").length, 2, "one section per child");
assert.equal(schoolCard.shadowRoot.querySelectorAll(".child-head .chip").length, 2);
assert.match(schoolText2, /Tom/);
assert.match(schoolText2, /Sam/);
assert.match(schoolText2, /68%/);
assert.match(schoolText2, /40%/);
assert.equal(schoolCard.shadowRoot.querySelectorAll(".break").length, 3, "max_breaks applies per child");
assert.ok(schoolCard.shadowRoot.querySelector(".break.inset"), "Sam's INSET day is shown");

assert.throws(() => {
  const bad = window.document.createElement("family-today-school-card");
  bad.setConfig({ max_breaks: 0 });
}, /max_breaks/);
assert.ok(window.customElements.get("family-today-school-card-editor"));
assert.ok(window.customCards.some((c) => c.type === "family-today-school-card"));

schoolCard = await renderSchool({ entity: "sensor.nope" }, { language: "en", states: {} });
assert.match(text(schoolCard), /not found/);

// --- hide_past
el = await render({ entity: "sensor.family_today_today", hide_past: true }, mkHass(attrs()));
assert.doesNotMatch(text(el), /Early meeting/);

// --- calendar health banner is not tied to the bin banners
const health = (over = {}) => ({
  entity_id: "calendar.sam", role: "person", person: "Sam", ok: true,
  using_cache: false, consecutive_failures: 0, last_attempt: null,
  last_success: null, last_error: null, ...over,
});
const withCalendar = (status, a = attrs()) =>
  mkHass(
    { ...a, calendar_status: { "calendar.sam": status }, calendars_ok: status.ok ? 1 : 0, calendars_total: 1 },
    { "calendar.sam": { state: "on", attributes: { friendly_name: "Sam's calendar" } } },
  );

el = await render(
  { entity: "sensor.family_today_today", show_bins: false },
  withCalendar(health({ ok: false, using_cache: true, consecutive_failures: 1 }),
    attrs({ bins_today: [], bins_tomorrow: [] })),
);
t = text(el);
assert.match(t, /Showing saved events/, "cached events show a banner");
assert.match(t, /Sam's calendar/, "banner names the calendar");
assert.ok(el.shadowRoot.querySelector(".banner.muted"), "health banner is muted even with show_bins off");

el = await render(
  { entity: "sensor.family_today_today", show_bins: false },
  withCalendar(health({ ok: false, using_cache: false, consecutive_failures: 1, last_error: "timeout" }),
    attrs({ bins_today: [], bins_tomorrow: [] })),
);
t = text(el);
assert.match(t, /Calendar unavailable/);
assert.match(t, /Couldn't refresh Sam's calendar/);

el = await render(
  { entity: "sensor.family_today_today", show_bins: false },
  withCalendar(health(), attrs({ bins_today: [], bins_tomorrow: [] })),
);
t = text(el);
assert.doesNotMatch(t, /Showing saved events|Calendar unavailable/, "no banner when every calendar is healthy");

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
    state: "2026-11-19",
    attributes: {
      bins: ["Recycling"],
      days_until: 5,
      bin_meta: { Recycling: { colour: "blue", icon: "mdi:recycle" } },
    },
  },
}));
t = text(el);
assert.match(t, /No school/);
assert.match(t, /Next bins/);
assert.match(t, /in 5 days/);
const nextChip = el.shadowRoot.querySelector(".banner.muted .bin-chip");
assert.ok(nextChip, "next-bin chip rendered");
assert.equal(nextChip.querySelector("ha-icon").getAttribute("icon"), "mdi:recycle");
assert.match(nextChip.getAttribute("style") ?? "", /--bin-color:\s*#3b82f6/);

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

// --- localisation goes through hass.localize, with English fallbacks
const localized = mkHass(attrs());
localized.localize = (key) =>
  key === "ui.card.family_today.school_day" ? "Schultag" : "";
el = await render({ entity: "sensor.family_today_today" }, localized);
t = text(el);
assert.match(t, /Schultag/, "translated strings win");
assert.match(t, /Bins out tonight/, "unknown keys fall back to English");
assert.equal(typeof localized.translate, "undefined", "hass has no translate method");

// --- bad config rejected; editor + registry present
const bad = window.document.createElement("family-today-card");
assert.throws(() => bad.setConfig({ layout: "grid" }));
assert.ok(window.customElements.get("family-today-card-editor"));
assert.equal(window.customCards[0].type, "family-today-card");

console.log("card smoke tests passed");
window.close();
