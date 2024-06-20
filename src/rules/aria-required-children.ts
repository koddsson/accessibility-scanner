import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

// TODO: This list is incomplete!
type Role =
  | "checkbox"
  | "combobox"
  | "heading"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "meter"
  | "radio"
  | "scrollbar"
  | "seperator"
  | "slider"
  | "switch";

// TODO: This list is incomplete!
type AriaAttribute =
  | "aria-checked"
  | "aria-expanded"
  | "aria-level"
  | "aria-checked"
  | "aria-valuenow"
  | "aria-controls";

/**
 * Required States and Properties:
 *
 * @see https://w3c.github.io/aria/#authorErrorDefaultValuesTable
 */
const roleToRequiredStatesAndPropertiesMaps: Record<Role, AriaAttribute[]> = {
  feed: ["article"],
  grid: ["rowgroup", "row"],
  list: ["listitem"],
  listbox: ["group", "option"],
  menu: [
    "group",
    "menuitemradio",
    "menuitem",
    "menuitemcheckbox",
    "menu",
    "separator",
  ],
  menubar: [
    "group",
    "menuitemradio",
    "menuitem",
    "menuitemcheckbox",
    "menu",
    "separator",
  ],
  row: ["cell", "columnheader", "gridcell", "rowheader"],
  rowgroup: ["row"],
  suggestion: ["insertion", "deletion"],
  table: ["rowgroup", "row"],
  tablist: ["tab"],
  tree: ["group", "treeitem"],
  treegrid: ["rowgroup", "row"],
};

export const references = {
  act: {
    id: "ff89c9",
    text: "ARIA required context role",
    url: "https://act-rules.github.io/rules/ff89c9",
  },
  axe: {
    id: "aria-required-children",
    text: "Certain ARIA roles must contain particular children",
    url: `https://dequeuniversity.com/rules/axe/4.4/aria-required-children?application=RuleDescription`,
  },
};

export function ariaRequiredChildren(el: Element): AccessibilityError[] {
  const errors = [];

  const selector = Object.entries(roleToRequiredStatesAndPropertiesMaps)
    .map(([role, attributes]) => {
      return `[role=${role}]:not(${attributes.map((attr) => `[${attr}]`).join("")})`;
    })
    .join(",");

  const elements = querySelectorAll(selector, el);
  if (el.matches(selector)) elements.push(el);

  for (const element of elements) {
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}
