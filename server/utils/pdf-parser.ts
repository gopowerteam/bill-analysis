import type { PDFPageProxy, PDFDocumentProxy } from "unpdf/pdfjs";


const THRESHOLD_X = 5
const THRESHOLD_Y = 20

function setTextBounds(text: TextItem) {
  const x = text.transform[4], y = text.transform[5], s = text.str,
    x2 = x + text.width,
    y2 = y + text.height;
  return { x1: x, y1: y, x2, y2, s };
}

export async function extractTable(document: PDFDocumentProxy, minCols?: number, maxCols?: number) {
  const rows = []

  for (let i = 1; i <= document.numPages; i++) {
    const page = await document.getPage(i)
    const items = await parserCellItems(page)
    rows.push(...extractRows(items, minCols, maxCols))
  }

  return rows
}

export async function parserCellItems(page: PDFPageProxy) {
  const content = await page.getTextContent()
  const items = content.items
    .filter(i => (i as { str: string }).str.trim() !== '')
    .filter(i => 'transform' in i)
    .map(i => setTextBounds(i))

  return items
}

export function extractRows(items: CellItem[], minCols?: number, maxCols?: number) {
  const rows = []

  while (items.length) {
    const row = extractRow(items)
    const skipped =
      (minCols !== undefined && row.length < minCols) ||
      (maxCols !== undefined && row.length > maxCols)

    if (!skipped) {
      rows.push(row)
    }
  }

  return rows
}

function extractRow(items: CellItem[]) {
  let prev: CellItem = extractCell(items)
  const row = [prev]

  while (items.length && !isCellNextRow(prev, items[0])) {
    const cell = extractCell(items)
    prev = cell
    row.push(prev)
  }

  return row
}

function extractCell(items: CellItem[]): CellItem {
  const first = items.shift()!
  const cells = [first]
  let finished = false

  while (!finished) {
    const next = items[0]
    if (next && (
      (Math.abs(next.x1 - first.x1) < THRESHOLD_X) ||
      (first.x1 <= next.x1 && first.x2 >= next.x2)
    )) {
      cells.push(next)
      items.shift()
    } else {
      finished = true
    }
  }

  return merageCells(cells)
}

function isCellNextRow(c1: CellItem, c2: CellItem) {
  const x = c2.x1 - c1.x1 < 0 && Math.abs(c2.x1 - c1.x1) > THRESHOLD_X
  const y = Math.abs(c2.y1 - c1.y1) > THRESHOLD_Y

  return x || y
}

function merageCells(cells: CellItem[]): CellItem {
  const first = cells[0]!
  const latest = cells[cells.length - 1]

  return {
    x1: first.x1,
    y1: first.y1,
    x2: latest.x2,
           y2: latest.y2,
    s: cells.map(c => c.s).join(''),
  }
}

export type RowItem = {
  cells: CellItem[]
}

export type CellItem = {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  s: string;
}

export type TextItem = {
  /**
   * - Text content.
   */
  str: string;
  /**
   * - Text direction: 'ttb', 'ltr' or 'rtl'.
   */
  dir: string;
  /**
   * - Transformation matrix.
   */
  transform: Array<number>;
  /**
   * - Width in device space.
   */
  width: number;
  /**
   * - Height in device space.
   */
  height: number;
  /**
   * - Font name used by PDF.js for converted font.
   */
  fontName: string;
  /**
   * - Indicating if the text content is followed by a
   * line-break.
   */
  hasEOL: boolean;
};
