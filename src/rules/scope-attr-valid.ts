// https://www.w3.org/TR/WCAG20-TECHS/H63.html
import { querySelectorAll } from "../utils";

const text = "Scope attribute should be used correctly on tables";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/scope-attr-valid?application=RuleDescription";

function checkScopeElements(el: Element) {
  const errors = [];
  const selector = "[scope]";
  const elements = querySelectorAll(selector, el);
  if (el.matches(selector)) elements.push(el as HTMLElement);
  for (const element of elements) {
    if (element.tagName !== "TH") {
      errors.push({
        element,
        text,
        url,
      });
    }
    if (
      element.getAttribute("scope") !== "col" &&
      element.getAttribute("scope") !== "row" &&
      element.getAttribute("scope") !== "colgroup" &&
      element.getAttribute("scope") !== "rowgroup"
    ) {
      errors.push({
        element,
        text,
        url,
      });
    }
  }
  return errors;
}

function checkTableHeaderElements(el: Element) {
  const errors = [];
  const selector = "th:not([scope])";
  const elements = querySelectorAll(selector, el);
  if (el.matches(selector)) elements.push(el as HTMLElement);
  for (const element of elements) {
    errors.push({
      element,
      text,
      url,
    });
  }
  return errors;
}

export default function metaViewport(el: Element) {
  const errors = [];

  errors.push(...checkScopeElements(el), ...checkTableHeaderElements(el));

  return errors;
}
