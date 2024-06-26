import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const text = "Elements must only use allowed ARIA attributes";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/area-alt?application=RuleDescription";

export function areaAlt(el: Document | Element): AccessibilityError[] {
  const errors = [];

  for (const element of querySelectorAll("map area[href]", el)) {
    if (element.getAttribute("alt")) continue;
    if (element.getAttribute("aria-label")) continue;
    if (labelledByIsValid(element)) continue;
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
