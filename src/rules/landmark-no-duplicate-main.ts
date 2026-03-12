import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-no-duplicate-main";
const text = "Document should have at most one main landmark";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function landmarkNoDuplicateMain(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const mains = querySelectorAll("main, [role='main']", element);
  if (element.matches("main, [role='main']")) mains.push(element);

  if (mains.length > 1) {
    // Flag all duplicate main landmarks (the second and beyond)
    for (let i = 1; i < mains.length; i++) {
      errors.push({ id, element: mains[i], text, url });
    }
  }
  return errors;
}
