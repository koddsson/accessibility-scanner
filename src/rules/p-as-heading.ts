import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "p-as-heading";
const text =
  "Ensure bold, italic text and font-size is not used to style <p> elements as a heading";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/p-as-heading?application=RuleDescription";

/**
 * Check if an element is styled like a heading (bold or italic with larger font size)
 */
function isStyledLikeHeading(element: HTMLElement): boolean {
  const computed = globalThis.getComputedStyle(element);

  // Check if element has text content
  if (!element.textContent?.trim()) {
    return false;
  }

  // Check for bold (font-weight >= 600) or italic
  // Handle both numeric values and keywords like 'bold', 'normal'
  let fontWeight = parseInt(computed.fontWeight, 10);
  if (isNaN(fontWeight)) {
    // Map common font-weight keywords to numeric values
    const fontWeightKeywords: { [key: string]: number } = {
      normal: 400,
      bold: 700,
      bolder: 700,
      lighter: 300,
    };
    fontWeight = fontWeightKeywords[computed.fontWeight] || 400;
  }
  const isBoldOrItalic = fontWeight >= 600 || computed.fontStyle === "italic";

  if (!isBoldOrItalic) {
    return false;
  }

  // Check for larger font size
  const fontSize = parseFloat(computed.fontSize);

  // Get the next sibling to compare font sizes
  let nextElement = element.nextElementSibling;
  while (nextElement && !nextElement.textContent?.trim()) {
    nextElement = nextElement.nextElementSibling;
  }

  if (!nextElement) {
    return false;
  }

  const nextComputed = globalThis.getComputedStyle(nextElement as HTMLElement);
  const nextFontSize = parseFloat(nextComputed.fontSize);

  // If this paragraph's font size is larger than the next element, it might be styled as a heading
  return fontSize > nextFontSize;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const elements = querySelectorAll<HTMLElement>("p", element);

  if (element.matches("p")) {
    elements.push(element as HTMLElement);
  }

  for (const pElement of elements) {
    // Skip if element is not visible
    const computed = globalThis.getComputedStyle(pElement);
    if (
      computed.display === "none" ||
      computed.visibility === "hidden" ||
      computed.opacity === "0"
    ) {
      continue;
    }

    if (isStyledLikeHeading(pElement)) {
      errors.push({
        id,
        element: pElement,
        text,
        url,
      });
    }
  }

  return errors;
}
