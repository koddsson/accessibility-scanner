// https://dequeuniversity.com/rules/axe/4.4/th-has-data-cells?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text =
  "Ensure that <th> elements and elements with role=columnheader/rowheader have data cells they describe";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/th-has-data-cells?application=RuleDescription";

/**
 * Check if a header cell has associated data cells
 */
function hasDataCells(
  header: HTMLTableCellElement | Element,
  table: HTMLTableElement | Element,
): boolean {
  // If the header has an id, check if any cells reference it via headers attribute
  const headerId = header.getAttribute("id");
  if (headerId) {
    // Search all td cells in the table
    const allCells = querySelectorAll("td", table);
    for (const cell of allCells) {
      const headersAttr = cell.getAttribute("headers");
      if (headersAttr) {
        const headerIds = headersAttr.trim().split(/\s+/);
        if (headerIds.includes(headerId)) {
          return true;
        }
      }
    }
  }

  // Check based on scope attribute
  const scope = header.getAttribute("scope");

  // For th elements in an HTML table, check if there are data cells in the same row/column
  if (
    header instanceof HTMLTableCellElement &&
    table instanceof HTMLTableElement
  ) {
    const row = header.parentElement as HTMLTableRowElement;
    if (!row) return false;

    // Get the column index of this header
    const cellIndex = [...row.cells].indexOf(header);

    if (
      scope === "col" ||
      scope === "colgroup" ||
      (!scope && row.rowIndex === 0)
    ) {
      // Column header - check if there are data cells in the same column below
      for (let i = 0; i < table.rows.length; i++) {
        if (i === row.rowIndex) continue; // Skip the header row itself
        const cell = table.rows[i].cells[cellIndex];
        if (cell && cell.tagName === "TD") {
          return true;
        }
      }
    } else if (
      scope === "row" ||
      scope === "rowgroup" ||
      (!scope && cellIndex === 0)
    ) {
      // Row header - check if there are data cells in the same row
      for (let i = 0; i < row.cells.length; i++) {
        if (i === cellIndex) continue; // Skip the header itself
        const cell = row.cells[i];
        if (cell && cell.tagName === "TD") {
          return true;
        }
      }
    } else if (!scope) {
      // No scope specified, check both directions
      // Check column
      for (let i = 0; i < table.rows.length; i++) {
        if (i === row.rowIndex) continue;
        const cell = table.rows[i].cells[cellIndex];
        if (cell && cell.tagName === "TD") {
          return true;
        }
      }
      // Check row
      for (let i = 0; i < row.cells.length; i++) {
        if (i === cellIndex) continue;
        const cell = row.cells[i];
        if (cell && cell.tagName === "TD") {
          return true;
        }
      }
    }
  }

  // For elements with role=columnheader or rowheader, check for cells with role=cell
  const role = header.getAttribute("role");
  if (role === "columnheader" || role === "rowheader") {
    // Find all cells in the same table/grid
    const cells = querySelectorAll('[role="cell"], [role="gridcell"]', table);
    if (cells.length > 0) {
      return true;
    }
  }

  return false;
}

export default function thHasDataCells(element: Element): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all tables
  const tables = querySelectorAll(
    "table, [role='table'], [role='grid']",
    element,
  );
  if (element.matches("table, [role='table'], [role='grid']")) {
    tables.push(element as HTMLTableElement);
  }

  for (const table of tables) {
    // First check if the table has any data cells at all
    const hasAnyDataCells =
      querySelectorAll("td", table).length > 0 ||
      querySelectorAll('[role="cell"], [role="gridcell"]', table).length > 0;

    // If the table has no data cells at all, skip it
    // (this is a different structural issue, not about headers having data cells)
    if (!hasAnyDataCells) {
      continue;
    }

    // Find all th elements and elements with role=columnheader/rowheader
    const headers = [
      ...querySelectorAll("th", table),
      ...querySelectorAll('[role="columnheader"], [role="rowheader"]', table),
    ];

    for (const header of headers) {
      // Skip if header is hidden
      if (header.getAttribute("aria-hidden") === "true") {
        continue;
      }

      // Check if this header has associated data cells
      if (!hasDataCells(header, table)) {
        errors.push({
          element: header,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
