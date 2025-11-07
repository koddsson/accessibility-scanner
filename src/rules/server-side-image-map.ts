import { AccessibilityError } from "../scanner";

const id = "server-side-image-map";
const text = "Ensures that server-side image maps are not used";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const elements = [
    ...element.querySelectorAll<HTMLImageElement>("img[ismap]"),
  ];
  if (element.matches("img[ismap]")) {
    elements.push(element as HTMLImageElement);
  }
  for (const element of elements) {
    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
