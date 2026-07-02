import { Given, Then, When } from "@cucumber/cucumber";

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

When("user mengisi form Data Pelayanan dengan kunjungan sakit", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.fillPelayananFormKunjunganSakit();
});

When("user menekan tombol Lanjutkan pendaftaran", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.clickLanjutkanPendaftaran();
});

Then("user berada di halaman registrasi pasien", async function (this: CustomWorld) {
  const registerPatientPage = ensureRegisterPatientPage(this);

  await registerPatientPage.verifyOnRegisterPatientPage();
});

Then(
  "pendaftaran pasien berhasil",
  { timeout: 120_000 },
  async function (this: CustomWorld) {
    const registerPatientPage = ensureRegisterPatientPage(this);

    await registerPatientPage.verifyPendaftaranSuccess();
  },
);
