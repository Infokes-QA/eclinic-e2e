import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { PatientShowDetailData } from "../../data/patient/patient-show-detail.data";
import { SearchPatientData } from "../../data/patient/search-patient.data";
import { formatNoErmForDisplay, normalizeNoRmForUrl } from "../../helpers/patient-display.helper";
import { PatientShowDetailLocator } from "../../locators/patient/patient-show-detail.locator";
import { CreatedPatientSnapshot } from "../../types/patient.type";
import { BasePage } from "../base/BasePage";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class PatientShowDetailPage extends BasePage {
  readonly panel: Locator;
  readonly panelTitle: Locator;
  readonly detailListItems: Locator;

  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.panel = page.locator(PatientShowDetailLocator.panel);
    this.panelTitle = page.locator(PatientShowDetailLocator.panelTitle);
    this.detailListItems = page.locator(PatientShowDetailLocator.detailListItem);

    this.sweetAlert = new SweetAlertComponent(page);
  }

  async verifyOnPatientShowDetailPage(snapshot: CreatedPatientSnapshot): Promise<void> {
    const noRmDigits = normalizeNoRmForUrl(snapshot.noRm);

    await this.expectUrlMatches(new RegExp(`/pasien/show/${noRmDigits}(\\?.*)?$`), ENV.TIMEOUT);
    await this.expectVisible(this.panel);
    await expect(this.panelTitle).toContainText(PatientShowDetailData.panelTitle);
  }

  async verifyPatientDetail(snapshot: CreatedPatientSnapshot): Promise<void> {
    const mapping = PatientShowDetailData.snapshotToDetailMapping;
    const noErmDigits = SearchPatientData.table.noRmAssertDigits;

    await this.expectDetailField(
      mapping.noRm.detailLabel,
      formatNoErmForDisplay(snapshot.noRm, noErmDigits),
    );
    await this.expectDetailField(mapping.nik.detailLabel, snapshot.nik);
    await this.expectDetailField(mapping.nama.detailLabel, snapshot.nama, { ignoreCase: true });
  }

  private detailItemByLabel(label: string): Locator {
    const exactLabel = new RegExp(`^\\s*${this.escapeRegExp(label)}\\s*$`);

    return this.panel.locator(PatientShowDetailLocator.detailListItem).filter({
      has: this.page.locator(PatientShowDetailLocator.detailLabel, { hasText: exactLabel }),
    });
  }

  private escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  }

  private async expectDetailField(
    label: string,
    expected: string,
    options?: { ignoreCase?: boolean },
  ): Promise<void> {
    const valueCell = this.detailItemByLabel(label).locator(PatientShowDetailLocator.detailValue);

    await expect(valueCell).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(valueCell).toContainText(expected, options);
  }
}
