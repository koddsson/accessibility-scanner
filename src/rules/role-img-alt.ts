import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const text = 'Elements containing role="img" have an alternative text';
const url =
  "https://dequeuniversity.com/rules/axe/4.4/role-img-alt?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll(
    "[role=img]",
    element,
  ) as HTMLImageElement[];
  if (element.matches("[role=img]")) {
    elements.push(element as HTMLImageElement);
  }
  for (const element of elements) {
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
