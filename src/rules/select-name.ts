import { AccessibilityError } from "../scanner.js";
import {
  querySelector,
  querySelectorAll,
  labelledByIsValid,
  labelReadableText,
} from "../utils.js";
import { isHTMLTag } from "../utils/dom.js";

const id = "select-name";
const text = "select element must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("select", element) as HTMLSelectElement[];
  if (element.matches("select")) {
    elements.push(element as HTMLSelectElement);
  }
  for (const element of elements) {
    const labelId = element.getAttribute("id");
    const label = querySelector(
      `[for="${labelId}"]`,
      element.ownerDocument,
    ) as HTMLLabelElement;
    if (label && labelReadableText(label)) continue;

    const parentElement = element.parentElement;
    if (isHTMLTag(parentElement, "label") && labelReadableText(parentElement))
      continue;

    if (element.getAttribute("aria-label")) continue;
    if (labelledByIsValid(element)) continue;
    if (element.getAttribute("title")) continue;
    if (element.disabled) continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
