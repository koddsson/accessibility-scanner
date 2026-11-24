import { AccessibilityError } from "../scanner.js";
import { querySelectorAll } from "../utils.js";

const id = "nested-interactive";
const text = "Interactive controls must not be nested";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const interactiveSelector = [
  "a[href]",
  "input",
  "button",
  "[role=button]",
  "[role=tab]",
  "[role=checkbox]",
  "[role=radio]",
].join(",");

const presentationalChildrenSelector = [
  "a",
  interactiveSelector,
  "[role=img]",
  "[role=math]",
  "[role=menuitemcheckbox]",
  "[role=menuitemradio]",
  "[role=meter]",
  "[role=option]",
  "[role=progressbar]",
  "[role=scrollbar]",
  "[role=separator]",
  "[role=slider]",
  "[role=switch]",
].join(",");

export default function nestedInteractive(
  element: Element,
): AccessibilityError[] {
  const errors = [];
  const elements = [
    ...querySelectorAll(presentationalChildrenSelector, element),
  ];
  if (element.matches(presentationalChildrenSelector)) {
    elements.push(element as HTMLImageElement);
  }

  for (const element of elements) {
    const nestedInteractiveElements = querySelectorAll(
      interactiveSelector,
      element,
    );
    for (const nestedInteractiveElement of nestedInteractiveElements) {
      if (nestedInteractiveElement.matches(":disabled")) continue;
      errors.push({
        id,
        element: nestedInteractiveElement,
        text,
        url,
      });
    }
  }

  return errors;
}

nestedInteractive.includeAriaHidden = true;
