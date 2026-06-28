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

  async expectTextContains(locator: Locator, text: string): Promise<void> {
    await expect(locator).toContainText(text);
  }

  async expectUrlMatches(pattern: RegExp, timeout?: number): Promise<void> {
    await expect(this.page).toHaveURL(pattern, timeout ? { timeout } : undefined);
  }

  async expectUrlNotContains(text: string, timeout?: number): Promise<void> {
    await expect(this.page).not.toHaveURL(new RegExp(text), timeout ? { timeout } : undefined);
  }
}
