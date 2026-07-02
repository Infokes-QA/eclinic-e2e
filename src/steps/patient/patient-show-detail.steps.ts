import { Then, When } from "@cucumber/cucumber";

import { PatientShowDetailPage } from "../../pages/patient/PatientShowDetailPage";
import { SearchPatientPage } from "../../pages/patient/SearchPatientPage";
import { CustomWorld } from "../../support/world";

function ensureSearchPatientPage(world: CustomWorld): SearchPatientPage {
  if (!world.searchPatientPage) {
    world.searchPatientPage = new SearchPatientPage(world.page);
  }

  return world.searchPatientPage;
}

function ensurePatientShowDetailPage(world: CustomWorld): PatientShowDetailPage {
  if (!world.patientShowDetailPage) {
    world.patientShowDetailPage = new PatientShowDetailPage(world.page);
  }

  return world.patientShowDetailPage;
}

When("user membuka detail pasien yang baru dibuat dari tabel Pasien", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const searchPatientPage = ensureSearchPatientPage(this);

  await searchPatientPage.openCreatedPatientDetailByDoubleClick(this.createdPatientSnapshot);
});

Then("halaman detail Pasien menampilkan data pasien yang baru dibuat", async function (this: CustomWorld) {
  if (!this.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
    );
  }

  const patientShowDetailPage = ensurePatientShowDetailPage(this);

  await patientShowDetailPage.verifyPatientDetail(this.createdPatientSnapshot);
});
