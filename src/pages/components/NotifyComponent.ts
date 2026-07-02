import { Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { NotifyLocator } from "../../locators/shared/notify.locator";

export class NotifyComponent {
  readonly container: Locator;
  readonly message: Locator;
  readonly title: Locator;
  readonly dismissButton: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator(NotifyLocator.container);
    this.message = page.locator(NotifyLocator.message);
    this.title = page.locator(NotifyLocator.title);
    this.dismissButton = page.locator(NotifyLocator.dismiss);
  }

  visibleContainer(): Locator {
    return this.container.filter({ visible: true }).first();
  }

  visibleMessage(): Locator {
    return this.visibleContainer().locator(NotifyLocator.message);
  }

  async isVisible(): Promise<boolean> {
    return this.visibleContainer().isVisible();
  }

  async readMessage(): Promise<string> {
    const container = this.visibleContainer();
    const title = ((await container.locator(NotifyLocator.title).textContent()) ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const message = ((await container.locator(NotifyLocator.message).textContent()) ?? "")
      .replace(/\s+/g, " ")
      .trim();

    return `${title} ${message}`.trim();
  }

  async readVisibleMessageText(): Promise<string> {
    return ((await this.visibleMessage().textContent()) ?? "").replace(/\s+/g, " ").trim();
  }

  async waitForVisible(timeout = ENV.TIMEOUT): Promise<string> {
    const container = this.visibleContainer();

    await container.waitFor({ state: "visible", timeout });

    return this.readMessage();
  }

  async waitForMessageText(timeout = ENV.TIMEOUT): Promise<string> {
    const message = this.visibleMessage();

    await message.waitFor({ state: "visible", timeout });

    return this.readVisibleMessageText();
  }

  messageWithText(pattern: RegExp): Locator {
    return this.message.filter({ hasText: pattern });
  }

  async waitForMessageMatching(pattern: RegExp, timeout = ENV.TIMEOUT): Promise<string> {
    const message = this.messageWithText(pattern).first();

    await message.waitFor({ state: "visible", timeout });

    return ((await message.textContent()) ?? "").replace(/\s+/g, " ").trim();
  }

  async dismissIfVisible(): Promise<void> {
    const container = this.visibleContainer();

    if (!(await container.isVisible())) {
      return;
    }

    const dismissButton = container.locator(NotifyLocator.dismiss);

    if (await dismissButton.isVisible()) {
      await dismissButton.click({ timeout: ENV.OPTIONAL_DIALOG_TIMEOUT }).catch(() => undefined);
    }
  }
}
