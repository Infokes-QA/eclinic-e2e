import { Then, When } from "@cucumber/cucumber";

import { PatientFixture } from "../../fixtures/patient.fixture";
import { CreatePatientPage } from "../../pages/patient/CreatePatientPage";
import { CustomWorld } from "../../support/world";

const FORM_STEP_TIMEOUT = 60_000;

function ensureCreatePatientPage(world: CustomWorld): CreatePatientPage {
  if (!world.createPatientPage) {
    world.createPatientPage = new CreatePatientPage(world.page);
  }

  return world.createPatientPage;
}

When(
  "user membuka halaman Create Pasien melalui menu {string} dan submenu {string}",
  async function (this: CustomWorld, menu: string, submenu: string) {
    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.openFromNavbar(menu, submenu);
  },
);

When("user membuka halaman pembuatan pasien", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);
  const { menu, submenu } = PatientFixture.createPatientNavigation;

  await createPatientPage.openFromNavbar(menu, submenu);
});

When("user membuka modal Buat Pasien Baru", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.openCreatePatientModal();
});

When("user memilih membuat pasien baru", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.openCreatePatientModal();
});

When(
  "user mengatur checkbox Diverifikasi Lengkap menjadi {string}",
  async function (this: CustomWorld, state: string) {
    if (state !== "dicentang" && state !== "tidak dicentang") {
      throw new Error(
        `State checkbox '${state}' tidak valid. Gunakan "dicentang" atau "tidak dicentang".`,
      );
    }

    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.setVerifiedCheckboxState(state);
  },
);

When("user memilih mode data pasien ringkas", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.setVerifiedCheckboxState("tidak dicentang");
});

When("user memilih mode data pasien lengkap", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.setVerifiedCheckboxState("dicentang");
});

When("user mengisi form Create Pasien dengan data ringkas", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  this.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataRingkas();
});

When("user mengisi data pasien ringkas", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  this.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataRingkas();
});

When(
  "user mengisi form Create Pasien dengan data lengkap",
  { timeout: FORM_STEP_TIMEOUT },
  async function (this: CustomWorld) {
    const createPatientPage = ensureCreatePatientPage(this);

    this.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataLengkap();
  },
);

When(
  "user mengisi data pasien lengkap",
  { timeout: FORM_STEP_TIMEOUT },
  async function (this: CustomWorld) {
    const createPatientPage = ensureCreatePatientPage(this);

    this.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataLengkap();
  },
);

When(
  "user menekan tombol Simpan Pasien",
  async function (this: CustomWorld) {
    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.clickSavePatientButton();
  },
);

When("user menyimpan data pasien", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.clickSavePatientButton();
});

Then("form Create Pasien terisi dengan data pasien", async function (this: CustomWorld) {
  if (!this.patientFormInput) {
    throw new Error("Data pasien belum tersedia. Jalankan step pengisian form terlebih dahulu.");
  }

  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifyPatientFormFilled(this.patientFormInput);
});

Then("data pasien ringkas terisi dengan benar", async function (this: CustomWorld) {
  if (!this.patientFormInput) {
    throw new Error("Data pasien belum tersedia. Jalankan step pengisian form terlebih dahulu.");
  }

  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifyPatientFormFilled(this.patientFormInput);
});

Then("form Create Pasien menampilkan mode data ringkas", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifyRingkasFormMode();
});

Then("form Create Pasien menampilkan mode data lengkap", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifyLengkapFormMode();
});

Then(
  "alert simpan pasien menampilkan hasil sukses",
  async function (this: CustomWorld) {
    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.verifySaveAlertSuccess();
  },
);

Then("data pasien berhasil tersimpan", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifySaveAlertSuccess();
});

Then("user berada di halaman pendaftaran create", async function (this: CustomWorld) {
  const createPatientPage = ensureCreatePatientPage(this);

  await createPatientPage.verifyOnCreateRegistrationPage();
});

Then(
  "halaman pendaftaran menampilkan data pasien yang dibuat",
  { timeout: FORM_STEP_TIMEOUT },
  async function (this: CustomWorld) {
    if (!this.patientFormInput) {
      throw new Error("Data pasien belum tersedia. Jalankan step pengisian form terlebih dahulu.");
    }

    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.verifyOnCreateRegistrationPage();
    await createPatientPage.verifyPatientPanelKiri(this.patientFormInput);
    this.createdPatientSnapshot = await createPatientPage.captureCreatedPatientSnapshot(
      this.patientFormInput,
    );
  },
);

Then(
  "panel Data Pasien menampilkan data pasien yang dibuat",
  async function (this: CustomWorld) {
    if (!this.patientFormInput) {
      throw new Error("Data pasien belum tersedia. Jalankan step pengisian form terlebih dahulu.");
    }

    const createPatientPage = ensureCreatePatientPage(this);

    await createPatientPage.verifyPatientPanelKiri(this.patientFormInput);
    this.createdPatientSnapshot = await createPatientPage.captureCreatedPatientSnapshot(
      this.patientFormInput,
    );
  },
);
