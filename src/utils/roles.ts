/**
 * Resolve an element's role: the explicit role attribute, or the implicit
 * role for the list and table elements the required-children/parent rules
 * care about. Not a full HTML-AAM mapping.
 */
const listRoles = new Set(["list", "directory"]);
const tableRoles = new Set(["table", "grid", "treegrid"]);

// Per HTML-AAM, li and table parts only keep their implicit role when the
// containing list/table still has a list-like/table-like role. When the
// container's role has been overridden the element maps to generic.
function containerRoleOverridden(
  container: Element | null,
  allowed: Set<string>,
): boolean {
  const role = container?.getAttribute("role")?.trim().split(/\s+/)[0];
  return role !== undefined && role !== "" && !allowed.has(role);
}

export function getRole(el: Element): string | null {
  // 1. Explicit role always wins
  const explicit = el.getAttribute("role");
  if (explicit) return explicit;

  // 2. Common implicit role mappings
  const tag = el.tagName.toLowerCase();
  switch (tag) {
    case "li": {
      const parent = el.parentElement;
      if (
        parent?.matches("ul, ol, menu") &&
        containerRoleOverridden(parent, listRoles)
      ) {
        return "generic";
      }
      return "listitem";
    }
    case "ul":
    case "ol": {
      return "list";
    }
    case "table": {
      return "table";
    }
    case "tr":
    case "td":
    case "th":
    case "tbody":
    case "thead":
    case "tfoot": {
      if (containerRoleOverridden(el.closest("table"), tableRoles)) {
        return "generic";
      }
      if (tag === "tr") return "row";
      if (tag === "td") return "cell";
      if (tag === "th") {
        return el.getAttribute("scope") === "row"
          ? "rowheader"
          : "columnheader";
      }
      return "rowgroup";
    }
    case "option": {
      return "option";
    }
    case "select": {
      return "listbox";
    }
    default: {
      return null;
    }
  }
}
