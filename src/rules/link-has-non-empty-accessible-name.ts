import { AccessibilityError } from "../scanner";
import {
  querySelector,
  querySelectorAll,
  isVisible,
  labelledByIsValid,
} from "../utils";

const id = "c487ae";
const url = `https://act-rules.github.io/rules/${id}`;
const text = "Link has non-empty accessible name";

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = querySelectorAll("a", el) as HTMLAnchorElement[];
  if (el.matches("a")) {
    elements.push(el as HTMLAnchorElement);
  }
  for (const element of elements) {
    if (!isVisible(element)) continue;

    if (
      element.hasAttribute("aria-label") &&
      element.getAttribute("aria-label")?.trim() !== ""
    )
      continue;

    if (
      element.hasAttribute("aria-labelledby") &&
      element.getAttribute("aria-labelledby")?.trim() === ""
    ) {
      const labelledby = element.getAttribute("aria-labelledby")?.trim();
      const x = querySelector(`#${labelledby}`, el);
      if (x && x.textContent && x?.textContent?.trim() === "") {
        errors.push({
          element,
          text,
          url,
        });
      }
    }

    if (element.hasAttribute("title")) continue;
    const textContent = element.textContent?.trim();
    if (textContent === "") {
      const image = querySelector("img, svg", element);
      const alt = image && image.getAttribute("alt");
      if (alt) continue;
      const ariaLabel = image && image.getAttribute("aria-label");
      if (ariaLabel) continue;
      const title = image && image.getAttribute("title");
      if (title) continue;

      if (image && labelledByIsValid(image)) continue;

      errors.push({
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
