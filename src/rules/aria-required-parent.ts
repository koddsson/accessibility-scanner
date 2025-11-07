import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "aria-required-parent";
const text = "Certain ARIA roles must be contained by particular parents";
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

// Map of child roles to their required parent roles
// Based on ARIA spec: roles that require specific context
const requiredParentRoles: Record<string, string[]> = {
  // Roles that must be in specific containers
  listitem: ["list"],
  option: ["listbox"],
  tab: ["tablist"],
  treeitem: ["tree"],
  row: ["table", "grid", "rowgroup", "treegrid"],
  cell: ["row"],
  columnheader: ["row"],
  gridcell: ["row"],
  rowheader: ["row"],
  rowgroup: ["table", "grid", "treegrid"],
  menuitem: ["menu", "menubar"],
  menuitemcheckbox: ["menu", "menubar"],
  menuitemradio: ["menu", "menubar"],
};

function findRequiredParent(
  element: Element,
  requiredParents: string[],
  root: Element,
): boolean {
  // First check if this element is owned via aria-owns
  if (element.id) {
    const ownedBy = querySelectorAll(
      `[aria-owns~="${element.id}"]`,
      root,
    ).filter((owner) => {
      const ownerRole = getRole(owner);
      return ownerRole && requiredParents.includes(ownerRole);
    });

    if (ownedBy.length > 0) {
      return true;
    }
  }

  // Then check the DOM hierarchy
  let current: Element | null = element.parentElement;
  while (current && current !== root.parentElement) {
    // Check if this element has one of the required parent roles
    const currentRole = getRole(current);
    if (currentRole && requiredParents.includes(currentRole)) {
      return true;
    }

    // Stop at explicit roles that would break the parent-child relationship
    // (except presentation/none/generic which are transparent)
    if (
      currentRole &&
      currentRole !== "presentation" &&
      currentRole !== "none" &&
      currentRole !== "generic" && // If we hit a role boundary that's not the required parent, fail
      !requiredParents.includes(currentRole)
    ) {
      return false;
    }

    current = current.parentElement;
  }
  return false;
}

export default function ariaRequiredParent(
  element: Element,
): AccessibilityError[] {
  const errors = [];

  // Build a selector for all roles that require parents
  const selector = Object.keys(requiredParentRoles)
    .map((role) => `[role="${role}"]`)
    .join(", ");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    const role = getRole(el);
    if (!role || !requiredParentRoles[role]) continue;

    const requiredParents = requiredParentRoles[role];

    // Check if the element has a valid parent
    const hasValidParent = findRequiredParent(el, requiredParents, element);

    if (!hasValidParent) {
      errors.push({
        id,
        element: el,
        text,
        url,
      });
    }
  }

  return errors;
}
