import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "tabindex";
const text = "Elements should not have tabindex greater than zero";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "[tabindex]";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const tabindex = parseInt(el.getAttribute("tabindex") || "0", 10);
    if (tabindex > 0) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
