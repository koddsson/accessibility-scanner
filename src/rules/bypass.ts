import { AccessibilityError } from "../scanner.js";
import { querySelectorAll, hasAccessibleText } from "../utils.js";

const id = "bypass";
const text = "Page must have means to bypass repeated blocks";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

const repeatedContentSelector =
  'nav, aside, [role="navigation"], [role="complementary"], [role="banner"], [role="contentinfo"]';
const sectioningSelector =
  'article, aside, main, nav, section, [role="main"], [role="article"]';

function isInRepeatedContent(element: Element): boolean {
  if (element.closest(repeatedContentSelector)) return true;
  const pageSection = element.closest("header, footer");
  return pageSection !== null && !pageSection.closest(sectioningSelector);
}

function isOffScreen(element: Element): boolean {
  const view = element.ownerDocument.defaultView;
  if (!view || !element.isConnected) return false;
  const rect = element.getBoundingClientRect();
  return rect.bottom + view.scrollY < 0 || rect.right + view.scrollX < 0;
}

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
  if (element.localName !== "html") return [];

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

    if (target && !isInRepeatedContent(target) && hasAccessibleText(link)) {
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
  // A heading allows screen reader users to navigate directly to content.
  // Both native heading elements and elements with role="heading" count,
  // but headings hidden from assistive technology (aria-hidden="true") do not.
  const headings = [
    ...querySelectorAll("h1, h2, h3, h4, h5, h6", doc.body || element),
    ...querySelectorAll('[role="heading"]', doc.body || element),
  ].filter(
    (h) =>
      h.getAttribute("aria-hidden") !== "true" &&
      !isInRepeatedContent(h) &&
      !isOffScreen(h),
  );
  if (headings.length > 0) {
    // At least one heading provides a navigation mechanism for assistive technology
    return [];
  }

  // No bypass mechanism found
  return [
    {
      id,
      element: doc.documentElement,
      text,
      url,
      needsReview: true,
    },
  ];
}
