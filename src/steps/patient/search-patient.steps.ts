import { Then, When } from "@cucumber/cucumber";

import { PatientFixture } from "../../fixtures/patient.fixture";
import { SearchPatientPage } from "../../pages/patient/SearchPatientPage";
import { CustomWorld } from "../../support/world";

function ensureSearchPatientPage(world: CustomWorld): SearchPatientPage {
  if (!world.searchPatientPage) {
    world.searchPatientPage = new SearchPatientPage(world.page);
  }

  return world.searchPatientPage;
}

When("user membuka halaman Pasien melalui menu {string} dan submenu {string}", async function (this: CustomWorld, menu: string, submenu: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.openFromNavbar(menu, submenu);
});

When("user membuka halaman pasien", async function (this: CustomWorld) {
  const searchPatientPage = ensureSearchPatientPage(this);
  const { menu, submenu } = PatientFixture.searchPatientNavigation;

  await searchPatientPage.openFromNavbar(menu, submenu);
});

When("user mencari pasien dengan kata kunci {string}", async function (this: CustomWorld, keyword: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.searchPatient(keyword);
});

When("user mencari pasien yang baru dibuat berdasarkan {string}", async function (this: CustomWorld, criteria: string) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.searchCreatedPatient(this.createdPatientSnapshot, criteria);
});

When("user memfilter data pasien dengan tipe record {string} verifikasi {string} dan general consent {string}",
async function (
  this: CustomWorld,
  typeRecord: string,
  verification: string,
  generalConsent: string,
) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.applyPatientFilters(typeRecord, verification, generalConsent);
});

When("user memfilter data pasien dengan tanggal lahir {string}", async function (this: CustomWorld, birthDate: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.filterByBirthDate(birthDate);
});

When("user menampilkan {string} data per halaman pada tabel Pasien", async function (this: CustomWorld, limitPerPage: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.selectLimitPerPage(limitPerPage);
});

When("user menekan tombol Cari pada halaman Pasien", async function (this: CustomWorld) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.clickSearch();
});

When("user menekan tombol Reset pada halaman Pasien", async function (this: CustomWorld) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.clickReset();
});

Then("form filter Pasien ditampilkan", async function (this: CustomWorld) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.verifySearchFormDisplayed();
});

Then("tabel Pasien menampilkan hasil yang mengandung {string}", async function (this: CustomWorld, expected: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.verifyTableContainsText(expected);
});

Then("tabel Pasien menampilkan pasien yang baru dibuat", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.verifyTableDisplaysCreatedPatient(this.createdPatientSnapshot);
});

Then("tabel Pasien menampilkan data hasil filter", async function (this: CustomWorld) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.verifyFilterResultsDisplayed();
});

Then("tabel Pasien menampilkan maksimal {string} baris data",
async function (this: CustomWorld, limitPerPage: string) {
  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.verifyTableRowCountAtMost(Number(limitPerPage));
});