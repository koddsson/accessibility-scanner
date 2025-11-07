import { AccessibilityError } from "../scanner";
import { querySelectorAll, hasAccessibleText } from "../utils";

const id = "bypass";
const text = "Page must have means to bypass repeated blocks";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

/**
 * Checks if the page has at least one mechanism to bypass navigation.
 * According to WCAG 2.4.1, acceptable bypass mechanisms include:
 * - Skip links (visible or hidden until focused)
 * - ARIA landmarks (main, navigation, etc.)
 * - Headings
 */
export default function (element: Element): AccessibilityError[] {
  // Only check at the document level
  const doc = element.ownerDocument;
  if (!doc || element !== doc.documentElement) {
    return [];
  }

  // Check for skip links - internal anchor links that are visible or become visible on focus
  // Get all links once for efficiency
  const allLinks = querySelectorAll<HTMLAnchorElement>(
    "a",
    doc.body || element,
  );
  const skipLinks = querySelectorAll<HTMLAnchorElement>(
    'a[href^="#"]',
    doc.body || element,
  );

  for (const link of skipLinks) {
    // A valid skip link should:
    // 1. Have an href that points to an element with that ID
    // 2. Have accessible text
    // 3. Be in the first part of the page (typically in header/nav or early in body)
    const href = link.getAttribute("href");
    if (!href || href === "#") continue;

    const targetId = href.slice(1);
    const target = doc.querySelector(`#${CSS.escape(targetId)}`);

    if (target && hasAccessibleText(link)) {
      // Check if this is early in the document (one of the first 3 links)
      const linkIndex = allLinks.indexOf(link);
      if (linkIndex < 3) {
        return []; // Valid skip link found
      }
    }
  }

  // Check for ARIA landmarks - specifically a main landmark
  const mainLandmarks = [
    ...querySelectorAll('[role="main"]', doc.body || element),
    ...querySelectorAll("main", doc.body || element),
  ];

  if (mainLandmarks.length > 0) {
    // A main landmark exists
    return [];
  }

  // Check for heading structure
  // Note: This checks for presence of multiple headings, not hierarchy.
  // Proper heading hierarchy (H1->H2->H3) is a separate concern covered by other rules.
  // For bypass purposes, having multiple headings allows users to navigate the page structure.
  const headings = querySelectorAll(
    "h1, h2, h3, h4, h5, h6",
    doc.body || element,
  );
  if (headings.length >= 2) {
    // Multiple headings provide a navigation structure
    return [];
  }

  // No bypass mechanism found
  return [
    {
      id,
      element: doc.documentElement,
      text,
      url,
    },
  ];
}
