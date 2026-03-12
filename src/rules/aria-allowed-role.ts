import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "aria-allowed-role";
const text = "ARIA role should be appropriate for the element";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

// Elements that should not have any role attribute
const noRoleAllowed = new Set([
  "meta",
  "script",
  "style",
  "br",
  "col",
  "colgroup",
  "head",
  "html",
  "base",
  "title",
  "noscript",
]);

export default function (el: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "[role]";
  const elements = querySelectorAll(selector, el);
  if (el.matches(selector)) elements.push(el);

  for (const element of elements) {
    const role = element.getAttribute("role");
    if (!role) continue;

    const tag = element.tagName.toLowerCase();

    if (noRoleAllowed.has(tag)) {
      errors.push({ id, element, text, url });
    }
  }
  return errors;
}
