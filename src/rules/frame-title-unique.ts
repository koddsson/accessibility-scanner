import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "frame-title-unique";
const text = "Frames must have a unique title attribute";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Get all iframe and frame elements
  const frameElements = querySelectorAll("iframe, frame", element);

  // If the root element is a frame, include it
  if (element.matches && element.matches("iframe, frame")) {
    frameElements.push(element);
  }

  // Track which titles we've seen and on which elements
  const titleMap = new Map<string, Element[]>();

  for (const el of frameElements) {
    const title = el.getAttribute("title");

    // Skip elements without titles or with empty titles
    if (!title || title.trim() === "") continue;

    const normalizedTitle = title.trim();

    // Track elements by title
    if (!titleMap.has(normalizedTitle)) {
      titleMap.set(normalizedTitle, []);
    }
    titleMap.get(normalizedTitle)!.push(el);
  }

  // Check for duplicate titles
  for (const [, elements] of titleMap.entries()) {
    if (elements.length > 1) {
      // Report error for each element with the duplicate title
      for (const el of elements) {
        errors.push({
          id,
          element: el,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
