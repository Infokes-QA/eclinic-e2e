import { chromium } from '@playwright/test';
import dotenv from 'dotenv';
import { LoginPage } from './pages/login/login.page';

dotenv.config({
  path: `.env.${process.env.ENV || 'eclinic'}`
});

export default async function globalSetup() {
  const browser = await chromium.launch();

  console.log("BASE_URL =", process.env.BASE_URL);
  console.log("ENV =", process.env.ENV);

  const context = await browser.newContext({
    baseURL: process.env.BASE_URL,
  });

  const page = await context.newPage();

  const loginPage = new LoginPage(page);

  await loginPage.goto();
  console.log("Goto login:", page.url());

  await loginPage.login(
    process.env.EC_USERNAME!,
    process.env.EC_PASSWORD!,
    process.env.EC_FASKES!
  );

  console.log("Setelah login:", page.url());

  await context.storageState({
    path: 'auth/user.json',
  });

  await page.screenshot({
  path: "global-setup.png",
  fullPage: true,
});
}