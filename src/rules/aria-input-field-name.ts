import { AccessibilityError } from "../scanner";
import { labelledByIsValid, querySelectorAll } from "../utils";

// Metadata
const id = "aria-input-field-name";
const text = "ARIA input fields must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

// ARIA roles that are considered input fields
const inputFieldRoles = [
  "combobox",
  "listbox",
  "searchbox",
  "slider",
  "spinbutton",
  "textbox",
];

/**
 * Check if an element has an accessible name via aria-label, aria-labelledby, or title
 * Note: For ARIA input fields, textContent is NOT considered an accessible name
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

  // Build selector for all input field roles
  const selector = inputFieldRoles.map((role) => `[role="${role}"]`).join(",");
  const elements = querySelectorAll(selector, element);

  // Check if the element itself matches
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    if (!hasAccessibleName(el)) {
      errors.push({
        id,
        element: el,
        url,
        text,
      });
    }
  }

  return errors;
}
