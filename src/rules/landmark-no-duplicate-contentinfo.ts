import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-no-duplicate-contentinfo";
const text = "Document should have at most one contentinfo landmark";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const sectioningElements = new Set([
  "article",
  "aside",
  "main",
  "nav",
  "section",
]);

function isContentinfoLandmark(el: Element): boolean {
  if (el.getAttribute("role") === "contentinfo") return true;
  if (el.tagName.toLowerCase() === "footer") {
    let parent = el.parentElement;
    while (parent) {
      if (sectioningElements.has(parent.tagName.toLowerCase())) return false;
      parent = parent.parentElement;
    }
    return true;
  }
  return false;
}

export default function landmarkNoDuplicateContentinfo(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "footer, [role='contentinfo']";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  const contentinfos = elements.filter((el) => isContentinfoLandmark(el));

  if (contentinfos.length > 1) {
    for (let i = 1; i < contentinfos.length; i++) {
      errors.push({ id, element: contentinfos[i], text, url });
    }
  }
  return errors;
}
