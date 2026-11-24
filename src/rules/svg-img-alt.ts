import { AccessibilityError } from "../scanner.js";
import { querySelectorAll, labelledByIsValid } from "../utils.js";

const id = "svg-img-alt";
const text =
  "Ensures <svg> elements with an img, graphics-document or graphics-symbol role have an accessible text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const roleSelector =
  ":is([role=img], [role=graphics-document], [role=graphics-symbol])";
const selector = `svg${roleSelector}, svg ${roleSelector}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll(selector, element) as SVGElement[];
  if (element.matches(selector)) {
    elements.push(element as SVGElement);
  }
  for (const element of elements) {
    const titleElement = [...element.children].find(
      (child) => child.localName === "title",
    );
    if (titleElement?.textContent?.trim()) continue;

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
