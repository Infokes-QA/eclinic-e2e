import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

Given('user navigates to eclinic login page', async ({ page }) => {
  await page.goto('/login');

  // pastikan halaman sudah siap
  await page.getByPlaceholder('ID Pengguna').waitFor();
});

When('user selects klinik', async ({ page }) => {
  const klinik = process.env.EC_FASKES!;

  const inputKlinik = page.getByPlaceholder('Pilih Klinik');

  await inputKlinik.waitFor({ state: 'visible' });
  await inputKlinik.click();
  await inputKlinik.fill(klinik);

  const suggestion = page.locator(`text=${klinik}`).first();

  await expect(suggestion).toBeVisible();
  await suggestion.click();

  // validasi berhasil pilih
  await expect(inputKlinik).toHaveValue(klinik);
});

When('user enters valid eclinic username and password', async ({ page }) => {
    await page.getByPlaceholder('ID Pengguna').fill(process.env.EC_USERNAME!);
    await page.getByPlaceholder('Kata Sandi').fill(process.env.EC_PASSWORD!);
});

When('user clicks eclinic login button', async ({ page }) => {
  await page.getByRole('button', { name: 'LOGIN' }).click();
});

Then('user will be directed to eclinic home page', async ({ page }) => {
  await page.waitForLoadState('networkidle');

  const popup = page.locator('text=Ada obat kadaluarsa');

  if (await popup.isVisible().catch(() => false)) {
    await expect(page).toHaveURL(/\/home/);
  } else {
    await expect(page.locator('.navbar-brand')).toBeVisible();
  }
});