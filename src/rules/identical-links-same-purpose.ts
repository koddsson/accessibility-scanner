import { AccessibilityError } from "../scanner";
import { getAccessibleName, hasLinkRole, querySelectorAll } from "../utils";

const id = "identical-links-same-purpose";
const text =
  "Links with the same accessible name should have a similar purpose";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const selector = 'a[href], area[href], [role="link"]';

// Resolve the link target so that relative and absolute forms of the same
// URL compare equal. A missing href (role="link" on a non-anchor) is unknown.
function resolveTarget(link: Element): string | null {
  const href = link.getAttribute("href")?.trim();
  if (href === undefined) return null;
  try {
    const resolved = new URL(href, link.baseURI);
    resolved.pathname = resolved.pathname
      .replace(/\/(?:index|default)\.[a-z]+$/i, "/")
      .replace(/\/+$/, "");
    return resolved.href;
  } catch {
    return href;
  }
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const candidates = querySelectorAll(selector, element);
  if (element.matches(selector)) candidates.push(element);

  const linksByName = new Map<
    string,
    Array<{ el: Element; target: string | null }>
  >();
  for (const el of candidates) {
    if (!hasLinkRole(el)) continue;
    const name = getAccessibleName(el).toLowerCase();
    if (!name) continue;
    const group = linksByName.get(name) ?? [];
    group.push({ el, target: resolveTarget(el) });
    linksByName.set(name, group);
  }

  for (const links of linksByName.values()) {
    if (links.length < 2) continue;
    const first = links[0].target;
    for (const link of links.slice(1)) {
      if (first !== null && link.target === first) continue;
      errors.push({ id, element: link.el, text, url, needsReview: true });
    }
  }
  return errors;
}
