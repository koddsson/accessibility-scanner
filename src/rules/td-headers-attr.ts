// https://dequeuniversity.com/rules/axe/4.4/td-headers-attr?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "td-headers-attr";
const text =
  "Ensure that each cell in a table that uses the headers attribute refers only to other cells in that table";
const url = `https://dequeuniversity.com/rules/axe/4.4/${id}`;

/**
 * Check if a cell's headers attribute references only cells in the same table
 */
function validateHeadersAttribute(cell: HTMLTableCellElement): boolean {
  const headersAttr = cell.getAttribute("headers");
  if (!headersAttr || headersAttr.trim() === "") {
    return true; // No headers attribute or empty is valid
  }

  // Get the table this cell belongs to
  const table = cell.closest("table");
  if (!table) {
    return true; // Cell not in a table (shouldn't happen in valid HTML)
  }

  // Get all header IDs
  const headerIds = headersAttr.trim().split(/\s+/);

  // Check each referenced ID
  for (const headerId of headerIds) {
    if (!headerId) continue; // Skip empty strings from split

    // Find the element with this ID
    const referencedElement = cell.ownerDocument?.getElementById(headerId);

    // Check if the referenced element exists
    if (!referencedElement) {
      return false;
    }

    // Check if it's a table cell (td or th)
    if (
      referencedElement.tagName !== "TD" &&
      referencedElement.tagName !== "TH"
    ) {
      return false;
    }

    // Check if the referenced cell is in the same table
    const referencedTable = referencedElement.closest("table");
    if (referencedTable !== table) {
      return false;
    }
  }

  return true;
}

export default function tdHeadersAttr(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all table cells with headers attribute
  const cellsWithHeaders = querySelectorAll("[headers]", element);
  if (element.matches("[headers]")) {
    cellsWithHeaders.push(element as HTMLElement);
  }

  for (const cell of cellsWithHeaders) {
    // Only check td and th elements
    if (cell.tagName !== "TD" && cell.tagName !== "TH") {
      continue;
    }

    const tableCell = cell as HTMLTableCellElement;

    // Validate the headers attribute
    if (!validateHeadersAttribute(tableCell)) {
      errors.push({
        id,
        element: tableCell,
        text,
        url,
      });
    }
  }

  return errors;
}
