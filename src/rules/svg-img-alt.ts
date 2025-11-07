import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "svg-img-alt";
const text =
  "Ensures <svg> elements with an img, graphics-document or graphics-symbol role have an accessible text";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll(
    "svg[role=img], svg[role=graphics-document], svg[role=graphics-symbol]",
    element,
  ) as SVGElement[];
  if (
    element.matches(
      "svg[role=img], svg[role=graphics-document], svg[role=graphics-symbol]",
    )
  ) {
    elements.push(element as SVGElement);
  }
  for (const element of elements) {
    const label = element.getAttribute("aria-label");
    if (label && label.trim() !== "") continue;
    if (labelledByIsValid(element)) continue;
    const title = element.getAttribute("title");
    if (title && title.trim() !== "") continue;

    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
