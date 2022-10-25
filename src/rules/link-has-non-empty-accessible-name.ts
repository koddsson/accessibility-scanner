import { AccessibilityError } from "../scanner";
import {isVisible, labelledByIsValid} from '../utils'

const id = 'c487ae'
const url = `https://act-rules.github.io/rules/${id}`
const text = "This rule checks that each link has a non-empty accessible name.";

export default function (el: Element): AccessibilityError[] {
  const errors = [];
  const elements = Array.from(el.querySelectorAll<HTMLAnchorElement>("a"));
  if (el.matches("a")) {
    elements.push(el as HTMLAnchorElement);
  }
  for (const element of elements) {
    if (!isVisible(element)) continue;
    if (element.hasAttribute('title')) continue
    const textContent = element.textContent?.trim()
    if (textContent === '') {
      const image = element.querySelector('img, svg')
      const alt = image && image.getAttribute('alt')
      if (alt) continue
      const ariaLabel = image && image.getAttribute('aria-label')
      if (ariaLabel) continue
      const title = image && image.getAttribute('title')
      if (title) continue

      if (image && labelledByIsValid(image)) continue

      errors.push({
        element,
        text,
        url,
      });
    }
  }
  return errors;
}
