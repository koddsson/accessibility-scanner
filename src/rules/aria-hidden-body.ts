import { AccessibilityError } from "../scanner";

const text = 'aria-hidden="true" must not be present on the document <body>';
const url =
  "https://dequeuniversity.com/rules/axe/4.4/aria-hidden-body?application=RuleDescription";

export function ariaHiddenBody(el: Document | Element): AccessibilityError[] {
  const body = el instanceof Document ? el.body : el.ownerDocument.body;
  if (body.getAttribute("aria-hidden") === "true") {
    return [
      {
        element: body,
        text,
        url,
      },
    ];
  }
  return [];
}
