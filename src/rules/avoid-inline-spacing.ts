import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "avoid-inline-spacing";
const text =
  "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * WCAG 1.4.12 minimum thresholds (expressed in relative units):
 *   - letter-spacing: >= 0.12em
 *   - word-spacing:   >= 0.16em
 *   - line-height:    >= 1.5  (unitless ratio of font-size)
 */
interface SpacingProperty {
  name: string;
  threshold: number;
}

const SPACING_PROPERTIES: SpacingProperty[] = [
  { name: "letter-spacing", threshold: 0.12 },
  { name: "word-spacing", threshold: 0.16 },
  { name: "line-height", threshold: 1.5 },
];

/**
 * CSS keyword values that reset spacing to browser defaults and are therefore
 * treated as below-threshold when used with !important.
 */
const RESET_KEYWORDS = new Set(["normal", "initial"]);

/**
 * CSS keyword values that defer to the inherited/cascaded value and therefore
 * do not restrict user overrides — these are NOT flagged.
 */
const PASSTHROUGH_KEYWORDS = new Set(["inherit", "unset", "revert"]);

interface ParsedDeclaration {
  property: string;
  value: string;
  important: boolean;
}

/**
 * Parse all CSS declarations from an inline style attribute string.
 * Handles duplicate properties — returns them in source order so the caller
 * can apply "last !important wins" logic.
 */
function parseStyleDeclarations(styleAttr: string): ParsedDeclaration[] {
  const declarations: ParsedDeclaration[] = [];
  // Split on semicolons, but be careful about edge cases
  const parts = styleAttr.split(";");

  for (const part of parts) {
    const trimmed = part.trim();
    if (!trimmed) continue;

    const colonIndex = trimmed.indexOf(":");
    if (colonIndex === -1) continue;

    const property = trimmed.slice(0, colonIndex).trim().toLowerCase();
    let value = trimmed.slice(colonIndex + 1).trim();

    const important = /!\s*important\s*$/i.test(value);
    if (important) {
      value = value.replace(/\s*!\s*important\s*$/i, "").trim();
    }

    declarations.push({ property, value: value.toLowerCase(), important });
  }

  return declarations;
}

/**
 * Parse a CSS length/number value and return it as a multiplier of font-size.
 * Returns null if the value cannot be statically evaluated (e.g. px without
 * known font-size, calc(), var(), etc.).
 *
 * For `em` values, the multiplier is the numeric part directly.
 * For unitless numbers (line-height), the value is the multiplier itself.
 * For `%` values, divide by 100 to get the multiplier.
 * For `px` and other absolute units, return null (can't evaluate without font-size).
 */
function parseRelativeValue(value: string, property: string): number | null {
  // Handle reset keywords — treat as 0 (below any positive threshold)
  if (RESET_KEYWORDS.has(value)) {
    return 0;
  }

  // Handle passthrough keywords — these don't restrict overrides
  if (PASSTHROUGH_KEYWORDS.has(value)) {
    return null;
  }

  // Try em values
  const emMatch = value.match(/^(-?[\d.]+)\s*em$/);
  if (emMatch) {
    return parseFloat(emMatch[1]);
  }

  // Try percentage values (line-height: 150% = 1.5)
  const percentMatch = value.match(/^(-?[\d.]+)\s*%$/);
  if (percentMatch) {
    return parseFloat(percentMatch[1]) / 100;
  }

  // Try unitless numbers (only valid for line-height)
  if (property === "line-height") {
    const numMatch = value.match(/^(-?[\d.]+)$/);
    if (numMatch) {
      return parseFloat(numMatch[1]);
    }
  }

  // px, cm, mm, pt, etc. — cannot evaluate without computed font-size
  // Return -1 to signal "cannot verify meets threshold" (flag it)
  const absMatch = value.match(/^(-?[\d.]+)\s*(px|pt|cm|mm|in|pc)$/);
  if (absMatch) {
    return -1;
  }

  // Unknown value (calc, var, etc.) — flag it conservatively
  return -1;
}

/**
 * Check if an element is hidden via inline styles.
 * We only check what's statically available in the style attribute.
 */
function isHiddenByInlineStyle(styleAttr: string): boolean {
  const lower = styleAttr.toLowerCase();
  // display: none
  if (/display\s*:\s*none/i.test(lower)) {
    return true;
  }
  return false;
}

/**
 * Check if an element has any visible text content (text nodes in descendants).
 */
function hasVisibleTextContent(element: Element): boolean {
  // Check for direct text content
  if (element.textContent && element.textContent.trim().length > 0) {
    return true;
  }
  return false;
}

/**
 * Get the winning !important value for a property from parsed declarations.
 * Per CSS cascade: when multiple declarations of the same property have
 * !important, the last one wins. A non-important declaration never overrides
 * an !important one.
 *
 * Returns the value string if there is an active !important declaration,
 * or null if no !important applies.
 */
function getWinningImportantValue(
  declarations: ParsedDeclaration[],
  propertyName: string,
): string | null {
  let lastImportantValue: string | null = null;

  for (const decl of declarations) {
    if (decl.property === propertyName && decl.important) {
      lastImportantValue = decl.value;
    }
  }

  return lastImportantValue;
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
    const styleAttr = el.getAttribute("style");
    if (!styleAttr) continue;

    // Skip hidden elements
    if (isHiddenByInlineStyle(styleAttr)) continue;

    // Skip elements with no visible text content
    if (!hasVisibleTextContent(el)) continue;

    const declarations = parseStyleDeclarations(styleAttr);

    for (const prop of SPACING_PROPERTIES) {
      const importantValue = getWinningImportantValue(declarations, prop.name);

      // No !important declaration for this property — not applicable
      if (importantValue === null) continue;

      // Passthrough keywords (inherit, unset) don't restrict overrides
      if (PASSTHROUGH_KEYWORDS.has(importantValue)) continue;

      const relativeValue = parseRelativeValue(importantValue, prop.name);

      // null means passthrough (already handled above) or truly unparseable
      if (relativeValue === null) continue;

      // -1 means absolute unit (px etc.) that can't be verified statically
      // Flag it because we can't confirm it meets threshold
      if (relativeValue === -1 || relativeValue < prop.threshold) {
        errors.push({
          id,
          element: el,
          text,
          url,
        });
        // Only report once per element
        break;
      }
    }
  }

  return errors;
}
