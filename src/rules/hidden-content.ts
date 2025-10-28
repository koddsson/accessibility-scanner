import { AccessibilityError } from "../scanner";

const text = "Informs users about hidden content.";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/hidden-content?application=RuleDescription";

export default function hiddenContent(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements within the provided container
  const allElements = [element, ...element.querySelectorAll("*")];

  for (const el of allElements) {
    if (!(el instanceof HTMLElement)) continue;

    // Check for various ways content can be hidden
    const hasHiddenAttribute = el.hasAttribute("hidden");
    const hasAriaHidden = el.getAttribute("aria-hidden") === "true";
    const hasDisplayNone = el.style.display === "none";
    const hasVisibilityHidden = el.style.visibility === "hidden";

    // If any hiding method is detected, report it
    if (
      hasHiddenAttribute ||
      hasAriaHidden ||
      hasDisplayNone ||
      hasVisibilityHidden
    ) {
      errors.push({
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
