import { LitElement, html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import type { Hass, SchoolCardConfig, SchoolBreak, SchoolStatus } from "./types";
import {
  DEFAULT_ENTITY,
  formatDateShort,
  inDays,
} from "./helpers";
import "./school-editor";

export class FamilyTodaySchoolCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };
  declare hass: Hass;
  declare _config: SchoolCardConfig;

  setConfig(config: Partial<SchoolCardConfig>): void {
    const max = config.max_breaks;
    if (max != null && (!Number.isInteger(max) || max < 1)) {
      throw new Error("max_breaks must be a positive whole number");
    }
    this._config = {
      type: "custom:family-today-school-card",
      entity: DEFAULT_ENTITY,
      max_breaks: config.max_breaks ?? 3,
      ...config,
    };
  }

  getCardSize(): number {
    return 4;
  }

  static getStubConfig(): Partial<SchoolCardConfig> {
    return { entity: DEFAULT_ENTITY };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("family-today-school-card-editor");
  }

  render(): TemplateResult | typeof nothing {
    if (!this.hass || !this._config) return nothing;
    const t = this._config.entity ?? DEFAULT_ENTITY;
    const e = this.hass.states[t];
    if (!e) {
      return html`<ha-card>
        <div class="missing">
          ${this.hass.translate("ui.card.family_today_school.sensor_not_found") ?? "Family Today sensor not found"} (<code>${t}</code>).
        </div>
      </ha-card>`;
    }
    const a = e.attributes;
    const entries = this._entries(a);
    const singleEntry = entries.length === 1;
    const title = this._config.title ?? this.hass.translate("ui.card.family_today_school.school") ?? "School";

    return html`<ha-card>
      <div class="header">
        <div class="title">${title}</div>
        ${singleEntry ? this._chip(entries[0].status) : nothing}
      </div>
      ${entries.length ? entries.map((entry) => this._section(entry, !singleEntry)) : html`<div class="empty">${this.hass.translate("ui.card.family_today_school.no_school_data_yet") ?? "No school data yet."}</div>`}
    </ha-card>`;
  }

  private _entries(a: any): { person: string | null; status: SchoolStatus }[] {
    const schoolByPerson = a.school_by_person ?? {};
    const people = Object.keys(schoolByPerson);
    if ((a.school_overrides?.length ?? 0) > 0 && people.length) {
      return people.map((person) => ({ person, status: schoolByPerson[person] }));
    }
    const status = a.school ?? this._legacyStatus(a);
    return status ? [{ person: null, status }] : [];
  }

  private _legacyStatus(t: any): SchoolStatus | null {
    if (t.school_day == null) return null;
    return {
      is_school_day: t.school_day,
      reason: t.break_reason ?? null,
      term: t.term ?? null,
      term_start: null,
      term_end: null,
      days_until_term_end: null,
      term_school_days: null,
      term_school_days_done: null,
      term_progress: null,
      next_term: null,
      next_term_start: null,
      days_until_next_term: null,
      next_break: null,
      next_break_start: null,
      days_until_next_break: null,
      back_to_school: null,
      days_until_school: null,
      upcoming_breaks: [],
    };
  }

  private _section(t: { person: string | null; status: SchoolStatus }, showHead: boolean): TemplateResult {
    const { person, status } = t;
    const color = person ? this._color(person) : "var(--primary-color)";
    return html`<section class="section">
      ${showHead ? html`<div class="child-head" style=${styleMap({ "--person-color": color })}>
            <span class="dot"></span>
            <span class="child-name">${person}</span>
            ${this._chip(status)}
          </div>` : nothing}
      ${this._term(status)} ${this._facts(status)} ${this._breaks(status)}
    </section>`;
  }

  private _color(person: string): string {
    return this.hass.themes?.effective?.colors?.primary || "var(--primary-color)";
  }

  private _chip(t: SchoolStatus): TemplateResult {
    const label = t.is_school_day ? this.hass.translate("ui.card.family_today_school.school_day") ?? "School day" : t.reason || (this.hass.translate("ui.card.family_today_school.no_school") ?? "No school");
    return html`<span class=${classMap({ chip: true, school: t.is_school_day })}>
      <ha-icon
        icon=${t.is_school_day ? "mdi:school" : "mdi:school-outline"}
      ></ha-icon>
      ${label}
    </span>`;
  }

  private _term(t: SchoolStatus): TemplateResult | typeof nothing {
    if (!t.term) return nothing;
    const progress = t.term_progress ?? null;
    const ends = t.term_end
      ? `${this.hass.translate("ui.card.family_today.term_ends") ?? "Term ends"} ${formatDateShort(this.hass, t.term_end)}`
      : "";
    return html`<div class="term">
      <div class="term-head">
        <span class="term-name">${t.term}</span>
        ${progress != null ? html`<span class="term-pct">${progress}%</span>` : nothing}
      </div>
      ${progress != null ? html`<div
            class="bar"
            role="progressbar"
            aria-label=${`${t.term} progress`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${progress}
          >
            <div class="bar-fill" style=${styleMap({ width: `${progress}%` })}></div>
          </div>` : nothing}
      <div class="term-meta">
        ${t.term_school_days != null && t.term_school_days_done != null ? html`<span
              >${t.term_school_days_done} of ${t.term_school_days} school days</span
            >` : nothing}
        ${ends ? html`<span>${ends}${t.days_until_term_end === 0 ? " · today" : ""}</span>` : nothing}
      </div>
    </div>`;
  }

  private _facts(t: SchoolStatus): TemplateResult | typeof nothing {
    const rows: TemplateResult[] = [];
    if (!t.is_school_day) {
      if (t.back_to_school) {
        const nextTermStarts = !!t.next_term && !!t.next_term_start && t.next_term_start === t.back_to_school;
        const label = nextTermStarts ? `${t.next_term} starts` : this.hass.translate("ui.card.family_today_school.back_to_school") ?? "Back to school";
        rows.push(
          this._fact("mdi:school", label, `${formatDateShort(this.hass, t.back_to_school)} · ${inDays(t.days_until_school)}`),
        );
      } else if (t.next_term && t.next_term_start) {
        rows.push(
          this._fact(
            "mdi:calendar-start",
            this.hass.translate("ui.card.family_today_school.next_term") ?? "Next term",
            `${t.next_term} · ${formatDateShort(this.hass, t.next_term_start)} · ${inDays(t.days_until_next_term)}`,
          ),
        );
      }
    }
    return rows.length ? html`<div class="facts">${rows}</div>` : nothing;
  }

  private _fact(icon: string, label: string, value: string): TemplateResult {
    return html`<div class="fact">
      <ha-icon icon=${icon}></ha-icon>
      <span class="fact-label">${label}</span>
      <span class="fact-value">${value}</span>
    </div>`;
  }

  private _breaks(t: SchoolStatus): TemplateResult | typeof nothing {
    const max = Math.max(1, this._config.max_breaks ?? 3);
    const breaks = (t.upcoming_breaks ?? []).slice(0, max);
    if (!breaks.length) {
      return html`<div class="empty-breaks">
        ${t.term || t.next_term ? this.hass.translate("ui.card.family_today_school.no_school_breaks_in_calendar_yet") ?? "No school breaks in the calendar yet." : this.hass.translate("ui.card.family_today_school.no_term_dates_configured") ?? "No term dates configured."}
      </div>`;
    }
    return html`<div class="breaks">
      <div class="breaks-title">${this.hass.translate("ui.card.family_today_school.upcoming_breaks") ?? "Upcoming breaks"}</div>
      ${breaks.map((brk) => this._breakRow(brk))}
    </div>`;
  }

  private _breakRow(t: SchoolBreak): TemplateResult {
    const when = t.end && t.end !== t.start ? `${formatDateShort(this.hass, t.start)} – ${formatDateShort(this.hass, t.end)}` : formatDateShort(this.hass, t.start);
    const isInset = t.kind === "inset";
    return html`<div class=${classMap({ break: true, inset: isInset })}>
      <ha-icon icon=${isInset ? "mdi:book-open" : "mdi:beach"}></ha-icon>
      <span class="break-name">${t.name}</span>
      <span class="break-count">${inDays(t.days_until)}</span>
      <span class="break-when">${when}</span>
    </div>`;
  }
}

customElements.define("family-today-school-card", FamilyTodaySchoolCard);
