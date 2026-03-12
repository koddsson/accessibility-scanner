import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "region";
const text = "All page content should be contained by landmarks";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const landmarkSelector = [
  '[role="banner"]',
  '[role="main"]',
  '[role="navigation"]',
  '[role="contentinfo"]',
  '[role="complementary"]',
  '[role="search"]',
  '[role="form"]',
  '[role="region"]',
  "header",
  "footer",
  "main",
  "nav",
  "aside",
  "section[aria-label]",
  "section[aria-labelledby]",
  "form[aria-label]",
  "form[aria-labelledby]",
].join(", ");

const exemptTags = new Set([
  "script",
  "style",
  "link",
  "meta",
  "noscript",
  "template",
  "svg",
  "head",
  "title",
  "base",
  "html",
  "body",
]);

function isElementHidden(el: Element): boolean {
  if (el.getAttribute("aria-hidden") === "true") return true;
  if (el instanceof HTMLElement) {
    if (el.style.display === "none") return true;
    if (el.style.visibility === "hidden") return true;
    if (el.hidden) return true;
  }
  return false;
}

function isHidden(el: Element): boolean {
  let current: Element | null = el;
  while (current) {
    if (isElementHidden(current)) return true;
    current = current.parentElement;
  }
  return false;
}

function isInsideLandmark(el: Element): boolean {
  let current = el.parentElement;
  while (current) {
    if (current.matches && current.matches(landmarkSelector)) return true;
    current = current.parentElement;
  }
  return false;
}

function hasVisibleContent(el: Element): boolean {
  // Check if element itself is a content element
  const tag = el.tagName.toLowerCase();

  // Form controls and images are content elements
  if (
    el instanceof HTMLInputElement ||
    el instanceof HTMLSelectElement ||
    el instanceof HTMLTextAreaElement ||
    el instanceof HTMLButtonElement ||
    tag === "img" ||
    tag === "video" ||
    tag === "audio" ||
    tag === "canvas" ||
    tag === "object" ||
    tag === "embed"
  ) {
    return true;
  }

  // Check for direct text content (not from children)
  for (const node of el.childNodes) {
    if (node.nodeType === Node.TEXT_NODE && node.textContent?.trim()) {
      return true;
    }
  }

  return false;
}

export default function region(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const allElements = querySelectorAll("*", element);

  for (const el of allElements) {
    const tag = el.tagName.toLowerCase();

    // Skip exempt elements
    if (exemptTags.has(tag)) continue;

    // Skip hidden elements
    if (isHidden(el)) continue;

    // Skip landmark elements themselves
    if (el.matches && el.matches(landmarkSelector)) continue;

    // Only check elements with visible content
    if (!hasVisibleContent(el)) continue;

    // Check if element is inside a landmark
    if (!isInsideLandmark(el)) {
      errors.push({ id, element: el, text, url });
    }
  }

  return errors;
}
