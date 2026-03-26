import { expect, type Locator, type Page } from '@playwright/test';
import { pasienListLocators } from './pasienList.locators';

export class PasienListPage {
  constructor(private page: Page) {}

  async gotoBroadcastNotif() {
    await this.page.goto(pasienListLocators.broadcastNotifPath);
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.waitForPencarianAndTable();
  }

  private async waitForPencarianAndTable() {
    const pencarianInput = await this.resolvePencarianInput();
    await pencarianInput.waitFor({ state: 'visible', timeout: 30_000 });
    await this.page.locator(pasienListLocators.tableSelector).first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async searchByNik(nik: string) {
    // UI flow: isi NIK di kolom "Pencarian" lalu klik tombol "Cari".
    const pencarianInput = await this.resolvePencarianInput();
    await pencarianInput.fill(nik);

    const cariButton = this.page.getByRole('button', { name: pasienListLocators.cariButtonNameRegex }).first();
    if ((await cariButton.count()) > 0) {
      await cariButton.click();
    } else {
      // Fallback: enter if button text differs.
      await pencarianInput.press('Enter').catch(() => {});
    }

    // Let the UI update results.
    await this.page.waitForTimeout(800);
    await this.page.waitForLoadState('networkidle').catch(() => {});
  }

  async expectPasienVisibleByNik(nik: string) {
    // Try to scope to table row first to avoid matching the search input value.
    const rowWithNik = this.findRowWithNik(nik);
    if ((await rowWithNik.count()) > 0) {
      await expect(rowWithNik.first()).toBeVisible({ timeout: 30_000 });
      return;
    }

    // Fallback: match any visible text containing the NIK.
    const nikText = this.page.locator(`text=${nik}`).first();
    await expect(nikText).toBeVisible({ timeout: 30_000 });
  }

  private findRowWithNik(nik: string): Locator {
    // Common table structure: <tr> contains cell text.
    return this.page.locator('tr').filter({ hasText: nik });
  }

  private async resolvePencarianInput(): Promise<Locator> {
    const byRole = this.page.getByRole('textbox', { name: pasienListLocators.pencarianLabelRegex }).first();
    if ((await byRole.count()) > 0 && (await byRole.isVisible().catch(() => false))) return byRole;

    const byPlaceholder = this.page.locator(pasienListLocators.pencarianPlaceholderSelector).first();
    if ((await byPlaceholder.count()) > 0 && (await byPlaceholder.isVisible().catch(() => false))) return byPlaceholder;

    const byName = this.page.locator(pasienListLocators.pencarianNameSelector).first();
    if ((await byName.count()) > 0 && (await byName.isVisible().catch(() => false))) return byName;

    // Fallback: role locator (will fail with a better timeout message later).
    return byRole;
  }
}

