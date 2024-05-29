import { querySelectorAll } from "../utils";
import { AccessibilityError } from "../scanner";

const text = "Elements must only use allowed ARIA attributes";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/aria-allowed-attr?application=RuleDescription";

// TODO: Fill out the rest of the mappings from https://www.w3.org/TR/html-aria/#docconformance
const ariaMappings: Record<string, string | undefined> = {
  HTML: "document",
  I: undefined,
};

export function ariaAllowedAttr(el: Element): AccessibilityError[] {
  const errors = [];
  const selector = Object.keys(ariaMappings).join(",");
  for (const element of querySelectorAll(selector, el)) {
    if (element.getAttribute("role") === ariaMappings[element.tagName])
      continue;
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
