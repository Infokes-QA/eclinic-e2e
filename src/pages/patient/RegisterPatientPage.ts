import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { RegisterPatientData } from "../../data/patient/register-patient.data";
import { RandomHelper } from "../../helpers/random.helper";
import { RegisterPatientLocator } from "../../locators/patient/register-patient.locator";
import { BasePage } from "../base/BasePage";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class RegisterPatientPage extends BasePage {
  readonly pelayananHeading: Locator;
  readonly waktuKunjunganHariIni: Locator;
  readonly kunjunganBaru: Locator;
  readonly kunjunganSakit: Locator;
  readonly kunjunganSehat: Locator;
  readonly penjaminSelect: Locator;
  readonly instalasiRawatJalan: Locator;
  readonly poliRuanganSelect: Locator;
  readonly poliRuanganPlaceholder: Locator;
  readonly jadwalPraktikContainer: Locator;
  readonly jadwalPraktikOptions: Locator;
  readonly btnLanjutkan: Locator;
  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.pelayananHeading = page.locator(RegisterPatientLocator.pelayanan.heading);
    this.waktuKunjunganHariIni = page.locator(RegisterPatientLocator.pelayanan.waktuKunjunganHariIni);
    this.kunjunganBaru = page.locator(RegisterPatientLocator.pelayanan.kunjunganBaru);
    this.kunjunganSakit = page.locator(RegisterPatientLocator.pelayanan.kunjunganSakit);
    this.kunjunganSehat = page.locator(RegisterPatientLocator.pelayanan.kunjunganSehat);
    this.penjaminSelect = page.locator(RegisterPatientLocator.pelayanan.penjaminSelect);
    this.instalasiRawatJalan = page.locator(RegisterPatientLocator.pelayanan.instalasiRawatJalan);
    this.poliRuanganSelect = page.locator(RegisterPatientLocator.pelayanan.poliRuanganSelect);
    this.poliRuanganPlaceholder = page.locator(RegisterPatientLocator.pelayanan.poliRuanganPlaceholder);
    this.jadwalPraktikContainer = page.locator(RegisterPatientLocator.pelayanan.jadwalPraktikContainer);
    this.jadwalPraktikOptions = page.locator(RegisterPatientLocator.pelayanan.jadwalPraktikOption);
    this.btnLanjutkan = page.locator(RegisterPatientLocator.pelayanan.btnLanjutkan);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async verifyOnRegisterPatientPage(): Promise<void> {
    await this.expectUrlMatches(RegisterPatientData.url.registerPatientPage);
    await this.expectVisible(this.pelayananHeading);
  }

  async fillPelayananFormKunjunganSakit(): Promise<void> {
    const defaults = RegisterPatientData.pelayanan.defaults;

    await this.expectVisible(this.pelayananHeading);
    await this.click(this.waktuKunjunganHariIni.first());
    await this.kunjunganBaru.check();
    await expect(this.kunjunganBaru).toBeChecked();
    await this.kunjunganSakit.check();
    await expect(this.kunjunganSakit).toBeChecked();

    await this.penjaminSelect.selectOption({ label: defaults.penjamin });
    await expect(this.penjaminSelect).toHaveValue(/.+/);

    await this.click(this.instalasiRawatJalan);
    await expect(this.instalasiRawatJalan).toHaveClass(/radio-btn-selected/);

    await this.selectPoliRuangan(defaults.poliRuangan);
    await this.selectRandomJadwalPraktik();
    await expect(this.btnLanjutkan).toBeEnabled({ timeout: ENV.TIMEOUT });
  }

  private async selectPoliRuangan(poliName: string): Promise<void> {
    await expect(this.poliRuanganPlaceholder).toBeHidden({ timeout: ENV.TIMEOUT });
    await expect(this.poliRuanganSelect).toBeVisible({ timeout: ENV.TIMEOUT });

    try {
      await this.poliRuanganSelect.selectOption({ label: poliName });
    } catch {
      throw new Error(`Poli Ruangan '${poliName}' tidak tersedia di environment ini.`);
    }

    await expect(this.poliRuanganSelect).not.toHaveValue("");
  }

  private async selectRandomJadwalPraktik(): Promise<string> {
    await expect(this.jadwalPraktikContainer).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.jadwalPraktikOptions.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const optionCount = await this.jadwalPraktikOptions.count();

    if (optionCount === 0) {
      throw new Error("Jadwal Praktik tidak memiliki opsi pilihan setelah memilih Poli Ruangan.");
    }

    const randomIndex = RandomHelper.pickRandomIndex(optionCount);
    const selectedOption = this.jadwalPraktikOptions.nth(randomIndex);
    const selectedText = ((await selectedOption.innerText()) ?? "").replace(/\s+/g, " ").trim();

    await this.click(selectedOption);
    await expect(selectedOption).toHaveClass(/radio-btn-selected/);

    return selectedText;
  }

  async clickLanjutkanPendaftaran(): Promise<void> {
    await expect(this.btnLanjutkan).toBeEnabled();
    await this.click(this.btnLanjutkan);
  }

  async verifyPendaftaranSuccess(): Promise<void> {
    const popup = this.sweetAlert.popup.first();

    await popup.waitFor({ state: "visible", timeout: ENV.TIMEOUT }).catch(() => undefined);

    if (await popup.isVisible()) {
      const title = (await popup.locator(".swal2-title").textContent()) ?? "";
      const content = (await popup.locator(".swal2-html-container").textContent()) ?? "";
      const message = `${title} ${content}`.trim();

      if (RegisterPatientData.alert.registrationFailurePattern.test(message)) {
        throw new Error(`Pendaftaran pasien gagal: ${message}`);
      }

      if (RegisterPatientData.alert.registrationSuccessPattern.test(message)) {
        await this.sweetAlert.closeIfVisible();
        return;
      }

      throw new Error(`Alert pendaftaran tidak dikenali: ${message}`);
    }

    await expect(this.page).not.toHaveURL(RegisterPatientData.url.registerPatientPage, {
      timeout: ENV.TIMEOUT,
    });
  }
}
