import { AccessibilityError } from "../scanner";
import {
  querySelectorAll,
  validAriaAttributes,
  validAriaAttributesWithRole,
} from "../utils";

const id = "aria-valid-attr";
const text = "ARIA attributes must conform to valid names";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

// TODO: Maybe use https://github.com/A11yance/aria-query for this?

export default function (element_: Element): AccessibilityError[] {
  const errors = [];
  const selector = "*";
  const elements = querySelectorAll(selector, element_);
  for (const element of [element_, ...elements]) {
    for (const attribute of element.attributes) {
      if (
        attribute.name === "aria-errormessage" &&
        validAriaAttributesWithRole["aria-errormessage"].includes(
          element.getAttribute("role") || "",
        )
      ) {
        continue;
      }
      if (
        attribute.name.startsWith("aria-") &&
        !validAriaAttributes.includes(attribute.name)
      ) {
        errors.push({
          element,
          text,
          url,
        });
      }
    }
  }
  return errors;
}
