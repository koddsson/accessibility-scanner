import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "label-content-name-mismatch";
const text =
  "Ensures that elements labelled through their content must have their visible text as part of their accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * Widget roles that support "name from content" per the ARIA specification.
 * The ACT rule 2ee8b8 only applies to elements whose semantic role is a
 * widget that supports naming from content.
 */
const widgetRolesWithNameFromContent = new Set([
  "button",
  "checkbox",
  "columnheader",
  "gridcell",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "rowheader",
  "switch",
  "tab",
  "treeitem",
]);

/**
 * Map from HTML element tag names to their implicit ARIA roles
 * (only for widget roles that name from content).
 */
function getImplicitRole(element: Element): string | null {
  const tag = element.tagName.toLowerCase();
  if (tag === "a" && element.hasAttribute("href")) return "link";
  if (tag === "button") return "button";
  if (tag === "summary") return "button";
  if (tag === "option") return "option";
  if (tag === "th") {
    // th can be columnheader or rowheader depending on scope
    const scope = element.getAttribute("scope");
    if (scope === "row") return "rowheader";
    return "columnheader";
  }
  if (tag === "td") return "gridcell";
  return null;
}

/**
 * Get the effective role of an element.
 */
function getEffectiveRole(element: Element): string | null {
  const explicitRole = element.getAttribute("role")?.trim().split(/\s+/)[0];
  if (explicitRole) return explicitRole;
  return getImplicitRole(element);
}

/**
 * Get the visible text content of an element, considering only direct
 * text node descendants (not alt text of images, etc.).
 */
function getVisibleText(element: Element): string {
  let text = "";
  for (const node of element.childNodes) {
    if (node.nodeType === Node.TEXT_NODE) {
      text += node.textContent || "";
    } else if (node.nodeType === Node.ELEMENT_NODE) {
      const child = node as Element;
      // Skip hidden elements
      if (child.getAttribute("aria-hidden") === "true") continue;
      // Skip img elements (their alt text is not "visible text")
      if (child.tagName.toLowerCase() === "img") continue;
      // Recurse into child elements for their text nodes
      text += getVisibleText(child);
    }
  }
  // Normalize whitespace
  return text.trim().replaceAll(/\s+/g, " ");
}

/**
 * Check if the visible text is a single character, which the ACT rule
 * considers potentially symbolic/iconic and therefore excluded.
 */
function isSingleCharacter(text: string): boolean {
  // After normalization, check if it's a single unicode character
  const chars = [...text];
  return chars.length === 1;
}

/**
 * Get the accessible name of an element (from aria-label or aria-labelledby)
 */
function getAccessibleName(element: Element): string | null {
  // Check aria-labelledby first (takes precedence over aria-label)
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const texts: string[] = [];
    for (const refId of ids) {
      const escapedId = CSS.escape(refId);
      const labelElement = element.ownerDocument.querySelector(`#${escapedId}`);
      if (labelElement) {
        const labelText = labelElement.textContent?.trim() || "";
        if (labelText) {
          texts.push(labelText);
        }
      }
    }
    if (texts.length > 0) {
      return texts.join(" ").replaceAll(/\s+/g, " ");
    }
  }

  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel.trim().replaceAll(/\s+/g, " ");
  }

  return null;
}

/**
 * Check if the visible text is a substring of the accessible name (case-insensitive)
 */
function isTextPartOfAccessibleName(
  visibleText: string,
  accessibleName: string,
): boolean {
  if (!visibleText || !accessibleName) return true;

  const normalizedVisible = visibleText.toLowerCase();
  const normalizedAccessible = accessibleName.toLowerCase();

  return normalizedAccessible.includes(normalizedVisible);
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Select elements that could have this issue — interactive widgets
  // that support name from content
  const selector = [
    "a[href]",
    "button",
    "summary",
    "option",
    "th",
    "[role]",
  ].join(", ");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    // Skip if element is hidden
    if (el.getAttribute("aria-hidden") === "true") continue;

    // Check that the element has a widget role that names from content
    const role = getEffectiveRole(el);
    if (!role || !widgetRolesWithNameFromContent.has(role)) continue;

    const visibleText = getVisibleText(el);
    const accessibleName = getAccessibleName(el);

    // Only check if:
    // 1. Element has visible text content
    // 2. Element has an accessible name from aria-label or aria-labelledby
    if (!visibleText || !accessibleName) continue;

    // Skip single-character visible text (treated as potentially symbolic)
    if (isSingleCharacter(visibleText)) continue;

    // Check if visible text is part of accessible name
    if (!isTextPartOfAccessibleName(visibleText, accessibleName)) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
