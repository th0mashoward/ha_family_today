import { LitElement, html, css, nothing } from "lit";
import type { TemplateResult } from "lit";
import { classMap } from "lit/directives/class-map.js";
import { styleMap } from "lit/directives/style-map.js";
import type {
  BinAppearance,
  CalendarHealth,
  CardConfig,
  FamilyEvent,
  FamilyTodayAttributes,
  Hass,
  HassEntity,
  SchoolStatus,
} from "./types";
import {
  DEFAULT_BIN_ENTITY,
  DEFAULT_ENTITY,
  FALLBACK_BIN_ICON,
  binColour,
  colorFor,
  countdown,
  defaults,
  formatDateLong,
  formatDateShort,
  formatEventWhen,
  inDays,
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
    _schoolOpen: { state: true },
    _schoolPerson: { state: true },
  };
  declare hass: Hass;
  declare _config: CardConfig;
  declare _now: number;
  declare _selected: FamilyEvent | null;
  declare _schoolOpen: boolean;
  declare _schoolPerson: string | null;
  private _timer?: number;

  constructor() {
    super();
    this._now = Date.now();
    this._selected = null;
    this._schoolOpen = false;
    this._schoolPerson = null;
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
    if (ev.key !== "Escape") return;
    this._selected = null;
    this._schoolOpen = false;
    this._schoolPerson = null;
  };

  private _openEvent(ev: FamilyEvent): void {
    this._selected = ev;
  }

  private _closeEvent(): void {
    this._selected = null;
  }

  private _openSchool(person: string | null = null): void {
    this._schoolPerson = person;
    this._schoolOpen = true;
  }

  private _closeSchool(): void {
    this._schoolOpen = false;
    this._schoolPerson = null;
  }

  private _schoolKey(ev: KeyboardEvent, person: string | null = null): void {
    if (ev.key === "Enter" || ev.key === " ") {
      ev.preventDefault();
      this._openSchool(person);
    }
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
          ${this.hass.locale("ui.card.family_today.sensor_not_found") ?? "Family Today sensor not found"}
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
      ${this._schoolOpen ? this._schoolDialog(a) : nothing}
    `;
  }

  private _header(a: FamilyTodayAttributes): TemplateResult {
    const date = formatDateLong(this.hass, this._now);
    const { title, show_school } = this._config;
    const reason = a.school?.reason ?? a.break_reason ?? null;
    const label = reason ?? (a.school_day ? this.hass.locale("ui.card.family_today.school_day") : this.hass.locale("ui.card.family_today.no_school"));
    const children =
      (a.school_overrides?.length ?? 0) > 0
        ? Object.entries(a.school_by_person ?? {})
        : [];
    return html`
      <div class="header">
        <div class="titles">
          <div class="title">${title ?? date}</div>
          ${title ? html`<div class="subtitle">${date}</div>` : nothing}
        </div>
        ${show_school
          ? children.length
            ? html`<div class="school-chips">
                ${children.map(([person, status]) =>
                  this._schoolChip(person, status),
                )}
              </div>`
            : html`<span
                class=${classMap({ chip: true, school: a.school_day })}
                role="button"
                tabindex="0"
                title=${label}
                aria-label=${`${this.hass.locale("ui.card.family_today.show_details") ?? "Show details"}, ${label}`}
                @click=${(e: Event) => {
                  e.stopPropagation();
                  this._openSchool();
                }}
                @keydown=${this._schoolKey}
              >
                <ha-icon
                  icon=${a.school_day ? "mdi:school" : "mdi:school-outline"}
                ></ha-icon>
                ${a.school_day ? this.hass.locale("ui.card.family_today.school_day") : this.hass.locale("ui.card.family_today.no_school")}
                <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
              </span>`
          : nothing}
      </div>
    `;
  }

  private _schoolChip(person: string, status: SchoolStatus): TemplateResult {
    const label = status.is_school_day ? this.hass.locale("ui.card.family_today.school_day") : status.reason || this.hass.locale("ui.card.family_today.no_school");
    return html`<span
      class=${classMap({ chip: true, school: status.is_school_day })}
      role="button"
      tabindex="0"
      title=${label}
      aria-label=${`${person}: ${label}, ${this.hass.locale("ui.card.family_today.show_details") ?? "Show details"}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._openSchool(person);
      }}
      @keydown=${(e: KeyboardEvent) => this._schoolKey(e, person)}
    >
      <ha-icon
        icon=${status.is_school_day ? "mdi:school" : "mdi:school-outline"}
      ></ha-icon>
      ${person} · ${label}
      <ha-icon class="more" icon="mdi:chevron-right"></ha-icon>
    </span>`;
  }

  private _banners(a: FamilyTodayAttributes): TemplateResult | typeof nothing {
    const { show_bins, show_next_bin } = this._config;
    const rows: TemplateResult[] = [];
    const notice = this._calendarNotice(a);
    if (notice) rows.push(notice);
    if (!show_bins) {
      return rows.length ? html`<div class="banners">${rows}</div>` : nothing;
    }
    const meta = a.bin_meta ?? {};
    if (a.bins_today?.length) {
      rows.push(
        this._banner("mdi:trash-can", this.hass.locale("ui.card.family_today.bin_day_today") ?? "Bin day today", this._binChips(a.bins_today, meta)),
      );
    }
    if (a.bins_tomorrow?.length) {
      rows.push(
        this._banner(
          "mdi:trash-can-outline",
          this.hass.locale("ui.card.family_today.bins_out_tonight") ?? "Bins out tonight",
          this._binChips(a.bins_tomorrow, meta),
        ),
      );
    }
    if (!rows.length && show_next_bin) {
      const next = this.hass.states[this._config.bin_entity ?? DEFAULT_BIN_ENTITY];
      if (next && /^\d{4}-\d{2}-\d{2}$/.test(next.state)) {
        const bins = (next.attributes.bins as string[] | undefined) ?? [];
        const nextMeta =
          (next.attributes.bin_meta as Record<string, BinAppearance> | undefined) ?? meta;
        const days = next.attributes.days_until as number | null | undefined;
        const when =
          days === 1 ? this.hass.locale("ui.card.family_today.tomorrow") ?? "tomorrow" : days != null ? `in ${days} days` : "";
        rows.push(
          this._banner(
            "mdi:calendar-clock",
            `${this.hass.locale("ui.card.family_today.next_bins") ?? "Next bins"} · ${formatDateShort(this.hass, next.state)}`,
            html`${bins.length ? this._binChips(bins, nextMeta) : nothing}${when
              ? html`<span class="when">(${when})</span>`
              : nothing}`,
            true,
          ),
        );
      }
    }
    return rows.length ? html`<div class="banners">${rows}</div>` : nothing;
  }

  /** Muted warning when a person calendar is stale or unavailable. */
  private _calendarNotice(a: FamilyTodayAttributes): TemplateResult | null {
    const statuses = Object.values(a.calendar_status ?? {}).filter(
      (s) => s.role === "person",
    );
    const failed = statuses.filter((s) => !s.ok);
    if (!failed.length) return null;
    const names = failed.map((s) => this._calendarName(s));
    const list =
      names.length > 1
        ? `${names.slice(0, -1).join(", ")} and ${names[names.length - 1]}`
        : names[0];
    const hasFreshData = failed.some((s) => !s.using_cache);
    return this._banner(
      "mdi:calendar-alert",
      hasFreshData ? (this.hass.locale("ui.card.family_today.calendar_unavailable") ?? "Calendar unavailable") : (this.hass.locale("ui.card.family_today.showing_saved_events") ?? "Showing saved events"),
      hasFreshData
        ? `Couldn't refresh ${list}`
        : `${this.hass.locale("ui.card.family_today.today_events_from") ?? "Today's events from"} ${list} ${this.hass.locale("ui.card.family_today.from_earlier_refresh") ?? "are from an earlier refresh"}`,
      true,
    );
  }

  private _calendarName(status: CalendarHealth): string {
    const friendly = this.hass.states?.[status.entity_id]?.attributes?.friendly_name;
    return typeof friendly === "string" && friendly
      ? friendly
      : status.person || status.entity_id;
  }

  private _binChips(
    names: string[],
    meta?: Record<string, BinAppearance>,
  ): TemplateResult {
    return html`${names.map((name) => {
      const appearance = meta?.[name] ?? {};
      const colour = binColour(appearance.colour);
      return html`<span
        class="bin-chip"
        style=${styleMap(colour ? { "--bin-color": colour } : {})}
        ><ha-icon icon=${appearance.icon || FALLBACK_BIN_ICON}></ha-icon>${name}</span
      >`;
    })}`;
  }

  private _banner(
    icon: string,
    label: string,
    text: TemplateResult | string,
    muted = false,
  ): TemplateResult {
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
      aria-label=${`${this.hass.locale("ui.card.family_today.details_for") ?? "Details for"} ${ev.summary}`}
      @click=${(e: Event) => {
        e.stopPropagation();
        this._openEvent(ev);
      }}
      @keydown=${(e: KeyboardEvent) => this._eventKey(e, ev)}
    >
      <span class="dot" style=${styleMap({ background: this._color(ev.person) })}></span>
      <span class="next-text"><strong>${this.hass.locale("ui.card.family_today.next") ?? "Next"}</strong>: ${ev.summary}</span>
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

    if (!all.length) return html`<div class="empty">${this.hass.locale("ui.card.family_today.nothing_scheduled_today") ?? "Nothing scheduled today"}</div>`;

    return html`
      ${this._config.show_all_day && allDay.length
        ? html`<div class="allday">
            ${allDay.map(
              (ev) => html`<span
                class="allday-chip"
                style=${styleMap({ "--person-color": this._color(ev.person) })}
                role="button"
                tabindex="0"
                aria-label=${`${this.hass.locale("ui.card.family_today.details_for") ?? "Details for"} ${ev.summary}`}
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
    if (!people.length) return html`<div class="empty">${this.hass.locale("ui.card.family_today.nothing_scheduled_today") ?? "Nothing scheduled today"}</div>`;
    return html`<div class="lanes">
      ${people.map((p) => {
        const events = this._visible(a.by_person?.[p] ?? []);
        return html`<div class="lane" style=${styleMap({ "--person-color": this._color(p) })}>
          <div class="lane-head"><span class="dot"></span>${p}</div>
          ${events.length
            ? events.map((e) => this._eventRow(e))
            : html`<div class="lane-empty">${this.hass.locale("ui.card.family_today.nothing_on") ?? "Nothing on"}</div>`}
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
      aria-label=${`${this.hass.locale("ui.card.family_today.details_for") ?? "Details for"} ${ev.summary}`}
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

  // ---- school details ---------------------------------------------------
  private _schoolDialog(a: FamilyTodayAttributes): TemplateResult {
    const person = this._schoolPerson;
    const s = (person ? a.school_by_person?.[person] : null) ?? a.school;
    const isSchool = s?.is_school_day ?? a.school_day;
    const reason = s?.reason ?? a.break_reason ?? null;
    const term = s?.term ?? a.term;
    const title = isSchool ? this.hass.locale("ui.card.family_today.school_day") : reason || this.hass.locale("ui.card.family_today.no_school");
    const subtitle = [person, term].filter(Boolean).join(" · ");
    const when = (iso?: string | null, days?: number | null): string =>
      [iso ? formatDateShort(this.hass, iso) : "", days != null ? inDays(days) : ""]
        .filter(Boolean)
        .join(" · ");
    const rows: TemplateResult[] = [];

    if (isSchool) {
      if (s?.term_end) {
        rows.push(
          this._detail(
            "mdi:calendar-end",
            this.hass.locale("ui.card.family_today.term_ends") ?? "Term ends",
            when(s.term_end, s.days_until_term_end),
          ),
        );
      }
      if (
        s?.next_break &&
        s.next_break_start &&
        (s.days_until_term_end == null ||
          (s.days_until_next_break ?? Infinity) < s.days_until_term_end)
      ) {
        rows.push(
          this._detail(
            "mdi:beach",
            this.hass.locale("ui.card.family_today.next_break") ?? "Next break",
            `${s.next_break} · ${when(s.next_break_start, s.days_until_next_break)}`,
          ),
        );
      }
    } else if (s) {
      if (s.back_to_school) {
        rows.push(
          this._detail(
            "mdi:school",
            this.hass.locale("ui.card.family_today.back_to_school") ?? "Back to school",
            when(s.back_to_school, s.days_until_school),
          ),
        );
      }
      if (s.next_term && s.next_term_start && s.next_term_start !== s.back_to_school) {
        rows.push(
          this._detail(
            "mdi:calendar-start",
            this.hass.locale("ui.card.family_today.next_term") ?? "Next term",
            `${s.next_term} · ${when(s.next_term_start, s.days_until_next_term)}`,
          ),
        );
      }
      if (s.term_end) {
        rows.push(
          this._detail(
            "mdi:calendar-end",
            this.hass.locale("ui.card.family_today.term_ends") ?? "Term ends",
            when(s.term_end, s.days_until_term_end),
          ),
        );
      }
    }

    if (!rows.length) {
      rows.push(
        html`<div class="detail muted-row">
          <ha-icon icon="mdi:information-outline"></ha-icon>
          <span>${this.hass.locale("ui.card.family_today.no_term_dates_configured") ?? "No term dates configured."}</span>
        </div>`,
      );
    }

    return html`<div
      class="overlay"
      @click=${(e: Event) => {
        e.stopPropagation();
        this._closeSchool();
      }}
    >
      <div
        class="dialog school-dialog"
        role="dialog"
        aria-modal="true"
        aria-label=${person ? `${person}: ${title}` : title}
        @click=${(e: Event) => e.stopPropagation()}
      >
        <div class="dialog-head">
          <div>
            <div class="dialog-title">${title}</div>
            ${subtitle ? html`<div class="dialog-sub">${subtitle}</div>` : nothing}
          </div>
          <button class="close" aria-label=${this.hass.locale("ui.card.family_today.close") ?? "Close"} @click=${this._closeSchool}>
            <ha-icon icon="mdi:close"></ha-icon>
          </button>
        </div>
        <div class="dialog-body">${rows}</div>
      </div>
    </div>`;
  }

  private _detail(icon: string, label: string, value: string): TemplateResult {
    return html`<div class="detail">
      <ha-icon icon=${icon}></ha-icon>
      <span class="detail-label">${label}</span>
      <span class="detail-value">${value}</span>
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
          <button class="close" aria-label=${this.hass.locale("ui.card.family_today.close") ?? "Close"} @click=${this._closeEvent}>
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
      background: var(--secondary-background-color); color: var(--secondary-text-color); font-size: 0.85em; white-space: nowrap;
      cursor: pointer; user-select: none; }
    .chip:hover { filter: brightness(0.96); }
    .chip:focus-visible { outline: 2px solid var(--primary-color); outline-offset: 2px; }
    .chip ha-icon { --mdc-icon-size: 16px; }
    .chip .more { --mdc-icon-size: 16px; margin-left: -2px; opacity: 0.6; }
    .school-chips { display: flex; flex-wrap: wrap; gap: 6px; justify-content: flex-end; }
    .school-chips .chip { max-width: 100%; }
    .chip.school { background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.15); color: var(--primary-color); }
    .banners { display: flex; flex-direction: column; gap: 6px; margin-bottom: 12px; }
    .banner { display: flex; flex-wrap: wrap; align-items: center; gap: 8px; padding: 8px 12px; border-radius: 10px;
      background: rgba(var(--rgb-primary-color, 3, 169, 244), 0.12); color: var(--primary-text-color); }
    .banner.muted { background: var(--secondary-background-color); color: var(--secondary-text-color); }
    .banner ha-icon { --mdc-icon-size: 20px; flex: none; }
    .banner .label { font-weight: 500; }
    .banner .text { margin-left: auto; min-width: 0; display: flex; flex-wrap: wrap; align-items: center;
      justify-content: flex-end; gap: 4px 6px; text-align: right; }
    .banner .when { color: var(--secondary-text-color); font-size: 0.9em; white-space: nowrap; }
    .bin-chip { display: inline-flex; align-items: center; gap: 4px; padding: 1px 8px 1px 5px; white-space: nowrap;
      border: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); border-radius: 999px;
      background: var(--secondary-background-color); color: var(--primary-text-color); font-size: 0.9em; }
    .bin-chip ha-icon { --mdc-icon-size: 16px; color: var(--bin-color, var(--secondary-text-color)); }
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
    .detail-label { color: var(--secondary-text-color); }
    .detail-value { margin-left: auto; min-width: 0; text-align: right; color: var(--primary-text-color);
      overflow-wrap: anywhere; }
    .muted-row { color: var(--secondary-text-color); }
    .description { padding-top: 12px; line-height: 1.4; overflow-wrap: anywhere; white-space: pre-wrap;
      border-top: 1px solid var(--divider-color, rgba(0, 0, 0, 0.12)); }
  `;
}

customElements.define("family-today-card", FamilyTodayCard);
