import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "avoid-inline-spacing";
const text =
  "Ensure that text spacing set through style attributes can be adjusted with custom stylesheets";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * WCAG 1.4.12 minimum thresholds (expressed relative to font-size):
 *   letter-spacing >= 0.12em
 *   word-spacing   >= 0.16em
 *   line-height    >= 1.5  (unitless or equivalent)
 */
const THRESHOLDS: Record<string, number> = {
  "letter-spacing": 0.12,
  "word-spacing": 0.16,
  "line-height": 1.5,
};

/**
 * Keywords that pass-through to the parent value and therefore do NOT restrict
 * the user from overriding spacing via a custom stylesheet.
 */
const PASSTHROUGH_KEYWORDS = new Set(["inherit", "unset"]);

/**
 * Keywords that reset the property to its initial/default value (effectively 0
 * or "normal"), which is below every WCAG threshold.
 */
const RESET_KEYWORDS = new Set(["normal", "initial"]);

/**
 * Parse all declarations from a `style` attribute string.  Handles duplicate
 * properties by returning every occurrence so the caller can apply cascade
 * rules (last `!important` wins; otherwise last declaration wins).
 */
function parseDeclarations(
  styleAttr: string,
): { property: string; value: string; important: boolean }[] {
  const declarations: {
    property: string;
    value: string;
    important: boolean;
  }[] = [];

  // Split by semicolons (crude but sufficient for inline styles)
  for (const raw of styleAttr.split(";")) {
    const colonIndex = raw.indexOf(":");
    if (colonIndex === -1) continue;

    const property = raw.slice(0, colonIndex).trim().toLowerCase();
    let value = raw.slice(colonIndex + 1).trim();

    // Detect and strip !important
    const importantRegex = /\s*!\s*important\s*$/i;
    const important = importantRegex.test(value);
    if (important) {
      value = value.replace(importantRegex, "").trim();
    }

    if (property && value) {
      declarations.push({ property, value: value.toLowerCase(), important });
    }
  }
  return declarations;
}

/**
 * For a given spacing property, determine the winning `!important` value from
 * the list of declarations.  Per CSS cascade rules for inline styles with
 * duplicate properties, the *last* `!important` declaration wins.  If no
 * declaration is `!important`, returns `undefined`.
 */
function getWinningImportantValue(
  declarations: { property: string; value: string; important: boolean }[],
  property: string,
): string | undefined {
  let winner: string | undefined;
  for (const decl of declarations) {
    if (decl.property === property && decl.important) {
      winner = decl.value;
    }
  }
  return winner;
}

/**
 * Check whether a value is below the WCAG threshold for the given property.
 * Returns `true` if the value is definitely below threshold or cannot be
 * evaluated (e.g. px values without knowing computed font-size).
 */
function isBelowThreshold(property: string, value: string): boolean {
  const threshold = THRESHOLDS[property];
  if (threshold === undefined) return false;

  // Reset keywords are always below threshold
  if (RESET_KEYWORDS.has(value)) return true;

  // Passthrough keywords don't restrict overriding
  if (PASSTHROUGH_KEYWORDS.has(value)) return false;

  // Try to parse as a number with unit
  const numericMatch = value.match(/^([+-]?\d*\.?\d+)\s*(em|%|px)?$/);
  if (!numericMatch) {
    // Can't evaluate -> flag it conservatively
    return true;
  }

  const num = parseFloat(numericMatch[1]);
  const unit = numericMatch[2] || "";

  if (property === "line-height") {
    // Unitless number: compare directly to 1.5
    if (!unit) return num < threshold;
    // em: 1em = 1x font-size, so compare directly
    if (unit === "em") return num < threshold;
    // %: 150% = 1.5x font-size
    if (unit === "%") return num < threshold * 100;
    // px: can't evaluate without knowing font-size -> flag it
    if (unit === "px") return true;
  } else {
    // letter-spacing and word-spacing
    // em: compare directly to threshold
    if (unit === "em") return num < threshold;
    // px or %: can't evaluate without knowing font-size -> flag it
    if (unit === "px" || unit === "%") return true;
  }

  // Unknown unit -> flag it
  return true;
}

/**
 * Check if an element is hidden via `display: none` in inline style.
 */
function isHiddenByInlineStyle(element: Element): boolean {
  const style = element.getAttribute("style");
  if (!style) return false;
  const declarations = parseDeclarations(style);
  for (const decl of declarations) {
    if (decl.property === "display" && decl.value === "none") return true;
  }
  return false;
}

/**
 * Check if an element (or any ancestor up to the root) is hidden.
 */
function isElementHidden(element: Element): boolean {
  let current: Element | null = element;
  while (current) {
    if (isHiddenByInlineStyle(current)) return true;
    current = current.parentElement;
  }
  return false;
}

/**
 * Check whether an element has any visible text content (directly or via
 * descendants).  Empty elements are inapplicable per the ACT rules.
 */
function hasVisibleTextContent(element: Element): boolean {
  return (element.textContent || "").trim().length > 0;
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
    if (isElementHidden(el)) continue;

    // Skip elements with no visible text content
    if (!hasVisibleTextContent(el)) continue;

    const declarations = parseDeclarations(styleAttr);
    let hasViolation = false;

    for (const property of Object.keys(THRESHOLDS)) {
      const winningValue = getWinningImportantValue(declarations, property);
      if (winningValue === undefined) continue; // no !important for this property

      // Passthrough keywords don't restrict user overrides
      if (PASSTHROUGH_KEYWORDS.has(winningValue)) continue;

      if (isBelowThreshold(property, winningValue)) {
        hasViolation = true;
        break;
      }
    }

    if (hasViolation) {
      errors.push({ id, element: el, text, url });
    }
  }

  return errors;
}
