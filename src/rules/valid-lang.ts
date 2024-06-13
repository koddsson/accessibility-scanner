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

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("[lang]", el);
  if (el.matches("[lang]")) {
    elements.push(el);
  }

  for (const element of elements) {
    if (!langIsValid(element.getAttribute("lang")!)) {
      errors.push({
        element,
        text,
        url,
      });
    }
  }

  return errors;
}
