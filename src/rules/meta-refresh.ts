import { AccessibilityError } from "../scanner";

const id = "meta-refresh";
const text = "Timed refresh must not exist";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/meta-refresh?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [...element.querySelectorAll<HTMLMetaElement>("meta")];
  if (element.matches("meta")) {
    elements.push(element as HTMLMetaElement);
  }
  for (const element of elements) {
    if (element.httpEquiv === "refresh") {
      errors.push({
        id,
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
