import type { CardConfig, FamilyEvent, Hass } from "./types";

export const DEFAULT_ENTITY = "sensor.family_today_today";
export const DEFAULT_BIN_ENTITY = "sensor.family_today_next_bin_collection";

const PALETTE = [
  "#4285f4", "#e8710a", "#0f9d58", "#a142f4",
  "#d93025", "#12b5cb", "#f9ab00", "#e52592",
];

export function colorFor(person: string, colors?: Record<string, string>): string {
  if (colors?.[person]) return colors[person];
  let h = 0;
  for (const ch of person) h = (h * 31 + ch.charCodeAt(0)) >>> 0;
  return PALETTE[h % PALETTE.length];
}

export type EventStatus = "all-day" | "past" | "now" | "upcoming";

export function statusOf(ev: FamilyEvent, now: number): EventStatus {
  if (ev.all_day) return "all-day";
  const start = Date.parse(ev.start);
  const end = Date.parse(ev.end);
  if (end <= now) return "past";
  if (start <= now) return "now";
  return "upcoming";
}

function locale(hass: Hass): string {
  return hass.locale?.language || hass.language || "en";
}

export function formatTime(hass: Hass, iso: string): string {
  const tf = hass.locale?.time_format;
  const hour12 = tf === "12" ? true : tf === "24" ? false : undefined;
  return new Date(iso).toLocaleTimeString(locale(hass), {
    hour: "numeric",
    minute: "2-digit",
    hour12,
  });
}

export function timeRange(hass: Hass, ev: FamilyEvent): string {
  if (ev.all_day) return "All day";
  return `${formatTime(hass, ev.start)} – ${formatTime(hass, ev.end)}`;
}

export function formatDateLong(hass: Hass, now: number): string {
  return new Date(now).toLocaleDateString(locale(hass), {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function formatDateShort(hass: Hass, isoDate: string): string {
  // isoDate is YYYY-MM-DD; parse as local to avoid UTC shifting the day.
  const [y, m, d] = isoDate.split("-").map(Number);
  return new Date(y, m - 1, d).toLocaleDateString(locale(hass), {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export function countdown(ms: number): string {
  const mins = Math.max(0, Math.round(ms / 60000));
  if (mins < 1) return "now";
  if (mins < 60) return `in ${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m ? `in ${h}h ${m}m` : `in ${h}h`;
}

export function defaults(config: Partial<CardConfig>): CardConfig {
  return {
    type: "custom:family-today-card",
    layout: "list",
    show_all_day: true,
    show_bins: true,
    show_school: true,
    show_next_bin: true,
    hide_past: false,
    ...config,
  };
}
