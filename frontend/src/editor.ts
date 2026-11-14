import { LitElement, html } from "lit";
import type { CardConfig, Hass } from "./types";

const SCHEMA = [
  { name: "entity", selector: { entity: { domain: "sensor" } } },
  { name: "title", selector: { text: {} } },
  {
    name: "layout",
    selector: {
      select: {
        mode: "dropdown",
        options: [
          { value: "list", label: "Chronological list" },
          { value: "lanes", label: "Lane per person" },
        ],
      },
    },
  },
  {
    type: "grid",
    name: "",
    schema: [
      { name: "show_school", selector: { boolean: {} } },
      { name: "show_bins", selector: { boolean: {} } },
      { name: "show_next_bin", selector: { boolean: {} } },
      { name: "show_all_day", selector: { boolean: {} } },
      { name: "hide_past", selector: { boolean: {} } },
    ],
  },
];

const LABELS: Record<string, string> = {
  entity: "Family Today sensor",
  title: "Title (optional, defaults to today's date)",
  layout: "Layout",
  show_school: "Show school day badge",
  show_bins: "Show bin banners",
  show_next_bin: "Show next bin collection",
  show_all_day: "Show all-day events",
  hide_past: "Hide events that have finished",
};

export class FamilyTodayCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };
  declare hass: Hass;
  declare _config: CardConfig;

  setConfig(config: CardConfig): void {
    this._config = config;
  }

  render() {
    if (!this._config) return html``;
    return html`
      <ha-form
        .hass=${this.hass}
        .data=${this._config}
        .schema=${SCHEMA}
        .computeLabel=${(s: { name: string }) => LABELS[s.name] ?? s.name}
        @value-changed=${this._changed}
      ></ha-form>
    `;
  }

  private _changed(ev: CustomEvent): void {
    this.dispatchEvent(
      new CustomEvent("config-changed", {
        detail: { config: ev.detail.value },
        bubbles: true,
        composed: true,
      }),
    );
  }
}

customElements.define("family-today-card-editor", FamilyTodayCardEditor);
