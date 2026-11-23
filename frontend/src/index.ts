import "./card";
import "./school-card";

declare global {
  interface Window {
    customCards?: Array<Record<string, unknown>>;
  }
}

window.customCards = window.customCards || [];
window.customCards.push({
  type: "family-today-card",
  name: "Family Today",
  description: "Today's family agenda, school day and bin collections in one card.",
  preview: false,
});
window.customCards.push({
  type: "family-today-school-card",
  name: "Family Today School",
  description: "Term progress and upcoming breaks, with one section per child.",
  preview: false,
});

console.info("%c FAMILY-TODAY-CARD %c 0.3.0", "color:#fff;background:#4285f4;font-weight:700", "");
