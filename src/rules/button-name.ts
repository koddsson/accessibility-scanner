import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "button-name";
const text = "Buttons must have discernible text";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

function getElementText(element: Element): string {
  let label = element.getAttribute("aria-label");
  if (label) return label;

  label = "";
  const labels = querySelectorAll("[aria-label]", element);
  for (const childLabel of labels) {
    label += `${childLabel.getAttribute("aria-label")} `;
  }

  return label.trim();
}

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("button", element);
  if (element.matches("button")) {
    elements.push(element as HTMLButtonElement);
  }
  for (const element of elements) {
    if (element.textContent?.trim() !== "") continue;
    if (getElementText(element) !== "") continue;
    if (labelledByIsValid(element)) continue;
    if ((element as HTMLButtonElement).title.trim() !== "") continue;
    if (
      ["presentation", "none"].includes(element.getAttribute("role")!) &&
      (element as HTMLButtonElement).disabled
    )
      continue;
    if (
      element.getAttribute("aria-hidden") === "true" &&
      element.getAttribute("tabindex") === "-1"
    )
      continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }

  return errors;
}
