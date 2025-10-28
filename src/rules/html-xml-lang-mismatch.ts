import { AccessibilityError } from "../scanner";

const id = "html-xml-lang-mismatch";
const text =
  "Ensure that HTML elements with both valid lang and xml:lang attributes agree on the base language of the page";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

/**
 * Extract the primary language subtag (the part before the first hyphen)
 * @param langValue - The language attribute value
 * @returns The primary language subtag in lowercase
 */
function getPrimaryLanguageSubtag(langValue: string): string {
  const trimmed = langValue.trim();
  const hyphenIndex = trimmed.indexOf("-");
  if (hyphenIndex === -1) {
    return trimmed.toLowerCase();
  }
  return trimmed.slice(0, Math.max(0, hyphenIndex)).toLowerCase();
}

export default function (element: Element): AccessibilityError[] {
  // Get the html element - either from the passed element's document or use the element itself if it's already html
  let htmlElement: Element | null = null;

  if (element.ownerDocument) {
    htmlElement = element.ownerDocument.documentElement;
  } else if (element.tagName?.toLowerCase() === "html") {
    htmlElement = element;
  }

  if (!htmlElement) {
    return [];
  }

  const langAttribute = htmlElement.getAttribute("lang");
  const xmlLangAttribute = htmlElement.getAttribute("xml:lang");

  // If both attributes are not present, no error
  if (!langAttribute || !xmlLangAttribute) {
    return [];
  }

  // If either is empty or just whitespace, no error (other rules handle this)
  if (langAttribute.trim() === "" || xmlLangAttribute.trim() === "") {
    return [];
  }

  // Extract primary language subtags
  const langPrimary = getPrimaryLanguageSubtag(langAttribute);
  const xmlLangPrimary = getPrimaryLanguageSubtag(xmlLangAttribute);

  // Compare primary language subtags (case-insensitive)
  if (langPrimary !== xmlLangPrimary) {
    return [{ element: htmlElement, url, text }];
  }

  return [];
}
