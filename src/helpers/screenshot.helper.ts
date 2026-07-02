import fs from "fs";
import path from "path";

import { Locator, Page } from "@playwright/test";

const SCREENSHOT_DIR = path.resolve("screenshots");

interface StepScreenshotAttachment {
  page: Page;
  attach: (data: Buffer, options: { mediaType: string; fileName: string }) => void | Promise<void>;
}

export class ScreenshotHelper {
  static ensureScreenshotDir(): void {
    if (!fs.existsSync(SCREENSHOT_DIR)) {
      fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
    }
  }

  static sanitizeFileName(value: string, maxLength = 80): string {
    return value
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-")
      .replace(/^-|-$/g, "")
      .slice(0, maxLength);
  }

  static async capture(page: Page, fileName: string): Promise<Buffer> {
    this.ensureScreenshotDir();

    return page.screenshot({
      path: path.join(SCREENSHOT_DIR, `${fileName}.png`),
      fullPage: true,
    });
  }

  static async captureLocator(locator: Locator, fileName: string): Promise<Buffer> {
    this.ensureScreenshotDir();

    return locator.screenshot({
      path: path.join(SCREENSHOT_DIR, `${fileName}.png`),
    });
  }

  static async attachThenStepScreenshot(
    attachment: StepScreenshotAttachment,
    scenarioName: string,
    stepText: string,
    statusSuffix: "passed" | "failed",
  ): Promise<void> {
    const scenarioSlug = this.sanitizeFileName(scenarioName, 60);
    const stepSlug = this.sanitizeFileName(stepText, 60);
    const screenshotName = `${scenarioSlug}-then-${stepSlug}-${statusSuffix}`;

    const screenshot = await this.capture(attachment.page, screenshotName);

    await attachment.attach(screenshot, {
      mediaType: "image/png",
      fileName: `${screenshotName}.png`,
    });
  }
}
