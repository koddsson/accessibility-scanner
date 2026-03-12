import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "skip-link";
const text = "Skip links must have a focusable target";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = 'a[href^="#"]';
  const elements = querySelectorAll<HTMLAnchorElement>(selector, element);
  if (element.matches(selector)) elements.push(element as HTMLAnchorElement);

  for (const el of elements) {
    const href = el.getAttribute("href");
    if (!href || href === "#") continue;

    const targetId = href.slice(1);
    const target = element.ownerDocument.querySelector(
      `#${CSS.escape(targetId)}`,
    );

    if (!target) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
