import { AccessibilityError } from "../scanner";
import { labelledByIsValid, querySelectorAll } from "../utils";

// Metadata
const id = "aria-tooltip-name";
const text = "ARIA tooltip must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

/**
 * Make sure that a elements text is "visible" to a screenreader user.
 *
 * - Inner text that is discernible to screen reader users.
 * - Non-empty aria-label attribute.
 * - aria-labelledby pointing to element with text which is discernible to screen reader users.
 */
function hasAccessibleText(el: Element): boolean {
  if (el.hasAttribute("aria-label")) {
    return el.getAttribute("aria-label")!.trim() !== "";
  }

  if (!labelledByIsValid(el)) return false;

  if (el.getAttribute("title")) {
    return el.getAttribute("title")!.trim() !== "";
  }

  if (el.textContent) {
    return el.textContent.trim() !== "";
  }

  return true;
}

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
