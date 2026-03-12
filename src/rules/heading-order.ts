import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "heading-order";
const text = "Heading levels should only increase by one";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function getHeadingLevel(el: Element): number {
  const role = el.getAttribute("role");
  if (role === "heading") {
    const level = parseInt(el.getAttribute("aria-level") || "2", 10);
    return level;
  }
  const match = el.tagName.match(/^h([1-6])$/i);
  return match ? parseInt(match[1], 10) : 0;
}

export default function headingOrder(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "h1, h2, h3, h4, h5, h6, [role='heading']";
  const headings = querySelectorAll(selector, element);
  if (element.matches(selector)) headings.unshift(element);

  let lastLevel = 0;
  for (const heading of headings) {
    const level = getHeadingLevel(heading);
    if (level === 0) continue;
    if (lastLevel > 0 && level > lastLevel + 1) {
      errors.push({ id, element: heading, text, url });
    }
    lastLevel = level;
  }
  return errors;
}
