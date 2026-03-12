import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-complementary-is-top-level";
const text = "Aside should not be contained in another landmark";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const landmarkRoles = new Set([
  "banner",
  "navigation",
  "main",
  "contentinfo",
  "complementary",
  "region",
  "search",
  "form",
]);
const landmarkElements = new Set(["header", "nav", "main", "footer", "aside"]);

function isInsideOtherLandmark(el: Element): boolean {
  let parent = el.parentElement;
  while (parent) {
    const role = parent.getAttribute("role");
    if (role && landmarkRoles.has(role) && role !== "complementary")
      return true;
    const tag = parent.tagName.toLowerCase();
    if (landmarkElements.has(tag) && tag !== "aside") return true;
    parent = parent.parentElement;
  }
  return false;
}

export default function landmarkComplementaryIsTopLevel(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = 'aside, [role="complementary"]';
  const elements = [...querySelectorAll(selector, element)];
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    if (isInsideOtherLandmark(el)) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
