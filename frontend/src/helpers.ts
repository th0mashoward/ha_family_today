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

// Mid-tone values that stay legible on both light and dark themes.
const BIN_COLOURS: Record<string, string> = {
  grey: "#9ca3af",
  gray: "#9ca3af",
  black: "#6b7280",
  white: "#e5e7eb",
  blue: "#3b82f6",
  green: "#22c55e",
  brown: "#a16207",
  red: "#ef4444",
  yellow: "#eab308",
  orange: "#f97316",
  purple: "#a855f7",
  pink: "#ec4899",
};

export const FALLBACK_BIN_ICON = "mdi:delete";

/** Friendly colour names map to theme-safe hex; anything else is CSS as-is. */
export function binColour(colour?: string): string | undefined {
  const value = colour?.trim();
  if (!value) return undefined;
  return BIN_COLOURS[value.toLowerCase()] ?? value;
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
  return hass.locale?.language ?? hass.language ?? "en";
}

export function formatTime(hass: Hass, iso: string): string {
  const tf = hass.locale?.time_format ?? "24";
  const hour12 = tf === "12" ? true : false;
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

export function formatEventWhen(hass: Hass, ev: FamilyEvent): string {
  const start = new Date(ev.start);
  if (!ev.all_day) {
    return `${formatDateLong(hass, start.getTime())} · ${timeRange(hass, ev)}`;
  }
  const end = new Date(ev.end);
  const lastDay = new Date(end.getFullYear(), end.getMonth(), end.getDate() - 1);
  const sameDay =
    start.getFullYear() === lastDay.getFullYear() &&
    start.getMonth() === lastDay.getMonth() &&
    start.getDate() === lastDay.getDate();
  const startText = formatDateLong(hass, start.getTime());
  return sameDay
    ? `All day · ${startText}`
    : `All day · ${startText} – ${formatDateLong(hass, lastDay.getTime())}`;
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

/** "today" / "tomorrow" / "in N days" for a whole-day countdown. */
export function inDays(days?: number | null): string {
  if (days == null) return "";
  if (days <= 0) return "today";
  if (days === 1) return "tomorrow";
  return `in ${days} days`;
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
