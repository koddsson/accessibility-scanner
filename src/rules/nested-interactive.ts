import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "nested-interactive";
const text = "Interactive controls must not be nested";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

const interactiveSelector = [
  "a",
  "input",
  "button",
  "[role=button]",
  "[role=tab]",
  "[role=checkbox]",
  "[role=radio]",
].join(",");

export default function (el: Document | Element): AccessibilityError[] {
  const errors = [];
  const elements = Array.from(querySelectorAll(interactiveSelector, el));
  if (el instanceof HTMLElement && el.matches(interactiveSelector)) {
    elements.push(el as HTMLImageElement);
  }

  for (const element of elements) {
    const nestedInteractiveElements = querySelectorAll(
      interactiveSelector,
      element,
    );
    for (const nestedInteractiveElement of nestedInteractiveElements) {
      errors.push({
        element: nestedInteractiveElement,
        text,
        url,
      });
    }
  }

  return errors;
}
