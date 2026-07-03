import { Locator, Page } from "@playwright/test";
import { ENV } from "../../config/env";
import { UrlHelper } from "../../config/url";
import { LoginData } from "../../data/authentication/login.data";
import { LoginLocator } from "../../locators/authentication/login.locator";
import { UserCredential } from "../../types/user.type";
import { BasePage } from "../base/BasePage";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class LoginPage extends BasePage {
  readonly clinicInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly notification: Locator;
  readonly notificationMessage: Locator;
  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.clinicInput = page.locator(LoginLocator.loginPageEclinic.clinicInput);
    this.usernameInput = page.locator(LoginLocator.loginPageEclinic.usernameInput);
    this.passwordInput = page.locator(LoginLocator.loginPageEclinic.passwordInput);
    this.loginButton = page.locator(LoginLocator.loginPageEclinic.loginButton);
    this.notification = page.locator(LoginLocator.loginPageEclinic.notification);
    this.notificationMessage = page.locator(LoginLocator.loginPageEclinic.notificationMessage);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async openLoginPage(): Promise<void> { 
    await this.goTo(UrlHelper.get("login"));
  }

  async verifyLoginSuccess(): Promise<void> {
    await this.expectUrlNotContains("/login", ENV.TIMEOUT);
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
    await this.clinicInput.click();
    await this.clinicInput.clear();
    await this.fill(this.clinicInput, clinicName);
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
  }

  async fillUsername(username: string): Promise<void> {
    await this.fill(this.usernameInput, username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.fill(this.passwordInput, password);
  }

  async clickLoginButton(): Promise<void> {
    await this.click(this.loginButton);
  }

  async loginAs(user: UserCredential): Promise<void> {
    await this.selectClinic(user.clinic);
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.clickLoginButton();
  }

  async verifyLoginErrorDisplayed(): Promise<void> {
    await this.expectVisible(this.notification);
    await this.expectTextContains(this.notificationMessage, LoginData.message.invalidCredential);
    await this.expectUrlMatches(/\/login/);
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.expectVisible(this.clinicInput);
    await this.expectVisible(this.usernameInput);
    await this.expectVisible(this.passwordInput);
  }
}
