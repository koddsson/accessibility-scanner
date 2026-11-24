// `instanceof` fails for nodes that belong to another window, such as a
// document inside an iframe, so these guards check the node itself.

const htmlNamespace = "http://www.w3.org/1999/xhtml";

export function isHTMLElement(node: unknown): node is HTMLElement {
  const element = node as Element | null;
  return element?.nodeType === 1 && element.namespaceURI === htmlNamespace;
}

type TagNameMap = HTMLElementTagNameMap & HTMLElementDeprecatedTagNameMap;

export function isHTMLTag<K extends keyof TagNameMap>(
  node: unknown,
  ...tags: K[]
): node is TagNameMap[K] {
  return isHTMLElement(node) && tags.includes(node.localName as K);
}

export function isDocument(node: unknown): node is Document {
  return (node as Node | null)?.nodeType === 9;
}

export function isShadowRoot(node: unknown): node is ShadowRoot {
  const fragment = node as Node | null;
  return fragment?.nodeType === 11 && "host" in fragment;
}

export function isCSSMediaRule(rule: CSSRule): rule is CSSMediaRule {
  return rule.constructor.name === "CSSMediaRule";
}

export function isCSSStyleRule(rule: CSSRule): rule is CSSStyleRule {
  return rule.constructor.name === "CSSStyleRule";
}

export function parentOrHost(element: Element): Element | null {
  if (element.parentElement) return element.parentElement;
  const root = element.getRootNode();
  return isShadowRoot(root) ? root.host : null;
}
