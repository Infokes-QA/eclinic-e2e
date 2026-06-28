import { expect, Locator, Page } from "@playwright/test";
import { ENV } from "../../config/env";
import { UrlHelper } from "../../config/url";
import { LoginLocator } from "../../locators/authentication/login.locator";
import { UserCredential } from "../../types/user.type";
import { BasePage } from "../base/BasePage";

export class LoginPage extends BasePage {
  readonly clinicInput: Locator;
  readonly usernameInput: Locator;
  readonly passwordInput: Locator;
  readonly loginButton: Locator;
  readonly notification: Locator;
  readonly notificationMessage: Locator;

  constructor(page: Page) {
    super(page);

    this.clinicInput = page.locator(LoginLocator.loginPageEclinic.clinicInput);
    this.usernameInput = page.locator(LoginLocator.loginPageEclinic.usernameInput);
    this.passwordInput = page.locator(LoginLocator.loginPageEclinic.passwordInput);
    this.loginButton = page.locator(LoginLocator.loginPageEclinic.loginButton);
    this.notification = page.locator(LoginLocator.loginPageEclinic.notification);
    this.notificationMessage = page.locator(LoginLocator.loginPageEclinic.notificationMessage);
  }

  async openLoginPage(): Promise<void> {
    await this.goTo(UrlHelper.get("login"));
  }

  async verifyLoginSuccess(): Promise<void> {
    await expect(this.page).not.toHaveURL(/\/login/, {
      timeout: ENV.TIMEOUT,
    });
  }
  async selectClinic(clinicName: string): Promise<void> {
    await this.clinicInput.click();
    await this.clinicInput.clear();
    await this.clinicInput.fill(clinicName);
    await this.page.keyboard.press("ArrowDown");
    await this.page.keyboard.press("Enter");
  }

  async fillUsername(username: string): Promise<void> {
    await this.usernameInput.click();
    await this.usernameInput.clear();
    await this.usernameInput.fill(username);
  }

  async fillPassword(password: string): Promise<void> {
    await this.passwordInput.click();
    await this.passwordInput.clear();
    await this.passwordInput.fill(password);
  }

  async clickLoginButton(): Promise<void> {
    await this.loginButton.click();
  }

  async loginAs(user: UserCredential): Promise<void> {
    await this.selectClinic(user.clinic);
    await this.fillUsername(user.username);
    await this.fillPassword(user.password);
    await this.clickLoginButton();
  }

  async verifyNotificationMessage(message: string): Promise<void> {
    await expect(this.notification).toBeVisible();
    await expect(this.notificationMessage).toContainText(message);
  }

  async verifyLoginErrorDisplayed(): Promise<void> {
    await expect(this.notification).toBeVisible();
    await expect(this.page).toHaveURL(/\/login/);
  }

  async verifyLoginPageDisplayed(): Promise<void> {
    await this.expectVisible(this.clinicInput);
    await this.expectVisible(this.usernameInput);
    await this.expectVisible(this.passwordInput);
  }
}
