import { Page, expect } from '@playwright/test';
import { Pasien } from '../../data/interfaces/pasien';

export class CreatePasienPage {
  constructor(private page: Page) {}

  async goto() {
    await this.page.goto('/pendaftaran/v2/create');
    await this.page.waitForLoadState('networkidle');
  }

  async openCreatePasienForm() {
    await this.page.getByRole('button', { name: /buat pasien baru/i }).click();
  }

  async waitForFormReady() {
    await this.page.getByPlaceholder('Nomor Induk Kependudukan (KTP)').waitFor();
  }

  async fillForm(data: Pasien) {
    await this.page.getByPlaceholder('Nomor Induk Kependudukan (KTP)').fill(data.nik);
    await this.page.getByPlaceholder('Nama lengkap').fill(data.nama);

    const dialog = this.page.getByRole('dialog');

    const dob = dialog.getByPlaceholder('dd-mm-yyyy');

    await dob.waitFor({ state: 'visible' });
    await dob.scrollIntoViewIfNeeded();

    await dob.fill(data.tanggalLahir); // YYYY-MM-DD
    await dob.press('Tab');

    await this.page.getByPlaceholder('Alamat Domisili').fill(data.alamat);
    await this.page.getByPlaceholder('Nomor HP').fill(data.noHp);

    await this.selectGender(data.gender);
  }

  async selectGender(gender: 'L' | 'P') {
    if (gender === 'L') {
      await this.page.getByRole('radio', { name: 'Laki-laki' }).check();
    } else {
      await this.page.getByRole('radio', { name: 'Perempuan' }).check();
    }
  }

  async submit() {
    await this.page.getByRole('button', { name: /simpan pasien/i }).click();
  }

  async verifySuccess() {
    await expect(
  this.page.locator('[data-notify="message"]')
).toHaveText(/Data berhasil disimpan/i);
  }
}