import { AccessibilityError } from "../scanner.js";
import { querySelectorAll } from "../utils.js";

// TODO: This list is incomplete!
type Role =
  | "checkbox"
  | "combobox"
  | "heading"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "meter"
  | "radio"
  | "scrollbar"
  | "slider"
  | "switch";

// TODO: This list is incomplete!
type AriaAttribute =
  | "aria-checked"
  | "aria-expanded"
  | "aria-level"
  | "aria-checked"
  | "aria-valuenow"
  | "aria-controls";

/**
 * Required States and Properties:
 *
 * @see https://w3c.github.io/aria/#authorErrorDefaultValuesTable
 */
const roleToRequiredStatesAndPropertiesMaps: Record<Role, AriaAttribute[]> = {
  checkbox: ["aria-checked"],
  combobox: ["aria-expanded"],
  heading: ["aria-level"],
  menuitemcheckbox: ["aria-checked"],
  menuitemradio: ["aria-checked"],
  meter: ["aria-valuenow"],
  radio: ["aria-checked"],
  scrollbar: ["aria-controls", "aria-valuenow"],
  slider: ["aria-valuenow"],
  switch: ["aria-checked"],
};

const id = "aria-required-attr";
const text = "Required ARIA attributes must be provided";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const focusableSeparatorSelector =
  "[role=separator][tabindex]:not([aria-valuenow])";

export function ariaRequiredAttr(element: Element): AccessibilityError[] {
  const errors = [];

  const selector = Object.entries(roleToRequiredStatesAndPropertiesMaps)
    .map(([role, attributes]) => {
      return `[role=${role}]:not(${attributes.map((attribute) => `[${attribute}]`).join("")})`;
    })
    .join(",");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  const separators = querySelectorAll(focusableSeparatorSelector, element);
  if (element.matches(focusableSeparatorSelector)) separators.push(element);
  elements.push(...separators);

  for (const element of elements) {
    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}
