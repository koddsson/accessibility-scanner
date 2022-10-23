import { AccessibilityError } from "../scanner";

const id = "td-has-header";
const text =
  "All non-empty <td> elements in tables larger than 3 by 3 must have an associated table header";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

export default function tdHasHeader(el: Element): AccessibilityError[] {
  const errors = [];
  for (const element of el.querySelectorAll("td")) {
    const row = element.closest("tr");
    const header = row?.querySelector("th");
    if (header && header.textContent?.trim() !== "") continue;
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
