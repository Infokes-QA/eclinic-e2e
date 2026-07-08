import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../../config/env";
import { CreatePatientData } from "../../../data/patient/create-patient.data";
import { PatientFixture, PatientFormDefaults } from "../../../fixtures/patient.fixture";
import { ScreenshotHelper } from "../../../helpers/screenshot.helper";
import { CreatePatientLocator } from "../../../locators/patient/create-patient.locator";
import { PatientCommonLocator } from "../../../locators/shared/patient-common.locator";
import {
  PatientFormInput,
  PatientGender,
  PatientGolonganDarah,
  PatientWargaNegara,
} from "../../../types/patient.type";
import { BasePage } from "../../base/BasePage";
import { NotifyComponent } from "../../components/NotifyComponent";
import { SweetAlertComponent } from "../../components/SweetAlertComponent";
import { CreatePatientAddressSection } from "./CreatePatientAddressSection";

export class CreatePatientModalSection extends BasePage {
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

  readonly notify: NotifyComponent;
  readonly sweetAlert: SweetAlertComponent;

  private savedNotifyMessage?: string;

  constructor(
    page: Page,
    private readonly address: CreatePatientAddressSection,
    notify: NotifyComponent,
    sweetAlert: SweetAlertComponent,
  ) {
    super(page);

    this.notify = notify;
    this.sweetAlert = sweetAlert;

    this.createPatientModal = page.locator(CreatePatientLocator.modal.dialog);
    this.modalTitle = this.createPatientModal.locator(CreatePatientLocator.modal.title);
    this.btnSavePatient = this.createPatientModal.locator(
      CreatePatientLocator.actionButton.btnSavePatient,
    );
    this.verifiedCheckbox = this.createPatientModal.locator(
      CreatePatientLocator.checkbox.verifiedCheckbox,
    );

    const modal = this.createPatientModal;

    this.noKKInput = modal.getByPlaceholder(CreatePatientData.placeholder.noKK);
    this.nikInput = modal.getByPlaceholder(CreatePatientData.placeholder.nik);
    this.namaInput = modal.locator(CreatePatientLocator.form.namaInput).first();
    this.phoneInput = modal.getByPlaceholder(CreatePatientData.placeholder.noHP);
    this.tanggalLahirInput = modal.locator(CreatePatientLocator.form.tanggalLahir);
    this.tempatLahirInput = modal.getByPlaceholder(CreatePatientData.placeholder.tempatLahir);
    this.alamatDomisiliInput = modal.getByPlaceholder(
      CreatePatientData.placeholder.alamatDomisili,
    );
    this.asuransiSelect = modal.locator(CreatePatientLocator.form.asuransiSelect).first();
    this.wargaNegaraSelect = modal.locator(CreatePatientLocator.select.wargaNegara);
    this.golonganDarahSelect = modal.locator(CreatePatientLocator.select.golonganDarah);
    this.jenisKelaminLakiLakiRadio = modal.locator(CreatePatientLocator.form.jenisKelaminLakiLaki);
    this.jenisKelaminPerempuanRadio = modal.locator(
      CreatePatientLocator.form.jenisKelaminPerempuan,
    );
    this.inputAlamatLengkapLink = modal
      .locator(PatientCommonLocator.linkAnchor)
      .filter({ hasText: new RegExp(CreatePatientData.linkLabel.inputAlamatLengkap, "i") });
    this.inputDataLainnyaLink = modal
      .locator(PatientCommonLocator.linkAnchor)
      .filter({ hasText: new RegExp(CreatePatientData.linkLabel.inputDataLainnya, "i") });
    this.sembunyikanLinks = modal
      .locator(PatientCommonLocator.linkAnchor)
      .filter({ hasText: new RegExp(CreatePatientData.linkLabel.sembunyikan, "i") });
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
      await expect(this.address.rtInput).toBeVisible({ timeout: ENV.TIMEOUT });
      await expect(this.address.pekerjaanInput).toBeVisible({ timeout: ENV.TIMEOUT });
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

    await expect(this.address.rtInput).not.toBeVisible();
    await expect(this.address.rwInput).not.toBeVisible();
    await expect(this.address.propinsiInput).not.toBeVisible();
    await expect(this.address.kotaKabInput).not.toBeVisible();
    await expect(this.address.kecamatanInput).not.toBeVisible();
    await expect(this.address.kelurahanDesaInput).not.toBeVisible();
    await expect(this.address.pekerjaanInput).not.toBeVisible();
    await expect(this.address.agamaSelect).not.toBeVisible();
    await expect(this.address.pendidikanSelect).not.toBeVisible();
    await expect(this.address.statusPerkawinanSelect).not.toBeVisible();
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
    await this.expectVisible(this.address.rtInput);
    await this.expectVisible(this.address.rwInput);
    await this.expectVisible(this.address.propinsiInput);
    await this.expectVisible(this.address.kotaKabInput);
    await this.expectVisible(this.address.kecamatanInput);
    await this.expectVisible(this.address.kelurahanDesaInput);
    await this.expectVisible(this.address.pekerjaanInput);
    await this.expectVisible(this.address.agamaSelect);
    await this.expectVisible(this.address.pendidikanSelect);
    await this.expectVisible(this.address.statusPerkawinanSelect);
    await this.expectVisible(this.address.emailInput);

    await expect(this.inputAlamatLengkapLink).not.toBeVisible();
    await expect(this.inputDataLainnyaLink).not.toBeVisible();
    await expect(this.sembunyikanLinks.filter({ visible: true }).first()).toBeVisible();

    for (const label of CreatePatientData.formMode.lengkap.requiredLabels) {
      await this.expectFieldRequired(label);
    }
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
    await this.selectWargaNegara(PatientFormDefaults.wargaNegara);
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
      input.alamatLengkap = await this.address.fillAlamatLengkap(input.alamatLengkap);
    }

    if (input.dataLainnya) {
      input.dataLainnya = await this.address.fillDataLainnya(input.dataLainnya);
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

  async fillPatientFormWithConditionalData(patientType: string): Promise<PatientFormInput> {
    if (patientType === "ringkas") {
      return this.fillPatientFormWithFakeDataRingkas();
    } else if (patientType === "lengkap") {
      return this.fillPatientFormWithFakeDataLengkap();
    }

    throw new Error(`Jenis data '${patientType}' tidak valid`);
  }

  async clickSavePatientButton(): Promise<void> {
    // await this.btnSavePatient.scrollIntoViewIfNeeded();
    // await this.ensureFormValidForSave();

    // const toastCapture = this.captureSaveNotifyToast();

    await this.click(this.btnSavePatient);
    await this.handleSaveConfirmation();
    // await toastCapture;
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
      await expect(this.address.propinsiInput).toHaveValue(input.alamatLengkap.propinsi);
    }

    if (input.alamatLengkap?.kotaKab) {
      await expect(this.address.kotaKabInput).toHaveValue(input.alamatLengkap.kotaKab);
    }

    if (input.dataLainnya?.pekerjaan) {
      await expect(this.address.pekerjaanInput).toHaveValue(input.dataLainnya.pekerjaan);
    }
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

  private formGroupByLabel(labelText: string): Locator {
    return this.createPatientModal.locator(
      PatientCommonLocator.formGroupByLabel.replace("{label}", labelText),
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
    await this.address.ensureAutocompleteFieldsValid();

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
      this.address.agamaSelect,
      this.address.pendidikanSelect,
      this.address.statusPerkawinanSelect,
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

  private async readSweetAlertMessage(): Promise<string> {
    return (await this.sweetAlert.readMessage()) ?? "";
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
}
