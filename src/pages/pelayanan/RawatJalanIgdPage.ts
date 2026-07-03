import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { RawatJalanIgdData } from "../../data/pelayanan/rawat-jalan-igd.data";
import { RawatJalanIgdLocator } from "../../locators/pelayanan/rawat-jalan-igd.locator";
import { RegistrationSnapshot } from "../../types/patient.type";
import { BasePage } from "../base/BasePage";
import { NavbarComponent } from "../components/NavbarComponent";

export class RawatJalanIgdPage extends BasePage {
  readonly panelTitle: Locator;
  readonly listWrapper: Locator;
  readonly searchInput: Locator;
  readonly ruanganSelect: Locator;
  readonly statusPeriksaSelect: Locator;
  readonly searchButton: Locator;
  readonly tableRows: Locator;
  readonly navbar: NavbarComponent;

  constructor(page: Page) {
    super(page);

    this.panelTitle = page.locator(RawatJalanIgdLocator.page.panelTitle);
    this.listWrapper = page.locator(RawatJalanIgdLocator.list.wrapper);
    this.searchInput = page.locator(RawatJalanIgdLocator.list.searchInput);
    this.ruanganSelect = page.locator(RawatJalanIgdLocator.list.ruanganSelect);
    this.statusPeriksaSelect = page.locator(RawatJalanIgdLocator.list.statusPeriksaSelect);
    this.searchButton = page.locator(RawatJalanIgdLocator.list.searchButton);
    this.tableRows = page.locator(RawatJalanIgdLocator.list.tableBodyRow);
    this.navbar = new NavbarComponent(page);
  }

  async openFromNavbar(): Promise<void> {
    await this.navbar.openRawatJalanIgd();
    await this.verifyOnListPage();
  }

  async verifyOnListPage(): Promise<void> {
    await this.expectUrlMatches(RawatJalanIgdData.url.listPage);
    await this.expectVisible(this.panelTitle);
    await this.expectVisible(this.listWrapper);
  }

  async selectRuangan(ruanganLabel: string): Promise<void> {
    await expect(this.ruanganSelect).toBeVisible({ timeout: ENV.TIMEOUT });
    await this.ruanganSelect.selectOption({ label: ruanganLabel });
    await expect(this.ruanganSelect).toHaveValue(/.+/);
  }

  async searchPatient(keyword: string): Promise<void> {
    await this.expectVisible(this.searchInput);
    await this.searchInput.fill(keyword);
    await this.click(this.searchButton);

    const matchingRow = this.tableRows.filter({
      hasText: new RegExp(escapeRegExp(keyword), "i"),
    });

    await expect(matchingRow.first()).toBeVisible({ timeout: ENV.TIMEOUT });
  }

  private async findPatientRowOnList(snapshot: RegistrationSnapshot): Promise<Locator> {
    const namePattern = new RegExp(escapeRegExp(snapshot.nama), "i");
    let matchingRow = this.tableRows
      .filter({ hasText: namePattern })
      .filter({ hasText: snapshot.nik });

    if (snapshot.ruangan) {
      matchingRow = matchingRow.filter({
        hasText: new RegExp(escapeRegExp(snapshot.ruangan), "i"),
      });
    }

    if (snapshot.dokter) {
      matchingRow = matchingRow.filter({
        hasText: new RegExp(escapeRegExp(snapshot.dokter), "i"),
      });
    }

    await expect(matchingRow.first()).toBeVisible({ timeout: ENV.TIMEOUT });

    return matchingRow.first();
  }

  private async assertRowBelumDiperiksa(row: Locator): Promise<void> {
    const rowClass = (await row.getAttribute("class")) ?? "";
    const { sedangDiperiksaPerawat, sudahDiperiksa } = RawatJalanIgdData.list.rowClass;

    if (rowClass.includes(sedangDiperiksaPerawat) || rowClass.includes(sudahDiperiksa)) {
      throw new Error(
        `Status pelayanan bukan '${RawatJalanIgdData.status.belumDiperiksa}'. Class baris: ${rowClass}`,
      );
    }
  }

  private async assertStatusFilterBelumDiperiksa(): Promise<void> {
    await expect(this.statusPeriksaSelect).toHaveValue(
      RawatJalanIgdData.status.belumDiperiksaFilterValue,
    );
  }

  async verifyPatientInPelayananList(snapshot: RegistrationSnapshot): Promise<string> {
    await this.openFromNavbar();
    await this.assertStatusFilterBelumDiperiksa();
    await this.selectRuangan(snapshot.ruangan);
    await this.searchPatient(snapshot.nama);

    const row = await this.findPatientRowOnList(snapshot);
    await this.assertRowBelumDiperiksa(row);

    const { columnIndex, noAntreanPattern } = RawatJalanIgdData.list;
    const cells = row.locator("td");

    const noAntrean = ((await cells.nth(columnIndex.noAntrean).innerText()) ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const poliRuangan = ((await cells.nth(columnIndex.poliRuangan).innerText()) ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const nik = ((await cells.nth(columnIndex.nik).innerText()) ?? "").replace(/\s+/g, " ").trim();
    const namaPasien = ((await cells.nth(columnIndex.namaPasien).innerText()) ?? "")
      .replace(/\s+/g, " ")
      .trim();
    const rowText = ((await row.innerText()) ?? "").replace(/\s+/g, " ").trim();

    expect(namaPasien.toUpperCase()).toContain(snapshot.nama.toUpperCase());
    expect(nik).toContain(snapshot.nik);
    expect(poliRuangan.toUpperCase()).toContain(snapshot.ruangan.toUpperCase());

    if (snapshot.dokter) {
      expect(rowText.toUpperCase()).toContain(snapshot.dokter.toUpperCase());
    }

    if (!noAntreanPattern.test(noAntrean)) {
      throw new Error(`Format nomor antrean tidak valid: '${noAntrean}'.`);
    }

    return noAntrean;
  }
}

function escapeRegExp(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}
