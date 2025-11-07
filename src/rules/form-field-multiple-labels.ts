import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "form-field-multiple-labels";
const text = "Ensures form field does not have multiple label elements";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/form-field-multiple-labels?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = ["input", "select", "textarea"]
    .map((x) => `${x}[id]`)
    .join(", ");
  const elements = querySelectorAll(selector, element) as (
    | HTMLInputElement
    | HTMLSelectElement
    | HTMLTextAreaElement
  )[];

  if (element.matches(selector)) {
    elements.push(
      element as HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement,
    );
  }

  for (const element of elements) {
    if (element instanceof HTMLInputElement && element.type === "hidden") {
      continue;
    }

    const elementId = element.getAttribute("id");
    if (!elementId) continue;

    // Find all labels with for attribute pointing to this element
    const escapedId = CSS.escape(elementId);
    const labelsWithFor = querySelectorAll(
      `label[for="${escapedId}"]`,
      element.ownerDocument,
    ) as HTMLLabelElement[];

    // Check if element is nested in a label
    let hasParentLabel = false;
    let parentElement = element.parentElement;
    while (parentElement) {
      if (parentElement instanceof HTMLLabelElement) {
        hasParentLabel = true;
        break;
      }
      parentElement = parentElement.parentElement;
    }

    // Check if there are multiple labels
    const totalLabels = labelsWithFor.length + (hasParentLabel ? 1 : 0);

    if (totalLabels > 1) {
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
