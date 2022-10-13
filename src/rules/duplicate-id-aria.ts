import { AccessibilityError } from "../scanner";
import { labelledByIsValid } from "../utils";

const id = "duplicate-id-aria";
const text = "IDs used in ARIA and labels must be unique";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (el: Element): AccessibilityError[] {
  const selector = "[aria-labelledby]";
  const errors = [];
  const elements = Array.from(el.querySelectorAll<HTMLElement>(selector));
  if (el.matches(selector)) {
    elements.push(el as HTMLElement);
  }
  for (const element of elements) {
    if (labelledByIsValid(element)) continue;

    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
