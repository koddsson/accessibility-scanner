import { AccessibilityError } from "../scanner";

const id = "page-has-heading-one";
const text = "Page should contain a level-one heading";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  // Only check at the document level
  const doc = element.ownerDocument;
  if (!doc || element !== doc.documentElement) {
    return [];
  }

  const root = doc.body || element;
  const h1s = root.querySelectorAll("h1");
  const ariaH1s = root.querySelectorAll('[role="heading"][aria-level="1"]');

  if (h1s.length === 0 && ariaH1s.length === 0) {
    return [{ id, element: doc.documentElement, text, url }];
  }
  return [];
}
