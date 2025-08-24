import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "duplicate-id";
const text = "ID attribute values must be unique";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (el: Element): AccessibilityError[] {
  const element = el.ownerDocument;
  const selector = "[id]";
  const errors = [];
  const elements = querySelectorAll(selector, element);
  if (el.matches(selector)) {
    elements.push(el as HTMLElement);
  }
  const idMap = new Map<string, Element[]>();

  for (const element of elements) {
    const idValue = element.getAttribute("id");

    if (!idValue) continue; //skip if id is null

    if (!idMap.has(idValue)) {
      idMap.set(idValue, [element as HTMLElement]);
    } else {
      idMap.get(idValue)?.push(element as HTMLElement);
    }
  }

  for (const [_, elements] of idMap) {
    if (elements.length > 1) {
      errors.push({
        text,
        url,
        element: elements,
      });
    }
  }
  // TODO: Need to fix this
  // return errors;
}
