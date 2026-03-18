import { Page } from '@playwright/test';
import { loginLocators } from './login.locators';

export class LoginPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/login');
    await this.page.locator(loginLocators.usernameInput).waitFor();
  }

  async selectKlinik(klinik: string) {
    const inputKlinik = this.page.locator(loginLocators.klinikInput);

    await inputKlinik.waitFor({ state: 'visible' });
    await inputKlinik.click();
    await inputKlinik.fill(klinik);

    const suggestion = this.page.locator(
      loginLocators.klinikSuggestion(klinik)
    ).first();

    await suggestion.click();
  }

  async login(username: string, password: string, klinik: string) {
    await this.selectKlinik(klinik);

    await this.page.locator(loginLocators.usernameInput).fill(username);
    await this.page.locator(loginLocators.passwordInput).fill(password);

    await this.page.locator(loginLocators.loginButton).click();
  }
}