import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";
import {
  parseColor,
  getContrastRatio,
  getEffectiveBackgroundColor,
  isLargeText,
  formatColor,
  flattenColor,
} from "../utils/color";

const text = "Elements must have sufficient color contrast";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/color-contrast?application=RuleDescription";

interface ContrastError extends AccessibilityError {
  foregroundColor?: string;
  backgroundColor?: string;
  contrastRatio?: number;
  expectedRatio?: number;
  needsReview?: boolean;
  reviewReason?: string;
}

/**
 * Check if element has visible text content
 */
function hasTextContent(element: Element): boolean {
  const textContent = element.textContent?.trim();
  if (!textContent) return false;

  // Check if element is visible
  const computed = globalThis.getComputedStyle(element as HTMLElement);
  if (
    computed.display === "none" ||
    computed.visibility === "hidden" ||
    computed.opacity === "0"
  ) {
    return false;
  }

  // Check if element has zero dimensions
  const rect = (element as HTMLElement).getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  return true;
}

/**
 * Check if element is text-based and should be checked for contrast
 */
function shouldCheckContrast(element: Element): boolean {
  const tagName = element.tagName.toLowerCase();

  // Skip input elements (they have their own contrast requirements)
  if (
    tagName === "input" ||
    tagName === "select" ||
    tagName === "textarea" ||
    tagName === "button"
  ) {
    return false;
  }

  // Check for text content
  if (!hasTextContent(element)) {
    return false;
  }

  // Check if element contains only images (text-as-image)
  const hasOnlyImages =
    element.children.length > 0 &&
    [...element.children].every((child) => child.tagName === "IMG");
  if (hasOnlyImages && !element.textContent?.trim()) {
    return false;
  }

  return true;
}

/**
 * Check if background might have image or gradient (needs manual review)
 */
function hasComplexBackground(element: Element): boolean {
  const computed = globalThis.getComputedStyle(element as HTMLElement);
  const bgImage = computed.backgroundImage;

  return bgImage !== "none" && bgImage !== "";
}

export default function (element: Element): ContrastError[] {
  const errors: ContrastError[] = [];

  // Get all text elements
  const textElements = querySelectorAll("*", element).filter((el) =>
    shouldCheckContrast(el),
  );

  // Include the element itself if it should be checked
  if (shouldCheckContrast(element)) {
    textElements.push(element);
  }

  for (const textElement of textElements) {
    try {
      const computed = globalThis.getComputedStyle(textElement as HTMLElement);
      const fgColorStr = computed.color;

      // Parse foreground color
      const fgColor = parseColor(fgColorStr);
      if (!fgColor) {
        continue;
      }

      // Get effective background color
      const bgColor = getEffectiveBackgroundColor(textElement);

      // Flatten foreground color if it has alpha
      const flattenedFg =
        fgColor.a !== undefined && fgColor.a < 1
          ? flattenColor(fgColor, bgColor)
          : fgColor;

      // Calculate contrast ratio
      const contrastRatio = getContrastRatio(flattenedFg, bgColor);

      // Determine threshold based on text size
      const isLarge = isLargeText(textElement);
      const threshold = isLarge ? 3 : 4.5;

      // Check if contrast meets threshold
      if (contrastRatio < threshold) {
        const hasComplex = hasComplexBackground(textElement);

        errors.push({
          element: textElement,
          text: text,
          url: url,
          foregroundColor: formatColor(flattenedFg),
          backgroundColor: formatColor(bgColor),
          contrastRatio: Math.round(contrastRatio * 100) / 100,
          expectedRatio: threshold,
          needsReview: hasComplex,
          reviewReason: hasComplex
            ? "Element has background image or gradient - manual review recommended"
            : undefined,
        });
      }
    } catch {
      // Skip elements that cause errors (e.g., pseudo-elements, etc.)
      continue;
    }
  }

  return errors;
}
