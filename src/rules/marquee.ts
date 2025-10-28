import { AccessibilityError } from "../scanner";

const text = "<marquee> elements are not used";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/marquee?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [...element.querySelectorAll<HTMLElement>("marquee")];
  if (element.matches("marquee")) {
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
