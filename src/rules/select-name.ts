import { AccessibilityError } from "../scanner";
import {
  querySelector,
  querySelectorAll,
  labelledByIsValid,
  labelReadableText,
} from "../utils";

const text = "select element must have an accessible name";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/select-name?application=RuleDescription";

export default function (el: Document | Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("select", el) as HTMLSelectElement[];
  if (el instanceof HTMLElement && el.matches("select")) {
    elements.push(el as HTMLSelectElement);
  }
  for (const element of elements) {
    const labelId = element.getAttribute("id");
    const label = querySelector(
      `[for="${labelId}"]`,
      element.ownerDocument,
    ) as HTMLLabelElement;
    if (label && labelReadableText(label)) continue;

    const parentElement = element.parentElement;
    if (
      parentElement instanceof HTMLLabelElement &&
      labelReadableText(parentElement)
    )
      continue;

    if (element.getAttribute("aria-label")) continue;
    if (labelledByIsValid(element)) continue;
    if (element.getAttribute("title")) continue;
    if (element.disabled) continue;

    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
