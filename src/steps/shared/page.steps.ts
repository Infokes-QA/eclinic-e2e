import { Then } from "@cucumber/cucumber";

import { LoginPage } from "../../pages/authentication/LoginPage";
import { CreatePatientPage } from "../../pages/patient/create-patient/CreatePatientPage";
import { PatientShowDetailPage } from "../../pages/patient/PatientShowDetailPage";
import { SearchPatientPage } from "../../pages/patient/SearchPatientPage";
import { CustomWorld } from "../../support/world";

Then("user berada di halaman {string}", async function (this: CustomWorld, halaman: string) {
  switch (halaman) {
    case "Home":
      if (!this.loginPage) {
        this.loginPage = new LoginPage(this.page);
      }

      await this.loginPage.verifyOnHomePage();
      break;

    case "Pembuatan Pasien":
    case "Create Pasien":
      if (!this.createPatientPage) {
        this.createPatientPage = new CreatePatientPage(this.page);
      }

      await this.createPatientPage.verifyCreatePatientPageDisplayed();
      break;

    case "Pasien":
      if (!this.searchPatientPage) {
        this.searchPatientPage = new SearchPatientPage(this.page);
      }

      await this.searchPatientPage.verifyOnPatientPage();
      break;

    case "Detail Pasien":
      if (!this.createdPatientSnapshot) {
        throw new Error(
          "Data pasien yang dibuat belum tersedia. Jalankan step create pasien terlebih dahulu.",
        );
      }

      if (!this.patientShowDetailPage) {
        this.patientShowDetailPage = new PatientShowDetailPage(this.page);
      }

      await this.patientShowDetailPage.verifyOnPatientShowDetailPage(this.createdPatientSnapshot);
      break;

    default:
      throw new Error(`Halaman '${halaman}' belum didukung oleh shared page steps.`);
  }
});
