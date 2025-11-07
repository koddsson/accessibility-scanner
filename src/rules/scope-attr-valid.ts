// https://www.w3.org/TR/WCAG20-TECHS/H63.html
import { querySelectorAll } from "../utils";

const id = "scope-attr-valid";
const text = "Scope attribute should be used correctly on tables";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

function checkScopeElements(element: Element) {
  const errors = [];
  const selector = "[scope]";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element as HTMLElement);
  for (const element of elements) {
    if (element.tagName !== "TH") {
      errors.push({
        id,
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
        id,
        element,
        text,
        url,
      });
    }
  }
  return errors;
}

function checkTableHeaderElements(element: Element) {
  const errors = [];
  const selector = "th:not([scope])";
  const elements = querySelectorAll(selector, element);
  if (element.matches(selector)) elements.push(element as HTMLElement);
  for (const element of elements) {
    errors.push({
      id,
      element,
      text,
      url,
    });
  }
  return errors;
}

export default function metaViewport(element: Element) {
  const errors = [];

  errors.push(
    ...checkScopeElements(element),
    ...checkTableHeaderElements(element),
  );

  return errors;
}
