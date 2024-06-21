import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

// TODO: This list is incomplete!
type Role =
  | "article"
  | "cell"
  | "checkbox"
  | "columnheader"
  | "combobox"
  | "deletion"
  | "feed"
  | "grid"
  | "gridcell"
  | "group"
  | "heading"
  | "insertion"
  | "list"
  | "listbox"
  | "listitem"
  | "menu"
  | "menubar"
  | "menuitem"
  | "menuitemcheckbox"
  | "menuitemradio"
  | "meter"
  | "option"
  | "radio"
  | "row"
  | "rowgroup"
  | "rowheader"
  | "scrollbar"
  | "separator"
  | "seperator"
  | "slider"
  | "suggestion"
  | "switch"
  | "tab"
  | "table"
  | "tablist"
  | "tree"
  | "treegrid"
  | "treeitem";

/**
 * Required States and Properties:
 *
 * @see https://w3c.github.io/aria/#authorErrorDefaultValuesTable
 */
const roleToRequiredChildRoleMapping: Partial<Record<Role, Role[]>> = {
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
  const root = document.createElement("div");
  root.append(el);
  const errors = [];

  // Loop over all the different rules.
  for (const [role, requiredChildren] of Object.entries(
    roleToRequiredChildRoleMapping,
  )) {
    // Find all the elements with a role that we are interested in.
    for (const parent of querySelectorAll(`[role=${role}]`, root)) {
      let isValid = false;

      // Look for children of the parents with the correct roles.
      // TODO: Probably special case `aria-owns` as that allows you to not have
      // the items as descendants.
      const childSelector = requiredChildren.reduce((selector, childRole) => {
        if (!selector) return `[role=${childRole}]`;
        return `${selector},[role=${childRole}]`;
      }, "");
      for (const child of querySelectorAll(childSelector, parent)) {
        if (!child) continue;
        // TODO: Check if child is valid somehow
        isValid = true;
      }

      if (isValid) continue;
      errors.push({
        element: parent,
        text: references.axe.text,
        url: references.axe.text,
      });
    }
  }

  return errors;
}
