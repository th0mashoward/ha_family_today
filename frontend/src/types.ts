export interface FamilyEvent {
  calendar: string;
  person: string;
  summary: string;
  start: string;
  end: string;
  all_day: boolean;
  location: string | null;
}

/** Attributes exposed by sensor.family_today_today */
export interface FamilyTodayAttributes {
  agenda: FamilyEvent[];
  by_person: Record<string, FamilyEvent[]>;
  people?: string[];
  next_event: FamilyEvent | null;
  school_day: boolean;
  term: string | null;
  bins_today: string[];
  bins_tomorrow: string[];
}

export interface HassEntity {
  state: string;
  attributes: Record<string, any>;
}

export interface Hass {
  states: Record<string, HassEntity>;
  language: string;
  locale?: { language?: string; time_format?: string };
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
