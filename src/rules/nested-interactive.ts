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

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [...querySelectorAll(interactiveSelector, element)];
  if (element.matches(interactiveSelector)) {
    elements.push(element as HTMLImageElement);
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
