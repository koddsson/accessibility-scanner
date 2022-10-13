/**
 * Given a element, make sure that it's `aria-labelledby` has a value and it's
 * value maps to a element in the DOM that has valid text
 **/
export function labelledByIsValid(el: Element): boolean {
  const id = el.getAttribute("aria-labelledby");
  if (!id) return false;
  const otherElement = document.querySelector<HTMLElement>(`#${id}`);
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
    window.getComputedStyle(label, null).display === "none";
  if (hasDisplayNone) return false;

  const copiedNode = label.cloneNode(true) as HTMLElement;
  for (const select of copiedNode.querySelectorAll("select")) {
    select.remove();
  }

  return copiedNode.textContent.trim() !== "";
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
