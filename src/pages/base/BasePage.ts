import { expect, Locator, Page } from "@playwright/test";

export class BasePage {
  constructor(protected readonly page: Page) {}

  async goTo(url: string): Promise<void> {
    await this.page.goto(url);
  }

  async click(locator: Locator): Promise<void> {
    await locator.click();
  }

  async fill(locator: Locator, value: string): Promise<void> {
    await locator.fill(value);
  }

  async expectVisible(locator: Locator): Promise<void> {
    await expect(locator).toBeVisible();
  }

  async expectUrlNotContains(text: string): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(text));
  }
}