import { Page } from "@playwright/test";

export class ScreenshotHelper {
  static async capture(page: Page, fileName: string): Promise<Buffer> {
    return page.screenshot({
      path: `screenshots/${fileName}.png`,
      fullPage: true,
    });
  }
}
