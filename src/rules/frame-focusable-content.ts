import { AccessibilityError } from "../scanner";
import { querySelectorAll, isVisible } from "../utils";

const id = "frame-focusable-content";
const text = "Frames with focusable content must not have tabindex=-1";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/frame-focusable-content?application=RuleDescription";

// Selector for focusable elements based on HTML spec and common patterns
const focusableSelector = [
  "a[href]",
  "area[href]",
  "input:not([type='hidden'])",
  "select",
  "textarea",
  "button",
  "iframe",
  "object",
  "embed",
  "[contenteditable='true']",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

/**
 * Checks if an element or its descendants contain focusable content
 */
function hasFocusableContent(element: Element): boolean {
  // Check if the element itself is focusable (but not if it's the frame we're checking)
  if (
    element.matches &&
    element.matches(focusableSelector) &&
    !element.matches("iframe, frame")
  ) {
    return true;
  }

  // For iframes and frames, we need to check their content
  if (
    element instanceof HTMLIFrameElement ||
    element instanceof HTMLFrameElement
  ) {
    try {
      const contentDocument = element.contentDocument;
      if (contentDocument && contentDocument.body) {
        // Check if the iframe's document has focusable elements
        const focusableElements = querySelectorAll(
          focusableSelector,
          contentDocument.body,
        );

        for (const focusableElement of focusableElements) {
          // Skip falsy/null elements that might occur in some edge cases
          if (!focusableElement) {
            continue;
          }

          // Skip elements that are not truly HTML elements (could be SVG elements, etc.)
          // NOTE: We cannot use `instanceof HTMLElement` here because elements from an iframe's
          // contentDocument have a different HTMLElement constructor than the parent window.
          // Checking for 'style' property is a pragmatic approach that works across contexts.
          if (!("style" in focusableElement)) {
            continue;
          }

          // Cast to work with it as an HTMLElement-like object
          const htmlElement = focusableElement as HTMLElement;

          // Skip elements that are not visible
          if (!isVisible(htmlElement)) continue;

          // Skip elements that are disabled
          if (htmlElement.hasAttribute("disabled")) continue;

          // Skip elements with tabindex="-1" (removed from tab order)
          if (htmlElement.getAttribute("tabindex") === "-1") continue;

          return true;
        }

        // If we successfully checked and found no focusable content, return false
        return false;
      }

      // If contentDocument or body is not available, assume it might have focusable content
      // This could happen if the iframe is not yet loaded or is cross-origin
      return true;
    } catch {
      // Cross-origin iframes will throw - we can't check their content
      // In this case, we assume they might have focusable content
      // This is a conservative approach for security reasons
      return true;
    }
  }

  return false;
}

export default function frameFocusableContent(
  element_: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all iframe and frame elements
  const frames = [...querySelectorAll("iframe, frame", element_)];

  // If the element being scanned is itself an iframe or frame, include it
  if (element_.matches && element_.matches("iframe, frame")) {
    frames.push(element_);
  }

  for (const frame of frames) {
    // Check if this frame has tabindex="-1"
    const tabindex = frame.getAttribute("tabindex");
    if (tabindex !== "-1") {
      continue;
    }

    // Check if the frame has focusable content
    if (hasFocusableContent(frame)) {
      errors.push({
        id,
        element: frame,
        text,
        url,
      });
    }
  }

  return errors;
}
