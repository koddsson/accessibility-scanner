import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "empty-heading";
const text = "Headings must have discernible text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

// Walk a subtree producing a heading's "name from content" per the
// accessible name computation: text nodes contribute their text, descendant
// imgs contribute their `alt`, `aria-hidden="true"` subtrees are skipped,
// and `role="presentation"`/`role="none"` elements contribute their content
// but no element-specific name (e.g. an img's alt is dropped).
function nameFromContent(el: Element): string {
  let name = "";
  for (const child of el.childNodes) {
    if (child.nodeType === Node.TEXT_NODE) {
      name += child.textContent ?? "";
      continue;
    }
    if (child.nodeType !== Node.ELEMENT_NODE) continue;
    const childEl = child as Element;
    if (childEl.getAttribute("aria-hidden") === "true") continue;

    const role = childEl.getAttribute("role");
    const isPresentational = role === "presentation" || role === "none";

    if (childEl.tagName === "IMG" && !isPresentational) {
      name += childEl.getAttribute("alt") ?? "";
      continue;
    }

    name += nameFromContent(childEl);
  }
  return name;
}

function hasAccessibleHeadingName(el: Element): boolean {
  if (el.hasAttribute("aria-labelledby")) {
    return labelledByIsValid(el);
  }
  if (el.hasAttribute("aria-label")) {
    return el.getAttribute("aria-label")!.trim() !== "";
  }
  if (nameFromContent(el).trim() !== "") return true;
  const title = el.getAttribute("title");
  return title !== null && title.trim() !== "";
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "h1, h2, h3, h4, h5, h6, [role='heading']";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }
  for (const el of elements) {
    if (!hasAccessibleHeadingName(el)) {
      errors.push({ id, element: el, text, url });
    }
  }
  return errors;
}
