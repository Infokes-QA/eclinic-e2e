import { Given, Then, When } from "@cucumber/cucumber";

import { RegisterPatientData } from "../../data/patient/register-patient.data";
import { RegisterPatientPage } from "../../pages/patient/RegisterPatientPage";
import { runCreatePatientLengkapFlow } from "../../support/flows/create-patient-lengkap.flow";
import { CustomWorld } from "../../support/world";

function ensureRegisterPatientPage(world: CustomWorld): RegisterPatientPage {
  if (!world.registerPatientPage) {
    world.registerPatientPage = new RegisterPatientPage(world.page);
  }

  return world.registerPatientPage;
}

Given(
  "pasien baru sudah dibuat di halaman pendaftaran create",
  { timeout: 120_000 },
  async function (this: CustomWorld) {
    await runCreatePatientLengkapFlow(this);
  },
);

Given("pasien baru sudah dibuat", { timeout: 120_000 }, async function (this: CustomWorld) {
  await runCreatePatientLengkapFlow(this);
});

When(
  "user membuka halaman Pendaftaran melalui menu {string} dan submenu {string}",
  async function (this: CustomWorld, menu: string, submenu: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.openFromNavbar(menu, submenu);
  },
);

When("user menekan tombol Tambah pada halaman Pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickTambahOnPendaftaranPage();
});

When(
  "user mencari pasien existing pada pendaftaran dengan kata kunci {string}",
  async function (this: CustomWorld, keyword: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.searchExistingPatient(keyword);
  },
);

When(
  "user mencari pasien yang baru dibuat pada pendaftaran berdasarkan {string}",
  async function (this: CustomWorld, criteria: string) {
    if (!this.createdPatientSnapshot) {
      throw new Error(
        "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
      );
    }

    const registerPatientPage = ensureRegisterPatientPage(this);
    const normalizedCriteria = criteria.toLowerCase();

    if (normalizedCriteria !== "nama" && normalizedCriteria !== "nik") {
      throw new Error(`Kriteria pencarian pendaftaran '${criteria}' belum didukung.`);
    }

    const keyword =
      normalizedCriteria === "nik"
        ? this.createdPatientSnapshot.nik
        : this.createdPatientSnapshot.nama;

    await registerPatientPage.searchExistingPatient(keyword);
  },
);

When(
  "user memilih pasien {string} dari hasil pencarian pendaftaran",
  async function (this: CustomWorld, expectedName: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.selectExistingPatientFromSuggest(expectedName);
  },
);

When(
  "user memilih pasien yang baru dibuat dari hasil pencarian pendaftaran",
  async function (this: CustomWorld) {
    if (!this.createdPatientSnapshot) {
      throw new Error(
        "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
      );
    }

    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.selectExistingPatientFromSuggest(this.createdPatientSnapshot.nama);
  },
);

When("user mengisi form Data Pelayanan dengan kunjungan sakit", { timeout: 120_000 }, async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.fillPelayananFormKunjunganSakit();
});

When("user memilih pelayanan kunjungan sakit", { timeout: 120_000 }, async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.fillPelayananFormKunjunganSakit();
});

When(
  "user memilih instalasi {string} pada form pendaftaran",
  { timeout: 120_000 },
  async function (this: CustomWorld, instalasiName: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.selectInstalasi(instalasiName);
  },
);

When(
  "user memilih poli ruangan {string} pada form pendaftaran",
  { timeout: 120_000 },
  async function (this: CustomWorld, poliName: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.selectPoliRuangan(poliName);
  },
);

When(
  "user memilih jadwal praktik pada form pendaftaran",
  { timeout: 120_000 },
  async function (this: CustomWorld) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.selectRandomJadwalPraktik();
  },
);

When("user menekan tombol Lanjutkan pendaftaran", { timeout: 120_000 }, async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickLanjutkanPendaftaran();
});

When("user melanjutkan pendaftaran pasien", { timeout: 120_000 }, async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickLanjutkanPendaftaran();
});

Then("user berada di halaman registrasi pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyOnRegisterPatientPage();
});

Then(
  "panel Data Pasien menampilkan pasien {string}",
  async function (this: CustomWorld, expectedName: string) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.verifyPanelDisplaysPatient(expectedName);
  },
);

Then("panel Data Pasien menampilkan pasien yang baru dibuat", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyPanelDisplaysPatient(this.createdPatientSnapshot.nama);
});

Then(
  "pendaftaran pasien berhasil",
  { timeout: 120_000 },
  async function (this: CustomWorld) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    try {
      await registerPatientPage.verifyPendaftaranSuccess();
    } catch (error) {
      const alertScreenshot = await registerPatientPage.captureRegistrationAlertScreenshot();

      if (alertScreenshot) {
        await this.attach(alertScreenshot, {
          mediaType: "image/png",
          fileName: `${RegisterPatientData.alert.screenshotFileName}-failed.png`,
        });
      }

      throw error;
    }
  },
);
