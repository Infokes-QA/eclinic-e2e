import { Locator, Page } from "@playwright/test";

import { SweetAlertLocator } from "../../locators/shared/sweet-alert.locator";

const SWEET_ALERT_TIMEOUT = 5000;

export class SweetAlertComponent {
  readonly container: Locator;
  readonly popup: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly actionButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator(SweetAlertLocator.container);
    this.popup = page.locator(SweetAlertLocator.popup);
    this.confirmButton = page.locator(SweetAlertLocator.confirm);
    this.cancelButton = page.locator(SweetAlertLocator.cancel);
    this.actionButton = page.locator(SweetAlertLocator.actionButton);
  }

  async closeIfVisible(): Promise<void> {
    const popup = this.popup.first();

    await popup.waitFor({ state: "visible", timeout: SWEET_ALERT_TIMEOUT }).catch(() => undefined);

    if (!(await popup.isVisible())) {
      return;
    }

    await this.tryDismissWithContainer();

    if (await popup.isVisible()) {
      await this.dismissWithButtons();
    }

    if (await popup.isVisible()) {
      await this.page.keyboard.press("Escape").catch(() => undefined);
    }
  }

  private async tryDismissWithContainer(): Promise<void> {
    const container = this.container.first();

    if (!(await container.isVisible())) {
      return;
    }

    await container.click({ position: { x: 8, y: 8 }, timeout: SWEET_ALERT_TIMEOUT }).catch(() => undefined);
  }

  private async dismissWithButtons(): Promise<void> {
    const candidates = [
      this.confirmButton.first(),
      this.cancelButton.first(),
      this.actionButton.first(),
    ];

    for (const button of candidates) {
      if (await button.isVisible()) {
        await button.click({ timeout: SWEET_ALERT_TIMEOUT }).catch(() => undefined);
        return;
      }
    }
  }
}
