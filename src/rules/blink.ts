import { AccessibilityError } from "../scanner";

const text = "Ensure <blink> elements are not used";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/blink?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [...element.querySelectorAll("blink")];
  if (element.matches("blink")) {
    elements.push(element as HTMLElement);
  }
  for (const element of elements) {
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
