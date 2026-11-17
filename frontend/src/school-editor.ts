import { LitElement, html } from "lit";
import type { Hass, SchoolCardConfig } from "./types";

const SCHEMA = [
  { name: "entity", selector: { entity: { domain: "sensor" } } },
  { name: "title", selector: { text: {} } },
  {
    name: "max_breaks",
    selector: { number: { min: 1, max: 6, mode: "box" } },
  },
];

const LABELS: Record<string, string> = {
  entity: "Family Today sensor",
  title: "Title (default: School)",
  max_breaks: "Upcoming breaks to show",
};

export class FamilyTodaySchoolCardEditor extends LitElement {
  static properties = {
    hass: { attribute: false },
    _config: { state: true },
  };
  declare hass: Hass;
  declare _config: SchoolCardConfig;

  setConfig(config: SchoolCardConfig): void {
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

customElements.define(
  "family-today-school-card-editor",
  FamilyTodaySchoolCardEditor,
);
