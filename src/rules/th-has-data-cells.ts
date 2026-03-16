// https://dequeuniversity.com/rules/axe/4.11/th-has-data-cells?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const id = "th-has-data-cells";
const text =
  "Ensure that <th> elements and elements with role=columnheader/rowheader have data cells they describe";
const url = `https://dequeuniversity.com/rules/axe/4.11/${id}`;

/**
 * Build a column-index map for a table that accounts for colspan/rowspan.
 * Returns a Map from each cell element to its starting column index.
 */
function buildColumnMap(
  table: HTMLTableElement,
): Map<HTMLTableCellElement, number> {
  const map = new Map<HTMLTableCellElement, number>();
  // Track which grid positions are occupied (for rowspan)
  const occupied: boolean[][] = [];

  for (let r = 0; r < table.rows.length; r++) {
    if (!occupied[r]) occupied[r] = [];
    const row = table.rows[r];
    let col = 0;
    for (let c = 0; c < row.cells.length; c++) {
      // Find next unoccupied column
      while (occupied[r][col]) col++;
      const cell = row.cells[c];
      map.set(cell, col);
      const colspan = cell.colSpan || 1;
      const rowspan = cell.rowSpan || 1;
      // Mark occupied positions
      for (let dr = 0; dr < rowspan; dr++) {
        if (!occupied[r + dr]) occupied[r + dr] = [];
        for (let dc = 0; dc < colspan; dc++) {
          occupied[r + dr][col + dc] = true;
        }
      }
      col += colspan;
    }
  }
  return map;
}

/**
 * Check if a cell in a given row occupies a particular column index,
 * accounting for colspan.
 */
function cellOccupiesColumn(
  cell: HTMLTableCellElement,
  colStart: number,
  targetCol: number,
): boolean {
  const colspan = cell.colSpan || 1;
  return targetCol >= colStart && targetCol < colStart + colspan;
}

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
    const allCells = querySelectorAll("td, th", table);
    for (const cell of allCells) {
      if (cell === header) continue;
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

    const colMap = buildColumnMap(table);
    const headerCol = colMap.get(header) ?? 0;

    if (
      scope === "col" ||
      scope === "colgroup" ||
      (!scope && row.rowIndex === 0)
    ) {
      // Column header - check if there are cells in the same column below
      // that don't override assignment with an explicit headers attribute
      for (let i = 0; i < table.rows.length; i++) {
        if (i === row.rowIndex) continue;
        for (let c = 0; c < table.rows[i].cells.length; c++) {
          const cell = table.rows[i].cells[c];
          const cellCol = colMap.get(cell) ?? 0;
          if (cellOccupiesColumn(cell, cellCol, headerCol)) {
            // If the cell has an explicit headers attribute, it must reference
            // this header's id for the assignment to count
            if (cell.hasAttribute("headers")) {
              if (
                headerId &&
                cell
                  .getAttribute("headers")!
                  .trim()
                  .split(/\s+/)
                  .includes(headerId)
              ) {
                return true;
              }
              // Explicit headers don't include this header - not assigned
              continue;
            }
            // Skip th elements that are themselves column headers
            // (they have scope="col"/"colgroup" and are not data cells)
            const cellScope = cell.getAttribute("scope");
            if (
              cell.tagName === "TH" &&
              (cellScope === "col" || cellScope === "colgroup")
            ) {
              continue;
            }
            // Cell is implicitly assigned to this column header
            // Count both td and th without column scope (a th can be
            // an assigned cell of another th, e.g. row headers in a column)
            return true;
          }
        }
      }
    } else if (
      scope === "row" ||
      scope === "rowgroup" ||
      (!scope && headerCol === 0)
    ) {
      // Row header - check if there are data cells in the same row
      for (let i = 0; i < row.cells.length; i++) {
        const cell = row.cells[i];
        if (cell === header) continue;
        if (cell.tagName === "TD") {
          return true;
        }
      }
    } else if (!scope) {
      // No scope specified, check both directions
      // Check column
      for (let i = 0; i < table.rows.length; i++) {
        if (i === row.rowIndex) continue;
        for (let c = 0; c < table.rows[i].cells.length; c++) {
          const cell = table.rows[i].cells[c];
          const cellCol = colMap.get(cell) ?? 0;
          if (cellOccupiesColumn(cell, cellCol, headerCol)) {
            if (cell.hasAttribute("headers")) {
              if (
                headerId &&
                cell
                  .getAttribute("headers")!
                  .trim()
                  .split(/\s+/)
                  .includes(headerId)
              ) {
                return true;
              }
              continue;
            }
            // Skip th elements that are column headers themselves
            const cellScope = cell.getAttribute("scope");
            if (
              cell.tagName === "TH" &&
              (cellScope === "col" || cellScope === "colgroup")
            ) {
              continue;
            }
            return true;
          }
        }
      }
      // Check row
      for (let i = 0; i < row.cells.length; i++) {
        const cell = row.cells[i];
        if (cell === header) continue;
        if (cell.tagName === "TD") {
          return true;
        }
      }
    }
  }

  // For elements with role=columnheader or rowheader, check positionally
  const role = header.getAttribute("role");
  if (role === "columnheader" || role === "rowheader") {
    const rows = querySelectorAll('[role="row"]', table);
    // Find which row the header is in and its position
    const headerRow = header.closest('[role="row"]');
    if (headerRow) {
      const headerChildren = [...headerRow.children];
      const headerIndex = headerChildren.indexOf(header as HTMLElement);

      if (role === "columnheader") {
        // Check if any other row has a cell/gridcell at this position
        for (const row of rows) {
          if (row === headerRow) continue;
          const children = [...row.children];
          if (headerIndex < children.length) {
            const cell = children[headerIndex];
            const cellRole = cell.getAttribute("role");
            if (
              cellRole === "cell" ||
              cellRole === "gridcell" ||
              cell.tagName === "TD"
            ) {
              return true;
            }
          }
        }
      } else {
        // rowheader - check if there are cells in the same row
        const children = [...headerRow.children];
        for (const [i, child] of children.entries()) {
          if (i === headerIndex) continue;
          const cellRole = child.getAttribute("role");
          if (
            cellRole === "cell" ||
            cellRole === "gridcell" ||
            child.tagName === "TD"
          ) {
            return true;
          }
        }
      }
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
          id,
          element: header,
          text,
          url,
        });
      }
    }
  }

  return errors;
}
