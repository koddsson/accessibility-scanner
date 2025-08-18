import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const text = "Image buttons must have alternate text";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/input-image-alt?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const selector = "input[type=image]";
  const errors = [];
  const elements = querySelectorAll(selector, element) as HTMLImageElement[];
  if (element.matches(selector)) {
    elements.push(element as HTMLImageElement);
  }
  for (const element of elements) {
    if (element.hasAttribute("alt") && element.alt === element.alt.trim())
      continue;
    const label = element.getAttribute("aria-label");
    if (label && label.trim() !== "") continue;
    if (labelledByIsValid(element)) continue;
    if (element.title) continue;

    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
