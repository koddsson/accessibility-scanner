import { AccessibilityError } from "../scanner";
import { querySelector, querySelectorAll } from "../utils";

const id = "aria-required-children";
const text = "Certain ARIA roles must contain particular children";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

function getRole(el: Element): string | null {
  // 1. Explicit role always wins
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;

  // 2. Common implicit role mappings
  const tag = el.tagName.toLowerCase();
  switch (tag) {
    case "li": {
      return "listitem";
    }
    case "ul":
    case "ol": {
      return "list";
    }
    case "table": {
      return "table";
    }
    case "tr": {
      return "row";
    }
    case "td": {
      return "cell";
    }
    case "th": {
      return el.getAttribute("scope") === "row" ? "rowheader" : "columnheader";
    }
    case "option": {
      return "option";
    }
    case "select": {
      return "listbox";
    }
    case "tbody":
    case "thead":
    case "tfoot": {
      return "rowgroup";
    }
    default: {
      return null;
    }
  }
}

// New helper to detect accessibility-tree boundaries
function isInsideSeparateA11yTree(node: Element, container: Element): boolean {
  let cur: Element | null = node.parentElement;
  while (cur && cur !== container) {
    const role = cur.getAttribute("role");
    const isLive = cur.hasAttribute("aria-live");
    const isInteractive = cur instanceof HTMLElement && cur.tabIndex === 0;

    if (
      isLive ||
      role === "dialog" ||
      role === "application" ||
      isInteractive
    ) {
      return true;
    }
    cur = cur.parentElement;
  }
  return false;
}

// Detect if a node is inside an intervening semantic role that should block
// the descendant from being considered a child of the container. We treat
// explicit roles "presentation", "none" and "generic" as transparent; any
// other explicit role acts as an intervening semantic boundary.
function isInsideInterveningSemanticRole(
  node: Element,
  container: Element,
): boolean {
  let cur: Element | null = node.parentElement;
  while (cur && cur !== container) {
    if (cur.hasAttribute("role")) {
      const role = cur.getAttribute("role");
      // treat presentation/none/generic as non-semantic (transparent)
      if (
        role &&
        role !== "presentation" &&
        role !== "none" &&
        role !== "generic"
      ) {
        return true;
      }
    }
    cur = cur.parentElement;
  }
  return false;
}

const requiredChildrenRoles: Record<string, string[]> = {
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

export default function ariaRequiredChildren(
  element: Element,
): AccessibilityError[] {
  const errors = [];
  const selector = Object.keys(requiredChildrenRoles)
    .map((role) => `[role="${role}"]`)
    .join(", ");
  const parents = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    parents.push(element);
  }
  for (const parent of parents) {
    const isBusy = parent.getAttribute("aria-busy") === "true";

    // If busy and has no children at all → skip check
    const hasAnyChildren = parent.children.length > 0;
    if (isBusy && !hasAnyChildren) {
      continue;
    }
    const parentRole = getRole(parent);
    if (!parentRole || !requiredChildrenRoles[parentRole]) continue;

    // Collect all descendants and filter by their (explicit or implicit) role
    // Exclude descendants that are inside an intervening accessibility tree OR
    // inside an intervening semantic role (except presentation/none/generic).
    const children = querySelectorAll("*", parent).filter((child) => {
      const childRole = getRole(child);
      return (
        childRole &&
        requiredChildrenRoles[parentRole].includes(childRole) &&
        !isInsideSeparateA11yTree(child, parent) &&
        !isInsideInterveningSemanticRole(child, parent)
      );
    });

    // Identify forbidden role-bearing descendants: those with a role that is not
    // one of the allowed child roles for this parent. Ignore transparent roles
    // (presentation/none/generic), nodes inside separate a11y trees, and
    // elements that are aria-hidden.
    const forbidden = querySelectorAll("*", parent).filter((child) => {
      const childRole = getRole(child);
      if (!childRole) return false;
      const transparent =
        childRole === "presentation" ||
        childRole === "none" ||
        childRole === "generic";
      if (transparent) return false;
      if (
        isInsideSeparateA11yTree(child, parent) ||
        isInsideInterveningSemanticRole(child, parent)
      )
        return false;
      if (
        child.hasAttribute("aria-hidden") &&
        child.getAttribute("aria-hidden") !== "false"
      )
        return false;
      return !requiredChildrenRoles[parentRole].includes(childRole);
    });

    const ariaOwns = parent.getAttribute("aria-owns")?.split(" ") || [];
    for (const ownedId of ariaOwns) {
      const ownedElement = querySelector(`#${ownedId}`, element);
      if (!ownedElement) continue;

      // Treat aria-owns targets as owned regardless of intervening semantic/a11y-tree checks.
      const ownedRole = getRole(ownedElement);
      if (
        ownedRole &&
        requiredChildrenRoles[parentRole].includes(ownedRole) &&
        !(
          ownedElement.hasAttribute("aria-hidden") &&
          ownedElement.getAttribute("aria-hidden") !== "false"
        )
      ) {
        children.push(ownedElement);
      }

      // Also consider descendants of the owned element as potential allowed children.
      // Do not exclude them because they are outside the DOM subtree of the parent.
      const ownedDescendants = querySelectorAll("*", ownedElement).filter(
        (child) => {
          const childRole = getRole(child);
          if (!childRole) return false;
          if (
            child.hasAttribute("aria-hidden") &&
            child.getAttribute("aria-hidden") !== "false"
          )
            return false;
          return requiredChildrenRoles[parentRole].includes(childRole);
        },
      );
      for (const d of ownedDescendants) {
        children.push(d);
      }

      // Check owned element and its descendants for forbidden roles as well.
      // Owned nodes should be evaluated even if they're outside the parent's DOM subtree.
      if (
        ownedRole &&
        !requiredChildrenRoles[parentRole].includes(ownedRole) &&
        ownedRole !== "presentation" &&
        ownedRole !== "none" &&
        ownedRole !== "generic" &&
        !(
          ownedElement.hasAttribute("aria-hidden") &&
          ownedElement.getAttribute("aria-hidden") !== "false"
        )
      ) {
        (forbidden as Element[]).push(ownedElement);
      }

      const ownedForbiddenDescendants = querySelectorAll(
        "*",
        ownedElement,
      ).filter((child) => {
        const childRole = getRole(child);
        if (!childRole) return false;
        if (
          childRole === "presentation" ||
          childRole === "none" ||
          childRole === "generic"
        )
          return false;
        if (
          child.hasAttribute("aria-hidden") &&
          child.getAttribute("aria-hidden") !== "false"
        )
          return false;
        return !requiredChildrenRoles[parentRole].includes(childRole);
      });
      for (const f of ownedForbiddenDescendants) {
        (forbidden as Element[]).push(f);
      }
    }

    // If there are no allowed children OR there exists a forbidden descendant,
    // report an error.
    if (children.length === 0 || forbidden.length > 0) {
      errors.push({
        id,
        element: parent,
        text,
        url,
      });
    }
  }
  return errors;
}
