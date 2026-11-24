import { AccessibilityError } from "../scanner.js";
import { querySelectorAll } from "../utils.js";

/**
 * Required States and Properties:
 *
 * @see https://w3c.github.io/aria/#authorErrorDefaultValuesTable
 */
const requiredAttributesByRole: Record<string, string[]> = {
  checkbox: ["aria-checked"],
  combobox: ["aria-expanded", "aria-controls"],
  heading: ["aria-level"],
  menuitemcheckbox: ["aria-checked"],
  menuitemradio: ["aria-checked"],
  meter: ["aria-valuenow"],
  radio: ["aria-checked"],
  scrollbar: ["aria-controls", "aria-valuenow"],
  separator: ["aria-valuenow"],
  slider: ["aria-valuenow"],
  switch: ["aria-checked"],
};

const nativeEquivalents: Record<string, string> = {
  "aria-checked": "input[type=checkbox], input[type=radio]",
  "aria-level": "h1, h2, h3, h4, h5, h6",
  "aria-valuenow": "input[type=range], input[type=number]",
};

const id = "aria-required-attr";
const text = "Required ARIA attributes must be provided";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function getRequiredAttributes(element: Element): string[] {
  const role = element.getAttribute("role")?.trim().toLowerCase() ?? "";
  const required = requiredAttributesByRole[role] ?? [];
  if (role === "separator" && !element.hasAttribute("tabindex")) return [];
  if (
    role === "combobox" &&
    element.getAttribute("aria-expanded") === "false"
  ) {
    return required.filter((attribute) => attribute !== "aria-controls");
  }
  return required;
}

function isMissing(element: Element, attribute: string): boolean {
  const native = nativeEquivalents[attribute];
  if (native && element.matches(native)) return false;
  return !element.getAttribute(attribute)?.trim();
}

export function ariaRequiredAttr(element: Element): AccessibilityError[] {
  const errors = [];

  const elements = querySelectorAll("[role]", element);
  if (element.matches("[role]")) elements.push(element);

  for (const element of elements) {
    const missing = getRequiredAttributes(element).some((attribute) =>
      isMissing(element, attribute),
    );
    if (missing) {
      errors.push({
        id,
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
