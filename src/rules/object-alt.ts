import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "object-alt";
const text = "<object> elements must have alternative text";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/object-alt?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("object", element) as HTMLObjectElement[];
  if (element.matches("object")) {
    elements.push(element as HTMLObjectElement);
  }
  for (const element of elements) {
    // Check if element has title attribute with non-empty value
    if (element.title && element.title.trim() !== "") continue;

    // Check if element has aria-label with non-empty value
    const label = element.getAttribute("aria-label");
    if (label && label.trim() !== "") continue;

    // Check if element has valid aria-labelledby
    if (labelledByIsValid(element)) continue;

    // Check if element has role="presentation" or role="none"
    const role = element.getAttribute("role");
    if (role === "presentation" || role === "none") continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
