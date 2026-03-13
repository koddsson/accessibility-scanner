import { AccessibilityError } from "../scanner";
import { querySelectorAll, labelledByIsValid } from "../utils";

const id = "summary-name";
const text = "Summary elements must have discernible text";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

export default function (element: Element): AccessibilityError[] {
  const errors = [];
  const details = querySelectorAll("details", element);
  if (element.matches("details")) {
    details.push(element as HTMLElement);
  }

  for (const detail of details) {
    // Only check the first <summary> child of each <details>
    const summary = detail.querySelector(":scope > summary");
    if (!summary) continue;

    if (summary.textContent?.trim() !== "") continue;
    if (summary.getAttribute("aria-label")?.trim()) continue;
    if (labelledByIsValid(summary)) continue;
    if ((summary as HTMLElement).title?.trim()) continue;

    errors.push({
      id,
      element: summary,
      text,
      url,
    });
  }

  return errors;
}
