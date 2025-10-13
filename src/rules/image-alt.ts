import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const text = "Images must have alternate text";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/image-alt?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("img", element) as HTMLImageElement[];
  if (element.matches("img")) {
    elements.push(element as HTMLImageElement);
  }
  for (const element of elements) {
    if (element.getAttribute("aria-hidden") === "true") continue;
    if (element.hasAttribute("alt") && element.alt === element.alt.trim())
      continue;
    const label = element.getAttribute("aria-label");
    if (label && label.trim() !== "") continue;
    if (labelledByIsValid(element)) continue;
    if (element.title) continue;

    const role = element.getAttribute("role");
    const hasValidRole = role === "presentation" || role === "none";
    if (
      hasValidRole &&
      element.tabIndex !== 0 &&
      !element.hasAttribute("aria-live")
    )
      continue;

    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
