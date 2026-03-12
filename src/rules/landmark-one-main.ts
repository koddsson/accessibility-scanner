import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-one-main";
const text = "Document should have one main landmark";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  // Only check at the document level
  const doc = element.ownerDocument;
  if (!doc || element !== doc.documentElement) {
    return [];
  }

  const body = doc.body || element;
  const mains = querySelectorAll("main", body);
  const roleMains = querySelectorAll('[role="main"]', body);

  const totalMains = mains.length + roleMains.length;

  if (totalMains === 0) {
    return [{ id, element: doc.documentElement, text, url }];
  }
  return [];
}
