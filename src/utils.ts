export function isVisible(element: HTMLElement): boolean {
  //console.log(el.style.display === "none");
  return element.style.display !== "none";
}

/**
 * Given a element, make sure that it's `aria-labelledby` has a value and it's
 * value maps to a element in the DOM that has valid text
 **/
export function labelledByIsValid(element: Element): boolean {
  const id = element.getAttribute("aria-labelledby");
  if (!id) return false;
  const otherElement = querySelector(`#${id}`, element.ownerDocument);
  if (!otherElement) return false;

  if (otherElement instanceof HTMLSelectElement) return false;

  return otherElement.textContent?.trim() !== "";
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

  // eslint-disable-next-line github/array-foreach
  for (const containerElement of elementsToProcess) {
    // eslint-disable-next-line github/array-foreach
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
        // eslint-disable-next-line github/array-foreach
        for (const e of element.shadowRoot.querySelectorAll(selector)) {
          elements.push(e);
        }
        continue;
      }

      // eslint-disable-next-line github/array-foreach
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
  "aria-controls",
  "aria-describedby",
  "aria-disabled",
  "aria-dropeffect",
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
  "aria-placeholder",
  "aria-orientation",
  "aria-owns",
  "aria-posinset",
  "aria-pressed",
  "aria-readonly",
  "aria-relevant",
  "aria-required",
  "aria-selected",
  "aria-setsize",
  "aria-sort",
  "aria-valuemax",
  "aria-valuemin",
  "aria-valuenow",
  "aria-valuetext",
];

export const validAriaAttributesWithRole = {
  "aria-errormessage": [
    "alert",
    "application",
    "banner",
    "checkbox",
    "contentinfo",
    "doc-appendix",
    "doc-glossary",
    "group",
    "log",
    "menubar",
    "scrollbar",
  ],
};
