import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "aria-roledescription";
const text =
  "Ensure aria-roledescription is only used on elements with an implicit or explicit role";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

/**
 * Returns the implicit role of an element based on its tag name and attributes.
 * Returns null if the element has no implicit role.
 */
function getImplicitRole(el: Element): string | null {
  const tag = el.tagName.toLowerCase();

  switch (tag) {
    case "a":
    case "area": {
      return el.hasAttribute("href") ? "link" : null;
    }
    case "article": {
      return "article";
    }
    case "aside": {
      return "complementary";
    }
    case "button": {
      return "button";
    }
    case "body": {
      return "document";
    }
    case "datalist": {
      return "listbox";
    }
    case "dd": {
      return "definition";
    }
    case "details": {
      return "group";
    }
    case "dialog": {
      return "dialog";
    }
    case "dl": {
      return "list";
    }
    case "dt": {
      return "term";
    }
    case "fieldset": {
      return "group";
    }
    case "figure": {
      return "figure";
    }
    case "footer": {
      // footer has role="contentinfo" only when not a descendant of article/aside/main/nav/section
      let ancestor = el.parentElement;
      while (ancestor) {
        const ancestorTag = ancestor.tagName.toLowerCase();
        if (
          ancestorTag === "article" ||
          ancestorTag === "aside" ||
          ancestorTag === "main" ||
          ancestorTag === "nav" ||
          ancestorTag === "section"
        ) {
          return null;
        }
        ancestor = ancestor.parentElement;
      }
      return "contentinfo";
    }
    case "form": {
      return "form";
    }
    case "h1":
    case "h2":
    case "h3":
    case "h4":
    case "h5":
    case "h6": {
      return "heading";
    }
    case "header": {
      // header has role="banner" only when not a descendant of article/aside/main/nav/section
      let ancestor = el.parentElement;
      while (ancestor) {
        const ancestorTag = ancestor.tagName.toLowerCase();
        if (
          ancestorTag === "article" ||
          ancestorTag === "aside" ||
          ancestorTag === "main" ||
          ancestorTag === "nav" ||
          ancestorTag === "section"
        ) {
          return null;
        }
        ancestor = ancestor.parentElement;
      }
      return "banner";
    }
    case "hr": {
      return "separator";
    }
    case "html": {
      return "document";
    }
    case "img": {
      return el.getAttribute("alt") === "" ? "presentation" : "img";
    }
    case "input": {
      const type = (el.getAttribute("type") || "text").toLowerCase();
      switch (type) {
        case "hidden": {
          return null;
        }
        case "button":
        case "image":
        case "reset":
        case "submit": {
          return "button";
        }
        case "checkbox": {
          return "checkbox";
        }
        case "radio": {
          return "radio";
        }
        case "range": {
          return "slider";
        }
        case "email":
        case "tel":
        case "text":
        case "url": {
          return el.hasAttribute("list") ? "combobox" : "textbox";
        }
        case "search": {
          return el.hasAttribute("list") ? "combobox" : "searchbox";
        }
        case "number": {
          return "spinbutton";
        }
        default: {
          return "textbox";
        }
      }
    }
    case "li": {
      return "listitem";
    }
    case "main": {
      return "main";
    }
    case "math": {
      return "math";
    }
    case "menu": {
      return "list";
    }
    case "meter": {
      return "meter";
    }
    case "nav": {
      return "navigation";
    }
    case "ol":
    case "ul": {
      return "list";
    }
    case "option": {
      return "option";
    }
    case "output": {
      return "status";
    }
    case "progress": {
      return "progressbar";
    }
    case "section": {
      return el.hasAttribute("aria-label") || el.hasAttribute("aria-labelledby")
        ? "region"
        : null;
    }
    case "select": {
      return el.hasAttribute("multiple") || (el as HTMLSelectElement).size > 1
        ? "listbox"
        : "combobox";
    }
    case "summary": {
      return "button";
    }
    case "table": {
      return "table";
    }
    case "tbody":
    case "tfoot":
    case "thead": {
      return "rowgroup";
    }
    case "td": {
      return "cell";
    }
    case "textarea": {
      return "textbox";
    }
    case "th": {
      // th can be columnheader or rowheader depending on scope
      const scope = el.getAttribute("scope");
      return scope === "row" || scope === "rowgroup"
        ? "rowheader"
        : "columnheader";
    }
    case "tr": {
      return "row";
    }
    default: {
      return null;
    }
  }
}

/**
 * Checks if an element has a role (explicit via role attribute or implicit via HTML semantics)
 */
function hasRole(el: Element): boolean {
  // Check for explicit role
  if (el.hasAttribute("role")) {
    const role = el.getAttribute("role");
    // Empty or whitespace-only role is treated as no role
    if (role && role.trim() !== "") {
      return true;
    }
  }

  // Check for implicit role
  const implicitRole = getImplicitRole(el);
  return implicitRole !== null;
}

export default function ariaRoledescription(
  element_: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all elements with aria-roledescription
  const selector = "[aria-roledescription]";
  const elements = querySelectorAll(selector, element_);

  // Check if the element being scanned itself has aria-roledescription
  // Only add if it's not already in the elements array
  if (
    element_.hasAttribute("aria-roledescription") &&
    !elements.includes(element_)
  ) {
    elements.push(element_);
  }

  for (const element of elements) {
    // Skip if aria-roledescription is empty or whitespace-only
    const roledescription = element.getAttribute("aria-roledescription");
    if (!roledescription || roledescription.trim() === "") {
      continue;
    }

    // Check if element has a role (explicit or implicit)
    if (!hasRole(element)) {
      errors.push({
        element,
        text,
        url,
      });
    }
  }

  return errors;
}
