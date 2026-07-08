import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../../config/env";
import { CreatePatientData } from "../../../data/patient/create-patient.data";
import { PatientFormDefaults } from "../../../fixtures/patient.fixture";
import { RandomHelper } from "../../../helpers/random.helper";
import { CreatePatientLocator } from "../../../locators/patient/create-patient.locator";
import { PatientCommonLocator } from "../../../locators/shared/patient-common.locator";
import {
  PatientAlamatLengkapInput,
  PatientDataLainnyaInput,
} from "../../../types/patient.type";
import { BasePage } from "../../base/BasePage";

export class CreatePatientAddressSection extends BasePage {
  readonly createPatientModal: Locator;
  readonly inputAlamatLengkapLink: Locator;
  readonly inputDataLainnyaLink: Locator;

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

  constructor(page: Page) {
    super(page);

    this.createPatientModal = page.locator(CreatePatientLocator.modal.dialog);
    const modal = this.createPatientModal;

    this.inputAlamatLengkapLink = modal
      .locator(PatientCommonLocator.linkAnchor)
      .filter({ hasText: new RegExp(CreatePatientData.linkLabel.inputAlamatLengkap, "i") });
    this.inputDataLainnyaLink = modal
      .locator(PatientCommonLocator.linkAnchor)
      .filter({ hasText: new RegExp(CreatePatientData.linkLabel.inputDataLainnya, "i") });

    this.rtInput = modal.locator(CreatePatientLocator.alamatLengkap.rt);
    this.rwInput = modal.locator(CreatePatientLocator.alamatLengkap.rw);
    this.propinsiInput = modal.getByPlaceholder(CreatePatientData.placeholder.propinsi);
    this.kotaKabInput = modal.getByPlaceholder(CreatePatientData.placeholder.kotaKab);
    this.kecamatanInput = modal.getByPlaceholder(CreatePatientData.placeholder.kecamatan);
    this.kelurahanDesaInput = modal.getByPlaceholder(
      CreatePatientData.placeholder.kelurahanDesa,
    );
    this.autocompleteOption = page.locator(CreatePatientLocator.alamatLengkap.autocompleteOption);

    this.pekerjaanInput = modal.getByPlaceholder(CreatePatientData.placeholder.pekerjaan);
    this.agamaSelect = modal.locator(CreatePatientLocator.select.agama);
    this.pendidikanSelect = modal.locator(CreatePatientLocator.select.pendidikan);
    this.statusPerkawinanSelect = modal.locator(CreatePatientLocator.select.statusPerkawinan);
    this.emailInput = modal.getByPlaceholder(CreatePatientData.placeholder.email);
    this.namaAyahInput = modal.getByPlaceholder(CreatePatientData.placeholder.namaAyah);
    this.namaIbuInput = modal.getByPlaceholder(CreatePatientData.placeholder.namaIbu);
    this.hubunganKeluargaInput = modal.getByPlaceholder(
      CreatePatientData.placeholder.hubunganKeluarga,
    );
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
    return this.selectAutocompleteOption(
      this.propinsiInput,
      propinsi ?? PatientFormDefaults.alamatLengkap.propinsi,
    );
  }

  async fillKotaKab(kotaKab?: string): Promise<string> {
    return this.selectAutocompleteOption(
      this.kotaKabInput,
      kotaKab ?? PatientFormDefaults.alamatLengkap.kotaKab,
    );
  }

  async fillKecamatan(kecamatan?: string): Promise<string> {
    return this.selectAutocompleteOption(
      this.kecamatanInput,
      kecamatan ?? PatientFormDefaults.alamatLengkap.kecamatan,
    );
  }

  async fillKelurahanDesa(kelurahanDesa?: string): Promise<string> {
    return this.selectAutocompleteOption(
      this.kelurahanDesaInput,
      kelurahanDesa ?? PatientFormDefaults.alamatLengkap.kelurahanDesa,
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

  async ensureAutocompleteFieldsValid(): Promise<void> {
    const autocompleteFields = [
      { input: this.propinsiInput, optionText: PatientFormDefaults.alamatLengkap.propinsi },
      { input: this.kotaKabInput, optionText: PatientFormDefaults.alamatLengkap.kotaKab },
      { input: this.kecamatanInput, optionText: PatientFormDefaults.alamatLengkap.kecamatan },
      {
        input: this.kelurahanDesaInput,
        optionText: PatientFormDefaults.alamatLengkap.kelurahanDesa,
      },
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
    }
  }

  async selectAutocompleteOption(input: Locator, optionText: string): Promise<string> {
    await input.click();
    await input.clear();
    await input.fill(optionText);

    await expect(this.autocompleteOption.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    const option = await this.resolveAutocompleteOption(optionText);
    const selectedText = await this.getAutocompleteOptionText(option);

    await option.click();
    await input.blur();

    return selectedText;
  }

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
}
