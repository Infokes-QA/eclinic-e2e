import { Page, expect, type Locator } from '@playwright/test';
import { BuatPesananLocators } from './BuatPesanan.locator'; 

export class BuatPesananPage {
    private locators;

    constructor(private page: Page) {
        this.locators = BuatPesananLocators(page);
    }

    async goto() {
        await this.page.goto('/pemesanan-pembelian/buat');
        await this.page.waitForLoadState('networkidle');
    }

    async gotoManajemenPemesananPembelian() {
        await this.locators.Menumanajemen.click();
        await expect(this.locators.MenuPemesananPembelian).toBeVisible();
        await this.locators.MenuPemesananPembelian.click();
        await this.page.waitForLoadState('networkidle');
    }

    async gotoBuatPesanan() {
        await this.locators.TombolbuatBaru.click();
        await this.page.waitForLoadState('networkidle');
    }

    async fillfieldPemasok(namaPemasok: string) {
        await this.locators.FieldPemasok.click();
        await this.page.keyboard.type(namaPemasok);
        const option = this.page.getByRole("option").first();
        await expect(option).toBeVisible();
        await option.click();
    }

    async fillfieldPenanggungJawab(namaPenanggungJawab: string) {
        await this.locators.FieldPenanggungJawab.fill(namaPenanggungJawab);
        await this.page.waitForSelector(".ui-menu-item");
        await this.page.locator(".ui-menu-item").first().click();
    }

    async fillFormObatAlkes(item_name: string) {
        await this.locators.FieldNamaObatAlkes.fill(item_name);
        await this.page.waitForSelector(".ui-menu-item");
        await this.page.locator(".ui-menu-item").first().click();
    }

    async fillObat() {
        await this.locators.FieldNamaObatAlkes.fill("Paracetamol");
        await this.page.waitForSelector(".ui-menu-item");
        await this.page.locator(".ui-menu-item").first().click();
    }

    async fillJumlahOrder(jumlah_order: string) {
        await this.locators.JumlahOrder.fill(jumlah_order);
    }

    async selectDiskonKeseluruhan() {
        await this.locators.FieldDiskonKeseluruhan.click();
    }

    async selectpersenDiskonKeseluruhan() {
        await this.locators.DiskonkeseluruhanPersen.click();
    }

    async filljumlahdiskonpersen(diskon: string) {
        await this.locators.JumlahPersenDiskon.fill(diskon);
    }

    async jumlahpesan() {
        return await this.locators.JumlahOrder.inputValue();
    }

    async verifyJumlahDiskonPersen(jumlah_diskon: string) {
        await expect(this.locators.FieldTotalDiskon).toHaveValue(jumlah_diskon);
    }

    async verifyJumlahHarga(jumlah_harga: string) {
        await expect(this.locators.FieldTotalHarga).toHaveValue(jumlah_harga);
    }

    async clickTambahkanItem() {
        await this.locators.TombolTambahkanItem.click();
    }

    async verifyItemInTable(item_Name: string, jumlah_Order: string) {

        const row = this.page.locator('table tbody tr').filter({
            has: this.page.getByText(item_Name, { exact: true })
        });

        await expect(row).toBeVisible();

        await expect(row).toContainText(jumlah_Order);
    }

    
};
