import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { CreatePatientData } from "../../data/patient/create-patient.data";
import { RegisterPatientData } from "../../data/patient/register-patient.data";
import { PatientFixture } from "../../fixtures/patient.fixture";
import { RandomHelper } from "../../helpers/random.helper";
import { RegisterPatientLocator } from "../../locators/patient/register-patient.locator";
import { BasePage } from "../base/BasePage";
import { NavbarComponent } from "../components/NavbarComponent";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class RegisterPatientPage extends BasePage {
  readonly panelTitle: Locator;
  readonly tambahButton: Locator;
  readonly patientSearchInput: Locator;
  readonly suggestDropdown: Locator;
  readonly suggestItem: Locator;
  readonly panelKiriHeading: Locator;
  readonly panelKiriTable: Locator;
  readonly pelayananHeading: Locator;
  readonly waktuKunjunganHariIni: Locator;
  readonly kunjunganBaru: Locator;
  readonly kunjunganSakit: Locator;
  readonly kunjunganSehat: Locator;
  readonly penjaminSelect: Locator;
  readonly skriningVisualPasienStabil: Locator;
  readonly instalasiButtons: Locator;
  readonly poliRuanganFormGroup: Locator;
  readonly poliRuanganButtons: Locator;
  readonly jadwalPraktikFormGroup: Locator;
  readonly jadwalPraktikOptions: Locator;
  readonly btnLanjutkan: Locator;
  readonly queuePrintDialog: Locator;
  readonly queuePrintContinueButton: Locator;
  readonly navbar: NavbarComponent;
  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.panelTitle = page.locator(RegisterPatientLocator.page.panelTitle);
    this.tambahButton = page.locator(RegisterPatientLocator.page.tambah);
    this.patientSearchInput = page.locator(RegisterPatientLocator.patientSearch.input);
    this.suggestDropdown = page.locator(RegisterPatientLocator.patientSearch.suggestDropdown);
    this.suggestItem = page.locator(RegisterPatientLocator.patientSearch.suggestItem);
    this.panelKiriHeading = page.locator(RegisterPatientLocator.panelKiri.heading);
    this.panelKiriTable = page.locator(RegisterPatientLocator.panelKiri.table);
    this.pelayananHeading = page.locator(RegisterPatientLocator.pelayanan.heading);
    this.waktuKunjunganHariIni = page.locator(RegisterPatientLocator.pelayanan.waktuKunjunganHariIni);
    this.kunjunganBaru = page.locator(RegisterPatientLocator.pelayanan.kunjunganBaru);
    this.kunjunganSakit = page.locator(RegisterPatientLocator.pelayanan.kunjunganSakit);
    this.kunjunganSehat = page.locator(RegisterPatientLocator.pelayanan.kunjunganSehat);
    this.penjaminSelect = page.locator(RegisterPatientLocator.pelayanan.penjaminSelect);
    this.skriningVisualPasienStabil = page.locator(
      RegisterPatientLocator.pelayanan.skriningVisualPasienStabil,
    );
    this.instalasiButtons = page.locator(RegisterPatientLocator.pelayanan.instalasiButtons);
    this.poliRuanganFormGroup = page.locator(RegisterPatientLocator.pelayanan.poliRuanganFormGroup);
    this.poliRuanganButtons = page.locator(RegisterPatientLocator.pelayanan.poliRuanganButtons);
    this.jadwalPraktikFormGroup = page.locator(RegisterPatientLocator.pelayanan.jadwalPraktikFormGroup);
    this.jadwalPraktikOptions = page.locator(RegisterPatientLocator.pelayanan.jadwalPraktikOption);
    this.btnLanjutkan = page.locator(RegisterPatientLocator.pelayanan.btnLanjutkan);
    this.queuePrintDialog = page.locator(RegisterPatientLocator.queuePrintModal.dialog);
    this.queuePrintContinueButton = page.locator(
      RegisterPatientLocator.queuePrintModal.continueButton,
    );
    this.navbar = new NavbarComponent(page);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async openFromNavbar(menu: string, submenu: string): Promise<void> {
    const { menu: expectedMenu, submenu: expectedSubmenu } =
      PatientFixture.registerPatientNavigation;

    if (menu !== expectedMenu || submenu !== expectedSubmenu) {
      throw new Error(
        `Menu '${menu}' dengan submenu '${submenu}' belum didukung oleh RegisterPatientPage.`,
      );
    }

    await this.navbar.openPendaftaranPasienV2();
    await this.verifyOnPendaftaranListPage();
  }

  async verifyOnPendaftaranListPage(): Promise<void> {
    await this.expectUrlMatches(RegisterPatientData.url.pendaftaranListPage);
    await this.expectVisible(this.panelTitle);
    await this.expectVisible(this.tambahButton);
  }

  async clickTambahOnPendaftaranPage(): Promise<void> {
    await this.click(this.tambahButton);
    await this.expectUrlMatches(RegisterPatientData.url.registerPatientPage);
    await expect(this.patientSearchInput).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.expectVisible(this.panelKiriHeading);
  }

  async searchExistingPatient(keyword: string): Promise<void> {
    await expect(this.patientSearchInput).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.patientSearchInput.fill(keyword);
    await expect(this.suggestDropdown).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.suggestItem.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async selectExistingPatientFromSuggest(expectedName: string): Promise<void> {
    if (await this.isPatientDisplayedInPanel(expectedName)) {
      await this.waitForPelayananFormReady();
      return;
    }

    const namePattern = new RegExp(escapeRegExp(expectedName), "i");
    const item = this.suggestDropdown.locator(".sfg-item").filter({ hasText: namePattern }).first();

    await expect(item).toBeVisible({ timeout: ENV.TIMEOUT });
    await item.scrollIntoViewIfNeeded();
    await item.click({ force: true });
    await expect(this.panelKiriTable).toContainText(expectedName, {
      timeout: ENV.TIMEOUT,
      ignoreCase: true,
    });
    await this.waitForPelayananFormReady();
  }

  private async isPatientDisplayedInPanel(expectedName: string): Promise<boolean> {
    try {
      await expect(this.panelKiriTable).toContainText(expectedName, {
        timeout: ENV.OPTIONAL_DIALOG_TIMEOUT,
        ignoreCase: true,
      });

      return true;
    } catch {
      return false;
    }
  }

  private async waitForPelayananFormReady(): Promise<void> {
    await expect(this.pelayananHeading).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.penjaminSelect).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async verifyPanelDisplaysPatient(expectedName: string): Promise<void> {
    await this.expectVisible(this.panelKiriHeading);
    await this.expectVisible(this.panelKiriTable);

    const label = CreatePatientData.panelKiri.labels.namaLengkap;
    const row = this.panelKiriTable.locator("tr").filter({
      has: this.page.getByRole("cell", { name: label, exact: true }),
    });
    const valueCell = row.locator("td").nth(1);

    await expect(valueCell).toBeVisible({ timeout: ENV.TIMEOUT });

    const actual = ((await valueCell.textContent()) ?? "").replace(/\s+/g, " ").trim();

    expect(actual.toUpperCase()).toContain(expectedName.toUpperCase());
  }

  async verifyOnRegisterPatientPage(): Promise<void> {
    await this.expectUrlMatches(RegisterPatientData.url.registerPatientPage);
    await this.expectVisible(this.pelayananHeading);
  }

  async fillPelayananFormKunjunganSakit(): Promise<void> {
    const defaults = RegisterPatientData.pelayanan.defaults;

    await this.expectVisible(this.pelayananHeading);
    await this.selectWaktuKunjunganHariIni();
    await this.selectJenisKunjunganSakit();
    await this.selectPenjaminIfEmpty(defaults.penjamin);
    await this.selectSkriningVisualIfNeeded(defaults.skriningVisual);
    await this.selectInstalasi(defaults.instalasi);
    await this.selectPoliRuangan(defaults.poliRuangan);
    await this.selectRandomJadwalPraktik();
    await expect(this.btnLanjutkan).toBeEnabled({ timeout: ENV.TIMEOUT });
  }

  async selectInstalasi(instalasiName: string): Promise<void> {
    const instalasiButton = this.instalasiButtons.filter({
      hasText: new RegExp(escapeRegExp(instalasiName), "i"),
    });

    const button = instalasiButton.first();

    await button.scrollIntoViewIfNeeded();
    await expect(button).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await button.evaluate((element) => element.classList.contains("radio-btn-selected")))) {
      await this.click(button);
    }

    await expect(button).toHaveClass(/radio-btn-selected/);
    await this.waitForPoliRuanganOptions();
  }

  async selectPoliRuangan(poliName: string): Promise<void> {
    await this.waitForPoliRuanganOptions();

    const matchingPoli = this.poliRuanganButtons.filter({
      hasText: new RegExp(escapeRegExp(poliName), "i"),
    });

    await expect(matchingPoli.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const poliButton = matchingPoli.first();

    await poliButton.scrollIntoViewIfNeeded();
    await expect(poliButton).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await poliButton.evaluate((element) => element.classList.contains("radio-btn-selected")))) {
      await this.click(poliButton);
    }

    await expect(poliButton).toHaveClass(/radio-btn-selected/);
    await this.waitForJadwalPraktikOptions();
  }

  async selectRandomJadwalPraktik(): Promise<string> {
    await this.waitForJadwalPraktikOptions();

    const optionCount = await this.jadwalPraktikOptions.count();

    if (optionCount === 0) {
      throw new Error("Jadwal Praktik tidak memiliki opsi pilihan setelah memilih Poli Ruangan.");
    }

    const randomIndex = RandomHelper.pickRandomIndex(optionCount);
    const selectedOption = this.jadwalPraktikOptions.nth(randomIndex);
    const selectedText = ((await selectedOption.innerText()) ?? "").replace(/\s+/g, " ").trim();

    await selectedOption.scrollIntoViewIfNeeded();
    await this.click(selectedOption);
    await expect(selectedOption).toHaveClass(/radio-btn-selected/);

    return selectedText;
  }

  private async selectJenisKunjunganSakit(): Promise<void> {
    const kunjunganSakitRadio = this.page.getByRole("radio", { name: "Kunjungan Sakit", exact: true });

    if (!(await this.kunjunganSakit.isChecked())) {
      await kunjunganSakitRadio.check();
    }

    await expect(this.kunjunganSakit).toBeChecked();
  }

  private async waitForPoliRuanganOptions(): Promise<void> {
    await expect(this.poliRuanganFormGroup).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.poliRuanganFormGroup).not.toContainText(
      RegisterPatientData.pelayanan.poliPlaceholderText,
      { timeout: ENV.TIMEOUT },
    );
    await expect(this.poliRuanganButtons.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async waitForJadwalPraktikOptions(): Promise<void> {
    await expect(this.jadwalPraktikFormGroup).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.jadwalPraktikOptions.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async selectWaktuKunjunganHariIni(): Promise<void> {
    const hariIniButton = this.waktuKunjunganHariIni.first();

    await expect(hariIniButton).toBeVisible({ timeout: ENV.TIMEOUT });

    if (!(await hariIniButton.evaluate((element) => element.classList.contains("radio-btn-selected")))) {
      await this.click(hariIniButton);
    }

    await expect(hariIniButton).toHaveClass(/radio-btn-selected/);
  }

  private async selectSkriningVisualIfNeeded(skriningValue: string): Promise<void> {
    void skriningValue;

    const skriningRadio = this.page.getByRole("radio", { name: "Pasien stabil", exact: true });

    if (!(await this.skriningVisualPasienStabil.isChecked())) {
      await skriningRadio.check();
    }

    await expect(this.skriningVisualPasienStabil).toBeChecked();
  }

  private async selectPenjaminIfEmpty(penjaminLabel: string): Promise<void> {
    await expect(this.penjaminSelect).toBeVisible({ timeout: ENV.TIMEOUT });

    const currentValue = await this.penjaminSelect.inputValue();

    if (!currentValue) {
      await this.penjaminSelect.selectOption({ label: penjaminLabel });
    }

    await expect(this.penjaminSelect).toHaveValue(/.+/);
  }

  async clickLanjutkanPendaftaran(): Promise<void> {
    await expect(this.btnLanjutkan).toBeEnabled();
    await this.click(this.btnLanjutkan);
  }

  async captureRegistrationAlertScreenshot(): Promise<Buffer | null> {
    return this.sweetAlert.captureVisiblePopup(RegisterPatientData.alert.screenshotFileName);
  }

  private async dismissQueuePrintModalIfVisible(): Promise<boolean> {
    const continueButton = this.queuePrintContinueButton.first();

    await continueButton.waitFor({ state: "visible", timeout: ENV.TIMEOUT }).catch(() => undefined);

    if (!(await continueButton.isVisible().catch(() => false))) {
      return false;
    }

    await continueButton.click({ force: true, noWaitAfter: true });
    await expect(this.queuePrintDialog.first()).toBeHidden({ timeout: ENV.TIMEOUT });

    return true;
  }

  private async throwRegistrationAlertError(prefix: string, message: string): Promise<never> {
    await this.captureRegistrationAlertScreenshot();

    throw new Error(
      `${prefix}: ${message}. Screenshot alert: screenshots/${RegisterPatientData.alert.screenshotFileName}.png`,
    );
  }

  async verifyPendaftaranSuccess(): Promise<void> {
    if (await this.dismissQueuePrintModalIfVisible()) {
      return;
    }

    const popup = this.sweetAlert.popup.first();

    await popup.waitFor({ state: "visible", timeout: ENV.TIMEOUT }).catch(() => undefined);

    if (await popup.isVisible()) {
      const message = (await this.sweetAlert.readMessage()) ?? "";

      if (RegisterPatientData.alert.queuePrintModalPattern.test(message)) {
        await this.dismissQueuePrintModalIfVisible();
        return;
      }

      if (RegisterPatientData.alert.registrationFailurePattern.test(message)) {
        await this.throwRegistrationAlertError("Pendaftaran pasien gagal", message);
      }

      if (RegisterPatientData.alert.registrationSuccessPattern.test(message)) {
        await this.sweetAlert.closeIfVisible();
        return;
      }

      await this.throwRegistrationAlertError("Alert pendaftaran tidak dikenali", message);
    }

    await expect(this.page).not.toHaveURL(RegisterPatientData.url.registerPatientPage, {
      timeout: ENV.TIMEOUT,
    });
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
