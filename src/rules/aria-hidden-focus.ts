import { AccessibilityError } from "../scanner";
import { querySelectorAll, isVisible } from "../utils";

const id = "aria-hidden-focus";
const text = "aria-hidden elements do not contain focusable elements";
const url = "https://dequeuniversity.com/rules/axe/4.4/aria-hidden-focus";

const focusableSelector = [
  "a[href]",
  "area[href]",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "button",
  "summary",
  "iframe",
  "object",
  "[contenteditable='true']",
  "[tabindex]",
].join(",");

export default function ariaHiddenFocus(
  element_: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements that explicitly set aria-hidden="true" within the provided container.
  const hiddenElements = [
    ...querySelectorAll('[aria-hidden="true"]', element_),
  ];

  // If the element being scanned itself is aria-hidden="true", ensure it's included.
  if (
    element_.matches &&
    element_.matches('[aria-hidden="true"]') && // Avoid duplicating if it's already in the list
    !hiddenElements.includes(element_)
  ) {
    hiddenElements.push(element_);
  }

  for (const hiddenElement of hiddenElements) {
    // Gather potential focusable elements within the hidden element.
    const candidates = [...querySelectorAll(focusableSelector, hiddenElement)];

    // If the hidden element itself matches the focusable selector, include it as well.
    if (
      (hiddenElement as Element).matches &&
      (hiddenElement as Element).matches(focusableSelector)
    ) {
      candidates.push(hiddenElement as Element);
    }

    let hasOffendingFocusable = false;

    for (const candidate of candidates) {
      // Skip elements that are not truly focusable for practical purposes.

      // 1) Skip if candidate is not an HTMLElement (defensive).
      if (!(candidate instanceof HTMLElement)) continue;

      // 2) Skip if explicitly hidden via inline style display:none (matches other rules' behavior).
      if (!isVisible(candidate)) continue;

      // 3) Skip if candidate or one of its ancestors up to the hiddenElement is inert.
      const inertAncestor = candidate.closest("[inert]");
      if (inertAncestor && hiddenElement.contains(inertAncestor)) {
        continue;
      }

      // 4) Skip if candidate is disabled (native disabled attribute). Note: aria-disabled should NOT be treated as disabled.
      // Works for form controls that support the disabled property.
      // Use hasAttribute to detect presence like <input disabled />
      if (candidate.hasAttribute("disabled")) continue;
      if (
        (candidate instanceof HTMLInputElement && candidate.disabled) ||
        (candidate instanceof HTMLButtonElement && candidate.disabled) ||
        (candidate instanceof HTMLSelectElement && candidate.disabled) ||
        (candidate instanceof HTMLTextAreaElement && candidate.disabled) ||
        (candidate instanceof HTMLOptionElement && candidate.disabled) ||
        (candidate instanceof HTMLOptGroupElement && candidate.disabled) ||
        (candidate instanceof HTMLFieldSetElement && candidate.disabled)
      ) {
        continue;
      }

      // 5) Skip if tabindex is -1 (programmatically removed from tab order).
      const tabindex = candidate.getAttribute("tabindex");
      if (tabindex === "-1") continue;

      // If we reach here, candidate is considered a focusable control that would be exposed despite
      // its ancestor being aria-hidden="true" — this is a violation.
      hasOffendingFocusable = true;
      break;
    }

    if (hasOffendingFocusable) {
      errors.push({
        id,
        element: hiddenElement,
        text,
        url,
      });
    }
  }

  return errors;
}
