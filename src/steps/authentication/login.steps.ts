import { Given, When, Then } from "@cucumber/cucumber";

import { Users } from "../../fixtures/users.fixture";
import { LoginPage } from "../../pages/authentication/LoginPage";
import { CustomWorld } from "../../support/world";

function ensureLoginPage(world: CustomWorld): LoginPage {
  if (!world.loginPage) {
    world.loginPage = new LoginPage(world.page);
  }

  return world.loginPage;
}

Given("user berada di halaman Login", async function (this: CustomWorld) {
  await ensureLoginPage(this).ensureOnLoginPage();
});

Given("user sudah berada di halaman Login", async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.openLoginPage();
}); 

When("user login menggunakan akun {string}", async function (this: CustomWorld, role: string) {
  const user = Users[role];

  if (!user) {
    throw new Error(`User role '${role}' tidak ditemukan di users.fixture.ts`);
  }

  const loginPage = ensureLoginPage(this);

  this.loggedInUser = user;
  await loginPage.loginAs(user);
});

When("user login ke {string} menggunakan akun {string} dan {string} yang tidak valid", async function (this: CustomWorld, clinic: string, username: string, password: string) {
  await this.loginPage.selectClinic(clinic);
  await this.loginPage.fillUsername(username);
  await this.loginPage.fillPassword(password);
  await this.loginPage.clickLoginButton();
});

When("user memilih klinik {string}", async function (this: CustomWorld, clinic: string) {
  await ensureLoginPage(this).selectClinic(clinic);
});

When("user mengisi ID Pengguna {string}", async function (this: CustomWorld, username: string) {
  await ensureLoginPage(this).fillUsername(username);
});

When("user mengisi Kata Sandi {string}", async function (this: CustomWorld, password: string) {
  await ensureLoginPage(this).fillPassword(password);
});

When("user menekan tombol Login", async function (this: CustomWorld) {
  await ensureLoginPage(this).clickLoginButton();
});

Then("user berhasil masuk ke Halaman Dashboard", async function (this: CustomWorld) {
  if (!this.loggedInUser) {
    throw new Error("Data user login belum tersedia. Jalankan step login terlebih dahulu.");
  }

  await ensureLoginPage(this).verifyLoginSuccess(this.loggedInUser);
});

Then("sistem menampilkan pesan error login", async function (this: CustomWorld) {
  await ensureLoginPage(this).verifyLoginErrorDisplayed();
});
