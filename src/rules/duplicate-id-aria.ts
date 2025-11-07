import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "duplicate-id-aria";
const text = "IDs used in ARIA and labels must be unique";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const selector = "[aria-labelledby]";
  const errors = [];
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element as HTMLElement);
  }
  for (const element of elements) {
    if (labelledByIsValid(element)) continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
