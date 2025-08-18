import { AccessibilityError } from "../scanner";
import ariaAttributes from "../utils/aria-attrs";
import type { Info } from "../utils/aria-attrs";

const id = "aria-valid-attr-value";
export const text = "ARIA attributes must conform to valid values";
export const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

function valid(element: Element, attribute: string, info: Info) {
  // Special case `aria-errormessage`.
  if (
    attribute === "aria-errormessage" &&
    (!element.hasAttribute("aria-invalid") ||
      element.getAttribute("aria-invalid") === "false")
  ) {
    return true;
  }

  if (attribute === "aria-describedby" || attribute === "aria-labelledby") {
    return true;
  }

  const value = element.getAttribute(attribute)!;
  if (info.type === "boolean" && (value === "true" || value === "false")) {
    return true;
  } else if (info.type === "idref") {
    if (info.allowEmpty && value === "") return true;
    const referencedValue = document.querySelector<HTMLElement>(`#${value}`);
    if (element.id === "pass169")
      console.log(
        element.id,
        value,
        referencedValue,
        document.querySelectorAll("div"),
      );
    if (!referencedValue) return false;
    if (
      referencedValue.hasAttribute("hidden") ||
      referencedValue.getAttribute("aria-hidden") === "true" ||
      referencedValue.style.visibility === "hidden"
    )
      return false;
    if (referencedValue.textContent?.trim() === "") return false;
    return true;
  } else if (info.type === "idrefs") {
    if (info.allowEmpty && value === "") return true;
    const ids = value.trim().split(" ");
    const selector = ids.map((x) => `#${x}`).join(",");
    const references = document.querySelectorAll<HTMLElement>(selector);
    if (references.length === 0) return false;
    //if (referencedValue.hasAttribute('hidden') || referencedValue.hasAttribute('aria-hidden')) return false
    //if (referencedValue.textContent?.trim() === '') return false
    return true;
  } else if (
    info.type === "nmtoken" &&
    (info.values?.includes(value) || (info.allowEmpty && value.trim() === ""))
  ) {
    if (info.allowEmpty && value === "") return true;
    if (!info.values?.includes(value)) {
      return false;
    }
    return true;
  } else if (info.type === "nmtokens") {
    if (!info.values?.includes(value)) {
      return false;
    }
    return true;
  } else if (info.type === "decimal" && !isNaN(Number.parseFloat(value))) {
    return true;
  } else if (info.type === "int" && !isNaN(Number.parseInt(value))) {
    if (info.minValue != undefined) {
      return info.minValue <= Number.parseInt(value);
    }
    return true;
  } else if (
    info.type === "string" &&
    (value.trim() !== "" || info.allowEmpty)
  ) {
    return true;
  }
  return false;
}

export function ariaValidAttrValue(element: Element): AccessibilityError[] {
  const errors = [];
  const selector = Object.keys(ariaAttributes)
    .map((attributeName) => `[${attributeName}]`)
    .join(",");
  const elements = [...element.querySelectorAll<HTMLElement>(selector)];
  if (element.matches(selector)) {
    elements.push(element as HTMLElement);
  }

  for (const element of elements) {
    for (const attribute of element.attributes) {
      const info = ariaAttributes[attribute.name];
      if (!info) continue;

      if (!valid(element, attribute.name, info)) {
        errors.push({ element, text, url });
      }
    }
  }
  return errors;
}
