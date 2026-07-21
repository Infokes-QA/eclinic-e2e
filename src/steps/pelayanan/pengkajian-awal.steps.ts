import { Given, Then, When } from "@cucumber/cucumber";

import { ENV } from "../../config/env";
import { resolveStatusLabelFromGherkin } from "../../data/pelayanan/pengkajian-awal.data";
import { RawatJalanIgdData } from "../../data/pelayanan/rawat-jalan-igd.data";
import { PengkajianAwalPage } from "../../pages/pelayanan/PengkajianAwalPage";
import { RawatJalanIgdPage } from "../../pages/pelayanan/RawatJalanIgdPage";
import {
  ensurePatientRegisteredOnPelayanan,
  getPengkajianFormInput,
  runPengkajianAwalByJenisData,
  runPengkajianAwalSavedComposite,
  runSaveAndStartDoctorExam,
  runSavePengkajianAwal,
} from "../../support/flows/pengkajian-awal.flow";
import { CustomWorld } from "../../support/world";

function ensurePengkajianAwalPage(world: CustomWorld): PengkajianAwalPage {
  if (!world.pengkajianAwalPage) {
    world.pengkajianAwalPage = new PengkajianAwalPage(world.page);
  }

  return world.pengkajianAwalPage;
}

function ensureRawatJalanIgdPage(world: CustomWorld): RawatJalanIgdPage {
  if (!world.rawatJalanIgdPage) {
    world.rawatJalanIgdPage = new RawatJalanIgdPage(world.page);
  }

  return world.rawatJalanIgdPage;
}

Given(
  "user membuka halaman pelayanan {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, pelayanan: string) {
    if (pelayanan !== RawatJalanIgdData.pelayananFeatureLabel.rawatJalan) {
      throw new Error(`Halaman pelayanan '${pelayanan}' belum didukung.`);
    }

    const rawatJalanIgdPage = ensureRawatJalanIgdPage(this);

    await rawatJalanIgdPage.openFromNavbar();
  },
);

Given(
  "pasien dengan data {string} telah terdaftar pada pelayanan {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, jenisData: string, pelayanan: string) {
    await ensurePatientRegisteredOnPelayanan(this, jenisData, pelayanan);
  },
);

Given(
  "pengkajian awal pasien sudah disimpan menggunakan data {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, jenisPengkajian: string) {
    await runPengkajianAwalSavedComposite(this, jenisPengkajian);
  },
);

When(
  "user melakukan pengkajian awal menggunakan data {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, jenisPengkajian: string) {
    await runPengkajianAwalByJenisData(this, jenisPengkajian);
  },
);

When(
  "user menyimpan data pengkajian awal",
  { timeout: ENV.STEP_TIMEOUT_FORM },
  async function (this: CustomWorld) {
    await runSavePengkajianAwal(this);
  },
);

When(
  "user menyimpan dan memulai pemeriksaan dokter",
  { timeout: ENV.STEP_TIMEOUT_FORM },
  async function (this: CustomWorld) {
    await runSaveAndStartDoctorExam(this);
  },
);

When(
  "user menyelesaikan pelayanan pengkajian awal",
  { timeout: ENV.STEP_TIMEOUT_FORM },
  async function (this: CustomWorld) {
    await runSaveAndStartDoctorExam(this);
  },
);

Then(
  "sistem berhasil menyimpan data pengkajian awal",
  { timeout: ENV.STEP_TIMEOUT_FORM },
  async function (this: CustomWorld) {
    const pengkajianAwalPage = ensurePengkajianAwalPage(this);

    await pengkajianAwalPage.verifySaveSuccess();
  },
);

Then(
  "status pelayanan pasien berubah menjadi {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, statusPelayanan: string) {
    if (!this.registrationSnapshot) {
      throw new Error(
        "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
      );
    }

    const rawatJalanIgdPage = ensureRawatJalanIgdPage(this);
    const statusLabel = resolveStatusLabelFromGherkin(statusPelayanan);

    await rawatJalanIgdPage.verifyPatientStatusOnList(this.registrationSnapshot, statusLabel);
  },
);

Then(
  "data pengkajian awal tersedia pada rekam pelayanan pasien",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld) {
    const pengkajianAwalPage = ensurePengkajianAwalPage(this);
    const input = getPengkajianFormInput(this);

    if (!(await pengkajianAwalPage.isOnPemeriksaanPage())) {
      if (!this.registrationSnapshot) {
        throw new Error(
          "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
        );
      }

      const rawatJalanIgdPage = ensureRawatJalanIgdPage(this);
      await rawatJalanIgdPage.reopenPatientOnPemeriksaanPage(this.registrationSnapshot);
      await pengkajianAwalPage.verifyOnPemeriksaanPage();
    }

    await pengkajianAwalPage.verifyAnamnesaOnRekamMedisKunjungan(input);
    await pengkajianAwalPage.verifyAnamnesaOnCppt(input);
  },
);
