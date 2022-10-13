import { AccessibilityError } from "../scanner";
import { labelledByIsValid, labelReadableText } from "../utils";

const text = "Form <input> elements must have labels";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/label?application=RuleDescription";

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const selector = ["input", "textarea"].map((x) => `form ${x}`).join(", ");
  const elements = Array.from(el.querySelectorAll<HTMLInputElement>(selector));
  if (el.matches(selector)) {
    elements.push(el as HTMLInputElement);
  }
  for (const element of elements) {
    if (element.type === "hidden") continue;
    const labelId = element.getAttribute("id");
    const label = element.ownerDocument.querySelector<HTMLElement>(
      `[for="${labelId}"]`
    );
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
