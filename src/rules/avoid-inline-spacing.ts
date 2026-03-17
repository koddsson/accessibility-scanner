import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "avoid-inline-spacing";
const text =
  "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * WCAG 1.4.12 minimum thresholds for text spacing properties.
 * Values at or above these thresholds are considered acceptable even with !important.
 *
 * - letter-spacing: at least 0.12em
 * - word-spacing: at least 0.16em
 * - line-height: at least 1.5 (unitless or em)
 */
const THRESHOLDS: Record<string, number> = {
  "letter-spacing": 0.12,
  "word-spacing": 0.16,
  "line-height": 1.5,
};

/**
 * Regex to extract individual CSS declarations from an inline style string.
 * Captures: property name, value, and whether !important is present.
 */
const DECLARATION_REGEX =
  /(letter-spacing|word-spacing|line-height)\s*:\s*([^!;]+?)\s*(!\s*important)?\s*(?:;|$)/gi;

/**
 * Parse a CSS value and return its numeric magnitude in em-equivalent units,
 * or null if the unit requires computed style information (e.g. px, %).
 */
function parseEmValue(value: string, property: string): number | null {
  const trimmed = value.trim();

  // em units
  const emMatch = trimmed.match(/^([+-]?\d*\.?\d+)\s*em$/i);
  if (emMatch) {
    return parseFloat(emMatch[1]);
  }

  // For line-height: unitless number or number with no unit
  if (property === "line-height") {
    const unitlessMatch = trimmed.match(/^([+-]?\d*\.?\d+)$/);
    if (unitlessMatch) {
      return parseFloat(unitlessMatch[1]);
    }
  }

  // px, %, and other units require font-size context — cannot evaluate statically
  return null;
}

/**
 * Check if an element has inline style with !important on text spacing properties
 * that restricts the value below the WCAG 1.4.12 minimum threshold.
 *
 * When duplicate declarations exist for the same property, CSS uses the last one.
 * If the last !important declaration meets the threshold, the element passes.
 */
function hasImportantInlineSpacing(element: Element): boolean {
  const styleAttr = element.getAttribute("style");
  if (!styleAttr) {
    return false;
  }

  // Collect all declarations per property, in order.
  // CSS cascading: when there are duplicate properties, the last declaration wins.
  // However, an !important declaration beats a non-!important one regardless of order.
  // When multiple !important declarations exist, the last one wins.
  const declarations: Record<
    string,
    Array<{ value: string; important: boolean }>
  > = {};

  let match;
  DECLARATION_REGEX.lastIndex = 0;
  while ((match = DECLARATION_REGEX.exec(styleAttr)) !== null) {
    const property = match[1].toLowerCase();
    const value = match[2];
    const important = !!match[3];
    if (!declarations[property]) {
      declarations[property] = [];
    }
    declarations[property].push({ value, important });
  }

  for (const [property, decls] of Object.entries(declarations)) {
    // Find the effective declaration: last !important wins, else last declaration wins
    const importantDecls = decls.filter((d) => d.important);
    if (importantDecls.length === 0) {
      continue; // No !important for this property
    }

    // The effective !important value is the last one
    const effective = importantDecls.at(-1)!;
    const threshold = THRESHOLDS[property];
    if (threshold === undefined) {
      continue;
    }

    const numericValue = parseEmValue(effective.value, property);
    if (numericValue === null) {
      // Can't determine if it meets threshold (px, %, etc.) — flag it
      return true;
    }
    if (numericValue < threshold) {
      return true;
    }
    // Value meets threshold — this property is OK
  }

  return false;
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
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
