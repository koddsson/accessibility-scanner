import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "frame-tested";
const text =
  "Ensures <iframe> and <frame> elements contain the axe-core script";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

/**
 * Checks if an iframe/frame element has been tested by the accessibility scanner.
 * This means the scanner script should be loaded inside the frame's document.
 * For cross-origin frames or frames that cannot be accessed, an error is reported
 * since we cannot confirm the script is present.
 */
export default function frameTested(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all iframe and frame elements
  const frames = [...querySelectorAll("iframe, frame", element)];

  // If the element being scanned is itself an iframe or frame, include it
  if (element.matches && element.matches("iframe, frame")) {
    frames.push(element);
  }

  for (const frame of frames) {
    // Skip hidden frames (aria-hidden or display:none)
    if (frame.getAttribute("aria-hidden") === "true") continue;
    if (frame instanceof HTMLElement && frame.style.display === "none")
      continue;

    // Check if we can access the frame's content document
    try {
      const frameElement = frame as HTMLIFrameElement;
      const contentDocument = frameElement.contentDocument;

      if (!contentDocument) {
        // Cannot access the frame's document (cross-origin or not loaded)
        errors.push({
          id,
          element: frame,
          text,
          url,
        });
        continue;
      }

      // Check if the accessibility scanner script is loaded in the frame
      const scripts = contentDocument.querySelectorAll("script");
      let hasScanner = false;

      for (const script of scripts) {
        const src = script.getAttribute("src") || "";
        const content = script.textContent || "";

        // Check if the script source or content references the accessibility scanner
        if (
          src.includes("accessibility-scanner") ||
          src.includes("axe-core") ||
          src.includes("axe.min.js") ||
          content.includes("accessibility-scanner") ||
          content.includes("axe-core")
        ) {
          hasScanner = true;
          break;
        }
      }

      if (!hasScanner) {
        errors.push({
          id,
          element: frame,
          text,
          url,
        });
      }
    } catch {
      // Cross-origin frames will throw a SecurityError
      // Report as an error since we can't confirm the scanner is loaded
      errors.push({
        id,
        element: frame,
        text,
        url,
      });
    }
  }

  return errors;
}
