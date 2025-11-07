import { AccessibilityError } from "../scanner";

const id = "accesskeys";
const text = "Ensures every accesskey attribute value is unique";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/accesskeys?application=RuleDescription";

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const elements = [...element.querySelectorAll("[accesskey]")];
  if (element.hasAttribute("accesskey")) {
    elements.push(element as HTMLElement);
  }

  // Track accesskey values and their elements
  const accesskeyMap = new Map<string, Element[]>();

  for (const el of elements) {
    const accesskey = el.getAttribute("accesskey");
    if (accesskey && accesskey.trim() !== "") {
      const normalizedKey = accesskey.trim();
      if (!accesskeyMap.has(normalizedKey)) {
        accesskeyMap.set(normalizedKey, []);
      }
      const elementList = accesskeyMap.get(normalizedKey);
      if (elementList) {
        elementList.push(el);
      }
    }
  }

  // Report errors for duplicate accesskeys
  for (const elementsWithKey of accesskeyMap.values()) {
    if (elementsWithKey.length > 1) {
      for (const el of elementsWithKey) {
        errors.push({
          id,
          element: el,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
