import { Given, When, Then } from "@cucumber/cucumber";

import { Users } from "../../fixtures/users.fixture";
import { LoginPage } from "../../pages/authentication/LoginPage";
import { CustomWorld } from "../../support/world";

Given("user sudah berada di halaman Login", async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.openLoginPage();
}); 

When("user login menggunakan akun {string}", async function (this: CustomWorld, role: string) {
  const user = Users[role];

  if (!user) {
    throw new Error(`User role '${role}' tidak ditemukan di users.fixture.ts`);
  }

  await this.loginPage.loginAs(user);
});

When("user login ke {string} menggunakan akun {string} dan {string} yang tidak valid", async function (this: CustomWorld, clinic: string, username: string, password: string) {
  await this.loginPage.selectClinic(clinic);
  await this.loginPage.fillUsername(username);
  await this.loginPage.fillPassword(password);
  await this.loginPage.clickLoginButton();
});

When("user memilih klinik {string}", async function (this: CustomWorld, clinic: string) {
  await this.loginPage.selectClinic(clinic);
});

When("user mengisi ID Pengguna {string}", async function (this: CustomWorld, username: string) {
  await this.loginPage.fillUsername(username);
});

When("user mengisi Kata Sandi {string}", async function (this: CustomWorld, password: string) {
  await this.loginPage.fillPassword(password);
});

When("user menekan tombol Login", async function (this: CustomWorld) {
  await this.loginPage.clickLoginButton();
});

Then("user berhasil masuk ke Halaman Dashboard", async function (this: CustomWorld) {
  await this.loginPage.verifyLoginSuccess();
});

Then("sistem menampilkan pesan error login", async function (this: CustomWorld) {
  await this.loginPage.verifyLoginErrorDisplayed();
});
