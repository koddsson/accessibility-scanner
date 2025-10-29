import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text =
  "Ensures elements in the focus order have a role appropriate for interactive content";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/focus-order-semantics?application=RuleDescription";

// Roles that are appropriate for interactive content
const interactiveRoles = new Set([
  "button",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "searchbox",
  "switch",
  "tab",
  "textbox",
  "combobox",
  "checkbox",
  "gridcell",
  "slider",
  "spinbutton",
  "treeitem",
  "listbox",
]);

// Widget roles that are interactive by nature
const widgetRoles = new Set([
  "scrollbar",
  "separator", // when focusable
]);

// Elements that are naturally interactive
const naturallyInteractiveElements = new Set([
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "summary",
]);

/**
 * Get the implicit or explicit role of an element
 */
function getRole(element: Element): string | null {
  // Check for explicit role
  const explicitRole = element.getAttribute("role");
  if (explicitRole) {
    return explicitRole;
  }

  // Check for implicit roles based on element type
  const tagName = element.tagName.toLowerCase();

  // <a> with href has implicit role of link
  if (tagName === "a" && element.hasAttribute("href")) {
    return "link";
  }

  // <button> has implicit role of button
  if (tagName === "button") {
    return "button";
  }

  // Input types have different implicit roles
  if (tagName === "input") {
    const type = (element as HTMLInputElement).type;
    if (type === "button" || type === "submit" || type === "reset") {
      return "button";
    }
    if (type === "checkbox") {
      return "checkbox";
    }
    if (type === "radio") {
      return "radio";
    }
    if (type === "range") {
      return "slider";
    }
    if (
      type === "text" ||
      type === "email" ||
      type === "tel" ||
      type === "url" ||
      type === "search" ||
      type === "password"
    ) {
      return "textbox";
    }
    if (type === "number") {
      return "spinbutton";
    }
  }

  // <select> has implicit role of combobox or listbox
  if (tagName === "select") {
    return (element as HTMLSelectElement).multiple ? "listbox" : "combobox";
  }

  // <textarea> has implicit role of textbox
  if (tagName === "textarea") {
    return "textbox";
  }

  // <summary> has implicit role of button
  if (tagName === "summary") {
    return "button";
  }

  // No implicit interactive role
  return null;
}

/**
 * Check if an element is in the focus order
 */
function isInFocusOrder(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  // Check tabindex attribute
  const tabindex = element.getAttribute("tabindex");
  if (tabindex !== null) {
    const tabindexValue = parseInt(tabindex, 10);
    // tabindex >= 0 puts element in focus order
    // tabindex < 0 removes element from focus order
    if (!isNaN(tabindexValue) && tabindexValue >= 0) {
      return true;
    }
  }

  // Check if element is naturally focusable (and thus in focus order by default)
  const tagName = element.tagName.toLowerCase();

  if (naturallyInteractiveElements.has(tagName)) {
    // For anchor tags, they need an href to be in focus order
    if (tagName === "a") {
      return element.hasAttribute("href");
    }

    // Check if disabled (disabled elements are not in focus order)
    if (
      "disabled" in element &&
      (
        element as
          | HTMLButtonElement
          | HTMLInputElement
          | HTMLSelectElement
          | HTMLTextAreaElement
      ).disabled
    ) {
      return false;
    }

    return true;
  }

  return false;
}

/**
 * Check if a role is appropriate for interactive content
 */
function hasAppropriateRole(element: Element): boolean {
  const role = getRole(element);

  // If no role, check if it's a naturally interactive element
  if (!role) {
    const tagName = element.tagName.toLowerCase();
    return naturallyInteractiveElements.has(tagName);
  }

  // Check if the role is in our set of interactive or widget roles
  return interactiveRoles.has(role) || widgetRoles.has(role);
}

export default function focusOrderSemantics(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements with tabindex attribute
  const elementsWithTabindex = querySelectorAll("[tabindex]", element);

  // Add the element itself if it has tabindex
  if (element.hasAttribute("tabindex")) {
    elementsWithTabindex.push(element);
  }

  for (const el of elementsWithTabindex) {
    // Only check elements that are in the focus order
    if (!isInFocusOrder(el)) {
      continue;
    }

    // Check if the element has an appropriate role for interactive content
    if (!hasAppropriateRole(el)) {
      errors.push({
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
