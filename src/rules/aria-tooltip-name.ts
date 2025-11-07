import { AccessibilityError } from "../scanner";
import { labelledByIsValid, querySelectorAll } from "../utils";

// Metadata
const id = "aria-tooltip-name";
const text = "ARIA tooltip must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

/**
 * Make sure that a elements text is "visible" to a screenreader user.
 *
 * - Inner text that is discernible to screen reader users.
 * - Non-empty aria-label attribute.
 * - aria-labelledby pointing to element with text which is discernible to screen reader users.
 */
function hasAccessibleText(element: Element): boolean {
  if (element.hasAttribute("aria-label")) {
    return element.getAttribute("aria-label")!.trim() !== "";
  }

  if (element.hasAttribute("aria-labelledby")) {
    return labelledByIsValid(element);
  }

  if (element.hasAttribute("title")) {
    return element.getAttribute("title")!.trim() !== "";
  }

  if (element.textContent) {
    return element.textContent.trim() !== "";
  }

  return false;
}

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const tooltips = querySelectorAll("[role=tooltip]", element);
  if (element.matches("[role=tooltip]")) tooltips.push(element);
  for (const tooltip of tooltips) {
    if (!hasAccessibleText(tooltip)) {
      errors.push({
        id,
        element: tooltip,
        url,
        text,
      });
    }
  }
  return errors;
}
