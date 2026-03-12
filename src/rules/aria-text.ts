import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "aria-text";
const text = '"role=text" should have no focusable descendants';
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const focusableSelector =
  'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])';

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = '[role="text"]';
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const focusable = querySelectorAll(focusableSelector, el);
    if (focusable.length > 0) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
