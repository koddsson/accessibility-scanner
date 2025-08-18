import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const localePattern = /^(.\w-.\w)/;

function langIsValid(locale: string): boolean {
  const match = locale.match(localePattern);
  const cleanedLocale = match ? match[1] : locale;
  try {
    const foundLocales = Intl.DisplayNames.supportedLocalesOf([cleanedLocale], {
      localeMatcher: "lookup",
    });
    if (foundLocales.length !== 1) return false;
    return foundLocales[0].toLowerCase() === cleanedLocale.toLowerCase();
  } catch {
    return false;
  }
}

const id = "de46e4";
const url = `https://act-rules.github.io/rules/${id}`;
const text = "Ensures lang attributes have valid values";

function getTexts(element: Element): string[] {
  // Normally we'd get all the text nodes here but we need to special case those with a filter.
  // Maybe we can generalise this by taking in a filter function?
  // TODO: Look into that.
  const labels = querySelectorAll("[aria-label]", element)
    .map((x) => x.getAttribute("aria-label")!.trim())
    .filter(Boolean);
  const alts = querySelectorAll("img[alt]", element)
    .map((x) => x.getAttribute("alt")!.trim())
    .filter(Boolean);
  return [...labels, ...alts];
}

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("[lang]", element);
  if (element.matches("[lang]")) {
    elements.push(element);
  }

  for (const element of elements) {
    const firstTextNode = document
      .createNodeIterator(element, NodeFilter.SHOW_TEXT, (node) => {
        if ((node as Text).wholeText.trim() === "")
          return NodeFilter.FILTER_REJECT;
        const parentElement = node.parentElement;
        const closestLangElement = parentElement?.closest("[lang]");
        return closestLangElement?.isSameNode(element)
          ? NodeFilter.FILTER_ACCEPT
          : NodeFilter.FILTER_REJECT;
      })
      .nextNode();

    const hasTextNodes = !!firstTextNode || getTexts(element).length > 0;

    if (!langIsValid(element.getAttribute("lang")!) && hasTextNodes) {
      errors.push({
        element,
        text,
        url,
      });
    }
  }

  return errors;
}
