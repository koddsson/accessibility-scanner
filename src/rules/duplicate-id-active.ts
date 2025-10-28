import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "duplicate-id-active";
const text = "IDs of active elements must be unique";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

// Active/interactive elements that can receive focus or user interaction
const activeElementSelector = [
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
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Get all active elements with IDs
  const activeElements = querySelectorAll(activeElementSelector, element);

  // If the root element is active and has an ID, include it
  if (element.matches && element.matches(activeElementSelector)) {
    activeElements.push(element);
  }

  // Track which IDs we've seen and on which elements
  const idMap = new Map<string, Element[]>();

  for (const el of activeElements) {
    const elementId = el.getAttribute("id");

    // Skip elements without IDs
    if (!elementId || elementId.trim() === "") continue;

    // Track elements by ID
    if (!idMap.has(elementId)) {
      idMap.set(elementId, []);
    }
    idMap.get(elementId)!.push(el);
  }

  // Check for duplicate IDs
  for (const [, elements] of idMap.entries()) {
    if (elements.length > 1) {
      // Report error for each element with the duplicate ID
      for (const el of elements) {
        errors.push({
          element: el,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
