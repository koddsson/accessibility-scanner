import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "decorative-image";
const text = "Images excluded from the accessibility tree should be decorative";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * ACT Rule e88epe — Image not in the accessibility tree is decorative.
 *
 * Checks `<img>` elements that are removed from the accessibility tree
 * (via `role="presentation"`, `role="none"`, `aria-hidden="true"`, or
 * empty `alt=""`) for attributes that suggest the image conveys meaningful
 * content.  If such attributes are found the image is flagged because it
 * appears to be informative yet is hidden from assistive technology.
 */
export default function decorativeImage(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const imgs = querySelectorAll("img", element) as HTMLImageElement[];
  if (element.matches("img")) {
    imgs.push(element as HTMLImageElement);
  }

  for (const img of imgs) {
    const role = img.getAttribute("role");
    const ariaHidden = img.getAttribute("aria-hidden") === "true";
    const hasEmptyAlt = img.hasAttribute("alt") && img.alt === "";
    const isPresentational = role === "presentation" || role === "none";

    // Only consider images excluded from the accessibility tree
    const isExcluded = ariaHidden || isPresentational || hasEmptyAlt;
    if (!isExcluded) continue;

    // Check for attributes indicating meaningful content
    const alt = img.getAttribute("alt");
    const hasNonEmptyAlt = alt !== null && alt.trim() !== "";
    const ariaLabel = img.getAttribute("aria-label");
    const hasAriaLabel = ariaLabel !== null && ariaLabel.trim() !== "";
    const hasAriaLabelledby = labelledByIsValid(img);
    const hasTitle =
      img.getAttribute("title") !== null &&
      img.getAttribute("title")!.trim() !== "";

    const hasMeaningfulContent =
      hasNonEmptyAlt || hasAriaLabel || hasAriaLabelledby || hasTitle;

    if (hasMeaningfulContent) {
      errors.push({ id, element: img, text, url });
    }
  }

  return errors;
}
