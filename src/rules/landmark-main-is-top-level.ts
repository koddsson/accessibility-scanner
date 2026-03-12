import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-main-is-top-level";
const text = "Main landmark should be at top level";
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
    if (role && landmarkRoles.has(role) && role !== "main") return true;
    const tag = parent.tagName.toLowerCase();
    if (landmarkElements.has(tag) && tag !== "main") return true;
    parent = parent.parentElement;
  }
  return false;
}

export default function landmarkMainIsTopLevel(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = 'main, [role="main"]';
  const elements = [...querySelectorAll(selector, element)];
  if (element.matches && element.matches(selector)) elements.push(element);

  for (const el of elements) {
    if (isInsideOtherLandmark(el)) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
