import { AccessibilityError } from "../scanner";
import { hasAccessibleText, querySelectorAll } from "../utils";

// Metadata
const id = "aria-tooltip-name";
const text = "ARIA tooltip must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

export function ariaTooltipName(el: Element): AccessibilityError[] {
  const errors = [];
  const tooltips = querySelectorAll("[role=tooltip]", el);
  if (el.matches("[role=tooltip]")) tooltips.push(el);
  for (const tooltip of tooltips) {
    if (!hasAccessibleText(tooltip)) {
      errors.push({
        element: tooltip,
        url,
        text,
      });
    }
  }
  return errors;
}
