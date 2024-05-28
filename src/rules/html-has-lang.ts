import { AccessibilityError } from "../scanner";

const id = "html-has-lang";
const text = "<html> element must have a lang attribute";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (el: Element): AccessibilityError[] {
  const htmlElement = el.ownerDocument.documentElement;
  if (!htmlElement.hasAttribute("lang")) {
    return [{ element: htmlElement, url, text }];
  }
  return [];
}
