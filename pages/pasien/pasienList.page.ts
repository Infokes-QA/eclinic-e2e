import { expect, type Locator, type Page } from '@playwright/test';

export class PasienListPage {
  constructor(private page: Page) {}

  async gotoBroadcastNotif() {
    await this.page.goto('/pasien?broadcastNotif=1');
    await this.page.waitForLoadState('networkidle').catch(() => {});
    await this.waitForPencarianAndTable();
  }

  private async waitForPencarianAndTable() {
    const pencarianInput = await this.resolvePencarianInput();
    await pencarianInput.waitFor({ state: 'visible', timeout: 30_000 });
    await this.page.locator('table').first().waitFor({ state: 'visible', timeout: 30_000 });
  }

  async searchByNik(nik: string) {
    // UI flow: isi NIK di kolom "Pencarian" lalu klik tombol "Cari".
    const pencarianInput = await this.resolvePencarianInput();
    await pencarianInput.fill(nik);

    const cariButton = this.page.getByRole('button', { name: /^Cari$/i }).first();
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
    const byRole = this.page.getByRole('textbox', { name: /pencarian/i }).first();
    if ((await byRole.count()) > 0 && (await byRole.isVisible().catch(() => false))) return byRole;

    const byPlaceholder = this.page.locator('input[placeholder*="Pencarian" i]').first();
    if ((await byPlaceholder.count()) > 0 && (await byPlaceholder.isVisible().catch(() => false))) return byPlaceholder;

    const byName = this.page.locator('input[name*="pencarian" i], input[name*="search" i]').first();
    if ((await byName.count()) > 0 && (await byName.isVisible().catch(() => false))) return byName;

    // Fallback: role locator (will fail with a better timeout message later).
    return byRole;
  }
}

