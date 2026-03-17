import { AccessibilityError } from "../scanner";
import { querySelectorAll, isVisible } from "../utils";

// Metadata
const id = "error-message";
const text =
  "Form fields with invalid values must have descriptive error messages";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

// Native HTML elements that implicitly have form field semantic roles
const formFieldSelector = [
  'input:not([type="hidden"]):not([type="button"]):not([type="submit"]):not([type="reset"]):not([type="image"])',
  "textarea",
  "select",
  '[role="checkbox"]',
  '[role="combobox"]',
  '[role="listbox"]',
  '[role="menuitemcheckbox"]',
  '[role="menuitemradio"]',
  '[role="radio"]',
  '[role="searchbox"]',
  '[role="slider"]',
  '[role="spinbutton"]',
  '[role="switch"]',
  '[role="textbox"]',
].join(",");

/**
 * Check if a referenced element exists, is visible, and is in the accessibility tree.
 */
function referencedElementHasVisibleText(
  element: Element,
  refId: string,
): boolean {
  const doc = element.ownerDocument;
  const refEl = doc.querySelector(`#${CSS.escape(refId)}`);
  if (!refEl) return false;

  // Element must not be aria-hidden
  if (refEl.getAttribute("aria-hidden") === "true") return false;

  // Element must be visible (not display:none, not hidden attr)
  if (!isVisible(refEl)) return false;

  // Element must have text content
  const text = refEl.textContent?.trim();
  if (!text) return false;

  return true;
}

/**
 * Check if a form field with aria-errormessage or aria-describedby has
 * valid, visible, non-empty referenced error elements.
 */
function hasValidErrorAssociation(element: Element): boolean {
  // Check aria-errormessage first
  const errorMessageId = element.getAttribute("aria-errormessage");
  if (errorMessageId) {
    const ids = errorMessageId.split(/\s+/).filter(Boolean);
    for (const refId of ids) {
      if (referencedElementHasVisibleText(element, refId)) {
        return true;
      }
    }
    // Has aria-errormessage but no valid reference — error
    return false;
  }

  // Check aria-describedby
  const describedBy = element.getAttribute("aria-describedby");
  if (describedBy) {
    const ids = describedBy.split(/\s+/).filter(Boolean);
    for (const refId of ids) {
      if (referencedElementHasVisibleText(element, refId)) {
        return true;
      }
    }
    // Has aria-describedby but no valid reference — error
    return false;
  }

  // No error association attributes present — no error to report
  return true;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const elements = querySelectorAll(formFieldSelector, element);

  // Check if the element itself matches
  if (element.matches(formFieldSelector)) {
    elements.push(element);
  }

  for (const el of elements) {
    // Only check fields that have aria-invalid="true" — these are the fields
    // that have been marked as having errors
    if (el.getAttribute("aria-invalid") !== "true") continue;

    if (!hasValidErrorAssociation(el)) {
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
