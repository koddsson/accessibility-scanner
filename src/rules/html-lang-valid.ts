import { AccessibilityError } from "../scanner";

const id = "html-lang-valid";
const text = "The lang attribute of the <html> element must have a valid value";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function langIsValid(locale: string): boolean {
  // Extract the primary language subtag (before any hyphen).
  // BCP 47 requires only the primary subtag to be a valid ISO 639 code;
  // additional subtags (region, variant, etc.) don't affect validity for
  // this rule.
  const primarySubtag = locale.split("-")[0];
  if (!primarySubtag) return false;

  try {
    const foundLocales = Intl.DisplayNames.supportedLocalesOf([primarySubtag], {
      localeMatcher: "lookup",
    });
    if (foundLocales.length !== 1) return false;
    return foundLocales[0].toLowerCase() === primarySubtag.toLowerCase();
  } catch {
    return false;
  }
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

  // If there's no lang attribute or it's empty/whitespace, no error for this rule
  // (that's covered by html-has-lang rule)
  if (!langAttribute || langAttribute.trim() === "") {
    return [];
  }

  // Check if the lang attribute has a valid value
  if (!langIsValid(langAttribute.trim())) {
    return [{ id, element: htmlElement, url, text }];
  }

  return [];
}
