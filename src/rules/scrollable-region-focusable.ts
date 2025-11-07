import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "scrollable-region-focusable";
const text =
  "Ensure elements that have scrollable content are accessible by keyboard";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/scrollable-region-focusable?application=RuleDescription";

/**
 * Check if an element is focusable via keyboard
 */
function isFocusable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  // Check if element is explicitly made focusable via tabindex
  const tabindex = element.getAttribute("tabindex");
  if (tabindex !== null) {
    const tabindexValue = parseInt(tabindex, 10);
    if (!isNaN(tabindexValue) && tabindexValue >= 0) {
      return true;
    }
  }

  // Check if element is naturally focusable
  const tagName = element.tagName.toLowerCase();
  const naturallyFocusable = [
    "a",
    "button",
    "input",
    "select",
    "textarea",
    "iframe",
    "audio",
    "video",
  ];

  if (naturallyFocusable.includes(tagName)) {
    // For anchor tags, they need an href to be focusable
    if (tagName === "a") {
      return element.hasAttribute("href");
    }

    // Check if disabled
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
 * Check if an element has focusable descendants
 */
function hasFocusableDescendants(element: Element): boolean {
  // Find all potential focusable elements
  const focusableSelector = [
    "a[href]",
    "button",
    "input",
    "select",
    "textarea",
    "iframe",
    "audio[controls]",
    "video[controls]",
    "[tabindex]",
  ].join(",");

  const candidates = querySelectorAll(focusableSelector, element);

  for (const candidate of candidates) {
    if (isFocusable(candidate)) {
      return true;
    }
  }

  return false;
}

/**
 * Check if an element is scrollable
 */
function isScrollable(element: Element): boolean {
  if (!(element instanceof HTMLElement)) return false;

  // Skip certain elements that shouldn't be checked
  const tagName = element.tagName.toLowerCase();
  if (tagName === "html" || tagName === "body") {
    return false;
  }

  const computed = globalThis.getComputedStyle(element);
  const overflowX = computed.overflowX;
  const overflowY = computed.overflowY;

  // Check if overflow is set to auto or scroll
  const hasScrollableOverflow =
    overflowX === "auto" ||
    overflowX === "scroll" ||
    overflowY === "auto" ||
    overflowY === "scroll";

  if (!hasScrollableOverflow) {
    return false;
  }

  // Check if content actually overflows
  const hasOverflowingContent =
    element.scrollHeight > element.clientHeight ||
    element.scrollWidth > element.clientWidth;

  return hasOverflowingContent;
}

export default function scrollableRegionFocusable(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements in the tree
  const allElements = querySelectorAll("*", element);

  // Add the element itself if it's an HTMLElement
  if (element instanceof HTMLElement) {
    allElements.unshift(element);
  }

  for (const el of allElements) {
    // Skip if not scrollable
    if (!isScrollable(el)) {
      continue;
    }

    // Check if the scrollable element is keyboard accessible
    const isKeyboardAccessible = isFocusable(el) || hasFocusableDescendants(el);

    if (!isKeyboardAccessible) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
