import { Given, Then } from "@cucumber/cucumber";

import { AuthHelper } from "../../helpers/auth.helper";
import { LoginPage } from "../../pages/authentication/LoginPage";
import { CustomWorld } from "../../support/world";

Given("user sudah login sebagai {string}", async function (this: CustomWorld, role: string) {
  if (!this.authRole) {
    throw new Error(
      "Step ini membutuhkan scenario bertag @authenticated. Pastikan hook memuat storageState terlebih dahulu.",
    );
  }

  if (this.authRole !== role) {
    throw new Error(`Role scenario '${this.authRole}' tidak cocok dengan role step '${role}'.`);
  }

  await AuthHelper.openAuthenticatedHome(this.page, AuthHelper.getAuthEntryUrl(role));

  this.loginPage = new LoginPage(this.page);
  await this.loginPage.verifyOnHomePage();
});

Then("user berada di halaman Home", async function (this: CustomWorld) {
  if (!this.loginPage) {
    this.loginPage = new LoginPage(this.page);
  }

  await this.loginPage.verifyOnHomePage();
});
