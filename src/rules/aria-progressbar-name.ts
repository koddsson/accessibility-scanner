import { AccessibilityError } from "../scanner";
import { labelledByIsValid, querySelectorAll } from "../utils";

// Metadata
const id = "aria-progressbar-name";
const text = "ARIA progressbar must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

/**
 * Check if an element has an accessible name via aria-label, aria-labelledby, or title
 */
function hasAccessibleName(element: Element): boolean {
  // Check for aria-label with non-empty text
  if (element.hasAttribute("aria-label")) {
    return element.getAttribute("aria-label")!.trim() !== "";
  }

  // Check for valid aria-labelledby
  if (labelledByIsValid(element)) {
    return true;
  }

  // Check for title attribute with non-empty text
  if (element.hasAttribute("title")) {
    return element.getAttribute("title")!.trim() !== "";
  }

  return false;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements with role="progressbar"
  const selector = '[role="progressbar"]';
  const elements = querySelectorAll(selector, element);

  // Check if the element itself matches
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    if (!hasAccessibleName(el)) {
      errors.push({
        element: el,
        url,
        text,
      });
    }
  }

  return errors;
}
