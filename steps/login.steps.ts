import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';
import { LoginPage } from '../pages/login/login.page';

const { Given, When, Then } = createBdd();

let loginPage: LoginPage;

Given('user is on the eclinic login page', async ({ page }) => {
  loginPage = new LoginPage(page);
  await loginPage.goto();
});

When('user logs in with valid credentials', async () => {
  await loginPage.login(
    process.env.EC_USERNAME!,
    process.env.EC_PASSWORD!,
    process.env.EC_FASKES!
  );
});

Then('user should be redirected to the eclinic home page', async ({ page }) => {
  await page.waitForLoadState('networkidle');
  await expect(page).toHaveURL(/\/home/);
});