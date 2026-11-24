import { AccessibilityError } from "../scanner.js";
import { querySelector, querySelectorAll } from "../utils.js";
import { getRole } from "../utils/roles.js";

const id = "aria-required-children";
const text = "Certain ARIA roles must contain particular children";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

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
// roles "presentation", "none" and "generic" as transparent; any other
// role (explicit or implicit) acts as an intervening semantic boundary.
function isInsideInterveningSemanticRole(
  node: Element,
  container: Element,
): boolean {
  let cur: Element | null = node.parentElement;
  while (cur && cur !== container) {
    const role = getRole(cur);
    // treat presentation/none/generic as non-semantic (transparent)
    if (
      role &&
      role !== "presentation" &&
      role !== "none" &&
      role !== "generic"
    ) {
      return true;
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

const menuGroupRoles = [
  "menuitemradio",
  "menuitem",
  "menuitemcheckbox",
  "separator",
];

const groupChildrenRoles: Record<string, string[]> = {
  listbox: ["option"],
  menu: menuGroupRoles,
  menubar: menuGroupRoles,
  tree: ["treeitem"],
};

function findDisallowedOwned(container: Element, allowed: string[]): Element[] {
  return querySelectorAll("*", container).filter((child) => {
    const childRole = getRole(child);
    if (!childRole) return false;
    const transparent =
      childRole === "presentation" ||
      childRole === "none" ||
      childRole === "generic";
    if (transparent) return false;
    if (
      isInsideSeparateA11yTree(child, container) ||
      isInsideInterveningSemanticRole(child, container)
    )
      return false;
    if (
      child.hasAttribute("aria-hidden") &&
      child.getAttribute("aria-hidden") !== "false"
    )
      return false;
    return !allowed.includes(childRole);
  });
}

function findOwnedWithRole(container: Element, role: string): Element[] {
  return querySelectorAll("*", container).filter(
    (child) =>
      getRole(child) === role &&
      !isInsideSeparateA11yTree(child, container) &&
      !isInsideInterveningSemanticRole(child, container),
  );
}

const reviewEmptyRoles = new Set([
  "grid",
  "list",
  "listbox",
  "menu",
  "menubar",
  "rowgroup",
  "table",
  "tablist",
  "tree",
  "treegrid",
]);

function hasTextContent(element: Element): boolean {
  const walker = element.ownerDocument.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT,
  );
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    if (!node.textContent?.trim()) continue;
    const parent = node.parentElement;
    if (parent?.closest("script, style, [aria-hidden='true']")) continue;
    return true;
  }
  return false;
}

export default function ariaRequiredChildren(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  // Match elements with explicit roles
  const selector = Object.keys(requiredChildrenRoles)
    .map((role) => `[role="${role}"]`)
    .join(", ");
  // Also match native elements with implicit roles that have required children
  const nativeSelector = "ul, ol, table, tr, select, tbody, thead, tfoot";
  const combinedSelector = `${selector}, ${nativeSelector}`;
  const parents = querySelectorAll(combinedSelector, element).filter((el) => {
    const role = getRole(el);
    return role && requiredChildrenRoles[role];
  });
  if (element.matches(combinedSelector)) {
    const role = getRole(element);
    if (role && requiredChildrenRoles[role]) {
      parents.push(element);
    }
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

    const hasExplicitRole = Boolean(parent.getAttribute("role"));
    if (!hasExplicitRole && !hasAnyChildren) continue;

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

    const forbidden = findDisallowedOwned(
      parent,
      requiredChildrenRoles[parentRole],
    );

    const ownedElements: Element[] = [];
    const ariaOwns = parent.getAttribute("aria-owns")?.split(" ") || [];
    for (const ownedId of ariaOwns) {
      const ownedElement = querySelector(`#${ownedId}`, element);
      if (!ownedElement) continue;
      ownedElements.push(ownedElement);

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
        forbidden.push(ownedElement);
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
        forbidden.push(f);
      }
    }

    const groupRoles = groupChildrenRoles[parentRole];
    if (groupRoles) {
      const allowedInGroup = [...groupRoles, "group"];
      const groups = children.filter((child) => getRole(child) === "group");
      for (const group of groups) {
        forbidden.push(...findDisallowedOwned(group, allowedInGroup));
        groups.push(
          ...findOwnedWithRole(group, "group").filter(
            (nested) => !groups.includes(nested),
          ),
        );
      }
    }

    if (forbidden.length > 0) {
      errors.push({ id, element: parent, text, url });
    } else if (children.length === 0) {
      const isEmpty = ![parent, ...ownedElements].some((el) =>
        hasTextContent(el),
      );
      const needsReview =
        hasExplicitRole && reviewEmptyRoles.has(parentRole) && isEmpty;
      errors.push({ id, element: parent, text, url, needsReview });
    }
  }
  return errors;
}
