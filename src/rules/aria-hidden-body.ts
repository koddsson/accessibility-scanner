import { AccessibilityError } from "../scanner";

const id = "aria-hidden-body";
const text = 'aria-hidden="true" must not be present on the document <body>';
const url =
  "https://dequeuniversity.com/rules/axe/4.4/aria-hidden-body?application=RuleDescription";

export function ariaHiddenBody(element_: Element): AccessibilityError[] {
  const element = element_.ownerDocument.body;
  if (element.getAttribute("aria-hidden") === "true") {
    return [
      {
        id,
        element,
        text,
        url,
      },
    ];
  }
  return [];
}
