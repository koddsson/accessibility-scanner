import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "link-in-text-block";
const text =
  "Links must be distinguished from surrounding text in a way that does not rely on color";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/link-in-text-block?application=RuleDescription";

// Threshold for determining if text content beyond link indicates a text block
const TEXT_BLOCK_THRESHOLD = 10;

// Font weight difference threshold between normal (400) and bold (700)
const FONT_WEIGHT_DIFFERENCE_THRESHOLD = 300;

/**
 * Convert CSS font-weight to numeric value
 */
function getFontWeightNumeric(fontWeight: string): number {
  const weightMap: { [key: string]: number } = {
    normal: 400,
    bold: 700,
    lighter: 300,
    bolder: 700,
  };

  return weightMap[fontWeight] || parseInt(fontWeight) || 400;
}

/**
 * Check if an element has text content
 */
function hasTextContent(element: Element): boolean {
  const text = element.textContent?.trim();
  return text !== undefined && text.length > 0;
}

/**
 * Check if element is visible
 */
function isVisible(element: Element): boolean {
  const computed = globalThis.getComputedStyle(element as HTMLElement);

  if (
    computed.display === "none" ||
    computed.visibility === "hidden" ||
    computed.opacity === "0"
  ) {
    return false;
  }

  const rect = (element as HTMLElement).getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) {
    return false;
  }

  return true;
}

/**
 * Check if a link is visually distinguishable without color
 * Returns true if the link has sufficient distinguishing features
 */
function isDistinguishableWithoutColor(link: HTMLAnchorElement): boolean {
  const computed = globalThis.getComputedStyle(link);

  // Check for text decoration (underline, overline, line-through)
  const textDecoration = computed.textDecoration || computed.textDecorationLine;
  if (
    textDecoration &&
    (textDecoration.includes("underline") ||
      textDecoration.includes("overline") ||
      textDecoration.includes("line-through"))
  ) {
    return true;
  }

  // Check for different font weight (bold) compared to parent
  const parent = link.parentElement;
  if (parent) {
    const parentComputed = globalThis.getComputedStyle(parent);
    const linkWeight = getFontWeightNumeric(computed.fontWeight);
    const parentWeight = getFontWeightNumeric(parentComputed.fontWeight);

    // A difference of 300 or more indicates bold vs normal
    if (
      Math.abs(linkWeight - parentWeight) >= FONT_WEIGHT_DIFFERENCE_THRESHOLD
    ) {
      return true;
    }

    // Check for different font style (italic)
    if (
      computed.fontStyle !== parentComputed.fontStyle &&
      (computed.fontStyle === "italic" || computed.fontStyle === "oblique")
    ) {
      return true;
    }
  }

  // Check for border that provides visual distinction
  const borderTopWidth = parseFloat(computed.borderTopWidth) || 0;
  const borderBottomWidth = parseFloat(computed.borderBottomWidth) || 0;
  const borderLeftWidth = parseFloat(computed.borderLeftWidth) || 0;
  const borderRightWidth = parseFloat(computed.borderRightWidth) || 0;

  if (
    borderTopWidth > 0 ||
    borderBottomWidth > 0 ||
    borderLeftWidth > 0 ||
    borderRightWidth > 0
  ) {
    return true;
  }

  return false;
}

/**
 * Check if the link is in a text block context (has surrounding text)
 */
function isInTextBlock(link: HTMLAnchorElement): boolean {
  const parent = link.parentElement;
  if (!parent) return false;

  // Get parent's text content and link's text content
  const parentText = parent.textContent?.trim() || "";
  const linkText = link.textContent?.trim() || "";

  // If parent has significantly more text than just the link, it's a text block
  // Using a threshold to account for whitespace and small differences
  return parentText.length > linkText.length + TEXT_BLOCK_THRESHOLD;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Get all links
  const links = querySelectorAll("a[href]", element);
  if (element.matches("a[href]")) {
    links.push(element as HTMLAnchorElement);
  }

  for (const link of links) {
    const anchor = link as HTMLAnchorElement;

    // Skip if link is not visible
    if (!isVisible(anchor)) {
      continue;
    }

    // Skip if link has no text content
    if (!hasTextContent(anchor)) {
      continue;
    }

    // Skip if link is not in a text block context
    if (!isInTextBlock(anchor)) {
      continue;
    }

    // Check if link is distinguishable without color
    if (!isDistinguishableWithoutColor(anchor)) {
      errors.push({
        id,
        element: anchor,
        text,
        url,
      });
    }
  }

  return errors;
}
