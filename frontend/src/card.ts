import { LitElement, html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import type {
  CardConfig,
  FamilyEvent,
  FamilyTodayAttributes,
  Hass,
  HassEntity,
} from "./types";
import {
  DEFAULT_BIN_ENTITY,
  DEFAULT_ENTITY,
  colorFor,
  countdown,
  defaults,
  formatDateLong,
  formatDateShort,
  formatEventWhen,
  statusOf,
  timeRange,
} from "./helpers";
import "./editor";

export class FamilyTodayCard extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
    _now: { state: true },
    _selected: { state: true },
  };
  declare hass: Hass;
  declare _config: CardConfig;
  declare _now: number;
  declare _selected: FamilyEvent | null;
  private _timer?: number;

  constructor() {
    super();
    this._now = Date.now();
    this._selected = null;
  }

  // ---- HA card API ------------------------------------------------------
  setConfig(config: Partial<CardConfig>): void {
    if (config.layout && !["list", "lanes"].includes(config.layout)) {
      throw new Error("layout must be 'list' or 'lanes'");
    }
    this._config = defaults(config);
  }

  getCardSize(): number {
    const a = this._attrs();
    return 2 + Math.min(a?.agenda.length ?? 0, 8);
  }

  static getStubConfig(): Partial<CardConfig> {
    return { entity: DEFAULT_ENTITY };
  }

  static getConfigElement(): HTMLElement {
    return document.createElement("family-today-card-editor");
  }

  connectedCallback(): void {
    super.connectedCallback();
    this._now = Date.now();
    this._timer = window.setInterval(() => (this._now = Date.now()), 30_000);
    window.addEventListener("keydown", this._onKeyDown);
  }

  disconnectedCallback(): void {
    super.disconnectedCallback();
    if (this._timer) window.clearInterval(this._timer);
    window.removeEventListener("keydown", this._onKeyDown);
  }

  private _onKeyDown = (ev: KeyboardEvent): void => {
    if (ev.key === "Escape" && this._selected) this._selected = null;
  };

  private _openEvent(ev: FamilyEvent): void {
    this._selected = ev;
  }

  private _closeEvent(): void {
    this._selected = null;
  }

  private _eventKey(ev: KeyboardEvent, event: FamilyEvent): void {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._openEvent(event);
    }
  }

  // ---- data -------------------------------------------------------------
  private _entity(): { id: string; ent: HassEntity } | null {
    const states = this.hass?.states ?? {};
    const id = this._config.entity ?? DEFAULT_ENTITY;
    if (states[id]) return { id, ent: states[id] };
    if (!this._config.entity) {
      for (const [eid, st] of Object.entries(states)) {
        if (
          eid.startsWith("sensor.") &&
          Array.isArray(st.attributes?.agenda) &&
          "by_person" in st.attributes
        ) {
          return { id: eid, ent: st };
        }
      }
    }
    return null;
  }

  private _attrs(): FamilyTodayAttributes | null {
    if (!this._config) return null;
    return (this._entity()?.ent.attributes as FamilyTodayAttributes) ?? null;
  }

  private _color(person: string): string {
    return colorFor(person, this._config.colors);
  }

  private _moreInfo(): void {
    const id = this._entity()?.id;
    if (!id) return;
    this.dispatchEvent(
      new CustomEvent("hass-more-info", {
        detail: { entityId: id },
        bubbles: true,
        composed: true,
      }),
    );
  }

  // ---- render -----------------------------------------------------------
  render(): TemplateResult | typeof nothing {
    if (!this._config || !this.hass) return nothing;
    const found = this._entity();
    if (!found) {
      return html`<ha-card>
        <div class="empty">
          Family Today sensor not found
          (<code>${this._config.entity ?? DEFAULT_ENTITY}</code>).
        </div>
      </ha-card>`;
    }
    const a = found.ent.attributes as FamilyTodayAttributes;
    const cfg = this._config;

    return html`
      <ha-card @click=${this._moreInfo}>
        ${this._header(a)} ${this._banners(a)} ${this._next(a)}
        ${cfg.layout === "lanes" ? this._lanes(a) : this._list(a)}
      </ha-card>
      ${this._selected ? this._eventDialog(this._selected) : nothing}
    `;
  }

  private _header(a: FamilyTodayAttributes): TemplateResult {
    const date = formatDateLong(this.hass, this._now);
    const { title, show_school } = this._config;
    return html`
      <div class="header">
        <div class="titles">
          <div class="title">${title ?? date}</div>
          ${title ? html`<div class="subtitle">${date}</div>` : nothing}
        </div>
        ${show_school
          ? html`<span class=${classMap({ chip: true, school: a.school_day })}>
              <ha-icon icon=${a.school_day ? "mdi:school" : "mdi:school-outline"}></ha-icon>
              ${a.school_day ? "School day" : "No school"}
            </span>`
          : nothing}
      </div>
    `;
  }

  private _banners(a: FamilyTodayAttributes): TemplateResult | typeof nothing {
    const { show_bins, show_next_bin } = this._config;
    if (!show_bins) return nothing;
    const rows: TemplateResult[] = [];
    if (a.bins_today?.length) {
      rows.push(this._banner("mdi:trash-can", "Bin day today", a.bins_today.join(", ")));
    }
    if (a.bins_tomorrow?.length) {
      rows.push(this._banner("mdi:trash-can-outline", "Bins out tonight", a.bins_tomorrow.join(", ")));
    }
    if (!rows.length && show_next_bin) {
      const next = this.hass.states[this._config.bin_entity ?? DEFAULT_BIN_ENTITY];
      if (next && /^\d{4}-\d{2}-\d{2}$/.test(next.state)) {
        const bins = (next.attributes.bins as string[] | undefined)?.join(", ") ?? "";
        const days = next.attributes.days_until as number | null | undefined;
        const when =
          days === 1 ? "tomorrow" : days != null ? `in ${days} days` : "";
        rows.push(
          this._banner(
            "mdi:calendar-clock",
            `Next bins · ${formatDateShort(this.hass, next.state)}`,
            [bins, when && `(${when})`].filter(Boolean).join(" "),
            true,
          ),
        );
      }
    }
    return rows.length ? html`<div class="banners">${rows}</div>` : nothing;
  }

  private _banner(icon: string, label: string, text: string, muted = false): TemplateResult {
    return html`<div class=${classMap({ banner: true, muted })}>
      <ha-icon icon=${icon}></ha-icon>
      <span class="label">${label}</span>
      <span class="text">${text}</span>
    </div>`;
  }

  private _next(a: FamilyTodayAttributes): TemplateResult | typeof nothing {
    const ev = a.next_event;
    if (!ev) return nothing;
    const ms = Date.parse(ev.start) - this._now;
    if (ms <= 0) return nothing;
    return html`<div
      class="next"
      role="button"
      tabindex="0"
      aria-label=${`Details for ${ev.summary}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._openEvent(ev);
      }}
      @keydown=${(e: KeyboardEvent) => this._eventKey(e, ev)}
    >
      <span class="dot" style=${styleMap({ background: this._color(ev.person) })}></span>
      <span class="next-text"><strong>Next:</strong> ${ev.summary}</span>
      <span class="next-when">${countdown(ms)}</span>
    </div>`;
  }

  // ---- layouts ----------------------------------------------------------
  private _visible(events: FamilyEvent[]): FamilyEvent[] {
    return this._config.hide_past
      ? events.filter((e) => statusOf(e, this._now) !== "past")
      : events;
  }

  private _list(a: FamilyTodayAttributes): TemplateResult {
    const all = this._visible(a.agenda ?? []);
    const allDay = all.filter((e) => e.all_day);
    const timed = all.filter((e) => !e.all_day);

    if (!all.length) return html`<div class="empty">Nothing scheduled today</div>`;

    return html`
      ${this._config.show_all_day && allDay.length
        ? html`<div class="allday">
            ${allDay.map(
              (ev) => html`<span
                class="allday-chip"
                style=${styleMap({ "--person-color": this._color(ev.person) })}
                role="button"
                tabindex="0"
                aria-label=${`Details for ${ev.summary}`}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._openEvent(ev);
                }}
                @keydown=${(e: KeyboardEvent) => this._eventKey(e, ev)}
                >${ev.summary}</span
              >`,
            )}
          </div>`
        : nothing}
      <div class="events">${timed.map((e) => this._eventRow(e))}</div>
    `;
  }

  private _lanes(a: FamilyTodayAttributes): TemplateResult {
    const people = a.people?.length ? a.people : Object.keys(a.by_person ?? {});
    if (!people.length) return html`<div class="empty">Nothing scheduled today</div>`;
    return html`<div class="lanes">
      ${people.map((p) => {
        const events = this._visible(a.by_person?.[p] ?? []);
        return html`<div class="lane" style=${styleMap({ "--person-color": this._color(p) })}>
          <div class="lane-head"><span class="dot"></span>${p}</div>
          ${events.length
            ? events.map((e) => this._eventRow(e))
            : html`<div class="lane-empty">Nothing on</div>`}
        </div>`;
      })}
    </div>`;
  }

  private _eventRow(ev: FamilyEvent): TemplateResult {
    const status = statusOf(ev, this._now);
    return html`<div
      class=${classMap({ event: true, past: status === "past", now: status === "now" })}
      style=${styleMap({ "--person-color": this._color(ev.person) })}
      role="button"
      tabindex="0"
      aria-label=${`Details for ${ev.summary}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._openEvent(ev);
      }}
      @keydown=${(e: KeyboardEvent) => this._eventKey(e, ev)}
    >
      <div class="time">${timeRange(this.hass, ev)}</div>
      <div class="body">
        <div class="summary">${ev.summary}</div>
        ${ev.location
          ? html`<div class="meta"><ha-icon icon="mdi:map-marker-outline"></ha-icon>${ev.location}</div>`
          : nothing}
      </div>
    </div>`;
  }

  private _eventDialog(ev: FamilyEvent): TemplateResult {
    return html`<div
      class="overlay"
      @click=${(e: Event) => {
        e.stopPropagation();
        this._closeEvent();
      }}
    >
      <div
        class="dialog"
        role="dialog"
        aria-modal="true"
        aria-label=${ev.summary}
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="dialog-head">
          <div>
            <div class="dialog-title">${ev.summary}</div>
            <div class="dialog-sub">${formatEventWhen(this.hass, ev)}</div>
          </div>
          <button class="close" aria-label="Close" @click=${this._closeEvent}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">
          ${ev.location
            ? html`<div class="detail">
                <ha-icon icon="mdi:map-marker-outline"></ha-icon><span>${ev.location}</span>
              </div>`
            : nothing}
          <div class="detail">
            <span class="dot" style=${styleMap({ background: this._color(ev.person) })}></span>
            <span>${ev.person}</span>
          </div>
          ${ev.description ? html`<div class="description">${ev.description}</div>` : nothing}
        </div>
      </div>
    </div>`;
  }

  // ---- styles -----------------------------------------------------------
  static styles = css`
    ha-card { padding: 16px; cursor: pointer; }
    .header { display: flex; align-items: center; justify-content: space-between; gap: 8px; margin-bottom: 12px; }
    .title { font-size: 1.3em; font-weight: 500; color: var(--primary-text-color); }
    .subtitle { color: var(--secondary-text-color); font-size: 0.9em; }
    .chip { display: inline-flex; align-items: center; gap: 4px; padding: 4px 10px; border-radius: 999px;
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em; white-space: nowrap; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .banners { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .banner { display: flex; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-text-color); }
    .banner.muted { background: var(--secondary-background-color); color: var(--secondary-text-color); }
    .banner ha-icon { --mdc-icon-size: 20px; flex: none; }
    .banner .label { font-weight: 500; }
    .banner .text { margin-left: auto; text-align: right; }
    .next { display: flex; align-items: center; gap: 8px; margin-bottom: 12px; cursor: pointer;
      border-radius: 4px; color: var(--primary-text-color); }
    .next:hover { background: var(--secondary-background-color); }
    .next-when { margin-left: auto; color: var(--secondary-text-color); white-space: nowrap; }
    .dot { width: 10px; height: 10px; border-radius: 50%; background: var(--person-color, var(--primary-color)); flex: none; }
    .allday { display: flex; flex-wrap: wrap; gap: 6px; margin-bottom: 10px; }
    .allday-chip { padding: 3px 10px; border-radius: 6px; font-size: 0.9em; cursor: pointer;
      border-left: 4px solid var(--person-color); background: var(--secondary-background-color); color: var(--primary-text-color); }
    .events { display: flex; flex-direction: column; gap: 2px; }
    .event { display: flex; align-items: flex-start; gap: 10px; padding: 8px 8px 8px 10px; cursor: pointer;
      border-left: 4px solid var(--person-color); border-radius: 4px; }
    .event:hover { background: var(--secondary-background-color); }
    .event.past { opacity: 0.45; }
    .event.now { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.1); }
    .event.now:hover { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.18); }
    .time { flex: none; min-width: 7.5em; color: var(--secondary-text-color); font-size: 0.9em; padding-top: 1px; }
    .body { flex: 1; min-width: 0; }
    .summary { color: var(--primary-text-color); overflow-wrap: anywhere; }
    .meta { display: flex; align-items: center; gap: 2px; color: var(--secondary-text-color); font-size: 0.85em; }
    .meta ha-icon { --mdc-icon-size: 14px; }
    .lanes { display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 12px; }
    .lane { min-width: 0; }
    .lane-head { display: flex; align-items: center; gap: 6px; font-weight: 500; margin-bottom: 6px; color: var(--primary-text-color); }
    .lane .event { flex-direction: column; gap: 0; }
    .lane .time { min-width: 0; }
    .lane-empty { color: var(--secondary-text-color); font-size: 0.9em; padding: 4px 0 4px 14px; }
    .empty { color: var(--secondary-text-color); padding: 12px 0; text-align: center; }
    .overlay { position: fixed; inset: 0; z-index: 999; display: flex; align-items: center;
      justify-content: center; padding: 16px; background: rgba(0, 0, 0, 0.45); }
    .dialog { width: min(420px, 100%); max-height: min(80vh, 560px); overflow: auto; padding: 18px 18px 20px;
      border-radius: 16px; color: var(--primary-text-color); box-shadow: 0 12px 40px rgba(0, 0, 0, 0.35);
      background: var(--card-background-color, var(--ha-card-background, #fff)); }
    .dialog-head { display: flex; align-items: flex-start; gap: 12px; }
    .dialog-head > div { flex: 1; min-width: 0; }
    .dialog-title { font-size: 1.15em; font-weight: 500; overflow-wrap: anywhere; }
    .dialog-sub { margin-top: 2px; color: var(--secondary-text-color); font-size: 0.9em; }
    .close { flex: none; display: inline-flex; padding: 2px; border: 0; border-radius: 50%; cursor: pointer;
      background: transparent; color: var(--secondary-text-color); }
    .close:hover { background: var(--secondary-background-color); color: var(--primary-text-color); }
    .close ha-icon { --mdc-icon-size: 22px; }
    .dialog-body { display: flex; flex-direction: column; gap: 10px; margin-top: 16px; }
    .detail { display: flex; align-items: center; gap: 8px; }
    .detail ha-icon { --mdc-icon-size: 18px; color: var(--secondary-text-color); flex: none; }
    .description { padding-top: 12px; line-height: 1.4; overflow-wrap: anywhere; white-space: pre-wrap;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
  `;
}

customElements.define("family-today-card", FamilyTodayCard);
