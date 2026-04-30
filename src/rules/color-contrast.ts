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

const id = "color-contrast";
const text = "Elements must have sufficient color contrast";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

interface ContrastError extends AccessibilityError {
  foregroundColor?: string;
  backgroundColor?: string;
  contrastRatio?: number;
  expectedRatio?: number;
  needsReview?: boolean;
  reviewReason?: string;
}

/**
 * Detect screen-reader-only patterns (visually clipped, not rendered).
 */
function isVisuallyHidden(computed: CSSStyleDeclaration): boolean {
  const clipPath = computed.clipPath;
  if (clipPath === "inset(50%)" || clipPath === "inset(100%)") return true;

  const clip = computed.clip;
  if (
    clip === "rect(0px, 0px, 0px, 0px)" ||
    clip === "rect(1px, 1px, 1px, 1px)"
  ) {
    return true;
  }

  // 1x1 absolutely-positioned with overflow:hidden — classic sr-only fallback.
  if (
    computed.position === "absolute" &&
    computed.overflow === "hidden" &&
    parseFloat(computed.width) <= 1 &&
    parseFloat(computed.height) <= 1
  ) {
    return true;
  }

  return false;
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

  if (isVisuallyHidden(computed)) {
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
 * True if the element has a non-empty direct text-node child.
 * Wrappers that only aggregate descendant text are not checked — axe checks
 * the element that *directly* contains the rendered text, not every ancestor.
 */
function hasOwnTextNode(element: Element): boolean {
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return true;
    }
  }
  return false;
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

  // Only check elements that directly contain text — avoid double-flagging
  // wrappers that aggregate descendant text via element.textContent.
  if (!hasOwnTextNode(element)) {
    return false;
  }

  if (!hasTextContent(element)) {
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
          id,
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
