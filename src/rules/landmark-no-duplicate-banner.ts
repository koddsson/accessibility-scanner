import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-no-duplicate-banner";
const text = "Document should have at most one banner landmark";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const sectioningElements = new Set([
  "article",
  "aside",
  "main",
  "nav",
  "section",
]);

function isBannerLandmark(el: Element): boolean {
  if (el.getAttribute("role") === "banner") return true;
  if (el.tagName.toLowerCase() === "header") {
    // header is only a banner landmark if not inside a sectioning element
    let parent = el.parentElement;
    while (parent) {
      if (sectioningElements.has(parent.tagName.toLowerCase())) return false;
      parent = parent.parentElement;
    }
    return true;
  }
  return false;
}

export default function landmarkNoDuplicateBanner(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "header, [role='banner']";
  const elements = [...querySelectorAll(selector, element)];
  if (element.matches && element.matches(selector)) elements.push(element);

  const banners = elements.filter((el) => isBannerLandmark(el));

  if (banners.length > 1) {
    for (let i = 1; i < banners.length; i++) {
      errors.push({ id, element: banners[i], text, url });
    }
  }
  return errors;
}
