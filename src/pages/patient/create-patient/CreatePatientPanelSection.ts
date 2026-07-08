import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../../config/env";
import { CreatePatientData } from "../../../data/patient/create-patient.data";
import { PatientFormDefaults } from "../../../fixtures/patient.fixture";
import { panelKiriTableRowByLabel, panelKiriValueCell } from "../../../helpers/patient-panel.helper";
import { CreatePatientLocator } from "../../../locators/patient/create-patient.locator";
import {
  CreatedPatientSnapshot,
  PatientFormInput,
} from "../../../types/patient.type";
import { BasePage } from "../../base/BasePage";

export class CreatePatientPanelSection extends BasePage {
  readonly panelKiri: Locator;
  readonly panelKiriHeading: Locator;
  readonly panelKiriTable: Locator;
  readonly panelKiriExpandLink: Locator;

  constructor(page: Page) {
    super(page);

    this.panelKiri = page.locator(CreatePatientLocator.panelKiri.container);
    this.panelKiriHeading = page.locator(CreatePatientLocator.panelKiri.heading);
    this.panelKiriTable = page.locator(CreatePatientLocator.panelKiri.table);
    this.panelKiriExpandLink = page.locator(CreatePatientLocator.panelKiri.lihatSelengkapnya);
  }

  async verifyOnCreateRegistrationPage(): Promise<void> {
    await this.expectUrlMatches(CreatePatientData.url.createRegistrationPage);
    await this.expectVisible(this.panelKiriHeading);
  }

  async getPanelKiriCellValue(label: string): Promise<string> {
    const row = panelKiriTableRowByLabel(this.panelKiriTable, this.page, label);
    const valueCell = panelKiriValueCell(row);

    await expect(valueCell).toBeVisible({ timeout: ENV.TIMEOUT });

    return ((await valueCell.textContent()) ?? "").replace(/\s+/g, " ").trim();
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
    // Nomor RM Lama is optional for new patients - only verify if expected to be present

    await this.expectPanelKiriValue(labels.wargaNegara, PatientFormDefaults.wargaNegara);
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

  async verifyPatientSavedSuccess(
    input: PatientFormInput,
    snapshot: CreatedPatientSnapshot,
  ): Promise<void> {
    if (!CreatePatientData.panelKiri.noRmPattern.test(snapshot.noRm)) {
      throw new Error(`Nomor RM belum terbentuk: '${snapshot.noRm}'.`);
    }

    expect(snapshot.nik).toBe(input.nik);
    expect(snapshot.nama.toUpperCase()).toContain(input.nama.toUpperCase());
    expect(snapshot.phoneNumber).toBe(input.phoneNumber);
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
}
