import { AccessibilityError } from "../scanner";

const id = "meta-refresh-no-exceptions";
const text = "Delayed refresh under 20 hours must not be used";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = 'meta[http-equiv="refresh"]';
  const elements = [...element.querySelectorAll<HTMLMetaElement>(selector)];
  if (element.matches(selector)) elements.push(element as HTMLMetaElement);

  for (const el of elements) {
    const content = el.getAttribute("content");
    if (!content) continue;

    const delay = parseInt(content.split(/[,;]/)[0], 10);
    if (isNaN(delay)) continue;

    // Any non-zero delay is a violation for AAA
    if (delay > 0) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
