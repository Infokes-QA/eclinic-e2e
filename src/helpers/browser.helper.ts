import {
    Browser,
    BrowserContext,
    BrowserType,
    chromium,
    firefox,
    webkit,
  } from "playwright";
  import { ENV } from "../config/env";
  
  export class BrowserHelper {
    static async launchBrowser(): Promise<Browser> {
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
  
      return await browser.launch({
        headless: ENV.HEADLESS,
        slowMo: ENV.HEADLESS ? 0 : 300,
      });
    }
  
    static async createContext(browser: Browser): Promise<BrowserContext> {
      return await browser.newContext({
        storageState: undefined,
        viewport: {
          width: 1920,
          height: 1080,
        },
        ignoreHTTPSErrors: true,
      });
    }
  }