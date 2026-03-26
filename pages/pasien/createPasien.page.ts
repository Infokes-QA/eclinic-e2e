import { Page, expect } from '@playwright/test';
import { Pasien } from '../../data/interfaces/pasien';
import { createPasienLocators } from './createPasien.locators';

export class CreatePasienPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/pendaftaran/v2/create');
    await this.page.waitForLoadState('networkidle');
  }

  async openCreatePasienForm() {
    await this.page.getByRole('button', { name: createPasienLocators.openCreatePasienButtonName }).click();
  }

  async waitForFormReady() {
    await this.page.getByPlaceholder(createPasienLocators.nikPlaceholder).waitFor();
  }

  async fillForm(data: Pasien) {
    await this.page.getByPlaceholder(createPasienLocators.nikPlaceholder).fill(data.nik);
    await this.page.getByPlaceholder(createPasienLocators.namaPlaceholder).fill(data.nama);

    const dialog = this.page.getByRole('dialog');

    const dob = dialog.getByPlaceholder(createPasienLocators.dobPlaceholder);

    await dob.waitFor({ state: 'visible' });
    await dob.scrollIntoViewIfNeeded();

    await dob.fill(data.tanggalLahir); // YYYY-MM-DD
    await dob.press('Tab');

    await this.page.getByPlaceholder(createPasienLocators.alamatPlaceholder).fill(data.alamat);
    await this.page.getByPlaceholder(createPasienLocators.noHpPlaceholder).fill(data.noHp);

    await this.selectGender(data.gender);
  }

  async selectGender(gender: 'L' | 'P') {
    if (gender === 'L') {
      await this.page.getByRole('radio', { name: createPasienLocators.genderLRadioName }).check();
    } else {
      await this.page.getByRole('radio', { name: createPasienLocators.genderPRadioName }).check();
    }
  }

  async submit() {
    await this.page.getByRole('button', { name: createPasienLocators.simpanPasienButtonName }).click();
  }

  async verifySuccess() {
    await expect(
      this.page.locator(createPasienLocators.successMessageSelector)
    ).toHaveText(createPasienLocators.successMessageText);
  }
}