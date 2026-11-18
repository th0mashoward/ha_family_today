import { LitElement, html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import type {
  FamilyTodayAttributes,
  Hass,
  SchoolBreak,
  SchoolCardConfig,
  SchoolStatus,
} from "./types";
import { DEFAULT_ENTITY, colorFor, formatDateShort, inDays } from "./helpers";
import "./school-editor";

const DEFAULT_MAX_BREAKS = 3;

interface Entry {
  person: string | null;
  status: SchoolStatus;
}

export class FamilyTodaySchoolCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };
  declare hass: Hass;
  declare _config: SchoolCardConfig;

  // ---- HA card API ------------------------------------------------------
  setConfig(config: Partial<SchoolCardConfig>): void {
    const max = config.max_breaks;
    if (max != null && (!Number.isInteger(max) || max < 1)) {
      throw new Error("max_breaks must be a positive whole number");
    }
    this._config = {
      type: "custom:family-today-school-card",
      entity: DEFAULT_ENTITY,
      max_breaks: DEFAULT_MAX_BREAKS,
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

  protected render(): TemplateResult {
    if (!this.hass || !this._config) return html``;
    const entity = this._config.entity ?? DEFAULT_ENTITY;
    const found = this.hass.states[entity];
    if (!found) {
      return html`<ha-card>
        <div class="missing">
          Family Today sensor not found (<code>${entity}</code>).
        </div>
      </ha-card>`;
    }

    const a = found.attributes as FamilyTodayAttributes;
    const entries = this._entries(a);
    const single = entries.length === 1;
    const title = this._config.title ?? "School";
    return html`<ha-card>
      <div class="header">
        <div class="title">${title}</div>
        ${single ? this._chip(entries[0].status) : nothing}
      </div>
      ${entries.length
        ? entries.map((entry) => this._section(entry, !single))
        : html`<div class="empty">No school data yet.</div>`}
    </ha-card>`;
  }

  // ---- data -------------------------------------------------------------
  private _entries(a: FamilyTodayAttributes): Entry[] {
    const byPerson = a.school_by_person ?? {};
    const people = Object.keys(byPerson);
    if ((a.school_overrides?.length ?? 0) > 0 && people.length) {
      return people.map((person) => ({ person, status: byPerson[person] }));
    }
    const status = a.school ?? this._legacyStatus(a);
    return status ? [{ person: null, status }] : [];
  }

  /** Build a minimal status from older top-level sensor attributes. */
  private _legacyStatus(a: FamilyTodayAttributes): SchoolStatus | null {
    if (a.school_day == null) return null;
    return {
      is_school_day: a.school_day,
      reason: a.break_reason ?? null,
      term: a.term ?? null,
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

  // ---- sections ---------------------------------------------------------
  private _section(entry: Entry, showHead: boolean): TemplateResult {
    const { person, status } = entry;
    const color = person
      ? colorFor(person, this._config.colors)
      : "var(--primary-color)";
    return html`<section class="section">
      ${showHead
        ? html`<div class="child-head" style=${styleMap({ "--person-color": color })}>
            <span class="dot"></span>
            <span class="child-name">${person}</span>
            ${this._chip(status)}
          </div>`
        : nothing}
      ${this._term(status)} ${this._facts(status)} ${this._breaks(status)}
    </section>`;
  }

  private _chip(s: SchoolStatus): TemplateResult {
    const label = s.is_school_day ? "School day" : s.reason || "No school";
    return html`<span class=${classMap({ chip: true, school: s.is_school_day })}>
      <ha-icon
        icon=${s.is_school_day ? "mdi:school" : "mdi:school-outline"}
      ></ha-icon>
      ${label}
    </span>`;
  }

  private _term(s: SchoolStatus): TemplateResult | typeof nothing {
    if (!s.term) return nothing;
    const pct = s.term_progress ?? null;
    const ends = s.term_end
      ? `ends ${formatDateShort(this.hass, s.term_end)}`
      : "";
    return html`<div class="term">
      <div class="term-head">
        <span class="term-name">${s.term}</span>
        ${pct != null ? html`<span class="term-pct">${pct}%</span>` : nothing}
      </div>
      ${pct != null
        ? html`<div
            class="bar"
            role="progressbar"
            aria-label=${`${s.term} progress`}
            aria-valuemin="0"
            aria-valuemax="100"
            aria-valuenow=${pct}
          >
            <div class="bar-fill" style=${styleMap({ width: `${pct}%` })}></div>
          </div>`
        : nothing}
      <div class="term-meta">
        ${s.term_school_days != null && s.term_school_days_done != null
          ? html`<span
              >${s.term_school_days_done} of ${s.term_school_days} school
              days</span
            >`
          : html`<span></span>`}
        ${ends
          ? html`<span
              >${ends}${s.days_until_term_end === 0 ? " · today" : ""}</span
            >`
          : nothing}
      </div>
    </div>`;
  }

  private _facts(s: SchoolStatus): TemplateResult | typeof nothing {
    const rows: TemplateResult[] = [];
    if (!s.is_school_day) {
      if (s.back_to_school) {
        // A mid-term break returns to the same term; only a gap between terms
        // should be labelled with the next term's name.
        const startsNextTerm =
          !!s.next_term &&
          !!s.next_term_start &&
          s.next_term_start === s.back_to_school;
        const label = startsNextTerm
          ? `${s.next_term} starts`
          : "Back to school";
        rows.push(
          this._fact(
            "mdi:school",
            label,
            `${formatDateShort(this.hass, s.back_to_school)} · ${inDays(
              s.days_until_school,
            )}`,
          ),
        );
      } else if (s.next_term && s.next_term_start) {
        rows.push(
          this._fact(
            "mdi:calendar-start",
            "Next term",
            `${s.next_term} · ${formatDateShort(
              this.hass,
              s.next_term_start,
            )} · ${inDays(s.days_until_next_term)}`,
          ),
        );
      }
    }
    return rows.length ? html`<div class="facts">${rows}</div>` : nothing;
  }

  private _fact(
    icon: string,
    label: string,
    value: string,
  ): TemplateResult {
    return html`<div class="fact">
      <ha-icon icon=${icon}></ha-icon>
      <span class="fact-label">${label}</span>
      <span class="fact-value">${value}</span>
    </div>`;
  }

  private _breaks(s: SchoolStatus): TemplateResult | typeof nothing {
    const limit = Math.max(1, this._config.max_breaks ?? DEFAULT_MAX_BREAKS);
    const breaks = (s.upcoming_breaks ?? []).slice(0, limit);
    if (!breaks.length) {
      return html`<div class="empty-breaks">
        ${s.term || s.next_term
          ? "No school breaks in the calendar yet."
          : "No term dates configured."}
      </div>`;
    }
    return html`<div class="breaks">
      <div class="breaks-title">Upcoming breaks</div>
      ${breaks.map((brk) => this._breakRow(brk))}
    </div>`;
  }

  private _breakRow(brk: SchoolBreak): TemplateResult {
    const when =
      brk.end && brk.end !== brk.start
        ? `${formatDateShort(this.hass, brk.start)} – ${formatDateShort(
            this.hass,
            brk.end,
          )}`
        : formatDateShort(this.hass, brk.start);
    const inset = brk.kind === "inset";
    return html`<div class=${classMap({ break: true, inset })}>
      <ha-icon icon=${inset ? "mdi:book-open" : "mdi:beach"}></ha-icon>
      <span class="break-name">${brk.name}</span>
      <span class="break-count">${inDays(brk.days_until)}</span>
      <span class="break-when">${when}</span>
    </div>`;
  }

  // ---- styles -----------------------------------------------------------
  static styles = css`
    :host { display: block; }
    ha-card { padding: 16px; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em;
      white-space: nowrap; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .section { margin-top: 12px; }
    .section + .section { margin-top: 12px; padding-top: 12px;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
    .child-head { display: flex; align-items: center; gap: 6px; margin-bottom: 8px; }
    .child-name { font-weight: 500; color: var(--primary-text-color); }
    .child-head .chip { margin-left: auto; }
    .dot { width: 10px; height: 10px; border-radius: 50%; flex: none;
      background: var(--person-color, var(--primary-color)); }
    .term-head { display: flex; align-items: baseline; gap: 8px; }
    .term-name { font-weight: 500; color: var(--primary-text-color); }
    .term-pct { margin-left: auto; color: var(--secondary-text-color); font-variant-numeric: tabular-nums; }
    .bar { height: 8px; margin-top: 8px; border-radius: 999px; overflow: hidden;
      background: var(--secondary-background-color); }
    .bar-fill { height: 100%; border-radius: inherit; background: var(--primary-color); }
    .term-meta { display: flex; justify-content: space-between; gap: 8px; margin-top: 5px;
      color: var(--secondary-text-color); font-size: 0.85em; }
    .facts { margin-top: 10px; }
    .fact { display: flex; align-items: center; gap: 8px; padding: 8px 10px; border-radius: 10px;
      background: var(--secondary-background-color); color: var(--primary-text-color); }
    .fact ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: none; }
    .fact-label { color: var(--secondary-text-color); }
    .fact-value { margin-left: auto; min-width: 0; text-align: right; overflow-wrap: anywhere; }
    .breaks { margin-top: 12px; }
    .breaks-title { margin-bottom: 4px; color: var(--secondary-text-color); font-size: 0.8em;
      font-weight: 500; letter-spacing: 0.02em; text-transform: uppercase; }
    .break { display: grid; grid-template-columns: 20px minmax(0, 1fr) auto;
      align-items: center; gap: 2px 8px; padding: 6px 0;
      border-bottom: 1px solid var(--divider-color, rgba(0, 0, 0, 0.08)); }
    .break:last-child { border-bottom: 0; }
    .break ha-icon { --mdc-icon-size: 18px; color: var(--primary-color); grid-row: 1 / span 2; }
    .break.inset ha-icon { color: var(--warning-color, #f59e0b); }
    .break-name { grid-column: 2; grid-row: 1; font-weight: 500; color: var(--primary-text-color);
      overflow-wrap: anywhere; }
    .break-count { grid-column: 3; grid-row: 1; color: var(--secondary-text-color); font-size: 0.85em;
      white-space: nowrap; }
    .break-when { grid-column: 2; grid-row: 2; color: var(--secondary-text-color); font-size: 0.85em; }
    .empty-breaks { padding: 4px 0; color: var(--secondary-text-color); font-size: 0.9em; }
    .empty, .missing { padding: 12px 0; color: var(--secondary-text-color); text-align: center; }
    .missing code { overflow-wrap: anywhere; }
  `;
}

customElements.define("family-today-school-card", FamilyTodaySchoolCard);
