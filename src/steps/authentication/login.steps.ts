import { Then, When } from "@cucumber/cucumber";

import { Users } from "../../fixtures/users.fixture";
import { CustomWorld } from "../../support/world";

When("user login menggunakan akun {string}", async function (this: CustomWorld, role: string) {
  const user = Users[role];

  if (!user) {
    throw new Error(`User role '${role}' tidak ditemukan di users.fixture.ts`);
  }

  await this.loginPage.loginAs(user);
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

Then("sistem menampilkan pesan {string}", async function (this: CustomWorld, message: string) {
  await this.loginPage.verifyNotificationMessage(message);
});

Then("sistem menampilkan pesan error login", async function (this: CustomWorld) {
  await this.loginPage.verifyLoginErrorDisplayed();
});
