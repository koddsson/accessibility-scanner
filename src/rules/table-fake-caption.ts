// https://dequeuniversity.com/rules/axe/4.4/table-fake-caption?application=RuleDescription
import { AccessibilityError } from "../scanner";
import { querySelectorAll } from "../utils";

const text = "Ensure that tables with a caption use the <caption> element.";
const url =
  "https://dequeuniversity.com/rules/axe/4.4/table-fake-caption?application=RuleDescription";

/**
 * Check if a table has a fake caption
 * A fake caption is when the first row has a single cell that spans the entire width
 * of the table, but doesn't use the <caption> element
 */
function hasFakeCaption(table: HTMLTableElement): Element | null {
  // Skip if table already has a proper caption
  if (table.caption) {
    return null;
  }

  const firstRow = table.rows[0];
  if (!firstRow) {
    return null;
  }

  // Check if first row has only one cell
  if (firstRow.cells.length !== 1) {
    return null;
  }

  const firstCell = firstRow.cells[0];

  // Get the total number of columns in the table
  // We need to check other rows to determine the actual table width
  let maxColumns = 1;
  for (let i = 1; i < table.rows.length; i++) {
    const row = table.rows[i];
    let columnCount = 0;
    for (let j = 0; j < row.cells.length; j++) {
      const cell = row.cells[j] as HTMLTableCellElement;
      columnCount += cell.colSpan || 1;
    }
    maxColumns = Math.max(maxColumns, columnCount);
  }

  // If there's only one column total, it's not a fake caption
  if (maxColumns <= 1) {
    return null;
  }

  // Check if the first cell spans all columns
  const cellColSpan = firstCell.colSpan || 1;
  if (cellColSpan >= maxColumns) {
    // This looks like a fake caption
    return firstCell;
  }

  return null;
}

export default function tableFakeCaption(
  element: Element,
): AccessibilityError[] {
  const errors: AccessibilityError[] = [];

  // Find all tables
  const tables = querySelectorAll("table", element);
  if (element.matches("table")) {
    tables.push(element as HTMLTableElement);
  }

  for (const table of tables) {
    const fakeCaption = hasFakeCaption(table as HTMLTableElement);
    if (fakeCaption) {
      errors.push({
        element: fakeCaption,
        text,
        url,
      });
    }
  }

  return errors;
}
