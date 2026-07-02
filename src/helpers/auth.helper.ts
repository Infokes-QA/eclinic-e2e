import fs from "fs";
import path from "path";
import { Page, Route } from "playwright";

import { ENV } from "../config/env";
import { UrlHelper } from "../config/url";
import { Users } from "../fixtures/users.fixture";
import { LoginPage } from "../pages/authentication/LoginPage";
import { BrowserHelper } from "./browser.helper";

const AUTH_DIR = path.resolve(process.cwd(), ".auth");

interface AuthMeta {
  origin: string;
}

export class AuthHelper {
  static getAuthStatePath(role: string): string {
    return path.join(AUTH_DIR, `${role}-${ENV.ENVIRONMENT}.json`);
  }

  static getAuthMetaPath(role: string): string {
    return path.join(AUTH_DIR, `${role}-${ENV.ENVIRONMENT}.meta.json`);
  }

  static getAuthEntryUrl(role: string): string {
    const origin = this.getAuthOrigin(role);

    if (origin) {
      return UrlHelper.buildAuthenticatedHomeUrl(origin);
    }

    return UrlHelper.getAuthenticatedHomeUrl();
  }

  private static getAuthOrigin(role: string): string | undefined {
    const metaPath = this.getAuthMetaPath(role);

    if (!fs.existsSync(metaPath)) {
      return undefined;
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as AuthMeta & {
      entryUrl?: string;
    };

    if (meta.origin) {
      return meta.origin;
    }

    if (meta.entryUrl) {
      return new URL(meta.entryUrl).origin;
    }

    return undefined;
  }

  static authStateExists(role: string): boolean {
    const statePath = this.getAuthStatePath(role);
    const metaPath = this.getAuthMetaPath(role);

    if (!fs.existsSync(statePath) || !fs.existsSync(metaPath)) {
      return false;
    }

    const meta = JSON.parse(fs.readFileSync(metaPath, "utf-8")) as AuthMeta & {
      entryUrl?: string;
    };

    if (!meta.origin) {
      return false;
    }

    const maxAgeMs = ENV.AUTH_STATE_MAX_AGE_HOURS * 60 * 60 * 1000;
    const stats = fs.statSync(statePath);
    const ageMs = Date.now() - stats.mtimeMs;

    return ageMs < maxAgeMs;
  }

  static deleteAuthState(role: string): void {
    const statePath = this.getAuthStatePath(role);
    const metaPath = this.getAuthMetaPath(role);

    if (fs.existsSync(statePath)) {
      fs.unlinkSync(statePath);
    }

    if (fs.existsSync(metaPath)) {
      fs.unlinkSync(metaPath);
    }
  }

  static async openAuthenticatedHome(page: Page, homeUrl?: string): Promise<void> {
    const homeUrlPattern = UrlHelper.getHomeUrlPattern();
    const loginUrlPattern = UrlHelper.getLoginUrlPattern();
    const targetHomeUrl =
      homeUrl ??
      (page.url().startsWith("http")
        ? UrlHelper.buildAuthenticatedHomeUrl(new URL(page.url()).origin)
        : UrlHelper.getAuthenticatedHomeUrl());
    let blockStokobatRedirect = false;

    const blockStokobatNavigation = async (route: Route): Promise<void> => {
      const request = route.request();

      if (blockStokobatRedirect && request.isNavigationRequest() && request.url().includes("/stokobat")) {
        await route.abort();
        return;
      }

      await route.continue();
    };

    await page.route("**/*", blockStokobatNavigation);

    try {
      blockStokobatRedirect = true;
      await page.goto(targetHomeUrl, { waitUntil: "domcontentloaded" });

      if (loginUrlPattern.test(page.url())) {
        throw new Error(
          "Session auth tidak valid atau sudah expired. Jalankan ulang: npm run auth:setup",
        );
      }

      await page.waitForURL(homeUrlPattern, { timeout: ENV.TIMEOUT });
    } finally {
      blockStokobatRedirect = false;
      await page.unroute("**/*", blockStokobatNavigation);
    }
  }

  static async captureSessionAfterLogin(page: Page, role: string): Promise<string> {
    const loginPage = new LoginPage(page);

    await this.openAuthenticatedHome(page);
    await loginPage.verifyOnHomePage();

    const statePath = this.getAuthStatePath(role);
    const metaPath = this.getAuthMetaPath(role);
    const origin = new URL(page.url()).origin;

    await page.context().storageState({ path: statePath });
    fs.writeFileSync(metaPath, JSON.stringify({ origin } satisfies AuthMeta));

    return statePath;
  }

  static async ensureAuthState(role: string): Promise<string> {
    if (this.authStateExists(role)) {
      return this.getAuthStatePath(role);
    }

    if (!fs.existsSync(AUTH_DIR)) {
      fs.mkdirSync(AUTH_DIR, { recursive: true });
    }

    const user = Users[role];

    if (!user) {
      throw new Error(`User role '${role}' tidak ditemukan di users.fixture.ts`);
    }

    const browser = await BrowserHelper.launchBrowser();
    const context = await BrowserHelper.createContext(browser);
    const page = await context.newPage();
    page.setDefaultTimeout(ENV.TIMEOUT);

    try {
      const loginPage = new LoginPage(page);
      await loginPage.openLoginPage();
      await loginPage.verifyLoginPageDisplayed();
      await loginPage.loginAs(user);
      await loginPage.verifyLoginSuccess();

      return await this.captureSessionAfterLogin(page, role);
    } finally {
      await page.close();
      await context.close();
      await browser.close();
    }
  }
}
