import { Browser, BrowserContext, BrowserType, chromium, firefox, webkit } from "playwright";

import { ENV } from "../config/env";

export class BrowserHelper {
  static async launchBrowser(options?: { headless?: boolean }): Promise<Browser> {
    let browser: BrowserType;

    switch (ENV.BROWSER.toLowerCase()) {
      case "firefox":
        browser = firefox;
        break;

      case "webkit":
        browser = webkit;
        break;

      case "chromium":
      default:
        browser = chromium;
        break;
    }

    const headless = options?.headless ?? ENV.HEADLESS;
    const launchOptions: Parameters<BrowserType["launch"]>[0] = {
      headless,
      slowMo: headless ? 0 : 300,
    };

    if (browser === chromium) {
      launchOptions.args = ["--force-device-scale-factor=1"];
    }

    return await browser.launch(launchOptions);
  }

  static async createContext(
    browser: Browser,
    storageStatePath?: string,
  ): Promise<BrowserContext> {
    return await browser.newContext({
      storageState: storageStatePath,
      viewport: {
        width: 1920,
        height: 1080,
      },
      deviceScaleFactor: 1,
      ignoreHTTPSErrors: true,
    });
  }
}
