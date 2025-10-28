import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text =
  "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/avoid-inline-spacing?application=RuleDescription";

/**
 * Properties that affect text spacing according to WCAG 1.4.12
 */
const TEXT_SPACING_PROPERTIES = [
  "line-height",
  "letter-spacing",
  "word-spacing",
] as const;

/**
 * Pre-compiled regular expressions for checking !important text spacing properties
 * Pattern matches: property: value !important (with optional whitespace)
 */
const TEXT_SPACING_REGEX = TEXT_SPACING_PROPERTIES.map(
  (property) => new RegExp(`${property}\\s*:\\s*[^;]+\\s*!\\s*important`, "i"),
);

/**
 * Check if an element has inline style with !important for text spacing properties
 */
function hasImportantInlineSpacing(element: Element): boolean {
  const styleAttr = element.getAttribute("style");
  if (!styleAttr) {
    return false;
  }

  // Check if the inline style contains !important for text spacing properties
  return TEXT_SPACING_REGEX.some((regex) => regex.test(styleAttr));
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Get all elements with style attributes
  const elements = querySelectorAll("[style]", element);

  // Include the element itself if it has a style attribute
  if (element.hasAttribute("style")) {
    elements.push(element);
  }

  for (const el of elements) {
    if (hasImportantInlineSpacing(el)) {
      errors.push({
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
