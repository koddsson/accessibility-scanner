// https://dequeuniversity.com/rules/axe/4.11/table-duplicate-name?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "table-duplicate-name";
const text = "tables should not have the same summary and caption";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function tableDuplicateName(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  const selector = "table";

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element);

  for (const el of elements) {
    const summary = (el as HTMLTableElement).getAttribute("summary")?.trim();
    if (!summary) continue;

    const caption = el.querySelector("caption");
    if (!caption) continue;

    const captionText = caption.textContent?.trim();
    if (captionText && captionText === summary) {
      errors.push({ id, element: el, text, url });
    }
  }

  return errors;
}
