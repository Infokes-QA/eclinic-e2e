import { expect, Locator, Page } from "@playwright/test";

import { ENV } from "../../config/env";
import { LandingPageLocator } from "../../locators/landing/landing.locator";
import { BasePage } from "../base/BasePage";

type LandingMenu = keyof typeof LandingPageLocator.menu;

export class LandingPage extends BasePage {
  readonly patientManagementMenu: Locator;
  readonly programManagementMenu: Locator;
  readonly organizationManagementMenu: Locator;

  constructor(page: Page) {
    super(page);

    this.patientManagementMenu = page.locator(LandingPageLocator.menu.patientManagement.title);

    this.programManagementMenu = page.locator(LandingPageLocator.menu.programManagement.title);

    this.organizationManagementMenu = page.locator(
      LandingPageLocator.menu.organizationManagement.title,
    );
  }

  async openLandingPage(): Promise<void> {
    await this.goTo(ENV.BASE_URL);
  }

  async verifyLandingPageDisplayed(): Promise<void> {
    await expect(this.patientManagementMenu).toBeVisible();
    await expect(this.programManagementMenu).toBeVisible();
    await expect(this.organizationManagementMenu).toBeVisible();
  }

  async hoverMenu(menu: string): Promise<void> {
    const selectedMenu = this.getMenu(menu);

    await this.page.locator(selectedMenu.title).hover();
  }

  async clickSubmenu(menu: string, submenu: string): Promise<void> {
    const selectedMenu = this.getMenu(menu);

    if (!(submenu in selectedMenu.submenu)) {
      throw new Error(`Submenu '${submenu}' tidak ditemukan pada menu '${menu}'.`);
    }

    const submenuLocator = selectedMenu.submenu[submenu as keyof typeof selectedMenu.submenu];

    await this.page.locator(submenuLocator).click();
  }

  private getMenu(menu: string) {
    if (!(menu in LandingPageLocator.menu)) {
      throw new Error(
        `Menu '${menu}' tidak ditemukan. Available menu: ${Object.keys(
          LandingPageLocator.menu,
        ).join(", ")}`,
      );
    }

    return LandingPageLocator.menu[menu as LandingMenu];
  }
}
