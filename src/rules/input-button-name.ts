import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "input-button-name";
const text = "Input buttons must have discernible text";
const url = "https://dequeuniversity.com/rules/axe/4.4/input-button-name";

export default function (element: Element): AccessibilityError[] {
  const selector =
    'input[type="button"],input[type="submit"],input[type="reset"]';
  const errors = [];
  const elements = querySelectorAll(selector, element) as HTMLButtonElement[];
  if (element.matches(selector)) {
    elements.push(element as HTMLButtonElement);
  }
  for (const element of elements) {
    if (element.hasAttribute("value")) {
      if (element.value.trim() === "") {
        errors.push({
          id,
          element,
          text,
          url,
        });
        continue;
      } else if (element.value === element.value.trim()) {
        continue;
      }
    }
    if (element.type === "submit" || element.type === "reset") continue;
    const label = element.getAttribute("aria-label");
    if (label && label.trim() !== "") continue;
    if (labelledByIsValid(element)) continue;
    if (element.title) continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
