import { AccessibilityError } from "../scanner";

const id = "html-has-lang";
const text = "<html> element must have a lang attribute";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (el: Element): AccessibilityError[] {
  const htmlElement = el.ownerDocument.documentElement;
  const langAttribute = htmlElement.getAttribute("lang");

  // Report error if the `lang` attribute is not on the element or if it's just whitespace
  if (!langAttribute || langAttribute?.trim() === "") {
    return [{ element: htmlElement, url, text }];
  }
  return [];
}
