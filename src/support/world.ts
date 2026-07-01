import { setWorldConstructor, World } from "@cucumber/cucumber";
import { Browser, BrowserContext, Page } from "playwright";

import { LoginPage } from "../pages/authentication/LoginPage";
import { LandingPage } from "../pages/landing/LandingPage";

export class CustomWorld extends World {
  browser!: Browser;
  context!: BrowserContext;
  page!: Page;

  loginPage!: LoginPage;
  landingPage!: LandingPage;

  authRole?: string;
}

setWorldConstructor(CustomWorld);
