import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "error-message";
const text =
  "Ensures that error messages are programmatically associated with form fields";
const url = "https://act-rules.github.io/rules/36b590";

/**
 * Form field selector — covers native form controls and ARIA widget roles
 * that accept user input.
 */
const formFieldSelector = [
  "input:not([type='button']):not([type='submit']):not([type='reset']):not([type='hidden']):not([type='image'])",
  "select",
  "textarea",
  "[role='textbox']",
  "[role='combobox']",
  "[role='listbox']",
  "[role='spinbutton']",
  "[role='searchbox']",
  "[role='slider']",
  "[role='switch']",
  "[role='checkbox']",
  "[role='radio']",
  "[role='menuitemcheckbox']",
  "[role='menuitemradio']",
].join(", ");

/**
 * Elements that are structural parts of a form (not error message candidates).
 */
const structuralSelector =
  "input, select, textarea, button, label, legend, fieldset";

/**
 * ARIA widget roles that are clearly not error message containers.
 * Elements with these roles should be excluded from candidate error elements.
 */
const widgetRoles = new Set([
  "tab",
  "tabpanel",
  "tablist",
  "menu",
  "menubar",
  "menuitem",
  "toolbar",
  "dialog",
  "alertdialog",
  "tree",
  "treeitem",
  "treegrid",
  "grid",
  "row",
  "rowgroup",
  "separator",
  "scrollbar",
  "navigation",
  "banner",
  "contentinfo",
  "complementary",
  "search",
]);

/**
 * Check whether an element is hidden via an inline `display:none` style.
 * In a DOMParser context there is no computed style, so we fall back to
 * inspecting the `style` attribute string.
 */
function isDisplayNone(el: Element): boolean {
  const style = el.getAttribute("style") || "";
  return /display\s*:\s*none/i.test(style);
}

/**
 * Collect all `aria-describedby` and `aria-errormessage` id references from
 * every element inside a container.
 */
function collectReferencedIds(container: Element): Set<string> {
  const ids = new Set<string>();
  const allElements = querySelectorAll("*", container);
  allElements.push(container);
  for (const el of allElements) {
    for (const attr of ["aria-describedby", "aria-errormessage"]) {
      const value = el.getAttribute(attr);
      if (value) {
        for (const token of value.split(/\s+/)) {
          if (token) ids.add(token);
        }
      }
    }
  }
  return ids;
}

/**
 * Find candidate error-message elements inside a form.  A candidate is an
 * element that:
 *  - has an `id` attribute (so it *could* be referenced)
 *  - is not a structural form element (input, label, legend, …)
 *  - has non-empty text content
 */
function findCandidateErrorElements(form: Element): Element[] {
  const candidates: Element[] = [];
  const allWithId = querySelectorAll("[id]", form);
  for (const el of allWithId) {
    // Skip structural form elements
    if (el.matches(structuralSelector)) continue;
    // Skip elements with ARIA widget/landmark roles
    const role = el.getAttribute("role");
    if (role && widgetRoles.has(role)) continue;
    // Must have text content
    if (!el.textContent?.trim()) continue;
    candidates.push(el);
  }
  return candidates;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all forms that contain at least one form field.
  const formSelector = "form";
  const forms = querySelectorAll(formSelector, element);
  if (element.matches(formSelector)) {
    forms.push(element);
  }

  for (const form of forms) {
    // The form must contain at least one form field for the rule to apply.
    const fields = querySelectorAll(formFieldSelector, form);
    if (fields.length === 0) continue;

    const referencedIds = collectReferencedIds(form);
    const candidates = findCandidateErrorElements(form);

    for (const candidate of candidates) {
      const candidateId = candidate.getAttribute("id") || "";
      const isReferenced = referencedIds.has(candidateId);
      const hidden = isDisplayNone(candidate);
      const ariaHidden = candidate.getAttribute("aria-hidden") === "true";

      if (isReferenced && hidden) {
        // Referenced but hidden via display:none — not perceivable.
        errors.push({ id, element: candidate, text, url });
        continue;
      }

      if (!hidden && ariaHidden) {
        // Visible on screen but excluded from the accessibility tree.
        errors.push({ id, element: candidate, text, url });
        continue;
      }

      if (!hidden && !ariaHidden && !isReferenced) {
        // Visible, in the a11y tree, but not associated with any control.
        errors.push({ id, element: candidate, text, url });
        continue;
      }
    }
  }

  return errors;
}
