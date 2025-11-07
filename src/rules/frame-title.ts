import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "frame-title";
const text = "Frames must have an accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}?application=RuleDescription`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const elements = [
    ...querySelectorAll("iframe", element),
    ...querySelectorAll("frame", element),
  ];

  if (element.matches("iframe") || element.matches("frame")) {
    elements.push(element as HTMLIFrameElement);
  }

  for (const frameElement of elements) {
    // Check for title attribute
    const title = frameElement.getAttribute("title");
    if (title && title.trim() !== "") continue;

    // Check for aria-label
    const ariaLabel = frameElement.getAttribute("aria-label");
    if (ariaLabel && ariaLabel.trim() !== "") continue;

    // Check for aria-labelledby
    if (labelledByIsValid(frameElement)) continue;

    // If none of the above, it's an error
    errors.push({
      id,
      element: frameElement,
      text,
      url,
    });
  }

  return errors;
}
