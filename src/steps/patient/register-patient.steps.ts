import { Given, Then, When } from "@cucumber/cucumber";

import { ENV } from "../../config/env";
import { PatientFixture } from "../../fixtures/patient.fixture";
import { RegisterPatientPage } from "../../pages/patient/RegisterPatientPage";
import { RawatJalanIgdPage } from "../../pages/pelayanan/RawatJalanIgdPage";
import { runCreatePatientLengkapFlow } from "../../support/flows/create-patient-lengkap.flow";
import {
  ensurePatientRegisteredByJenisData,
  isRawatJalanPelayanan,
  resolveKunjunganValue,
  resolveRuanganUiLabel,
  updateRegistrationSnapshot,
  verifyRegistrationWithAlertDiagnostic,
} from "../../support/flows/register-patient.flow";
import { CustomWorld } from "../../support/world";

function ensureRegisterPatientPage(world: CustomWorld): RegisterPatientPage {
  if (!world.registerPatientPage) {
    world.registerPatientPage = new RegisterPatientPage(world.page);
  }

  return world.registerPatientPage;
}

function ensureRawatJalanIgdPage(world: CustomWorld): RawatJalanIgdPage {
  if (!world.rawatJalanIgdPage) {
    world.rawatJalanIgdPage = new RawatJalanIgdPage(world.page);
  }

  return world.rawatJalanIgdPage;
}

Given("pasien baru sudah dibuat di halaman pendaftaran create", { timeout: ENV.STEP_TIMEOUT_LONG }, async function (this: CustomWorld) {
  await runCreatePatientLengkapFlow(this);
});

Given("pasien baru sudah dibuat", { timeout: ENV.STEP_TIMEOUT_LONG }, async function (this: CustomWorld) {
  await runCreatePatientLengkapFlow(this);
});

Given("pasien dengan data {string} sudah terdaftar", { timeout: ENV.STEP_TIMEOUT_LONG }, async function (this: CustomWorld, jenisData: string) {
  await ensurePatientRegisteredByJenisData(this, jenisData);
});

Given("user berada di halaman pendaftaran pasien", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien belum tersedia. Jalankan step pasien dengan data terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.openRegisterPatientCreateWithPatient(
    this.createdPatientSnapshot.nama,
    this.createdPatientSnapshot.nama,
  );
});

When("user membuka halaman Pendaftaran melalui menu {string} dan submenu {string}", async function (this: CustomWorld, menu: string, submenu: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.openFromNavbar(menu, submenu);
});

When("user membuka halaman daftar pendaftaran pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);
  const { menu, submenu } = PatientFixture.registerPatientNavigation;

  await registerPatientPage.openFromNavbar(menu, submenu);
});

When("user menekan tombol Tambah pada halaman pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickTambahOnPendaftaranPage();
});

When("user menekan tombol Tambah pada halaman Pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickTambahOnPendaftaranPage();
});

When("user mencari pasien existing pada pendaftaran dengan kata kunci {string}", async function (this: CustomWorld, keyword: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.searchExistingPatient(keyword);
});

When("user mencari pasien yang baru dibuat pada pendaftaran berdasarkan {string}", async function (this: CustomWorld, criteria: string) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.searchCreatedPatientByCriteria(criteria, this.createdPatientSnapshot);
});

When("user memilih pasien {string} dari hasil pencarian pendaftaran", async function (this: CustomWorld, expectedName: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectExistingPatientFromSuggest(expectedName);
});

When("user memilih pasien yang baru dibuat dari hasil pencarian pendaftaran", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectExistingPatientFromSuggest(this.createdPatientSnapshot.nama);
});

When("user mengisi form Data Pelayanan dengan kunjungan sakit", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.fillPelayananFormKunjunganSakit();
});

When("user memilih pelayanan kunjungan sakit", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.fillPelayananFormKunjunganSakit();
});

When("user memilih instalasi {string} pada form pendaftaran", async function (this: CustomWorld, instalasiName: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectInstalasi(instalasiName);
});

When("user memilih poli ruangan {string} pada form pendaftaran", async function (this: CustomWorld, poliName: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectPoliRuangan(poliName);
});

When("user memilih jadwal praktik pada form pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectRandomJadwalPraktik();
});

When("user menekan tombol Lanjutkan pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickLanjutkanPendaftaran();
});

When("user melanjutkan pendaftaran pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickLanjutkanPendaftaran();
});

When("user mendaftarkan pasien ke kunjungan {string}", async function (this: CustomWorld, jenisKunjungan: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.prepareKunjunganFormDefaults();
  await registerPatientPage.selectJenisKunjungan(jenisKunjungan);
  updateRegistrationSnapshot(this, {
    kunjungan: resolveKunjunganValue(jenisKunjungan),
  });
});

When("user memilih tujuan pelayanan {string}", async function (this: CustomWorld, pelayanan: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.selectInstalasi(pelayanan);
  updateRegistrationSnapshot(this, { pelayanan });
});

When("user memilih unit pelayanan {string}", async function (this: CustomWorld, ruangan: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);
  const ruanganUiLabel = resolveRuanganUiLabel(ruangan);

  await registerPatientPage.selectPoliRuangan(ruangan);
  updateRegistrationSnapshot(this, { ruangan: ruanganUiLabel });
});

When("user memilih jadwal {string}", async function (this: CustomWorld, jadwal: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);
  const selectedJadwal = await registerPatientPage.selectJadwalPraktikByLabel(jadwal);
  const dokterMatch = selectedJadwal.match(/^(.+?)\s+\d{2}:\d{2}/);

  updateRegistrationSnapshot(this, {
    jadwal: selectedJadwal,
    dokter: dokterMatch?.[1]?.trim(),
  });
});

When("user menyimpan data pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.saveAndRegisterAnother();
});

Then("user berada di halaman registrasi pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyOnRegisterPatientPage();
});

Then("panel Data Pasien menampilkan pasien {string}", async function (this: CustomWorld, expectedName: string) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyPanelDisplaysPatient(expectedName);
});

Then("panel Data Pasien menampilkan pasien yang baru dibuat", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyPanelDisplaysPatient(this.createdPatientSnapshot.nama);
});

Then("pendaftaran pasien berhasil", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await verifyRegistrationWithAlertDiagnostic(this, registerPatientPage, () =>
    registerPatientPage.verifyPendaftaranSuccess(),
  );
});

Then("sistem berhasil menyimpan data pendaftaran pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await verifyRegistrationWithAlertDiagnostic(this, registerPatientPage, () =>
    registerPatientPage.verifyRegistrationSavedAfterDaftarkanLainnya(),
  );
});

Then("data pendaftaran tersedia pada daftar pendaftaran pasien", async function (this: CustomWorld) {
  if (!this.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);
  const noPendaftaran = await registerPatientPage.verifyRegistrationOnPendaftaranList(
    this.registrationSnapshot,
  );

  updateRegistrationSnapshot(this, { noPendaftaran });
});

Then("data pelayanan tersedia pada daftar pelayanan {string}", async function (this: CustomWorld, pelayanan: string) {
  if (!this.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran terlebih dahulu.",
    );
  }

  if (!isRawatJalanPelayanan(pelayanan)) {
    throw new Error(`Daftar pelayanan '${pelayanan}' belum didukung.`);
  }

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(this);
  const noAntrean = await rawatJalanIgdPage.verifyPatientInPelayananList(
    this.registrationSnapshot,
  );

  updateRegistrationSnapshot(this, { noAntrean });
});