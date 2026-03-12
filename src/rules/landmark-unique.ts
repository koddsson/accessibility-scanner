import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "landmark-unique";
const text =
  "Landmarks must have a unique role or role/label/title combination";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const landmarkSelectors =
  'header, footer, nav, main, aside, [role="banner"], [role="contentinfo"], [role="navigation"], [role="main"], [role="complementary"], [role="region"], [role="search"], [role="form"]';

function getLandmarkRole(el: Element): string {
  const role = el.getAttribute("role");
  if (role) return role;
  const tag = el.tagName.toLowerCase();
  const roleMap: Record<string, string> = {
    header: "banner",
    footer: "contentinfo",
    nav: "navigation",
    main: "main",
    aside: "complementary",
  };
  return roleMap[tag] || tag;
}

function getAccessibleName(el: Element): string {
  return (
    el.getAttribute("aria-label") ||
    el.getAttribute("aria-labelledby") ||
    el.getAttribute("title") ||
    ""
  )
    .trim()
    .toLowerCase();
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const elements = querySelectorAll(landmarkSelectors, element);
  if (element.matches && element.matches(landmarkSelectors)) {
    elements.push(element);
  }

  const seen = new Map<string, Element>();

  for (const el of elements) {
    const role = getLandmarkRole(el);
    const name = getAccessibleName(el);
    const key = `${role}::${name}`;

    if (seen.has(key)) {
      errors.push({ id, element: el, text, url });
    } else {
      seen.set(key, el);
    }
  }
  return errors;
}
