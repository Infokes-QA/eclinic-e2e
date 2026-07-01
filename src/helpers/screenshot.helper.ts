import fs from "fs";
import path from "path";

import { Page } from "@playwright/test";

const SCREENSHOT_DIR = path.resolve("screenshots");

export class ScreenshotHelper {
  static ensureScreenshotDir(): void {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  }

  static async capture(page: Page, fileName: string): Promise<Buffer> {
    this.ensureScreenshotDir();

    return page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${fileName}.png`),
      fullPage: true,
    });
  }
}
