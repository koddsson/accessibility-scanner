import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "label-title-only";
const text = "Form elements should have a visible label";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector =
    "input:not([type='hidden']):not([type='image']):not([type='button']):not([type='submit']):not([type='reset']), select, textarea";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    // Skip if has aria-label or aria-labelledby
    if (el.getAttribute("aria-label")?.trim()) continue;
    if (el.getAttribute("aria-labelledby")?.trim()) continue;

    // Check for associated <label>
    const elId = el.getAttribute("id");
    const hasAssociatedLabel = elId
      ? !!element.ownerDocument.querySelector(`label[for="${elId}"]`)
      : false;
    const hasParentLabel = !!el.closest("label");
    if (hasAssociatedLabel || hasParentLabel) continue;

    // If we get here, the only labeling is title or aria-describedby
    const hasTitle = !!el.getAttribute("title")?.trim();
    const hasAriaDescribedby = !!el.getAttribute("aria-describedby")?.trim();

    if (hasTitle || hasAriaDescribedby) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
