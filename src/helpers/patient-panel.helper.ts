import { Locator, Page } from "@playwright/test";

export function panelKiriTableRowByLabel(
  panelKiriTable: Locator,
  page: Page,
  label: string,
): Locator {
  return panelKiriTable.locator("tr").filter({
    has: page.getByRole("cell", { name: label, exact: true }),
  });
}

export function panelKiriValueCell(row: Locator): Locator {
  return row.locator("td").nth(1);
}
