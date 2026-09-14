import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "label-content-name-mismatch";
const text =
  "Ensures that elements labelled through their content must have their visible text as part of their accessible name";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * Widget roles that support "name from content" per the ARIA specification.
 * The ACT rule 2ee8b8 only applies to elements whose semantic role is a
 * widget that supports naming from content.
 */
const widgetRolesWithNameFromContent = new Set([
  "button",
  "checkbox",
  "columnheader",
  "gridcell",
  "link",
  "menuitem",
  "menuitemcheckbox",
  "menuitemradio",
  "option",
  "radio",
  "rowheader",
  "searchbox",
  "switch",
  "tab",
  "treeitem",
]);

type StyleMap = Record<string, string>;

const styledProperties = [
  "display",
  "visibility",
  "opacity",
  "clip",
  "clip-path",
  "width",
  "height",
] as const;

function parseDeclarations(block: string): StyleMap {
  const declarations: StyleMap = {};
  for (const declaration of block.split(";")) {
    const separator = declaration.indexOf(":");
    if (separator === -1) continue;
    const property = declaration.slice(0, separator).trim().toLowerCase();
    if (
      !styledProperties.includes(property as (typeof styledProperties)[number])
    )
      continue;
    declarations[property] = declaration
      .slice(separator + 1)
      .replaceAll(/\s*!important\s*$/gi, "")
      .trim()
      .toLowerCase();
  }
  return declarations;
}

const documentRules = new WeakMap<
  Document,
  { selector: string; declarations: StyleMap }[]
>();

/**
 * Documents produced by `DOMParser` have no browsing context, so their
 * `<style>` elements are never turned into `CSSStyleSheet`s and
 * `getComputedStyle` is unavailable. Parse the stylesheets by hand so the
 * rule can still resolve the handful of properties it cares about.
 */
function getDocumentRules(document: Document) {
  const cached = documentRules.get(document);
  if (cached) return cached;

  const rules: { selector: string; declarations: StyleMap }[] = [];
  for (const styleElement of document.querySelectorAll("style")) {
    const css = (styleElement.textContent ?? "").replaceAll(
      /\/\*[\S\s]*?\*\//g,
      "",
    );
    for (const [, selector, block] of css.matchAll(/([^{}]+){([^{}]*)}/g)) {
      const trimmed = selector.trim();
      if (!trimmed || trimmed.startsWith("@")) continue;
      rules.push({ selector: trimmed, declarations: parseDeclarations(block) });
    }
  }

  documentRules.set(document, rules);
  return rules;
}

function matchesSelector(element: Element, selector: string): boolean {
  try {
    return element.matches(selector);
  } catch {
    return false;
  }
}

function getStyle(element: Element): StyleMap {
  const view = element.ownerDocument?.defaultView;
  if (element.isConnected && view) {
    const computed = view.getComputedStyle(element);
    const style: StyleMap = {};
    for (const property of styledProperties) {
      style[property] = computed.getPropertyValue(property);
    }
    return style;
  }

  const style: StyleMap = {};
  for (const { selector, declarations } of getDocumentRules(
    element.ownerDocument,
  )) {
    if (matchesSelector(element, selector)) Object.assign(style, declarations);
  }
  Object.assign(style, parseDeclarations(element.getAttribute("style") ?? ""));
  return style;
}

const neverRenderedTags = new Set([
  "head",
  "link",
  "meta",
  "noscript",
  "script",
  "style",
  "template",
  "title",
]);

const blockLevelTags = new Set([
  "address",
  "article",
  "aside",
  "blockquote",
  "body",
  "details",
  "dd",
  "dialog",
  "div",
  "dl",
  "dt",
  "fieldset",
  "figcaption",
  "figure",
  "footer",
  "form",
  "h1",
  "h2",
  "h3",
  "h4",
  "h5",
  "h6",
  "header",
  "hgroup",
  "hr",
  "main",
  "nav",
  "ol",
  "p",
  "pre",
  "section",
  "ul",
]);

function getDisplay(element: Element): string {
  const declared = getStyle(element).display;
  if (declared) return declared;

  const tag = element.tagName.toLowerCase();
  if (tag === "td" || tag === "th") return "table-cell";
  if (tag === "tr") return "table-row";
  if (tag === "caption") return "table-caption";
  if (tag === "table") return "table";
  if (tag === "li") return "list-item";
  if (blockLevelTags.has(tag)) return "block";
  return "inline";
}

function hasBlockOuterDisplay(display: string): boolean {
  return (
    display.startsWith("block") ||
    display.startsWith("flow-root") ||
    display === "list-item" ||
    display === "table" ||
    display === "flex" ||
    display === "grid"
  );
}

function isTinyLength(value: string | undefined): boolean {
  if (!value) return false;
  const length = Number.parseFloat(value);
  return Number.isFinite(length) && length <= 1;
}

/**
 * Detects the "visually hidden" pattern — a clipped box collapsed to a pixel —
 * which renders nothing on screen even though it stays in the accessibility
 * tree.
 */
function isClippedOutOfView(style: StyleMap): boolean {
  const clipPath = style["clip-path"];
  const clip = style.clip;
  const clipped =
    (clipPath && clipPath !== "none") || (clip && clip !== "auto");
  if (!clipped) return false;
  return isTinyLength(style.width) || isTinyLength(style.height);
}

/**
 * The "visible inner text" of a node, per the ACT glossary. It differs from
 * both `textContent` (which includes content hidden with CSS) and `innerText`
 * (which collapses whitespace-only inline elements).
 *
 * Note that `aria-hidden` content is deliberately *included*: it is removed
 * from the accessibility tree but still rendered on screen, so it forms part
 * of the visible label.
 */
function getVisibleInnerText(node: Node): string {
  if (node.nodeType === Node.TEXT_NODE) {
    return (node.textContent ?? "").replaceAll(/\s+/g, " ");
  }

  if (node.nodeType !== Node.ELEMENT_NODE) {
    return getChildrenVisibleInnerText(node);
  }

  const element = node as Element;
  const tag = element.tagName.toLowerCase();
  if (neverRenderedTags.has(tag)) return "";
  if (tag === "br") return "\n";

  const style = getStyle(element);
  const display = getDisplay(element);
  if (display === "none") return "";
  if (style.visibility && style.visibility !== "visible") return " ";
  if (style.opacity && Number.parseFloat(style.opacity) === 0) return " ";
  if (isClippedOutOfView(style)) return " ";

  const inner = getChildrenVisibleInnerText(element);
  if (display === "table-cell" || display === "table-row") return ` ${inner} `;
  if (display === "table-caption" || hasBlockOuterDisplay(display))
    return `\n${inner}\n`;
  return inner;
}

function getChildrenVisibleInnerText(node: Node): string {
  let result = "";
  for (const child of node.childNodes) {
    result += getVisibleInnerText(child);
  }
  return result;
}

/**
 * Map from HTML element tag names to their implicit ARIA roles
 * (only for widget roles that name from content).
 */
function getImplicitRole(element: Element): string | null {
  const tag = element.tagName.toLowerCase();
  if (tag === "a" && element.hasAttribute("href")) return "link";
  if (tag === "button") return "button";
  if (tag === "summary") return "button";
  if (tag === "option") return "option";
  if (tag === "th") {
    // th can be columnheader or rowheader depending on scope
    const scope = element.getAttribute("scope");
    if (scope === "row") return "rowheader";
    return "columnheader";
  }
  if (tag === "td") return "gridcell";
  return null;
}

/**
 * Get the effective role of an element.
 */
function getEffectiveRole(element: Element): string | null {
  const explicitRole = element.getAttribute("role")?.trim().split(/\s+/)[0];
  if (explicitRole) return explicitRole;
  return getImplicitRole(element);
}

/**
 * Get the accessible name of an element (from aria-label or aria-labelledby)
 */
function getAccessibleName(element: Element): string | null {
  // Check aria-labelledby first (takes precedence over aria-label)
  const labelledBy = element.getAttribute("aria-labelledby");
  if (labelledBy) {
    const ids = labelledBy.split(/\s+/);
    const texts: string[] = [];
    for (const refId of ids) {
      const escapedId = CSS.escape(refId);
      const labelElement = element.ownerDocument.querySelector(`#${escapedId}`);
      if (labelElement) {
        const labelText = labelElement.textContent?.trim() || "";
        if (labelText) {
          texts.push(labelText);
        }
      }
    }
    if (texts.length > 0) {
      return texts.join(" ").replaceAll(/\s+/g, " ");
    }
  }

  // Check aria-label
  const ariaLabel = element.getAttribute("aria-label");
  if (ariaLabel) {
    return ariaLabel.trim().replaceAll(/\s+/g, " ");
  }

  return null;
}

/**
 * Tokenize a string as described by the ACT "label in name algorithm":
 * drop parenthesised asides, case fold and normalise, reduce everything that
 * is neither a letter nor a digit to whitespace, then split into words.
 */
function tokenize(value: string): string[] {
  const withoutParentheticals = value.replaceAll(/\([^()]*\)/g, " ");
  const folded = withoutParentheticals.toLowerCase().normalize("NFKD");

  let letters = "";
  for (const character of folded) {
    letters += /[\p{L}\p{N}]/u.test(character) ? character : " ";
  }

  return letters.split(/\s+/).filter(Boolean);
}

/**
 * Whether `needle` appears as a run of consecutive entries in `haystack`.
 */
function isContiguousSubsequence(
  needle: string[],
  haystack: string[],
): boolean {
  if (needle.length === 0) return true;
  if (needle.length > haystack.length) return false;

  for (let start = 0; start <= haystack.length - needle.length; start++) {
    let matches = true;
    for (const [offset, element] of needle.entries()) {
      if (haystack[start + offset] !== element) {
        matches = false;
        break;
      }
    }
    if (matches) return true;
  }

  return false;
}

/**
 * A label made of a single letter — "X" for "close", say — is a character
 * expressing non-text content, which the algorithm ignores. A single digit is
 * ordinary text and is not excluded.
 */
function expressesNonTextContent(tokens: string[]): boolean {
  return (
    tokens.length === 1 &&
    [...tokens[0]].length === 1 &&
    /\p{L}/u.test(tokens[0])
  );
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Select elements that could have this issue — interactive widgets
  // that support name from content
  const selector = [
    "a[href]",
    "button",
    "summary",
    "option",
    "th",
    "[role]",
  ].join(", ");

  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) {
    elements.push(element);
  }

  for (const el of elements) {
    // Skip if element is hidden
    if (el.getAttribute("aria-hidden") === "true") continue;

    // Check that the element has a widget role that names from content
    const role = getEffectiveRole(el);
    if (!role || !widgetRolesWithNameFromContent.has(role)) continue;

    const accessibleName = getAccessibleName(el);
    if (!accessibleName) continue;

    const label = tokenize(getVisibleInnerText(el));
    if (label.length === 0) continue;
    if (expressesNonTextContent(label)) continue;

    if (!isContiguousSubsequence(label, tokenize(accessibleName))) {
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
