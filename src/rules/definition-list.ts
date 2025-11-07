import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "definition-list";
const text = "Ensures <dl> elements are structured correctly";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all <dl> elements
  const definitionLists = querySelectorAll("dl", element);
  if (element.matches("dl")) {
    definitionLists.push(element as HTMLDListElement);
  }

  for (const dl of definitionLists) {
    // Check that dl only contains dt, dd, script, template, or div as direct children
    for (const child of dl.children) {
      if (!["DT", "DD", "SCRIPT", "TEMPLATE", "DIV"].includes(child.tagName)) {
        errors.push({
          id,
          element: child,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
