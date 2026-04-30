import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "presentation-role-conflict";
const text =
  'Elements with role="none" or role="presentation" must not have conditions that trigger role conflict resolution';
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const conflictAttrs = ["aria-label", "aria-labelledby", "aria-describedby"];
const nativeFocusable = ["a[href]", "button", "input", "select", "textarea"];

// `<img alt="">` is implicitly marked as decorative per ACT 46ca7f: an empty
// alt removes the img from the accessibility tree the same way as
// role="presentation"/"none". Surfacing it via aria-label/labelledby/
// describedby (or making it focusable) creates the same exposure conflict.
const selector = '[role="none"], [role="presentation"], img[alt=""]';

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
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
