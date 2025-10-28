import { AccessibilityError } from "../scanner";

const text =
  "Ensures content is not locked to any specific display orientation, and the content is operable in all display orientations";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/css-orientation-lock?application=RuleDescription";

/**
 * Checks if a CSS rule contains transform rotations that lock orientation
 */
function hasOrientationLockingTransform(cssRule: CSSStyleRule): boolean {
  const style = cssRule.style;
  const transform = style.getPropertyValue("transform");

  if (!transform) return false;

  // Check for 90 or -90 degree rotations (or 270 degrees which is equivalent to -90)
  // These transforms are used to lock orientation
  const rotatePattern =
    /rotate\s*\(\s*(-?\s*90deg|-?\s*270deg)\s*\)|rotatez\s*\(\s*(-?\s*90deg|-?\s*270deg)\s*\)/i;
  return rotatePattern.test(transform);
}

/**
 * Checks if a media query is orientation-specific
 */
function isOrientationMediaQuery(mediaText: string): boolean {
  return /orientation\s*:\s*(portrait|landscape)/i.test(mediaText);
}

/**
 * Recursively checks CSS rules for orientation locking patterns
 */
function checkCSSRules(
  rules: CSSRuleList | null | undefined,
): CSSStyleRule | null {
  if (!rules) return null;

  for (const rule of rules) {
    // Check media rules with orientation queries
    if (
      rule instanceof CSSMediaRule &&
      isOrientationMediaQuery(rule.media.mediaText)
    ) {
      // Check rules within the media query for orientation-locking transforms
      for (const innerRule of rule.cssRules) {
        if (
          innerRule instanceof CSSStyleRule &&
          hasOrientationLockingTransform(innerRule)
        ) {
          return innerRule;
        }
      }
    }
  }

  return null;
}

export default function cssOrientationLock(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  const doc = element.ownerDocument;
  if (!doc) return errors;

  try {
    // Check document-level stylesheets
    const stylesheets = doc.styleSheets;

    for (const stylesheet of stylesheets) {
      try {
        // Check if stylesheet is accessible (may throw SecurityError for cross-origin)
        const rules = stylesheet.cssRules;
        const violatingRule = checkCSSRules(rules);

        if (violatingRule) {
          // Report error on the document element or scanned element
          errors.push({
            element: doc.documentElement || element,
            text,
            url,
          });
          // Only report once per scan
          return errors;
        }
      } catch {
        // Ignore cross-origin stylesheet access errors
        // These stylesheets cannot be checked but we shouldn't fail the rule
        continue;
      }
    }

    // Also check for inline <style> elements within the scanned element
    // This is important for test fixtures and dynamically created content
    const styleElements = element.querySelectorAll("style");
    for (const styleElement of styleElements) {
      if (styleElement.sheet) {
        try {
          const rules = (styleElement.sheet as CSSStyleSheet).cssRules;
          const violatingRule = checkCSSRules(rules);

          if (violatingRule) {
            errors.push({
              element: styleElement,
              text,
              url,
            });
            // Only report once per scan
            return errors;
          }
        } catch {
          // Ignore any errors accessing inline stylesheets
          continue;
        }
      }
    }
  } catch {
    // If there's any error accessing stylesheets, don't fail the rule
    // This ensures the rule doesn't break in unusual environments
  }

  return errors;
}
