import { expect, Locator, Page } from "@playwright/test";

import { NavbarLocator, NavbarMenu } from "../../locators/shared/navbar.locator";
import { SweetAlertComponent } from "./SweetAlertComponent";

type NavbarSubmenuGroup = Omit<typeof NavbarLocator, "container" | "menu">;
type NavbarSubmenuGroupName = keyof NavbarSubmenuGroup;
type NavbarSubmenuName<GroupName extends NavbarSubmenuGroupName> =
  keyof NavbarSubmenuGroup[GroupName];

export class NavbarComponent {
  readonly container: Locator;

  constructor(private readonly page: Page) {
    this.container = page.locator(NavbarLocator.container);
  }

  async verifyDisplayed(): Promise<void> {
    await expect(this.container).toBeVisible();
  }

  async openMenu(menu: NavbarMenu): Promise<void> {
    const menuLocator = pageLocator(this.page, NavbarLocator.menu[menu]);

    await menuLocator.hover();
    await expect(menuLocator).toBeVisible();
  }

  async clickSubmenu<GroupName extends NavbarSubmenuGroupName>(
    groupName: GroupName,
    submenuName: NavbarSubmenuName<GroupName>,
  ): Promise<void> {
    await new SweetAlertComponent(this.page).closeIfVisible();

    const menuLocator = pageLocator(this.page, NavbarLocator.menu[groupName as NavbarMenu]);
    const submenuSelector = NavbarLocator[groupName][submenuName] as string;
    const submenuLocator = pageLocator(this.page, submenuSelector);

    await menuLocator.hover();
    if (!(await submenuLocator.isVisible())) {
      await menuLocator.click();
    }

    await expect(submenuLocator).toBeVisible();
    await submenuLocator.click();
  }

  async openCreatePasien(): Promise<void> {
    await this.clickSubmenu("pendaftaran", "createPasien");
  }

  async openPendaftaranPasienV2(): Promise<void> {
    await this.clickSubmenu("pendaftaran", "pendaftaranPasienV2");
  }

  async openPasien(): Promise<void> {
    await this.clickSubmenu("pendaftaran", "pasien");
  }

  async openRawatJalanIgd(): Promise<void> {
    await this.clickSubmenu("pelayanan", "rawatJalanIgd");
  }
}

function pageLocator(page: Page, selector: string): Locator {
  return page.locator(selector);
}
