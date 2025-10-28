import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text =
  "Ensures that elements labelled through their content must have their visible text as part of their accessible name";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/label-content-name-mismatch?application=RuleDescription";

/**
 * Get the visible text content of an element
 */
function getVisibleText(element: Element): string {
  // Get text content and normalize whitespace
  const textContent = element.textContent?.trim() || "";
  // Normalize multiple whitespaces to single space
  return textContent.replaceAll(/\s+/g, " ");
}

/**
 * Get the accessible name of an element (from aria-label or aria-labelledby)
 */
function getAccessibleName(element: Element): string | null {
  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel.trim().replaceAll(/\s+/g, " ");
  }

  // Check aria-labelledby
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const texts: string[] = [];
    for (const id of ids) {
      // Escape the ID to prevent CSS injection
      const escapedId = CSS.escape(id);
      const labelElement = element.ownerDocument.querySelector(`#${escapedId}`);
      if (labelElement) {
        const labelText = labelElement.textContent?.trim() || "";
        if (labelText) {
          texts.push(labelText);
        }
      }
    }
    if (texts.length > 0) {
      return texts.join(" ").replaceAll(/\s+/g, " ");
    }
  }

  return null;
}

/**
 * Check if the visible text is a substring of the accessible name (case-insensitive)
 */
function isTextPartOfAccessibleName(
  visibleText: string,
  accessibleName: string,
): boolean {
  if (!visibleText || !accessibleName) return true;

  // Normalize both strings for case-insensitive comparison
  const normalizedVisible = visibleText.toLowerCase();
  const normalizedAccessible = accessibleName.toLowerCase();

  return normalizedAccessible.includes(normalizedVisible);
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Select elements that could have this issue
  // These are typically interactive elements with roles
  const selector = [
    "a[href]",
    "button",
    "[role='button']",
    "[role='link']",
    "[role='menuitem']",
    "[role='menuitemcheckbox']",
    "[role='menuitemradio']",
    "[role='tab']",
    "[role='treeitem']",
  ].join(", ");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    // Skip if element is hidden
    if (el.getAttribute("aria-hidden") === "true") continue;

    const visibleText = getVisibleText(el);
    const accessibleName = getAccessibleName(el);

    // Only check if:
    // 1. Element has visible text content
    // 2. Element has an accessible name from aria-label or aria-labelledby
    if (!visibleText || !accessibleName) continue;

    // Check if visible text is part of accessible name
    if (!isTextPartOfAccessibleName(visibleText, accessibleName)) {
      errors.push({
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
