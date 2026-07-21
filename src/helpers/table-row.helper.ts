import { Locator } from "@playwright/test";

export async function getTableRowBackgroundColor(row: Locator): Promise<string> {
  return row.evaluate((element) => {
    const rowElement =
      element instanceof HTMLTableRowElement
        ? element
        : (element.querySelector("tr") ?? element);
    const cell = rowElement.querySelector("td");
    const target = cell ?? rowElement;

    return window.getComputedStyle(target).backgroundColor;
  });
}

export function normalizeHexColor(color: string): string {
  const normalized = color.replace(/\s+/g, "").toLowerCase();

  if (normalized.startsWith("#")) {
    return normalized;
  }

  const rgbMatch = normalized.match(/^rgba?\((\d+),(\d+),(\d+)/);

  if (!rgbMatch) {
    return normalized;
  }

  const toHex = (value: string): string => Number(value).toString(16).padStart(2, "0");

  return `#${toHex(rgbMatch[1])}${toHex(rgbMatch[2])}${toHex(rgbMatch[3])}`;
}
