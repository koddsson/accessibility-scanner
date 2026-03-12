import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "area-alt";
const text = "Ensures <area> elements of image maps have alternate text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export function areaAlt(element_: Element): AccessibilityError[] {
  const errors = [];

  for (const element of querySelectorAll("map area[href]", element_)) {
    if (element.getAttribute("alt")) continue;
    if (element.getAttribute("aria-label")) continue;
    if (labelledByIsValid(element)) continue;
    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
