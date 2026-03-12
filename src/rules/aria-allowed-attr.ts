import { querySelectorAll, validAriaAttributesWithRole } from "../utils";
import { AccessibilityError } from "../scanner";

const id = "aria-allowed-attr";
const text = "Elements must only use allowed ARIA attributes";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

// Mappings from HTML element tag names to their implicit ARIA roles.
// Reference: https://www.w3.org/TR/html-aria/#docconformance
// Tag names are uppercase to match element.tagName.
const implicitRoles: Record<string, string | undefined> = {
  A: "link",
  ABBR: undefined,
  ADDRESS: "group",
  ARTICLE: "article",
  ASIDE: "complementary",
  B: undefined,
  BDI: undefined,
  BDO: undefined,
  BLOCKQUOTE: "blockquote",
  BUTTON: "button",
  CAPTION: "caption",
  CITE: undefined,
  CODE: "code",
  COL: undefined,
  COLGROUP: undefined,
  DATA: undefined,
  DATALIST: "listbox",
  DD: "definition",
  DEL: "deletion",
  DETAILS: "group",
  DFN: "term",
  DIALOG: "dialog",
  DIV: "generic",
  DL: undefined,
  DT: "term",
  EM: "emphasis",
  FIELDSET: "group",
  FIGCAPTION: undefined,
  FIGURE: "figure",
  FOOTER: "contentinfo",
  FORM: "form",
  H1: "heading",
  H2: "heading",
  H3: "heading",
  H4: "heading",
  H5: "heading",
  H6: "heading",
  HEADER: "banner",
  HGROUP: "group",
  HR: "separator",
  HTML: "document",
  I: undefined,
  IMG: "img",
  INPUT: "textbox",
  INS: "insertion",
  LI: "listitem",
  MAIN: "main",
  MARK: "mark",
  MATH: "math",
  MENU: "list",
  METER: "meter",
  NAV: "navigation",
  OL: "list",
  OPTGROUP: "group",
  OPTION: "option",
  OUTPUT: "status",
  P: "paragraph",
  PRE: undefined,
  PROGRESS: "progressbar",
  Q: undefined,
  S: undefined,
  SAMP: undefined,
  SEARCH: "search",
  SECTION: "region",
  SELECT: "combobox",
  SMALL: undefined,
  SPAN: "generic",
  STRONG: "strong",
  SUB: "subscript",
  SUMMARY: "button",
  SUP: "superscript",
  TABLE: "table",
  TBODY: "rowgroup",
  TD: "cell",
  TEXTAREA: "textbox",
  TFOOT: "rowgroup",
  TH: "columnheader",
  THEAD: "rowgroup",
  TIME: "time",
  TR: "row",
  U: undefined,
  UL: "list",
  VAR: undefined,
};

export function ariaAllowedAttr(element_: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];
  for (const element of querySelectorAll("*", element_)) {
    const effectiveRole =
      element.getAttribute("role") || implicitRoles[element.tagName];
    if (!effectiveRole) continue;

    for (const attribute of element.attributes) {
      if (!attribute.name.startsWith("aria-")) continue;
      const allowedRoles = validAriaAttributesWithRole[attribute.name];
      if (!allowedRoles) continue;
      if (!allowedRoles.includes(effectiveRole)) {
        errors.push({ id, element, text, url });
        break;
      }
    }
  }
  return errors;
}
