import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "list";
const text = "Ensures that lists are structured correctly";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/list?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Check semantic HTML lists (ul, ol)
  const semanticLists = querySelectorAll("ul, ol", element);
  if (element.matches("ul, ol")) {
    semanticLists.push(element as HTMLUListElement | HTMLOListElement);
  }

  for (const list of semanticLists) {
    // Check that ul/ol only contain li, script, or template as direct children
    for (const child of list.children) {
      if (!["LI", "SCRIPT", "TEMPLATE"].includes(child.tagName)) {
        errors.push({
          id,
          element: child,
          text,
          url,
        });
      }
    }
  }

  // Check ARIA lists (role="list")
  const ariaLists = querySelectorAll('[role="list"]', element);
  if (element.getAttribute("role") === "list") {
    ariaLists.push(element);
  }

  for (const list of ariaLists) {
    // For ARIA lists, check if they contain listitem children or use aria-owns
    const hasAriaOwns = list.hasAttribute("aria-owns");
    const directListItems = [...list.children].filter(
      (child) => child.getAttribute("role") === "listitem",
    );
    const nestedListItems = querySelectorAll('[role="listitem"]', list);

    // If no aria-owns and no listitem children, it's an error
    if (
      !hasAriaOwns &&
      directListItems.length === 0 &&
      nestedListItems.length === 0
    ) {
      errors.push({
        id,
        element: list,
        text,
        url,
      });
    }
  }

  return errors;
}
