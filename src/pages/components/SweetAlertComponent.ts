import { expect, Locator, Page } from "@playwright/test";

import { SweetAlertLocator } from "../../locators/shared/sweet-alert.locator";

export class SweetAlertComponent {
  readonly popup: Locator;
  readonly closeButton: Locator;
  readonly confirmButton: Locator;

  constructor(private readonly page: Page) {
    this.popup = page.locator(SweetAlertLocator.popup);
    this.closeButton = page.locator(SweetAlertLocator.close);
    this.confirmButton = page.locator(SweetAlertLocator.confirm);
  }

  async closeIfVisible(): Promise<void> {
    const popup = this.popup.first();

    await popup.waitFor({ state: "visible", timeout: 5000 }).catch(() => undefined);

    if (!(await popup.isVisible())) {
      return;
    }

    const closeButton = this.closeButton.first();
    const confirmButton = this.confirmButton.first();

    if (await closeButton.isVisible()) {
      await closeButton.click();
    } else if (await confirmButton.isVisible()) {
      await confirmButton.click();
    } else {
      await this.page.keyboard.press("Escape");
    }

    await expect(popup).toBeHidden();
  }
}
