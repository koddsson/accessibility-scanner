import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text = "Ensures <li> elements are used semantically";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/listitem?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all <li> elements
  const listItems = querySelectorAll("li", element);
  if (element.matches("li")) {
    listItems.push(element as HTMLLIElement);
  }

  for (const listItem of listItems) {
    // Check if the <li> has a proper parent
    let hasValidParent = false;
    let parent = listItem.parentElement;

    while (parent) {
      // Check for semantic list parents (ul, ol)
      if (parent.matches("ul, ol")) {
        hasValidParent = true;
        break;
      }

      // Check for ARIA list parent (role="list")
      if (parent.getAttribute("role") === "list") {
        hasValidParent = true;
        break;
      }

      parent = parent.parentElement;
    }

    if (!hasValidParent) {
      errors.push({
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
    // Check if the element with role="listitem" has a proper parent
    let hasValidParent = false;
    let parent = listItem.parentElement;

    while (parent) {
      // Check for semantic list parents (ul, ol)
      if (parent.matches("ul, ol")) {
        hasValidParent = true;
        break;
      }

      // Check for ARIA list parent (role="list")
      if (parent.getAttribute("role") === "list") {
        hasValidParent = true;
        break;
      }

      parent = parent.parentElement;
    }

    if (!hasValidParent) {
      errors.push({
        element: listItem,
        text,
        url,
      });
    }
  }

  return errors;
}
