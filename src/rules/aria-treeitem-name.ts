import { AccessibilityError } from "../scanner";
import { labelledByIsValid, querySelectorAll } from "../utils";

// Metadata
const id = "aria-treeitem-name";
const text = "ARIA treeitem nodes must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

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
  const treeitems = querySelectorAll('[role="treeitem"]', element);
  if (element.matches('[role="treeitem"]')) treeitems.push(element);
  for (const treeitem of treeitems) {
    if (!hasAccessibleText(treeitem)) {
      errors.push({
        id,
        element: treeitem,
        url,
        text,
      });
    }
  }
  return errors;
}
