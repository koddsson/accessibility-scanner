import { AccessibilityError } from "../scanner";
import { labelledByIsValid } from "../utils";

const text = "Buttons must have discernible text";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/button-name?application=RuleDescription";

function getElementText(element: Element): string {
  let label = element.getAttribute("aria-label");
  if (label) return label;

  label = "";
  const labels = element.querySelectorAll("[aria-label]");
  for (const childLabel of labels) {
    label += `${childLabel.getAttribute("aria-label")} `;
  }

  return label.trim();
}

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = Array.from(el.querySelectorAll<HTMLButtonElement>("button"));
  if (el.matches("button")) {
    elements.push(el as HTMLButtonElement);
  }
  for (const element of elements) {
    if (element.textContent.trim() !== "") continue;
    if (getElementText(element) !== "") continue;
    if (labelledByIsValid(element)) continue;
    if (element.title.trim() !== "") continue;
    if (
      ["presentation", "none"].includes(element.getAttribute("role")!) &&
      element.disabled
    )
      continue;

    errors.push({
      element,
      text,
      url,
    });
  }

  return errors;
}
