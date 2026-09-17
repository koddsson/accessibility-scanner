/**
 * Role names defined by WAI-ARIA 1.2, DPUB-ARIA and Graphics-ARIA. Used to
 * resolve a `role` attribute: the first recognised token wins, and when no
 * token is recognised the element keeps its native role.
 */
export const validRoles = new Set([
  // WAI-ARIA 1.2 roles
  "alert",
  "alertdialog",
  "application",
  "article",
  "banner",
  "blockquote",
  "button",
  "caption",
  "cell",
  "checkbox",
  "code",
  "columnheader",
  "combobox",
  "complementary",
  "contentinfo",
  "definition",
  "deletion",
  "dialog",
  "directory",
  "document",
  "emphasis",
  "feed",
  "figure",
  "form",
  "generic",
  "grid",
  "gridcell",
  "group",
  "heading",
  "img",
  "insertion",
  "link",
  "list",
  "listbox",
  "listitem",
  "log",
  "main",
  "marquee",
  "math",
  "menu",
  "menubar",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "meter",
  "navigation",
  "none",
  "note",
  "option",
  "paragraph",
  "presentation",
  "progressbar",
  "radio",
  "radiogroup",
  "region",
  "row",
  "rowgroup",
  "rowheader",
  "scrollbar",
  "search",
  "searchbox",
  "separator",
  "slider",
  "spinbutton",
  "status",
  "strong",
  "subscript",
  "superscript",
  "switch",
  "tab",
  "table",
  "tablist",
  "tabpanel",
  "term",
  "textbox",
  "time",
  "timer",
  "toolbar",
  "tooltip",
  "tree",
  "treegrid",
  "treeitem",
  // Graphics-AAM roles
  "graphics-document",
  "graphics-object",
  "graphics-symbol",
  // DPUB-ARIA roles
  "doc-abstract",
  "doc-acknowledgments",
  "doc-afterword",
  "doc-appendix",
  "doc-backlink",
  "doc-biblioentry",
  "doc-bibliography",
  "doc-biblioref",
  "doc-chapter",
  "doc-colophon",
  "doc-conclusion",
  "doc-cover",
  "doc-credit",
  "doc-credits",
  "doc-dedication",
  "doc-endnote",
  "doc-endnotes",
  "doc-epigraph",
  "doc-epilogue",
  "doc-errata",
  "doc-example",
  "doc-footnote",
  "doc-foreword",
  "doc-glossary",
  "doc-glossref",
  "doc-index",
  "doc-introduction",
  "doc-noteref",
  "doc-notice",
  "doc-pagebreak",
  "doc-pagefooter",
  "doc-pageheader",
  "doc-pagelist",
  "doc-part",
  "doc-preface",
  "doc-prologue",
  "doc-pullquote",
  "doc-qna",
  "doc-subtitle",
  "doc-tip",
  "doc-toc",
]);

export function getExplicitRole(element: Element): string | null {
  const tokens = element.getAttribute("role")?.trim().split(/\s+/) ?? [];
  return tokens.find((token) => validRoles.has(token)) ?? null;
}

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
