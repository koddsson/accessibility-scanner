import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "target-size";
const text = "Ensure touch target have sufficient size and space";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/target-size?application=RuleDescription";

// Minimum target size in CSS pixels (WCAG 2.2 SC 2.5.8)
const MIN_TARGET_SIZE = 24;

// Selector for interactive elements
const interactiveSelector = [
  "a",
  "button",
  "input",
  "select",
  "textarea",
  "[role=button]",
  "[role=link]",
  "[role=checkbox]",
  "[role=radio]",
  "[role=slider]",
  "[role=spinbutton]",
  "[role=switch]",
  "[role=tab]",
  "[role=menuitem]",
  "[role=menuitemcheckbox]",
  "[role=menuitemradio]",
].join(",");

/**
 * Check if an element is visible
 */
function isVisible(element: Element): boolean {
  const computed = globalThis.getComputedStyle(element as HTMLElement);
  if (
    computed.display === "none" ||
    computed.visibility === "hidden" ||
    computed.opacity === "0"
  ) {
    return false;
  }

  const rect = (element as HTMLElement).getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  return true;
}

/**
 * Check if element is an inline text link (exempt from size requirement)
 */
function isInlineTextLink(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();
  if (tagName !== "a") {
    return false;
  }

  const computed = globalThis.getComputedStyle(element as HTMLElement);
  const display = computed.display;

  // Inline or inline-block elements within text flow
  if (display === "inline" || display === "inline-block") {
    // Check if it has text content
    const textContent = element.textContent?.trim();
    if (textContent && textContent.length > 0) {
      return true;
    }
  }

  return false;
}

/**
 * Check if element meets the minimum target size requirement
 */
function meetsTargetSize(element: Element): boolean {
  const rect = (element as HTMLElement).getBoundingClientRect();
  return rect.width >= MIN_TARGET_SIZE && rect.height >= MIN_TARGET_SIZE;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all interactive elements using the selector
  const interactiveElements = [
    ...querySelectorAll(interactiveSelector, element),
  ];

  // Include the element itself if it matches the selector
  if (element.matches && element.matches(interactiveSelector)) {
    interactiveElements.push(element);
  }

  for (const target of interactiveElements) {
    // Skip non-visible elements
    if (!isVisible(target)) {
      continue;
    }

    // Skip inline text links (exception per WCAG 2.5.8)
    if (isInlineTextLink(target)) {
      continue;
    }

    // Check if target meets minimum size
    if (!meetsTargetSize(target)) {
      errors.push({
        id,
        element: target,
        text,
        url,
      });
    }
  }

  return errors;
}
