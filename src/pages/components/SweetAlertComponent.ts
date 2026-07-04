import { Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { ScreenshotHelper } from "../../helpers/screenshot.helper";
import { SweetAlertLocator } from "../../locators/shared/sweet-alert.locator";

export class SweetAlertComponent {
  readonly container: Locator;
  readonly popup: Locator;
  readonly confirmButton: Locator;
  readonly cancelButton: Locator;
  readonly actionButton: Locator;
  readonly title: Locator;
  readonly htmlContainer: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator(SweetAlertLocator.container);
    this.popup = page.locator(SweetAlertLocator.popup);
    this.confirmButton = page.locator(SweetAlertLocator.confirm);
    this.cancelButton = page.locator(SweetAlertLocator.cancel);
    this.actionButton = page.locator(SweetAlertLocator.actionButton);
    this.title = this.popup.locator(SweetAlertLocator.title);
    this.htmlContainer = this.popup.locator(SweetAlertLocator.htmlContainer);
  }

  async isPopupVisible(): Promise<boolean> {
    return this.popup.first().isVisible();
  }

  async readMessage(): Promise<string | null> {
    const popup = this.popup.first();

    if (!(await popup.isVisible())) {
      return null;
    }

    const title = (await this.title.textContent()) ?? "";
    const content = (await this.htmlContainer.textContent()) ?? "";
    const message = `${title} ${content}`.replace(/\s+/g, " ").trim();

    return message || null;
  }

  async captureVisiblePopup(fileName: string): Promise<Buffer | null> {
    const popup = this.popup.first();

    if (!(await popup.isVisible())) {
      return null;
    }

    return ScreenshotHelper.captureLocator(popup, fileName);
  }

  async closeIfVisible(): Promise<void> {
    const popup = this.popup.first();

    await popup
      .waitFor({ state: "visible", timeout: ENV.OPTIONAL_DIALOG_TIMEOUT })
      .catch(() => undefined);

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

    if (await popup.isVisible()) {
      await this.container
        .first()
        .click({ position: { x: 10, y: 10 }, timeout: ENV.OPTIONAL_DIALOG_TIMEOUT, force: true })
        .catch(() => undefined);
    }
  }

  private async tryDismissWithContainer(): Promise<void> {
    const container = this.container.first();

    if (!(await container.isVisible())) {
      return;
    }

    await container
      .click({ position: { x: 8, y: 8 }, timeout: ENV.OPTIONAL_DIALOG_TIMEOUT })
      .catch(() => undefined);
  }

  private async dismissWithButtons(): Promise<void> {
    const candidates = [
      this.confirmButton.first(),
      this.cancelButton.first(),
      this.actionButton.first(),
    ];

    for (const button of candidates) {
      if (await button.isVisible()) {
        await button.click({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => undefined);
        return;
      }
    }
  }
}
