export function isVisible(element: Element | null): boolean {
  // Return false for null/undefined
  if (!element) {
    return false;
  }
  // If element doesn't have a style property, we can't check display, so assume visible
  if (!("style" in element)) {
    return true;
  }

  // Walk up the DOM tree checking each element for visibility
  let current: Element | null = element;
  while (current) {
    // Check the HTML hidden attribute
    if (current.hasAttribute("hidden")) {
      return false;
    }

    if ("style" in current) {
      const defaultView = (current as HTMLElement).ownerDocument?.defaultView;
      if (current.isConnected && defaultView) {
        // Use computed styles (accurate for elements in the DOM with a view)
        const style = defaultView.getComputedStyle(current as HTMLElement);
        if (style.display === "none") {
          return false;
        }
        if (style.visibility === "hidden") {
          return false;
        }
      } else {
        // Fallback to inline styles for detached elements or documents without a view (e.g. DOMParser)
        if ((current as HTMLElement).style.display === "none") {
          return false;
        }
        if ((current as HTMLElement).style.visibility === "hidden") {
          return false;
        }
      }
    }

    current = current.parentElement;
  }

  return true;
}

/**
 * Make sure that a elements text is "visible" to a screenreader user.
 *
 * - Inner text that is discernible to screen reader users.
 * - Non-empty aria-label attribute.
 * - aria-labelledby pointing to element with text which is discernible to screen reader users.
 */
export function hasAccessibleText(el: Element): boolean {
  if (el.hasAttribute("aria-labelledby")) {
    return labelledByIsValid(el);
  }

  if (el.hasAttribute("aria-label")) {
    return el.getAttribute("aria-label")!.trim() !== "";
  }

  if (el.textContent?.trim() !== "") {
    return true;
  }

  if (el.getAttribute("title")) {
    return el.getAttribute("title")!.trim() !== "";
  }

  return false;
}

/**
 * Given a element, make sure that it's `aria-labelledby` has a value and it's
 * value maps to a element in the DOM that has valid text
 **/
export function labelledByIsValid(element: Element): boolean {
  const labelledBy = element.getAttribute("aria-labelledby");
  if (!labelledBy) return false;

  const ids = labelledBy.split(/\s+/);
  for (const id of ids) {
    const escapedId = CSS.escape(id);
    const otherElement = querySelector(`#${escapedId}`, element.ownerDocument);
    if (!otherElement) continue;
    if (otherElement instanceof HTMLSelectElement) continue;
    if (otherElement.textContent?.trim() !== "") return true;
  }

  return false;
}

/**
 * TODO
 **/
export function labelReadableText(label: HTMLElement): boolean {
  if (!label?.textContent?.trim()) return false;

  // NOTE: This is expensive and we should look into ways to not do this any more.
  const hasDisplayNone =
    globalThis.getComputedStyle(label, null).display === "none";
  if (hasDisplayNone) return false;

  const copiedNode = label.cloneNode(true) as Element;
  for (const select of querySelectorAll("select", copiedNode)) {
    select.remove();
  }

  return copiedNode.textContent?.trim() !== "";
}

type Container = HTMLElement | Element | Document | ShadowRoot;

export function querySelector<T extends Element>(
  selector: string,
  container: Container,
  options = { depth: Infinity },
): T | null {
  const els = querySelectorAll<T>(selector, container, options);

  if (Array.isArray(els) && els.length > 0) {
    return els[0];
  }

  return null;
}

/**
 * `deepQuerySelector` behaves like a normal querySelector except it will recurse into the container ShadowRoot
 * and shadowRoot of children. It will not return shadow roots.
 *
 * @example
 *   // <my-element>
 *   //   #shadowRoot <slot name="blah"></slot>
 *   //   <div></div>
 *   // </my-element>
 *   deepQuerySelectorAll(myElement, "*") // => [slot, div]
 *   deepQuerySelectorAll(myElement, "slot[name='blah']") // => [slot]
 */
export function querySelectorAll<T extends Element>(
  selector: string,
  container: Container,
  options = { depth: Infinity },
): T[] {
  const elements = getAllElementsAndShadowRoots(container, options);

  const queriedElements = elements.flatMap((element) => [
    ...element.querySelectorAll<T>(selector),
  ]);
  return [...new Set(queriedElements)];
}

// This could probably get really slow and memory intensive in large DOMs,
// maybe an infinite generator in the future?
export function getAllElementsAndShadowRoots(
  container: Container,
  options = { depth: Infinity },
) {
  const selector = "*";
  return recurse(container, selector, options);
}

function recurse(
  container: Container,
  selector: string,
  options = { depth: Infinity },
  elementsToProcess: Array<Element | ShadowRoot | Document> = [],
  elements: Array<Element | ShadowRoot | Document> = [],
  currentDepth = 1,
) {
  // if "document" is passed in, it will also pick up "<html>" causing the query to run twice.
  if (container instanceof Document) {
    container = container.documentElement;
  }

  // I haven't figured this one out, but for some reason when using the buildQueries
  // from DOM-testing-library, not reassigning here causes an infinite loop.
  // I've even tried calling "elementsToProcess.includes / .find" with no luck.
  elementsToProcess = [container];
  elements.push(container); // Make sure we're checking the container element!

  // Accounts for if the container houses a textNode
  if (
    container instanceof HTMLElement &&
    container.shadowRoot != undefined &&
    container.shadowRoot.mode !== "closed"
  ) {
    elements.push(container.shadowRoot);
    elementsToProcess.push(container.shadowRoot);
  }

  for (const containerElement of elementsToProcess) {
    for (const element of containerElement.querySelectorAll(selector)) {
      if (
        element.shadowRoot == undefined ||
        element.shadowRoot.mode === "closed"
      ) {
        elements.push(element);
        continue;
      }

      // This is here because queryByRole() requires the parent element which in some cases is the shadow root.
      elements.push(element.shadowRoot);

      if (options.depth <= currentDepth) {
        for (const e of element.shadowRoot.querySelectorAll(selector)) {
          elements.push(e);
        }
        continue;
      }

      for (const e of element.shadowRoot.querySelectorAll(selector)) {
        elements.push(e);
        elementsToProcess.push(e);
      }
      recurse(
        element.shadowRoot,
        selector,
        options,
        elementsToProcess,
        elements,
        currentDepth,
      );
    }
  }

  // We can sometimes hit duplicate nodes this way, lets stop that.
  return [...new Set(elements)];
}

export const validAriaAttributes = [
  "aria-activedescendant",
  "aria-atomic",
  "aria-autocomplete",
  "aria-busy",
  "aria-checked",
  "aria-colcount",
  "aria-colindex",
  "aria-colspan",
  "aria-controls",
  "aria-current",
  "aria-describedby",
  "aria-details",
  "aria-disabled",
  "aria-dropeffect",
  "aria-errormessage",
  "aria-expanded",
  "aria-flowto",
  "aria-grabbed",
  "aria-haspopup",
  "aria-hidden",
  "aria-invalid",
  "aria-keyshortcuts",
  "aria-label",
  "aria-labelledby",
  "aria-level",
  "aria-live",
  "aria-modal",
  "aria-multiline",
  "aria-multiselectable",
  "aria-orientation",
  "aria-owns",
  "aria-placeholder",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-roledescription",
  "aria-rowcount",
  "aria-rowindex",
  "aria-rowspan",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
];

export const validAriaAttributesWithRole: Record<string, string[]> = {
  "aria-activedescendant": [
    "combobox", "grid", "listbox", "menu", "menubar", "radiogroup", "tablist",
    "tree", "treegrid", "application", "group",
  ],
  "aria-autocomplete": ["combobox", "textbox", "searchbox"],
  "aria-checked": [
    "checkbox", "menuitemcheckbox", "menuitemradio", "option", "radio", "switch",
  ],
  "aria-colcount": ["grid", "table", "treegrid"],
  "aria-colindex": ["cell", "columnheader", "gridcell", "row", "rowheader"],
  "aria-colspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-errormessage": [
    "alert", "application", "banner", "checkbox", "contentinfo",
    "doc-appendix", "doc-glossary", "group", "log", "menubar", "scrollbar",
  ],
  "aria-expanded": [
    "application", "button", "checkbox", "combobox", "gridcell", "link",
    "listbox", "menuitem", "row", "rowheader", "tab", "treeitem",
    "columnheader", "menuitemcheckbox", "menuitemradio",
  ],
  "aria-level": ["heading", "listitem", "row", "tablist", "treeitem", "comment"],
  "aria-modal": ["alertdialog", "dialog"],
  "aria-multiline": ["textbox", "searchbox"],
  "aria-multiselectable": ["grid", "listbox", "tablist", "tree", "treegrid"],
  "aria-orientation": [
    "listbox", "menu", "menubar", "radiogroup", "scrollbar", "select",
    "separator", "slider", "tablist", "toolbar", "tree", "treegrid", "combobox",
  ],
  "aria-placeholder": ["textbox", "searchbox"],
  "aria-posinset": [
    "article", "comment", "listitem", "menuitem", "menuitemcheckbox",
    "menuitemradio", "option", "radio", "row", "tab", "treeitem",
  ],
  "aria-pressed": ["button"],
  "aria-readonly": [
    "checkbox", "combobox", "grid", "gridcell", "listbox", "radiogroup",
    "slider", "spinbutton", "textbox", "treegrid", "columnheader", "rowheader",
    "searchbox", "menuitemcheckbox", "menuitemradio",
  ],
  "aria-required": [
    "checkbox", "combobox", "gridcell", "listbox", "radiogroup", "spinbutton",
    "textbox", "tree", "columnheader", "rowheader", "searchbox", "select",
    "treegrid",
  ],
  "aria-rowcount": ["grid", "table", "treegrid"],
  "aria-rowindex": ["cell", "row", "columnheader", "gridcell", "rowheader"],
  "aria-rowspan": ["cell", "columnheader", "gridcell", "rowheader"],
  "aria-selected": [
    "cell", "columnheader", "gridcell", "option", "row", "rowheader", "tab",
    "treeitem",
  ],
  "aria-setsize": [
    "article", "comment", "listitem", "menuitem", "menuitemcheckbox",
    "menuitemradio", "option", "radio", "row", "tab", "treeitem",
  ],
  "aria-sort": ["columnheader", "rowheader"],
  "aria-valuemax": [
    "meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton",
  ],
  "aria-valuemin": [
    "meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton",
  ],
  "aria-valuenow": [
    "meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton",
  ],
  "aria-valuetext": [
    "meter", "progressbar", "scrollbar", "separator", "slider", "spinbutton",
  ],
};
