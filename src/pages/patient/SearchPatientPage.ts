import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { SearchPatientData } from "../../data/patient/search-patient.data";
import { PatientFixture } from "../../fixtures/patient.fixture";
import { formatNoErmForDisplay, normalizeNoRmForUrl } from "../../helpers/patient-display.helper";
import { SearchPatientLocator } from "../../locators/patient/search-patient.locator";
import { PatientSearchFilterInput } from "../../types/patient-search.type";
import { CreatedPatientSnapshot } from "../../types/patient.type";
import { BasePage } from "../base/BasePage";
import { NavbarComponent } from "../components/NavbarComponent";
import { SweetAlertComponent } from "../components/SweetAlertComponent";

export class SearchPatientPage extends BasePage {
  readonly datatableWrapper: Locator;
  readonly limitPerPageSelect: Locator;
  readonly searchForm: Locator;
  readonly typeRecordSelect: Locator;
  readonly typeVerificationSelect: Locator;
  readonly generalConsentSelect: Locator;
  readonly birthDateInput: Locator;
  readonly searchKeyInput: Locator;
  readonly searchButton: Locator;
  readonly resetButton: Locator;
  readonly table: Locator;
  readonly tableHeaders: Locator;
  readonly tableBody: Locator;
  readonly tableRows: Locator;
  readonly footerInfo: Locator;

  readonly navbar: NavbarComponent;
  readonly sweetAlert: SweetAlertComponent;

  constructor(page: Page) {
    super(page);

    this.datatableWrapper = page.locator(SearchPatientLocator.datatableWrapper);
    this.limitPerPageSelect = page.locator(SearchPatientLocator.limitPerPage);
    this.searchForm = page.locator(SearchPatientLocator.searchForm);
    this.typeRecordSelect = page.locator(SearchPatientLocator.typeRecord);
    this.typeVerificationSelect = page.locator(SearchPatientLocator.typeVerification);
    this.generalConsentSelect = page.locator(SearchPatientLocator.generalConsent);
    this.birthDateInput = page.locator(SearchPatientLocator.birthDate);
    this.searchKeyInput = page.locator(SearchPatientLocator.searchKey);
    this.searchButton = page.locator(SearchPatientLocator.searchButton);
    this.resetButton = page.locator(SearchPatientLocator.resetButton);
    this.table = page.locator(SearchPatientLocator.table);
    this.tableHeaders = page.locator(SearchPatientLocator.tableHeader);
    this.tableBody = page.locator(SearchPatientLocator.tableBody);
    this.tableRows = page.locator(SearchPatientLocator.tableRow);
    this.footerInfo = page.locator(SearchPatientLocator.footerInfo);

    this.navbar = new NavbarComponent(page);
    this.sweetAlert = new SweetAlertComponent(page);
  }

  async openFromNavbar(menu: string, submenu: string): Promise<void> {
    const { menu: expectedMenu, submenu: expectedSubmenu } = PatientFixture.searchPatientNavigation;

    if (menu !== expectedMenu || submenu !== expectedSubmenu) {
      throw new Error(
        `Menu '${menu}' dengan submenu '${submenu}' belum didukung oleh SearchPatientPage.`,
      );
    }

    await this.navbar.openPasien();
    await this.sweetAlert.closeIfVisible();
  }

  async verifyOnPatientPage(): Promise<void> {
    await this.expectUrlMatches(SearchPatientData.url.patientPage, ENV.TIMEOUT);
    await this.expectVisible(this.datatableWrapper);
    await this.expectVisible(this.searchForm);
    await this.expectVisible(this.table);
  }

  async verifySearchFormDisplayed(): Promise<void> {
    await this.expectVisible(this.typeRecordSelect);
    await this.expectVisible(this.typeVerificationSelect);
    await this.expectVisible(this.generalConsentSelect);
    await this.expectVisible(this.birthDateInput);
    await this.expectVisible(this.searchKeyInput);
    await this.expectVisible(this.searchButton);
    await this.expectVisible(this.resetButton);
  }

  async selectTypeRecord(label: string): Promise<void> {
    await this.typeRecordSelect.selectOption({ label });
  }

  async selectTypeVerification(label: string): Promise<void> {
    await this.typeVerificationSelect.selectOption({ label });
  }

  async selectGeneralConsent(label: string): Promise<void> {
    const value = this.resolveGeneralConsentValue(label);

    await this.generalConsentSelect.selectOption({ value });
  }

  async fillBirthDate(birthDate: string): Promise<void> {
    await this.fill(this.birthDateInput, birthDate);
  }

  async fillSearchKey(keyword: string): Promise<void> {
    await this.fill(this.searchKeyInput, keyword);
  }

  async selectLimitPerPage(limit: string): Promise<void> {
    await this.limitPerPageSelect.selectOption(limit);
    await this.waitForTableUpdated();
  }

  async applyPatientFilters(
    typeRecord: string,
    typeVerification: string,
    generalConsent: string,
  ): Promise<void> {
    await this.selectTypeRecord(typeRecord);
    await this.selectTypeVerification(typeVerification);
    await this.selectGeneralConsent(generalConsent);
  }

  async filterByBirthDate(birthDate: string): Promise<void> {
    await this.fillBirthDate(birthDate);
    await this.clickSearch();
  }

  async applyFilters(filter: PatientSearchFilterInput): Promise<void> {
    if (filter.typeRecord) {
      await this.selectTypeRecord(filter.typeRecord);
    }

    if (filter.typeVerification) {
      await this.selectTypeVerification(filter.typeVerification);
    }

    if (filter.generalConsent) {
      await this.selectGeneralConsent(filter.generalConsent);
    }

    if (filter.birthDate) {
      await this.fillBirthDate(filter.birthDate);
    }

    if (filter.searchKey) {
      await this.fillSearchKey(filter.searchKey);
    }

    if (filter.limitPerPage) {
      await this.selectLimitPerPage(filter.limitPerPage);
    }
  }

  async clickSearch(): Promise<void> {
    await this.click(this.searchButton);
    await this.waitForTableUpdated();
  }

  async clickReset(): Promise<void> {
    await this.click(this.resetButton);
    await this.waitForTableUpdated();
  }

  async searchPatient(keyword: string): Promise<void> {
    await this.fillSearchKey(keyword);
    await this.clickSearch();
  }

  async searchCreatedPatient(snapshot: CreatedPatientSnapshot, criteria: string): Promise<void> {
    const keyword = this.resolveSearchKeyword(snapshot, criteria);

    await this.searchPatient(keyword);
  }

  async verifyCreatedPatientListed(snapshot: CreatedPatientSnapshot): Promise<void> {
    await this.verifyTableDisplayed();
    await this.verifyFooterHasSearchResults();

    const patientRow = await this.findCreatedPatientRow(snapshot);

    await expect(patientRow).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async openPatientListAndSearchCreatedPatient(snapshot: CreatedPatientSnapshot): Promise<void> {
    const { menu, submenu } = PatientFixture.searchPatientNavigation;

    await this.openFromNavbar(menu, submenu);
    await this.verifyOnPatientPage();
    await this.searchCreatedPatient(snapshot, SearchPatientData.searchCriteria.nama);
  }

  async verifyCreatedPatientOnPatientList(snapshot: CreatedPatientSnapshot): Promise<void> {
    await this.openPatientListAndSearchCreatedPatient(snapshot);
    await this.verifyCreatedPatientListed(snapshot);
  }

  async verifyTableDisplaysCreatedPatient(snapshot: CreatedPatientSnapshot): Promise<void> {
    await this.verifyTableDisplayed();
    await this.verifyFooterHasSearchResults();

    const resultRowCount = await this.getSearchResultRowCount();

    if (resultRowCount === 0) {
      throw new Error("Tabel Pasien tidak menampilkan hasil pencarian.");
    }

    const patientRow = await this.findCreatedPatientRow(snapshot);

    await expect(patientRow).toBeVisible({ timeout: ENV.TIMEOUT });

    const mapping = SearchPatientData.panelToTableMapping;
    const noErmColumnIndex = await this.getTableColumnIndex(mapping.noRm.tableColumn);
    const namaColumnIndex = await this.getTableColumnIndex(mapping.nama.tableColumn);
    const nikColumnIndex = await this.getTableColumnIndex(mapping.nik.tableColumn);

    await this.expectRowCellContains(
      patientRow,
      noErmColumnIndex,
      formatNoErmForDisplay(snapshot.noRm, SearchPatientData.table.noRmAssertDigits),
    );
    await this.expectRowCellContains(patientRow, namaColumnIndex, snapshot.nama, {
      ignoreCase: true,
    });
    await this.expectRowCellContains(patientRow, nikColumnIndex, snapshot.nik);
  }

  async openCreatedPatientDetailByDoubleClick(snapshot: CreatedPatientSnapshot): Promise<void> {
    const patientRow = await this.findCreatedPatientRow(snapshot);
    const noRmDigits = normalizeNoRmForUrl(snapshot.noRm);

    await patientRow.dblclick();
    await this.expectUrlMatches(new RegExp(`/pasien/show/${noRmDigits}(\\?.*)?$`), ENV.TIMEOUT);
    await this.sweetAlert.closeIfVisible();
  }

  async getSearchResultRowCount(): Promise<number> {
    await this.verifyTableDisplayed();

    return this.tableRows.count();
  }

  async verifyTableDisplayed(): Promise<void> {
    await this.expectVisible(this.table);
    await expect(this.tableRows.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  async verifyTableContainsText(expected: string): Promise<void> {
    await this.verifyTableDisplayed();
    await this.verifyFooterHasSearchResults();

    const resultRow = this.tableRows.filter({ hasText: new RegExp(expected, "i") }).first();

    await expect(resultRow).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(resultRow).toContainText(expected, { ignoreCase: true });
  }

  async verifyTableRowCountAtMost(maxRows: number): Promise<void> {
    await this.verifyTableDisplayed();

    const rowCount = await this.tableRows.count();

    expect(rowCount).toBeGreaterThan(0);
    expect(rowCount).toBeLessThanOrEqual(maxRows);
  }

  async verifyFooterInfoDisplayed(): Promise<void> {
    await this.expectVisible(this.footerInfo);
    await expect(this.footerInfo).toContainText(SearchPatientData.footer.infoPattern);
  }

  async verifyFilterResultsDisplayed(): Promise<void> {
    await this.verifyTableDisplayed();
    await this.verifyFooterHasSearchResults();
  }

  private async verifyFooterHasSearchResults(): Promise<void> {
    await this.expectVisible(this.footerInfo);
    await expect(this.footerInfo).toContainText(SearchPatientData.footer.hasResultsPattern, {
      timeout: ENV.TIMEOUT,
    });
  }

  private async waitForTableUpdated(): Promise<void> {
    await expect(this.tableBody).toBeVisible({ timeout: ENV.TIMEOUT });
    await expect(this.footerInfo).toContainText(SearchPatientData.footer.infoPattern, {
      timeout: ENV.TIMEOUT,
    });
  }

  private async findCreatedPatientRow(snapshot: CreatedPatientSnapshot): Promise<Locator> {
    const mapping = SearchPatientData.panelToTableMapping;
    const noErmColumnIndex = await this.getTableColumnIndex(mapping.noRm.tableColumn);
    const namaColumnIndex = await this.getTableColumnIndex(mapping.nama.tableColumn);
    const nikColumnIndex = await this.getTableColumnIndex(mapping.nik.tableColumn);
    const expectedNoErm = formatNoErmForDisplay(
      snapshot.noRm,
      SearchPatientData.table.noRmAssertDigits,
    );

    const rowCount = await this.tableRows.count();
    const matchingIndexes: number[] = [];

    for (let index = 0; index < rowCount; index += 1) {
      const row = this.tableRows.nth(index);
      const nikText = (await row.locator("td").nth(nikColumnIndex).innerText()).replace(/\s+/g, "");
      const namaText = (await row.locator("td").nth(namaColumnIndex).innerText()).trim();
      const noErmText = (await row.locator("td").nth(noErmColumnIndex).innerText()).trim();

      const isMatch =
        nikText.includes(snapshot.nik) &&
        namaText.toLowerCase().includes(snapshot.nama.toLowerCase()) &&
        noErmText.includes(expectedNoErm);

      if (isMatch) {
        matchingIndexes.push(index);
      }
    }

    if (matchingIndexes.length === 0) {
      throw new Error(
        `Pasien yang baru dibuat tidak ditemukan pada ${rowCount} baris hasil pencarian.`,
      );
    }

    if (matchingIndexes.length > 1) {
      throw new Error(
        `Ditemukan ${matchingIndexes.length} baris pasien yang cocok dari ${rowCount} hasil pencarian, diharapkan hanya 1.`,
      );
    }

    return this.tableRows.nth(matchingIndexes[0]);
  }

  private async getTableColumnIndex(headerLabel: string): Promise<number> {
    const headerCount = await this.tableHeaders.count();

    for (let index = 0; index < headerCount; index += 1) {
      const headerText = (await this.tableHeaders.nth(index).innerText()).trim();

      if (headerText.includes(headerLabel)) {
        return index;
      }
    }

    throw new Error(`Kolom tabel '${headerLabel}' tidak ditemukan.`);
  }

  private async expectRowCellContains(
    row: Locator,
    columnIndex: number,
    expected: string,
    options?: { ignoreCase?: boolean },
  ): Promise<void> {
    const cell = row.locator("td").nth(columnIndex);

    await expect(cell).toContainText(expected, options);
  }

  private resolveSearchKeyword(snapshot: CreatedPatientSnapshot, criteria: string): string {
    const normalized = criteria.trim().toLowerCase();
    const { searchCriteria } = SearchPatientData;

    if (normalized === searchCriteria.nama) {
      return snapshot.nama;
    }

    if (normalized === searchCriteria.nik) {
      return snapshot.nik;
    }

    if (normalized === searchCriteria.noRm) {
      return snapshot.noRm;
    }

    throw new Error(`Kriteria pencarian '${criteria}' tidak didukung.`);
  }

  private resolveGeneralConsentValue(label: string): string {
    const options = SearchPatientData.filter.generalConsent;

    switch (label) {
      case "Semua":
        return options.semua.value;
      case "Sudah":
        return options.sudah.value;
      case "Belum":
        return options.belum.value;
      default:
        return label;
    }
  }
}
