import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "image-redundant-alt";
const text = "Alternative text of images should not be repeated as text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "img[alt]";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const alt = el.getAttribute("alt")?.trim().toLowerCase();
    if (!alt) continue;

    // Check parent element's text content (excluding the img's own alt)
    const parent = el.parentElement;
    if (!parent) continue;

    // Get text content of parent without the image
    const clone = parent.cloneNode(true) as Element;
    for (const img of clone.querySelectorAll("img")) {
      img.remove();
    }
    const parentText = clone.textContent?.trim().toLowerCase();

    if (parentText && parentText.includes(alt)) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
