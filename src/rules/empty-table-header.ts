import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "empty-table-header";
const text = "Table headers must have discernible text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "th";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const hasText = (el.textContent ?? "").trim() !== "";
    const ariaLabel = el.getAttribute("aria-label");
    const hasAriaLabel = ariaLabel !== null && ariaLabel.trim() !== "";
    const ariaLabelledBy = el.getAttribute("aria-labelledby");
    const hasAriaLabelledBy = ariaLabelledBy
      ? (
          element.ownerDocument.querySelector(`#${ariaLabelledBy}`)
            ?.textContent ?? ""
        ).trim() !== ""
      : false;

    if (!hasText && !hasAriaLabel && !hasAriaLabelledBy) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
