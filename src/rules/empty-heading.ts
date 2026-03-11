import { AccessibilityError } from "../scanner";
import { querySelectorAll, hasAccessibleText } from "../utils";

const id = "empty-heading";
const text = "Headings must have discernible text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "h1, h2, h3, h4, h5, h6, [role='heading']";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }
  for (const el of elements) {
    if (!hasAccessibleText(el)) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
