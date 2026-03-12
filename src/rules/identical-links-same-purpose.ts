import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "identical-links-same-purpose";
const text =
  "Links with the same accessible name should have a similar purpose";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

function getAccessibleName(el: Element): string {
  const ariaLabel = el.getAttribute("aria-label");
  if (ariaLabel) return ariaLabel.trim().toLowerCase();
  return (el.textContent || "").trim().toLowerCase();
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "a[href]";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  // Group links by accessible name
  const linksByName = new Map<string, Array<{ el: Element; href: string }>>();

  for (const el of elements) {
    const name = getAccessibleName(el);
    if (!name) continue;

    const href = el.getAttribute("href") || "";
    if (!linksByName.has(name)) {
      linksByName.set(name, []);
    }
    linksByName.get(name)!.push({ el, href });
  }

  // Check each group - if same name but different hrefs, flag
  for (const [, links] of linksByName) {
    if (links.length < 2) continue;

    const firstHref = links[0].href;
    for (let i = 1; i < links.length; i++) {
      if (links[i].href !== firstHref) {
        errors.push({ id, element: links[i].el, text, url });
      }
    }
  }
  return errors;
}
