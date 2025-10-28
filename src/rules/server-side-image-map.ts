import { AccessibilityError } from "../scanner";

const text = "Ensures that server-side image maps are not used";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/server-side-image-map?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [
    ...element.querySelectorAll<HTMLImageElement>("img[ismap]"),
  ];
  if (element.matches("img[ismap]")) {
    elements.push(element as HTMLImageElement);
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
