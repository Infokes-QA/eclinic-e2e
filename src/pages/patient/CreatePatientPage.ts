import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { CreatePatientData } from "../../data/patient/create-patient.data";
import { PatientFixture } from "../../fixtures/patient.fixture";
import { RandomHelper } from "../../helpers/random.helper";
import { ScreenshotHelper } from "../../helpers/screenshot.helper";
import { CreatePatientLocator } from "../../locators/patient/create-patient.locator";
import {
  CreatedPatientSnapshot,
  PatientAlamatLengkapInput,
  PatientDataLainnyaInput,
  PatientFormInput,
  PatientGender,
  PatientGolonganDarah,
  PatientWargaNegara,
} from "../../types/patient.type";
import { BasePage } from "../base/BasePage";
import { NavbarComponent } from "../components/NavbarComponent";
import { NotifyComponent } from "../components/NotifyComponent";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class CreatePatientPage extends BasePage {
  readonly panelTitle: Locator;
  readonly fiturTundaButton: Locator;
  readonly tambahButton: Locator;
  readonly daftarLaboratoriumButton: Locator;
  readonly daftarRencanaKontrolButton: Locator;
  readonly printButton: Locator;
  readonly exportExcelButton: Locator;
  readonly btnNewCreatePatient: Locator;

  readonly createPatientModal: Locator;
  readonly modalTitle: Locator;
  readonly btnSavePatient: Locator;
  readonly verifiedCheckbox: Locator;

  readonly noKKInput: Locator;
  readonly nikInput: Locator;
  readonly namaInput: Locator;
  readonly phoneInput: Locator;
  readonly tanggalLahirInput: Locator;
  readonly tempatLahirInput: Locator;
  readonly alamatDomisiliInput: Locator;
  readonly asuransiSelect: Locator;
  readonly wargaNegaraSelect: Locator;
  readonly golonganDarahSelect: Locator;
  readonly jenisKelaminLakiLakiRadio: Locator;
  readonly jenisKelaminPerempuanRadio: Locator;
  readonly inputAlamatLengkapLink: Locator;
  readonly inputDataLainnyaLink: Locator;
  readonly sembunyikanLinks: Locator;

  readonly rtInput: Locator;
  readonly rwInput: Locator;
  readonly propinsiInput: Locator;
  readonly kotaKabInput: Locator;
  readonly kecamatanInput: Locator;
  readonly kelurahanDesaInput: Locator;
  readonly autocompleteOption: Locator;

  readonly pekerjaanInput: Locator;
  readonly agamaSelect: Locator;
  readonly pendidikanSelect: Locator;
  readonly statusPerkawinanSelect: Locator;
  readonly emailInput: Locator;
  readonly namaAyahInput: Locator;
  readonly namaIbuInput: Locator;
  readonly hubunganKeluargaInput: Locator;

  readonly panelKiri: Locator;
  readonly panelKiriHeading: Locator;
  readonly panelKiriTable: Locator;
  readonly panelKiriExpandLink: Locator;

  readonly navbar: NavbarComponent;
  readonly notify: NotifyComponent;
  readonly sweetAlert: SweetAlertComponent;

  private savedNotifyMessage?: string;

  constructor(page: Page) {
    super(page);

    this.panelTitle = page.locator(CreatePatientLocator.page.panelTitle);
    this.fiturTundaButton = page.locator(CreatePatientLocator.actionButtonMenu.fiturTunda);
    this.tambahButton = page.locator(CreatePatientLocator.actionButtonMenu.tambah);
    this.daftarLaboratoriumButton = page.locator(
      CreatePatientLocator.actionButtonMenu.daftarLaboratorium,
    );
    this.daftarRencanaKontrolButton = page.locator(
      CreatePatientLocator.actionButtonMenu.daftarRencanaKontrol,
    );
    this.printButton = page.locator(CreatePatientLocator.actionButtonMenu.print);
    this.exportExcelButton = page.locator(CreatePatientLocator.actionButtonMenu.exportExcel);
    this.btnNewCreatePatient = page.locator(CreatePatientLocator.actionButton.btnNewCreatePatient);

    this.createPatientModal = page.locator(CreatePatientLocator.modal.dialog);
    this.modalTitle = this.createPatientModal.locator(CreatePatientLocator.modal.title);
    this.btnSavePatient = this.createPatientModal.locator(
      CreatePatientLocator.actionButton.btnSavePatient,
    );
    this.verifiedCheckbox = this.createPatientModal.locator(
      CreatePatientLocator.checkbox.verifiedCheckbox,
    );

    const modal = this.createPatientModal;

    this.noKKInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.noKK);
    this.nikInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.nik);
    this.namaInput = modal.locator(CreatePatientLocator.form.namaInput).first();
    this.phoneInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.noHP);
    this.tanggalLahirInput = modal.locator(CreatePatientLocator.form.tanggalLahir);
    this.tempatLahirInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.tempatLahir);
    this.alamatDomisiliInput = modal.getByPlaceholder(
      CreatePatientLocator.placeholder.alamatDomisili,
    );
    this.asuransiSelect = modal.locator(CreatePatientLocator.form.asuransiSelect).first();
    this.wargaNegaraSelect = modal.locator(CreatePatientLocator.select.wargaNegara);
    this.golonganDarahSelect = modal.locator(CreatePatientLocator.select.golonganDarah);
    this.jenisKelaminLakiLakiRadio = modal.locator(CreatePatientLocator.form.jenisKelaminLakiLaki);
    this.jenisKelaminPerempuanRadio = modal.locator(
      CreatePatientLocator.form.jenisKelaminPerempuan,
    );
    this.inputAlamatLengkapLink = modal
      .locator("a")
      .filter({ hasText: new RegExp(CreatePatientLocator.link.inputAlamatLengkap, "i") });
    this.inputDataLainnyaLink = modal
      .locator("a")
      .filter({ hasText: new RegExp(CreatePatientLocator.link.inputDataLainnya, "i") });
    this.sembunyikanLinks = modal
      .locator("a")
      .filter({ hasText: new RegExp(CreatePatientLocator.link.sembunyikan, "i") });

    this.rtInput = modal.locator(CreatePatientLocator.alamatLengkap.rt);
    this.rwInput = modal.locator(CreatePatientLocator.alamatLengkap.rw);
    this.propinsiInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.propinsi);
    this.kotaKabInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.kotaKab);
    this.kecamatanInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.kecamatan);
    this.kelurahanDesaInput = modal.getByPlaceholder(
      CreatePatientLocator.placeholder.kelurahanDesa,
    );
    this.autocompleteOption = page.locator(CreatePatientLocator.alamatLengkap.autocompleteOption);

    this.pekerjaanInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.pekerjaan);
    this.agamaSelect = modal.locator(CreatePatientLocator.select.agama);
    this.pendidikanSelect = modal.locator(CreatePatientLocator.select.pendidikan);
    this.statusPerkawinanSelect = modal.locator(CreatePatientLocator.select.statusPerkawinan);
    this.emailInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.email);
    this.namaAyahInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.namaAyah);
    this.namaIbuInput = modal.getByPlaceholder(CreatePatientLocator.placeholder.namaIbu);
    this.hubunganKeluargaInput = modal.getByPlaceholder(
      CreatePatientLocator.placeholder.hubunganKeluarga,
    );

    this.panelKiri = page.locator(CreatePatientLocator.panelKiri.container);
    this.panelKiriHeading = page.locator(CreatePatientLocator.panelKiri.heading);
    this.panelKiriTable = page.locator(CreatePatientLocator.panelKiri.table);
    this.panelKiriExpandLink = page.locator(CreatePatientLocator.panelKiri.lihatSelengkapnya);

    this.navbar = new NavbarComponent(page);
    this.notify = new NotifyComponent(page);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async openFromNavbar(menu: string, submenu: string): Promise<void> {
    const { menu: expectedMenu, submenu: expectedSubmenu } =
      PatientFixture.createPatientNavigation;

    if (menu !== expectedMenu || submenu !== expectedSubmenu) {
      throw new Error(
        `Menu '${menu}' dengan submenu '${submenu}' belum didukung oleh CreatePatientPage.`,
      );
    }

    await this.navbar.openCreatePasien();
  }

  async verifyCreatePatientPageDisplayed(): Promise<void> {
    await this.expectUrlMatches(CreatePatientData.url.createPatientPage);
    await this.expectVisible(this.panelTitle);
    await this.expectVisible(this.tambahButton);
    await this.expectVisible(this.daftarRencanaKontrolButton);
    await this.expectVisible(this.printButton);
    await this.expectVisible(this.exportExcelButton);
  }

  async openCreatePatientModal(): Promise<void> {
    await this.click(this.tambahButton);
    await this.expectVisible(this.btnNewCreatePatient);
    await this.click(this.btnNewCreatePatient);
    await this.verifyCreatePatientModalDisplayed();
  }

  async verifyCreatePatientModalDisplayed(): Promise<void> {
    await this.expectVisible(this.createPatientModal);
    await this.expectVisible(this.modalTitle);
    await this.expectVisible(this.btnSavePatient);
    await this.expectVisible(this.nikInput);
  }

  async setVerifiedDataComplete(isComplete: boolean): Promise<void> {
    if (isComplete) {
      await this.verifiedCheckbox.check();
      await expect(this.rtInput).toBeVisible({ timeout: ENV.TIMEOUT });
      await expect(this.pekerjaanInput).toBeVisible({ timeout: ENV.TIMEOUT });
      return;
    }

    await this.verifiedCheckbox.uncheck();
    await expect(this.inputAlamatLengkapLink).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.inputDataLainnyaLink).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async setVerifiedCheckboxState(state: "dicentang" | "tidak dicentang"): Promise<void> {
    await this.setVerifiedDataComplete(state === "dicentang");
  }

  async verifyRingkasFormMode(): Promise<void> {
    await expect(this.verifiedCheckbox).not.toBeChecked();
    await this.expectVisible(this.createPatientModal);
    await this.expectVisible(this.modalTitle);
    await this.expectVisible(this.btnSavePatient);
    await this.expectVisible(this.alamatDomisiliInput);
    await this.expectVisible(this.inputAlamatLengkapLink);
    await this.expectVisible(this.inputDataLainnyaLink);

    await expect(this.rtInput).not.toBeVisible();
    await expect(this.rwInput).not.toBeVisible();
    await expect(this.propinsiInput).not.toBeVisible();
    await expect(this.kotaKabInput).not.toBeVisible();
    await expect(this.kecamatanInput).not.toBeVisible();
    await expect(this.kelurahanDesaInput).not.toBeVisible();
    await expect(this.pekerjaanInput).not.toBeVisible();
    await expect(this.agamaSelect).not.toBeVisible();
    await expect(this.pendidikanSelect).not.toBeVisible();
    await expect(this.statusPerkawinanSelect).not.toBeVisible();
    await expect(this.sembunyikanLinks.filter({ visible: true })).toHaveCount(0);

    for (const label of CreatePatientData.formMode.ringkas.requiredLabels) {
      await this.expectFieldRequired(label);
    }

    for (const label of CreatePatientData.formMode.ringkas.optionalVisibleLabels) {
      await this.expectFieldVisibleWithoutRequired(label);
    }
  }

  async verifyLengkapFormMode(): Promise<void> {
    await expect(this.verifiedCheckbox).toBeChecked();
    await this.expectVisible(this.createPatientModal);
    await this.expectVisible(this.modalTitle);
    await this.expectVisible(this.btnSavePatient);
    await this.expectVisible(this.alamatDomisiliInput);
    await this.expectVisible(this.tanggalLahirInput);
    await this.expectVisible(this.rtInput);
    await this.expectVisible(this.rwInput);
    await this.expectVisible(this.propinsiInput);
    await this.expectVisible(this.kotaKabInput);
    await this.expectVisible(this.kecamatanInput);
    await this.expectVisible(this.kelurahanDesaInput);
    await this.expectVisible(this.pekerjaanInput);
    await this.expectVisible(this.agamaSelect);
    await this.expectVisible(this.pendidikanSelect);
    await this.expectVisible(this.statusPerkawinanSelect);
    await this.expectVisible(this.emailInput);

    await expect(this.inputAlamatLengkapLink).not.toBeVisible();
    await expect(this.inputDataLainnyaLink).not.toBeVisible();
    await expect(this.sembunyikanLinks.filter({ visible: true }).first()).toBeVisible();

    for (const label of CreatePatientData.formMode.lengkap.requiredLabels) {
      await this.expectFieldRequired(label);
    }
  }

  private formGroupByLabel(labelText: string): Locator {
    return this.createPatientModal.locator(
      `div.form-group:has(label:has-text("${labelText}"))`,
    );
  }

  private async expectFieldRequired(labelText: string): Promise<void> {
    const label = this.formGroupByLabel(labelText).locator("label").first();

    await expect(label).toBeVisible();
    await expect(label).toContainText("*");
  }

  private async expectFieldVisibleWithoutRequired(labelText: string): Promise<void> {
    const formGroup = this.formGroupByLabel(labelText);
    const label = formGroup.locator("label").first();

    await expect(formGroup).toBeVisible();
    await expect(label).toBeVisible();
    await expect(label).not.toContainText("*");
  }

  async selectInsuranceByLabel(insuranceName: string): Promise<void> {
    if (!(await this.asuransiSelect.isVisible())) {
      return;
    }

    await this.asuransiSelect.scrollIntoViewIfNeeded();

    try {
      await this.asuransiSelect.selectOption({ label: insuranceName });
    } catch {
      await this.asuransiSelect.selectOption({ index: 1 });
    }

    await expect(this.asuransiSelect).not.toHaveValue("");
  }

  async selectWargaNegara(wargaNegara: PatientWargaNegara): Promise<void> {
    await this.wargaNegaraSelect.selectOption({ value: wargaNegara });
  }

  async ensureWargaNegaraIndonesia(): Promise<void> {
    await this.selectWargaNegara(CreatePatientData.defaults.wargaNegara);
  }

  async selectGolonganDarah(golonganDarah: PatientGolonganDarah): Promise<void> {
    if (!(await this.golonganDarahSelect.isVisible())) {
      return;
    }

    try {
      await this.golonganDarahSelect.selectOption({ value: golonganDarah });
    } catch {
      await this.golonganDarahSelect.selectOption({ index: 1 });
    }
  }

  async fillNoKK(noKK: string): Promise<void> {
    await this.fill(this.noKKInput, noKK);
  }

  async fillNik(nik: string): Promise<void> {
    await this.fill(this.nikInput, nik);
  }

  async fillNama(nama: string): Promise<void> {
    await this.namaInput.scrollIntoViewIfNeeded();
    await this.namaInput.fill(nama);
    await this.namaInput.blur();
    await this.expectInputValueIgnoreCase(this.namaInput, nama);
  }

  async fillPhoneNumber(phoneNumber: string): Promise<void> {
    await this.fill(this.phoneInput, phoneNumber);
  }

  async fillTanggalLahir(tanggalLahir: string): Promise<void> {
    if (!(await this.tanggalLahirInput.isVisible())) {
      return;
    }

    const [day, month, year] = tanggalLahir.split("/");
    const formattedDate = `${year}-${month}-${day}`;

    await this.tanggalLahirInput.scrollIntoViewIfNeeded();
    await this.tanggalLahirInput.fill(formattedDate);
    await this.tanggalLahirInput.evaluate((element, value) => {
      const input = element as HTMLInputElement;

      if (input.value !== value) {
        input.value = value;
      }

      input.dispatchEvent(new Event("input", { bubbles: true }));
      input.dispatchEvent(new Event("change", { bubbles: true }));
    }, formattedDate);
    await this.tanggalLahirInput.blur();
    await expect(this.tanggalLahirInput).toHaveValue(formattedDate);
  }

  async selectJenisKelamin(gender: PatientGender): Promise<void> {
    const genderLocator =
      gender === "LAKI-LAKI"
        ? this.jenisKelaminLakiLakiRadio
        : this.jenisKelaminPerempuanRadio;

    await genderLocator.check();
    await expect(genderLocator).toBeChecked();
  }

  async fillTempatLahir(tempatLahir: string): Promise<void> {
    await this.fill(this.tempatLahirInput, tempatLahir);
  }

  async fillAlamatDomisili(alamatDomisili: string): Promise<void> {
    await this.fill(this.alamatDomisiliInput, alamatDomisili);
  }

  async expandInputAlamatLengkapIfNeeded(): Promise<void> {
    if (await this.rtInput.isVisible()) {
      return;
    }

    await this.click(this.inputAlamatLengkapLink);
    await this.expectVisible(this.rtInput);
  }

  async expandInputDataLainnyaIfNeeded(): Promise<void> {
    if (await this.pekerjaanInput.isVisible()) {
      return;
    }

    await this.click(this.inputDataLainnyaLink);
    await this.expectVisible(this.pekerjaanInput);
  }

  async fillRt(rt: string): Promise<void> {
    await this.fill(this.rtInput, rt);
  }

  async fillRw(rw: string): Promise<void> {
    await this.fill(this.rwInput, rw);
  }

  async fillPropinsi(propinsi?: string): Promise<string> {
    // return this.selectAutocompleteWithSpaces(this.propinsiInput, propinsi);
    return this.selectAutocompleteOption(
      this.propinsiInput,
      propinsi ?? CreatePatientData.alamatLengkap.propinsi,
    );
  }

  async fillKotaKab(kotaKab?: string): Promise<string> {
    // return this.selectAutocompleteWithSpaces(this.kotaKabInput, kotaKab);
    return this.selectAutocompleteOption(
      this.kotaKabInput,
      kotaKab ?? CreatePatientData.alamatLengkap.kotaKab,
    );
  }

  async fillKecamatan(kecamatan?: string): Promise<string> {
    // return this.selectAutocompleteWithSpaces(this.kecamatanInput, kecamatan);
    return this.selectAutocompleteOption(
      this.kecamatanInput,
      kecamatan ?? CreatePatientData.alamatLengkap.kecamatan,
    );
  }

  async fillKelurahanDesa(kelurahanDesa?: string): Promise<string> {
    // return this.selectAutocompleteWithSpaces(this.kelurahanDesaInput, kelurahanDesa);
    return this.selectAutocompleteOption(
      this.kelurahanDesaInput,
      kelurahanDesa ?? CreatePatientData.alamatLengkap.kelurahanDesa,
    );
  }

  async fillAlamatLengkap(input: PatientAlamatLengkapInput): Promise<PatientAlamatLengkapInput> {
    await this.expandInputAlamatLengkapIfNeeded();
    await this.fillRt(input.rt);
    await this.fillRw(input.rw);

    const propinsi = await this.fillPropinsi(input.propinsi);
    const kotaKab = await this.fillKotaKab(input.kotaKab);
    const kecamatan = await this.fillKecamatan(input.kecamatan);
    const kelurahanDesa = await this.fillKelurahanDesa(input.kelurahanDesa);

    return {
      rt: input.rt,
      rw: input.rw,
      propinsi,
      kotaKab,
      kecamatan,
      kelurahanDesa,
    };
  }

  async fillPekerjaan(pekerjaan?: string): Promise<string> {
    // return this.selectAutocompleteWithSpaces(this.pekerjaanInput, pekerjaan);
    return this.selectAutocompleteOption(
      this.pekerjaanInput,
      pekerjaan ?? RandomHelper.generateJobSearch(),
    );
  }

  async selectAgama(agama: PatientDataLainnyaInput["agama"]): Promise<void> {
    await this.agamaSelect.selectOption({ value: agama });
  }

  async selectPendidikan(pendidikan: PatientDataLainnyaInput["pendidikan"]): Promise<void> {
    await this.pendidikanSelect.selectOption({ value: pendidikan });
  }

  async selectStatusPerkawinan(
    statusPerkawinan: PatientDataLainnyaInput["statusPerkawinan"],
  ): Promise<void> {
    await this.statusPerkawinanSelect.selectOption({ value: statusPerkawinan });
  }

  async fillEmail(email: string): Promise<void> {
    await this.fill(this.emailInput, email);
  }

  async fillNamaAyah(namaAyah: string): Promise<void> {
    await this.fill(this.namaAyahInput, namaAyah);
  }

  async fillNamaIbu(namaIbu: string): Promise<void> {
    await this.fill(this.namaIbuInput, namaIbu);
  }

  async fillHubunganKeluarga(hubunganKeluarga: string): Promise<void> {
    await this.fill(this.hubunganKeluargaInput, hubunganKeluarga);
  }

  async fillDataLainnya(input: PatientDataLainnyaInput): Promise<PatientDataLainnyaInput> {
    await this.expandInputDataLainnyaIfNeeded();

    const pekerjaan = await this.fillPekerjaan(input.pekerjaan);
    await this.selectAgama(input.agama);
    await this.selectPendidikan(input.pendidikan);
    await this.selectStatusPerkawinan(input.statusPerkawinan);
    await this.fillEmail(input.email);
    await this.fillNamaAyah(input.namaAyah);
    await this.fillNamaIbu(input.namaIbu);
    await this.fillHubunganKeluarga(input.hubunganKeluarga);

    return {
      ...input,
      pekerjaan,
    };
  }

  async fillPatientForm(input: PatientFormInput): Promise<PatientFormInput> {
    await this.ensureWargaNegaraIndonesia();

    await this.fillNik(input.nik);
    await this.fillNoKK(input.noKK);
    await this.fillNama(input.nama);
    await this.fillPhoneNumber(input.phoneNumber);
    await this.fillTanggalLahir(input.tanggalLahir);
    await this.fillTempatLahir(input.tempatLahir);
    await this.fillAlamatDomisili(input.alamatDomisili);
    await this.selectJenisKelamin(input.jenisKelamin);

    if (input.golonganDarah) {
      await this.selectGolonganDarah(input.golonganDarah);
    }

    if (input.insuranceName) {
      await this.selectInsuranceByLabel(input.insuranceName);
    }

    if (input.alamatLengkap) {
      input.alamatLengkap = await this.fillAlamatLengkap(input.alamatLengkap);
    }

    if (input.dataLainnya) {
      input.dataLainnya = await this.fillDataLainnya(input.dataLainnya);
    }

    await this.ensureNamaFilled(input.nama);

    return input;
  }

  async fillPatientFormWithFakeDataRingkas(): Promise<PatientFormInput> {
    await this.setVerifiedDataComplete(false);
    await this.verifyRingkasFormMode();

    const input = PatientFixture.buildRandomInputRingkas();

    return this.fillPatientForm(input);
  }

  async fillPatientFormWithFakeDataLengkap(): Promise<PatientFormInput> {
    await this.setVerifiedDataComplete(true);
    await this.verifyLengkapFormMode();

    const input = PatientFixture.buildRandomInputLengkap();
    const filledInput = await this.fillPatientForm(input);

    await this.ensureFormValidForSave();

    return filledInput;
  }

  async clickSavePatientButton(): Promise<void> {
    await this.btnSavePatient.scrollIntoViewIfNeeded();
    await this.ensureFormValidForSave();

    const toastCapture = this.captureSaveNotifyToast();

    await this.click(this.btnSavePatient);
    await this.handleSaveConfirmation();
    await toastCapture;
  }

  private async handleSaveConfirmation(): Promise<void> {
    const confirmButton = this.sweetAlert.confirmButton.first();

    await confirmButton
      .waitFor({ state: "visible", timeout: ENV.OPTIONAL_DIALOG_TIMEOUT })
      .catch(() => undefined);

    if (await confirmButton.isVisible()) {
      await confirmButton.click();
    }
  }

  private async captureSaveNotifyToast(): Promise<void> {
    this.savedNotifyMessage = undefined;

    const validationWatcher = this.watchValidationToast();
    const successWatcher = this.notify.waitForMessageMatching(
      CreatePatientData.alert.saveSuccessMessage,
    );

    this.savedNotifyMessage = await Promise.race([successWatcher, validationWatcher]);
  }

  private watchValidationToast(): Promise<never> {
    const validationToast = this.notify
      .messageWithText(CreatePatientData.alert.validationPattern)
      .first();

    return validationToast
      .waitFor({ state: "visible", timeout: ENV.TIMEOUT })
      .then(async () => {
        const message = ((await validationToast.textContent()) ?? "").replace(/\s+/g, " ").trim();

        throw new Error(`Validasi form gagal: ${message}`);
      });
  }

  private async expectInputValueIgnoreCase(locator: Locator, expected: string): Promise<void> {
    expect((await locator.inputValue()).toUpperCase()).toBe(expected.toUpperCase());
  }

  async verifyPatientFormFilled(input: PatientFormInput): Promise<void> {
    await expect(this.nikInput).toHaveValue(input.nik);
    await expect(this.noKKInput).toHaveValue(input.noKK);
    await this.expectInputValueIgnoreCase(this.namaInput, input.nama);
    await expect(this.phoneInput).toHaveValue(input.phoneNumber);
    await this.expectInputValueIgnoreCase(this.tempatLahirInput, input.tempatLahir);
    await this.expectInputValueIgnoreCase(this.alamatDomisiliInput, input.alamatDomisili);

    if (await this.tanggalLahirInput.isVisible()) {
      const [day, month, year] = input.tanggalLahir.split("/");
      await expect(this.tanggalLahirInput).toHaveValue(`${year}-${month}-${day}`);
    }

    if (input.alamatLengkap?.propinsi) {
      await expect(this.propinsiInput).toHaveValue(input.alamatLengkap.propinsi);
    }

    if (input.alamatLengkap?.kotaKab) {
      await expect(this.kotaKabInput).toHaveValue(input.alamatLengkap.kotaKab);
    }

    if (input.dataLainnya?.pekerjaan) {
      await expect(this.pekerjaanInput).toHaveValue(input.dataLainnya.pekerjaan);
    }
  }

  private invalidFormControls(): Locator {
    return this.createPatientModal
      .locator("input:invalid, select:invalid, textarea:invalid")
      .filter({ visible: true });
  }

  private async ensureFormValidForSave(): Promise<void> {
    await this.ensureNamaFilled();
    await this.ensureTanggalLahirValid();
    await this.ensureAsuransiSelected();
    await this.ensureJenisKelaminValid();
    await this.ensureRequiredSelectsValid();
    await this.ensureInvalidAutocompleteFieldsValid();

    const invalidFields = this.invalidFormControls();
    const invalidFieldCount = await invalidFields.count();

    if (invalidFieldCount === 0) {
      return;
    }

    const hints: string[] = [];

    for (let index = 0; index < invalidFieldCount; index++) {
      hints.push(await this.describeInvalidField(invalidFields.nth(index)));
    }

    throw new Error(
      `Form belum valid saat simpan. Ada ${invalidFieldCount} field invalid. Contoh: ${hints.join(" || ")}`,
    );
  }

  private async ensureTanggalLahirValid(fallbackDate = "15/06/1990"): Promise<void> {
    if (!(await this.tanggalLahirInput.isVisible())) {
      return;
    }

    const isInvalid = await this.tanggalLahirInput.evaluate(
      (element) => element instanceof HTMLInputElement && !element.checkValidity(),
    );
    const currentValue = await this.tanggalLahirInput.inputValue();

    if (!currentValue || isInvalid) {
      await this.fillTanggalLahir(fallbackDate);
    }
  }

  private async ensureAsuransiSelected(): Promise<void> {
    if (!(await this.asuransiSelect.isVisible())) {
      return;
    }

    const isInvalid = await this.asuransiSelect.evaluate(
      (element) => element instanceof HTMLSelectElement && !element.checkValidity(),
    );
    const selectedValue = await this.asuransiSelect.inputValue();

    if (selectedValue && !isInvalid) {
      return;
    }

    try {
      await this.asuransiSelect.selectOption({ label: PatientFixture.defaultInsuranceName });
    } catch {
      await this.asuransiSelect.selectOption({ index: 1 });
    }

    await expect(this.asuransiSelect).not.toHaveValue("");
  }

  private async ensureRequiredSelectsValid(): Promise<void> {
    const requiredSelects = [
      this.wargaNegaraSelect,
      this.agamaSelect,
      this.pendidikanSelect,
      this.statusPerkawinanSelect,
      this.golonganDarahSelect,
    ];

    for (const select of requiredSelects) {
      if (!(await select.isVisible())) {
        continue;
      }

      const isInvalid = await select.evaluate(
        (element) => element instanceof HTMLSelectElement && !element.checkValidity(),
      );

      if (!isInvalid) {
        continue;
      }

      const optionCount = await select.locator("option").count();

      if (optionCount > 1) {
        await select.selectOption({ index: 1 });
      }
    }
  }

  private async ensureJenisKelaminValid(): Promise<void> {
    const genderRadios = [this.jenisKelaminLakiLakiRadio, this.jenisKelaminPerempuanRadio];
    const visibleRadios: Locator[] = [];

    for (const radio of genderRadios) {
      if (await radio.isVisible()) {
        visibleRadios.push(radio);
      }
    }

    if (visibleRadios.length === 0) {
      return;
    }

    const hasChecked = await Promise.all(visibleRadios.map((radio) => radio.isChecked())).then(
      (states) => states.some(Boolean),
    );

    if (hasChecked) {
      return;
    }

    await visibleRadios[0].check();
    await expect(visibleRadios[0]).toBeChecked();
  }

  private async ensureInvalidAutocompleteFieldsValid(): Promise<void> {
    // const autocompleteInputs = [
    //   this.propinsiInput,
    //   this.kotaKabInput,
    //   this.kecamatanInput,
    //   this.kelurahanDesaInput,
    //   this.pekerjaanInput,
    // ];
    //
    // for (const input of autocompleteInputs) {
    //   if (!(await input.isVisible())) {
    //     continue;
    //   }
    //
    //   const isInvalid = await input.evaluate(
    //     (element) => element instanceof HTMLInputElement && !element.checkValidity(),
    //   );
    //
    //   if (!isInvalid) {
    //     continue;
    //   }
    //
    //   await this.selectAutocompleteWithSpaces(input);
    // }

    const autocompleteFields = [
      { input: this.propinsiInput, optionText: CreatePatientData.alamatLengkap.propinsi },
      { input: this.kotaKabInput, optionText: CreatePatientData.alamatLengkap.kotaKab },
      { input: this.kecamatanInput, optionText: CreatePatientData.alamatLengkap.kecamatan },
      { input: this.kelurahanDesaInput, optionText: CreatePatientData.alamatLengkap.kelurahanDesa },
      { input: this.pekerjaanInput, optionText: RandomHelper.generateJobSearch() },
    ];

    for (const field of autocompleteFields) {
      if (!(await field.input.isVisible())) {
        continue;
      }

      const isInvalid = await field.input.evaluate(
        (element) => element instanceof HTMLInputElement && !element.checkValidity(),
      );

      if (!isInvalid) {
        continue;
      }

      await this.selectAutocompleteOption(field.input, field.optionText);
      // await this.selectAutocompleteWithSpaces(field.input);
    }
  }

  private async describeInvalidField(field: Locator): Promise<string> {
    const fieldInfo = await field
      .evaluate((element) => {
        const tagName = element.tagName.toLowerCase();
        const labelFromFor = element.id
          ? document.querySelector<HTMLLabelElement>(`label[for="${element.id}"]`)?.textContent
          : null;
        const parentLabel = element
          .closest(".form-group")
          ?.querySelector("label")
          ?.textContent?.replace(/\s+/g, " ")
          .trim();

        if (
          element instanceof HTMLInputElement ||
          element instanceof HTMLSelectElement ||
          element instanceof HTMLTextAreaElement
        ) {
          return {
            tagName,
            label: parentLabel ?? labelFromFor?.replace(/\s+/g, " ").trim() ?? null,
            placeholder: element instanceof HTMLInputElement ? element.placeholder : null,
            name: element.name || null,
            id: element.id || null,
            type: element instanceof HTMLInputElement ? element.type : tagName,
            value: element.value || null,
            validationMessage: element.validationMessage || null,
          };
        }

        return {
          tagName,
          label: parentLabel ?? labelFromFor?.replace(/\s+/g, " ").trim() ?? null,
          placeholder: null,
          name: element.getAttribute("name"),
          id: element.id || null,
          type: null,
          value: null,
          validationMessage: null,
        };
      })
      .catch(() => null);

    if (!fieldInfo) {
      return "field tidak diketahui";
    }

    const parts = [
      fieldInfo.label,
      fieldInfo.placeholder,
      fieldInfo.name,
      fieldInfo.id,
      fieldInfo.type ? `type=${fieldInfo.type}` : null,
      fieldInfo.value ? `value=${fieldInfo.value}` : null,
      fieldInfo.validationMessage ? `validation=${fieldInfo.validationMessage}` : null,
      `tag=${fieldInfo.tagName}`,
    ].filter((part): part is string => Boolean(part && part.length > 0));

    return parts.join(" | ") || "field tidak diketahui";
  }

  private async selectAutocompleteOption(input: Locator, optionText: string): Promise<string> {
    await input.click();
    await input.clear();
    await input.fill(optionText);

    // Logic trigger autocomplete dengan spasi 3x (dinonaktifkan, pakai hardcode text)
    // for (let index = 0; index < CreatePatientData.autocomplete.spaceTriggerCount; index++) {
    //   await input.press(" ");
    // }

    await expect(this.autocompleteOption.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const option = await this.resolveAutocompleteOption(optionText);
    const selectedText = await this.getAutocompleteOptionText(option);

    await option.click();
    await input.blur();

    return selectedText;
  }

  // private async selectAutocompleteWithSpaces(
  //   input: Locator,
  //   optionText?: string,
  // ): Promise<string> {
  //   await input.click();
  //   await input.clear();
  //
  //   for (let index = 0; index < CreatePatientData.autocomplete.spaceTriggerCount; index++) {
  //     await input.press(" ");
  //   }
  //
  //   await expect(this.autocompleteOption.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  //
  //   const option = await this.resolveAutocompleteOption(optionText);
  //   const selectedText = await this.getAutocompleteOptionText(option);
  //
  //   await option.click();
  //   await input.blur();
  //
  //   return selectedText;
  // }

  private async resolveAutocompleteOption(optionText?: string): Promise<Locator> {
    if (optionText) {
      const matchedOption = this.autocompleteOption.filter({ hasText: optionText }).first();

      await expect(matchedOption).toBeVisible({ timeout: ENV.TIMEOUT });

      return matchedOption;
    }

    const optionCount = await this.autocompleteOption.count();

    if (optionCount === 0) {
      throw new Error("Autocomplete dropdown tidak memiliki opsi pilihan");
    }

    const randomIndex = RandomHelper.pickRandomIndex(optionCount);

    return this.autocompleteOption.nth(randomIndex);
  }

  private async getAutocompleteOptionText(option: Locator): Promise<string> {
    const optionText = await option.innerText();

    return optionText.replace(/\s+/g, " ").trim();
  }

  async captureSaveAlertScreenshot(): Promise<Buffer> {
    if (await this.notify.isVisible()) {
      return ScreenshotHelper.captureLocator(this.notify.visibleContainer(), "alert-simpan-pasien");
    }

    if (await this.sweetAlert.popup.first().isVisible()) {
      return ScreenshotHelper.captureLocator(this.sweetAlert.popup.first(), "alert-simpan-pasien");
    }

    return ScreenshotHelper.capture(this.page, "alert-simpan-pasien-redirect");
  }

  private async readSweetAlertMessage(): Promise<string> {
    const popup = this.sweetAlert.popup.first();
    const title = (await popup.locator(".swal2-title").textContent()) ?? "";
    const content = (await popup.locator(".swal2-html-container").textContent()) ?? "";

    return `${title} ${content}`.trim();
  }

  private async readVisibleSaveFeedbackMessage(): Promise<string | null> {
    if (this.savedNotifyMessage) {
      return this.savedNotifyMessage;
    }

    if (await this.notify.isVisible()) {
      return this.notify.readMessage();
    }

    if (await this.sweetAlert.popup.first().isVisible()) {
      return this.readSweetAlertMessage();
    }

    return null;
  }

  private assertSaveFeedbackIsFinal(message: string): void {
    if (CreatePatientData.alert.validationPattern.test(message)) {
      throw new Error(`Validasi form gagal: ${message}`);
    }

    if (CreatePatientData.alert.saveFailurePattern.test(message)) {
      throw new Error(`Simpan pasien gagal: ${message}`);
    }

    if (!CreatePatientData.alert.saveSuccessMessage.test(message)) {
      throw new Error(`Toast simpan pasien tidak dikenali: ${message}`);
    }
  }

  async getSaveAlertMessage(): Promise<string> {
    const message = await this.readVisibleSaveFeedbackMessage();

    if (!message) {
      throw new Error("Toast simpan pasien tidak ditemukan");
    }

    return message;
  }

  async verifySaveAlertSuccess(): Promise<void> {
    const message = await this.getSaveAlertMessage();

    this.assertSaveFeedbackIsFinal(message);

    await this.sweetAlert.closeIfVisible();
    await this.notify.dismissIfVisible();

    if (CreatePatientData.url.createRegistrationPage.test(this.page.url())) {
      return;
    }

    await this.page.waitForURL(CreatePatientData.url.createRegistrationPage, {
      timeout: ENV.TIMEOUT,
    });
  }

  private async ensureNamaFilled(expectedNama?: string): Promise<void> {
    await this.namaInput.scrollIntoViewIfNeeded();

    const currentValue = (await this.namaInput.inputValue()).trim();

    if (currentValue) {
      return;
    }

    if (expectedNama) {
      await this.fillNama(expectedNama);
      return;
    }

    throw new Error("Field Nama kosong sebelum simpan");
  }

  async verifyOnCreateRegistrationPage(): Promise<void> {
    await this.expectUrlMatches(CreatePatientData.url.createRegistrationPage);
    await this.expectVisible(this.panelKiriHeading);
  }

  private tableRowByLabel(label: string): Locator {
    return this.panelKiriTable.locator("tr").filter({
      has: this.page.getByRole("cell", { name: label, exact: true }),
    });
  }

  async getPanelKiriCellValue(label: string): Promise<string> {
    const row = this.tableRowByLabel(label);
    const valueCell = row.locator("td").nth(1);

    await expect(valueCell).toBeVisible({ timeout: ENV.TIMEOUT });

    return ((await valueCell.textContent()) ?? "").replace(/\s+/g, " ").trim();
  }

  private async expectPanelKiriValue(label: string, expected: string): Promise<void> {
    const actual = await this.getPanelKiriCellValue(label);

    expect(actual.toUpperCase()).toBe(expected.toUpperCase());
  }

  private async expectPanelKiriValueContains(label: string, expected: string): Promise<void> {
    const actual = await this.getPanelKiriCellValue(label);

    expect(actual.toUpperCase()).toContain(expected.toUpperCase());
  }

  private async expectPanelKiriValueIncludedIn(label: string, expected: string): Promise<void> {
    const actual = await this.getPanelKiriCellValue(label);

    expect(expected.toUpperCase()).toContain(actual.toUpperCase());
  }

  private async expectPanelKiriValueMatches(label: string, pattern: RegExp): Promise<void> {
    const actual = await this.getPanelKiriCellValue(label);

    expect(actual).toMatch(pattern);
  }

  private async expectPanelKiriValueNotEmpty(label: string): Promise<void> {
    const actual = await this.getPanelKiriCellValue(label);

    expect(actual.length).toBeGreaterThan(0);
  }

  async expandPanelKiriDetails(): Promise<void> {
    await expect(this.panelKiriExpandLink).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.click(this.panelKiriExpandLink);
    await expect(this.panelKiriExpandLink).toBeHidden({ timeout: ENV.TIMEOUT });
  }

  async verifyPatientPanelKiri(input: PatientFormInput): Promise<void> {
    const labels = CreatePatientData.panelKiri.labels;

    await this.expectVisible(this.panelKiri);
    await this.expectVisible(this.panelKiriHeading);
    await this.expandPanelKiriDetails();

    await this.expectPanelKiriValueNotEmpty(labels.noRm);
    await this.expectPanelKiriValue(labels.nik, input.nik);
    await this.expectPanelKiriValue(labels.namaLengkap, input.nama);
    await this.expectPanelKiriValue(labels.jenisKelamin, input.jenisKelamin);
    await this.expectPanelKiriValueMatches(labels.usia, CreatePatientData.panelKiri.usiaPattern);
    await this.expectPanelKiriValue(labels.noHp, input.phoneNumber);
    await this.expectPanelKiriValueNotEmpty(labels.noRmLama);
    await this.expectPanelKiriValue(labels.wargaNegara, CreatePatientData.defaults.wargaNegara);
    await this.expectPanelKiriValue(labels.noKk, input.noKK);
    await this.expectPanelKiriValue(labels.alamat, input.alamatDomisili);

    if (input.golonganDarah) {
      await this.expectPanelKiriValue(labels.golonganDarah, input.golonganDarah);
    }

    if (input.alamatLengkap) {
      const rtRw = `${input.alamatLengkap.rt} / ${input.alamatLengkap.rw}`;

      await this.expectPanelKiriValue(labels.rtRw, rtRw);

      if (input.alamatLengkap.propinsi) {
        await this.expectPanelKiriValue(labels.propinsi, input.alamatLengkap.propinsi);
      }

      if (input.alamatLengkap.kotaKab) {
        await this.expectPanelKiriValue(labels.kota, input.alamatLengkap.kotaKab);
      }

      if (input.alamatLengkap.kecamatan) {
        await this.expectPanelKiriValue(labels.kecamatan, input.alamatLengkap.kecamatan);
      }

      if (input.alamatLengkap.kelurahanDesa) {
        await this.expectPanelKiriValueIncludedIn(
          labels.kelurahan,
          input.alamatLengkap.kelurahanDesa,
        );
      }
    }

    if (input.dataLainnya) {
      if (input.dataLainnya.pekerjaan) {
        await this.expectPanelKiriValueContains(labels.pekerjaan, input.dataLainnya.pekerjaan);
      }

      await this.expectPanelKiriValue(labels.agama, input.dataLainnya.agama);
      await this.expectPanelKiriValue(labels.pendidikan, input.dataLainnya.pendidikan);
      await this.expectPanelKiriValue(labels.statusPerkawinan, input.dataLainnya.statusPerkawinan);
      await this.expectPanelKiriValue(labels.email, input.dataLainnya.email);
    }
  }

  async captureCreatedPatientSnapshot(input: PatientFormInput): Promise<CreatedPatientSnapshot> {
    const labels = CreatePatientData.panelKiri.labels;
    const noRm = await this.getPanelKiriCellValue(labels.noRm);

    return {
      noRm,
      nik: input.nik,
      nama: input.nama,
      phoneNumber: input.phoneNumber,
    };
  }
}
