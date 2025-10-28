// https://dequeuniversity.com/rules/axe/4.4/td-has-header?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text =
  "Ensure that each non-empty data cell in a <table> larger than 3 by 3 has one or more table headers";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/td-has-header?application=RuleDescription";

/**
 * Check if a table is larger than 3x3
 */
function isLargeTable(table: HTMLTableElement): boolean {
  const rows = table.rows.length;
  if (rows <= 3) return false;

  // Check if any row has more than 3 cells
  for (let i = 0; i < rows; i++) {
    if (table.rows[i].cells.length > 3) {
      return true;
    }
  }

  return false;
}

/**
 * Check if a td element has associated headers
 */
function hasHeaders(td: HTMLTableCellElement): boolean {
  // Check for headers attribute
  const headersAttr = td.getAttribute("headers");
  if (headersAttr && headersAttr.trim() !== "") {
    // Verify that at least one referenced header exists
    const headerIds = headersAttr.trim().split(/\s+/);
    for (const headerId of headerIds) {
      if (td.ownerDocument?.getElementById(headerId)) {
        return true;
      }
    }
  }

  // Check if the td is in a table with th elements
  const table = td.closest("table");
  if (!table) return false;

  // Check for th elements with scope that might apply to this td
  const headers = querySelectorAll("th", table);
  if (headers.length === 0) return false;

  // Find the row and column index of this td
  const row = td.parentElement as HTMLTableRowElement;
  if (!row) return false;

  const cellIndex = [...row.cells].indexOf(td);

  // Check if there's a header in the same column
  for (let i = 0; i < table.rows.length; i++) {
    const cell = table.rows[i].cells[cellIndex];
    if (cell && cell.tagName === "TH") {
      const scope = cell.getAttribute("scope");
      if (!scope || scope === "col" || scope === "colgroup") {
        return true;
      }
    }
  }

  // Check if there's a header in the same row
  for (let i = 0; i < row.cells.length; i++) {
    const cell = row.cells[i];
    if (cell && cell.tagName === "TH") {
      const scope = cell.getAttribute("scope");
      if (!scope || scope === "row" || scope === "rowgroup") {
        return true;
      }
    }
  }

  return false;
}

export default function tdHasHeader(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all tables
  const tables = querySelectorAll("table", element);
  if (element.matches("table")) {
    tables.push(element as HTMLTableElement);
  }

  for (const table of tables) {
    // Only check tables larger than 3x3
    if (!isLargeTable(table as HTMLTableElement)) continue;

    // Find all td elements in this table
    const tdElements = querySelectorAll("td", table);
    for (const td of tdElements) {
      const tdElement = td as HTMLTableCellElement;

      // Skip empty cells
      if (
        !tdElement.textContent?.trim() &&
        !tdElement.querySelector("img, input, select, textarea, button")
      ) {
        continue;
      }

      // Check if this td has headers
      if (!hasHeaders(tdElement)) {
        errors.push({
          element: tdElement,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
