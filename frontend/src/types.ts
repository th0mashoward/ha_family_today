declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

export interface FamilyEvent {
  calendar: string;
  person: string;
  summary: string;
  start: string;
  end: string;
  all_day: boolean;
  location: string | null;
  description?: string | null;
}

export interface BinAppearance {
  colour?: string;
  icon?: string;
}

/** A holiday or INSET run shown in the school card timeline. */
export interface SchoolBreak {
  name: string;
  start: string;
  end: string | null;
  days: number | null;
  days_until: number | null;
  kind: "holiday" | "inset";
}

/** Nested `school` attribute: today's status plus countdowns. */
export interface SchoolStatus {
  is_school_day: boolean;
  reason: string | null;
  term: string | null;
  term_start: string | null;
  term_end: string | null;
  days_until_term_end: number | null;
  term_school_days: number | null;
  term_school_days_done: number | null;
  term_progress: number | null;
  next_term: string | null;
  next_term_start: string | null;
  days_until_next_term: number | null;
  next_break: string | null;
  next_break_start: string | null;
  days_until_next_break: number | null;
  back_to_school: string | null;
  days_until_school: number | null;
  upcoming_breaks: SchoolBreak[];
}

/** Per-calendar health for the "showing saved events" banner. */
export interface CalendarHealth {
  entity_id: string;
  role: "person" | "bins" | "school";
  person?: string | null;
  ok: boolean;
  using_cache: boolean;
  consecutive_failures: number;
  last_attempt: string | null;
  last_success: string | null;
  last_error: string | null;
}

/** Attributes exposed by sensor.family_today_today */
export interface FamilyTodayAttributes {
  agenda: FamilyEvent[];
  by_person: Record<string, FamilyEvent[]>;
  people?: string[];
  next_event: FamilyEvent | null;
  school_day: boolean;
  term: string | null;
  break_reason?: string | null;
  school?: SchoolStatus | null;
  school_by_person?: Record<string, SchoolStatus>;
  school_overrides?: string[];
  bins_today: string[];
  bins_tomorrow: string[];
  bin_meta?: Record<string, BinAppearance>;
  calendar_status?: Record<string, CalendarHealth>;
  calendars_ok?: number;
  calendars_total?: number;
}

export interface HassEntity {
  state: string;
  attributes: Record<string, any>;
}

export interface HassLocale {
  language: string;
  time_format: "12" | "24";
}

export interface Hass {
  states: Record<string, HassEntity>;
  language?: string;
  hass?: boolean;
  locale?: HassLocale;
  /** Returns a translated string for the key. In runtime HA this is always defined and returns a non-empty string. */
  translate(key: string, substitutions?: Record<string, any>): string;
  themes?: Theme;
}

export interface Locale extends HassLocale {
  (key: string): string;
}

export interface Theme {
  effective?: EffectiveTheme;
}

export interface EffectiveTheme {
  colors?: Colors;
}

export interface Colors {
  primary: string;
}

export type Layout = "list" | "lanes";

export interface CardConfig {
  type: string;
  entity?: string;
  bin_entity?: string;
  title?: string;
  layout?: Layout;
  show_all_day?: boolean;
  show_bins?: boolean;
  show_school?: boolean;
  show_next_bin?: boolean;
  hide_past?: boolean;
  colors?: Record<string, string>;
}

export interface SchoolCardConfig {
  type: string;
  entity?: string;
  title?: string;
  max_breaks?: number;
  colors?: Record<string, string>;
}
