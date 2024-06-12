import { AccessibilityError } from "../scanner";

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

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = Array.from(el.querySelectorAll(interactiveSelector));
  if (el.matches(interactiveSelector)) {
    elements.push(el as HTMLImageElement);
  }

  for (const element of elements) {
    const nestedInteractiveElements =
      element.querySelectorAll(interactiveSelector);
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
