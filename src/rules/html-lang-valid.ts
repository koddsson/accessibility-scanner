import { AccessibilityError } from "../scanner";

const id = "html-lang-valid";
const text = "The lang attribute of the <html> element must have a valid value";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

function langIsValid(locale: string): boolean {
  try {
    const foundLocales = Intl.DisplayNames.supportedLocalesOf([locale], {
      localeMatcher: "lookup",
    });
    if (foundLocales.length !== 1) return false;
    return foundLocales[0].toLowerCase() === locale.toLowerCase();
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
