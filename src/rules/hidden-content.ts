import { AccessibilityError } from "../scanner";

const id = "hidden-content";
const text = "Informs users about hidden content.";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function hiddenContent(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements within the provided container
  const allElements = [element, ...element.querySelectorAll("*")];

  for (const el of allElements) {
    // Check for aria-hidden on all elements (including SVG)
    const hasAriaHidden = el.getAttribute("aria-hidden") === "true";

    // For HTML elements, also check hidden attribute and inline styles
    if (el instanceof HTMLElement) {
      const hasHiddenAttribute = el.hasAttribute("hidden");
      const hasDisplayNone = el.style.display === "none";
      const hasVisibilityHidden = el.style.visibility === "hidden";

      if (
        hasHiddenAttribute ||
        hasAriaHidden ||
        hasDisplayNone ||
        hasVisibilityHidden
      ) {
        errors.push({
          id,
          element: el,
          text,
          url,
        });
      }
    } else if (hasAriaHidden) {
      // For non-HTML elements (like SVG), only check aria-hidden
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
