import { expect, Locator, Page } from "@playwright/test";
import { ENV } from "../../config/env";
import { UrlHelper } from "../../config/url";
import { LoginData } from "../../data/authentication/login.data";
import { AuthHelper } from "../../helpers/auth.helper";
import { LoginLocator } from "../../locators/authentication/login.locator";
import { NavbarLocator } from "../../locators/shared/navbar.locator";
import { UserCredential } from "../../types/user.type";
import { BasePage } from "../base/BasePage";
import { NotifyComponent } from "../components/NotifyComponent";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class LoginPage extends BasePage {
  readonly clinicInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly navbar: Locator;
  readonly userMenu: Locator;
  readonly notify: NotifyComponent;
  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.clinicInput = page.locator(LoginLocator.loginPageEclinic.clinicInput);
    this.usernameInput = page.locator(LoginLocator.loginPageEclinic.usernameInput);
    this.passwordInput = page.locator(LoginLocator.loginPageEclinic.passwordInput);
    this.loginButton = page.locator(LoginLocator.loginPageEclinic.loginButton);
    this.navbar = page.locator(NavbarLocator.container);
    this.userMenu = page.locator(NavbarLocator.menu.user);
    this.notify = new NotifyComponent(page);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async openLoginPage(): Promise<void> {
    await this.goTo(UrlHelper.get("login"));
  }

  async ensureOnLoginPage(): Promise<void> {
    const isOnLoginPage = /\/login/.test(this.page.url());

    if (!isOnLoginPage) {
      await this.openLoginPage();
    }

    await this.verifyLoginPageDisplayed();
  }

  async openAuthenticatedHomeAs(role: string): Promise<void> {
    await AuthHelper.openAuthenticatedHome(this.page, AuthHelper.getAuthEntryUrl(role));
  }

  async verifyLoginSuccess(user: UserCredential): Promise<void> {
    await this.expectUrlNotContains("/login", ENV.TIMEOUT);
    await this.sweetAlert.closeIfVisible();
    await expect(this.navbar).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.userMenu).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.userMenu).toContainText(user.username, { ignoreCase: true });
    await this.sweetAlert.closeIfVisible();
  }

  async verifyOnHomePage(): Promise<void> {
    await this.expectUrlMatches(UrlHelper.getHomeUrlPattern(), ENV.TIMEOUT);
    await this.sweetAlert.closeIfVisible();
  }

  async openHomePage(origin?: string): Promise<void> {
    const homeUrl = origin
      ? UrlHelper.buildAuthenticatedHomeUrl(origin)
      : UrlHelper.getAuthenticatedHomeUrl();
    await this.goTo(homeUrl);
  }

  async selectClinic(clinicName: string): Promise<void> {
    await expect(this.clinicInput).toBeVisible({ timeout: ENV.TIMEOUT });

    const currentValue = ((await this.clinicInput.inputValue()) ?? "").trim();

    if (currentValue.localeCompare(clinicName.trim(), undefined, { sensitivity: "accent" }) === 0) {
      return;
    }

    await this.clinicInput.click();
    await this.clinicInput.clear();
    await this.fill(this.clinicInput, clinicName);

    const clinicOption = this.page.locator(LoginLocator.loginPageEclinic.clinicAutocompleteItem).filter({
      hasText: new RegExp(`^${escapeRegExp(clinicName)}$`, "i"),
    });

    await clinicOption.first().waitFor({ state: "visible", timeout: ENV.TIMEOUT });
    await clinicOption.first().click();
    await expect(this.clinicInput).toHaveValue(clinicName);
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click({ noWaitAfter: true });
  }

  async loginAs(user: UserCredential): Promise<void> {
    await this.selectClinic(user.clinic);
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.clickLoginButton();
  }

  async verifyLoginErrorDisplayed(): Promise<void> {
    await this.expectVisible(this.notify.visibleContainer());
    await this.expectTextContains(
      this.notify.visibleMessage(),
      LoginData.message.invalidCredential,
    );
    await this.expectUrlMatches(/\/login/);
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.expectVisible(this.clinicInput);
    await this.expectVisible(this.usernameInput);
    await this.expectVisible(this.passwordInput);
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
