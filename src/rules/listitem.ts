import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "listitem";
const text = "Ensures <li> elements are used semantically";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

function hasValidListParent(element: Element): boolean {
  let parent = element.parentElement;

  while (parent) {
    // Check for semantic list parents (ul, ol)
    if (parent.matches("ul, ol")) {
      return true;
    }

    // Check for ARIA list parent (role="list")
    if (parent.getAttribute("role") === "list") {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all <li> elements
  const listItems = querySelectorAll("li", element);
  if (element.matches("li")) {
    listItems.push(element as HTMLLIElement);
  }

  for (const listItem of listItems) {
    if (!hasValidListParent(listItem)) {
      errors.push({
        id,
        element: listItem,
        text,
        url,
      });
    }
  }

  // Check elements with role="listitem"
  const ariaListItems = querySelectorAll('[role="listitem"]', element);
  if (element.getAttribute("role") === "listitem") {
    ariaListItems.push(element);
  }

  for (const listItem of ariaListItems) {
    if (!hasValidListParent(listItem)) {
      errors.push({
        id,
        element: listItem,
        text,
        url,
      });
    }
  }

  return errors;
}
