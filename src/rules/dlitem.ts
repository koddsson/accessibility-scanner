import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text = "Ensures <dt> and <dd> elements are contained by a <dl>";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/dlitem?application=RuleDescription";

function hasValidDefinitionListParent(element: Element): boolean {
  let parent = element.parentElement;

  while (parent) {
    // Check for semantic definition list parent (dl)
    if (parent.matches("dl")) {
      return true;
    }

    // Check for ARIA definition list parent (role="list" for definition lists)
    // or more specific roles like "group" when used with definitions
    if (parent.getAttribute("role") === "list") {
      return true;
    }

    parent = parent.parentElement;
  }

  return false;
}

export default function (element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all <dd> elements
  const ddElements = querySelectorAll("dd", element);
  if (element.matches("dd")) {
    ddElements.push(element as HTMLElement);
  }

  for (const dd of ddElements) {
    if (!hasValidDefinitionListParent(dd)) {
      errors.push({
        element: dd,
        text,
        url,
      });
    }
  }

  // Find all <dt> elements
  const dtElements = querySelectorAll("dt", element);
  if (element.matches("dt")) {
    dtElements.push(element as HTMLElement);
  }

  for (const dt of dtElements) {
    if (!hasValidDefinitionListParent(dt)) {
      errors.push({
        element: dt,
        text,
        url,
      });
    }
  }

  // Check elements with role="definition" (dd equivalent)
  const ariaDefinitions = querySelectorAll('[role="definition"]', element);
  if (element.getAttribute("role") === "definition") {
    ariaDefinitions.push(element);
  }

  for (const definition of ariaDefinitions) {
    if (!hasValidDefinitionListParent(definition)) {
      errors.push({
        element: definition,
        text,
        url,
      });
    }
  }

  // Check elements with role="term" (dt equivalent)
  const ariaTerms = querySelectorAll('[role="term"]', element);
  if (element.getAttribute("role") === "term") {
    ariaTerms.push(element);
  }

  for (const term of ariaTerms) {
    if (!hasValidDefinitionListParent(term)) {
      errors.push({
        element: term,
        text,
        url,
      });
    }
  }

  return errors;
}
