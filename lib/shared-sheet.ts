const SHARED_SHEET_ID = "1xDiJfz5DeIBDxEOl9CXzebAlouU3yA2bMp5f0jizAqU";

export function parseCsv(csv: string) {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let quoted = false;

  for (let index = 0; index < csv.length; index += 1) {
    const character = csv[index];
    if (character === '"') {
      if (quoted && csv[index + 1] === '"') {
        field += '"';
        index += 1;
      } else {
        quoted = !quoted;
      }
    } else if (character === "," && !quoted) {
      row.push(field);
      field = "";
    } else if ((character === "\n" || character === "\r") && !quoted) {
      if (character === "\r" && csv[index + 1] === "\n") index += 1;
      row.push(field);
      if (row.some((cell) => cell.trim())) rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  row.push(field);
  if (row.some((cell) => cell.trim())) rows.push(row);
  return rows;
}

export async function fetchSharedSheetRows(selector: { gid?: string; sheet?: string }) {
  const url = selector.sheet
    ? `https://docs.google.com/spreadsheets/d/${SHARED_SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${encodeURIComponent(selector.sheet)}`
    : `https://docs.google.com/spreadsheets/d/${SHARED_SHEET_ID}/export?format=csv&gid=${encodeURIComponent(selector.gid || "0")}`;

  try {
    const response = await fetch(url, { cache: "no-store" });
    if (!response.ok) return null;
    return parseCsv(await response.text());
  } catch {
    return null;
  }
}

export function headerIndex(headers: string[], ...names: string[]) {
  const normalized = headers.map((header) => header.trim().toLowerCase());
  return normalized.findIndex((header) => names.includes(header));
}

export function rowIsVisible(row: string[], visibleIndex: number) {
  return visibleIndex < 0 || ["yes", "true", "1"].includes((row[visibleIndex] || "").trim().toLowerCase());
}
