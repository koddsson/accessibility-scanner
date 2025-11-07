import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "duplicate-id";
const text = "IDs must be unique";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const selector = "[id]";
  const errors = [];
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element as HTMLElement);
  }

  // Track which IDs we've seen and which elements have them
  const idMap = new Map<string, Element[]>();

  for (const el of elements) {
    const idValue = el.getAttribute("id");
    // Skip empty id attributes
    if (!idValue || idValue.trim() === "") continue;

    if (!idMap.has(idValue)) {
      idMap.set(idValue, []);
    }
    idMap.get(idValue)!.push(el);
  }

  // Report errors for duplicate IDs
  for (const [, elementList] of idMap.entries()) {
    if (elementList.length > 1) {
      // All elements with the duplicate ID should be reported as errors
      for (const element of elementList) {
        errors.push({
          id,
          element,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
