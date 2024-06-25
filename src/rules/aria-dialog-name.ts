import { AccessibilityError } from "../scanner";
import { hasAccessibleText, querySelectorAll } from "../utils";

// Metadata
const id = "aria-dialog-name";
const text = "ARIA dialog and alertdialog must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

/**
 * Ensure that each element with role="dialog" or role="alertdialog" has one of the following characteristics:
 *
 * - Non-empty aria-label attribute.
 * - aria-labelledby pointing to element with text which is discernible to screen reader users.
 */
export function ariaDialogName(el: Element): AccessibilityError[] {
  const errors = [];
  const selector = "[role=dialog],[role=alertdialog]";
  const dialogs = querySelectorAll(selector, el);
  if (el.matches(selector)) dialogs.push(el);
  for (const dialog of dialogs) {
    if (!hasAccessibleText(dialog)) {
      errors.push({
        element: dialog,
        url,
        text,
      });
    }
  }
  return errors;
}
