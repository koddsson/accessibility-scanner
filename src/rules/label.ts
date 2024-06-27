import { AccessibilityError } from "../scanner";
import {
  querySelector,
  querySelectorAll,
  labelledByIsValid,
  labelReadableText,
} from "../utils";

const text = "Form <input> elements must have labels";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const selector = ["input", "textarea"].map((x) => `form ${x}`).join(", ");
  const elements = querySelectorAll(selector, element) as HTMLInputElement[];

  if (element.matches(selector)) {
    elements.push(element as HTMLInputElement);
  }
  for (const element of elements) {
    if (element.type === "hidden") continue;
    const labelId = element.getAttribute("id");
    const label = querySelector(
      `[for="${labelId}"]`,
      element.ownerDocument,
    ) as HTMLLabelElement;
    if (label && labelReadableText(label)) continue;

    const parentElement = element.parentElement;
    if (
      parentElement instanceof HTMLLabelElement &&
      labelReadableText(parentElement)
    )
      continue;

    if (element.getAttribute("aria-label")) continue;
    if (labelledByIsValid(element)) continue;
    if (element.getAttribute("title")) continue;
    if (element.disabled) continue;

    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
