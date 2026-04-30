import { AccessibilityError } from "../scanner";

const id = "document-title";
const text = "Documents must have <title> element to aid in navigation";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const document = element.ownerDocument;
  if (!document) return [];

  // ACT 2779a5 considers only the first <title> in document order — a later
  // non-empty <title> can't compensate for an empty first one.
  const firstTitle = document.querySelector("title");
  if (!firstTitle) {
    return [{ id, element: document.documentElement, url, text }];
  }

  if ((firstTitle.textContent ?? "").trim().length === 0) {
    return [{ id, element: document.documentElement, url, text }];
  }

  return [];
}
