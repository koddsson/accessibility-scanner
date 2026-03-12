import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "presentation-role-conflict";
const text =
  'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution';
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const conflictAttrs = ["aria-label", "aria-labelledby", "aria-describedby"];
const nativeFocusable = ["a[href]", "button", "input", "select", "textarea"];

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = '[role="none"], [role="presentation"]';
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const hasConflictAttr = conflictAttrs.some((attr) => el.hasAttribute(attr));
    const hasTabindex =
      el.hasAttribute("tabindex") && el.getAttribute("tabindex") !== "-1";
    const isFocusable = nativeFocusable.some((sel) => el.matches(sel));

    if (hasConflictAttr || hasTabindex || isFocusable) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
