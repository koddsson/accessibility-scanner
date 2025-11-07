import { AccessibilityError } from "../scanner";

const id = "document-title";
const text = "Documents must have <title> element to aid in navigation";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const document = element.ownerDocument;
  const titleElements = document.querySelectorAll("title");

  // Check if there is at least one <title> element
  if (titleElements.length === 0) {
    return [{ id, element: document.documentElement, url, text }];
  }

  // Check that at least one <title> element has non-empty text content
  for (const titleElement of titleElements) {
    const titleText = titleElement.textContent?.trim();
    if (titleText && titleText.length > 0) {
      return [];
    }
  }

  // All <title> elements are empty
  return [{ id, element: document.documentElement, url, text }];
}
