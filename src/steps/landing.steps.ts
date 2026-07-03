import { Given, Then, When } from "@cucumber/cucumber";

import { LoginPage } from "../pages/authentication/LoginPage";
import { LandingPage } from "../pages/landing/LandingPage";
import { CustomWorld } from "../support/world";

Given("user berada di halaman Landing Page", async function (this: CustomWorld) {
  this.landingPage = new LandingPage(this.page);
  await this.landingPage.openLandingPage();
});

When("user hover menu {string}", async function (this: CustomWorld, menu: string) {
  await this.landingPage.hoverMenu(menu);
});

When(
  "user memilih submenu {string} pada menu {string}",
  async function (this: CustomWorld, submenu: string, menu: string) {
    await this.landingPage.clickSubmenu(menu, submenu);
  },
);

Then("user berada di halaman Login", async function (this: CustomWorld) {
  this.loginPage = new LoginPage(this.page);
  await this.loginPage.verifyLoginPageDisplayed();
}); 
