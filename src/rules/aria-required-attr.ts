import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

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
  | "seperator"
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
  // If focusable
  seperator: ["aria-valuenow"],
  slider: ["aria-valuenow"],
  switch: ["aria-checked"],
};

const id = "aria-required-attr";
const text = "Required ARIA attributes must be provided";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export function ariaRequiredAttr(element: Element): AccessibilityError[] {
  const errors = [];

  const selector = Object.entries(roleToRequiredStatesAndPropertiesMaps)
    .map(([role, attributes]) => {
      return `[role=${role}]:not(${attributes.map((attribute) => `[${attribute}]`).join("")})`;
    })
    .join(",");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

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
