import { createBdd } from "playwright-bdd";
import { BuatPesananPage } from "../pages/PemesananPembelian/BuatPesanan.page";
import { PemesananPembelian } from "../data/interfaces/PemesananPembelian";
import { createPemesananPembelian } from "../data/PemesananPembelian";
import { LoginPage } from "../pages/login/login.page";
import { expect } from "@playwright/test";

const { Given, When, Then } = createBdd();

let buatPesananPage: BuatPesananPage;
let currentData: PemesananPembelian;

// GIVEN

Given("user sudah berada di halaman pemesanan pembelian", async ({ page }) => {

    // login dulu
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await loginPage.login(
        process.env.EC_USERNAME!,
        process.env.EC_PASSWORD!,
        process.env.EC_FASKES!
    );

    // baru ke halaman pemesanan pembelian
    buatPesananPage = new BuatPesananPage(page);
    await buatPesananPage.gotoManajemenPemesananPembelian();
    await buatPesananPage.gotoBuatPesanan();

    // pastikan halaman sudah siap
    await expect(page).toHaveURL(/.*\/pemesananobat\/v2\/create/);
    // await expect(buatPesananPage['locators'].FieldPemasok).toBeVisible();
    // await expect(buatPesananPage['locators'].FieldPenanggungJawab).toBeVisible();
});

// WHEN
When("user menambahkan {string} pemesanan pembelian", async ({ page }, item_name: string) => {

    // isi form dengan data awal
    currentData = createPemesananPembelian();
    await buatPesananPage.fillfieldPemasok(currentData.namaPemasok);
    await buatPesananPage.fillfieldPenanggungJawab(currentData.namaPenanggungJawab);

    // isi form obat/alkes
    await buatPesananPage.fillFormObatAlkes(item_name);
});

// AND
When("user mengisi {string} item pemesanan pembelian", 
    async ({ page }, jumlah_order: string) => {
    await buatPesananPage.fillJumlahOrder(jumlah_order);
});

// AND
When("user klik tombol \"Tambahkan Item\"", async () => {
    await buatPesananPage.clickTambahkanItem();
});

// // THEN
// Then("item pemesanan pembelian berhasil ditambahkan", 
//     async () => {
//     await expect(buatPesananPage['locators'].TabelDaftarItem).toBeVisible();
    
// });

// AND
Then("item {string} dengan jumlah order {string} muncul di daftar pemesanan pembelian", 
    async ({page}, nama_item: string, jumlah_order: string) => {
        await buatPesananPage.verifyItemInTable(nama_item, jumlah_order);

        await page.screenshot({ path: `Avidance/pemesanan-pembelian-${Date.now()}.png`, fullPage: true });
});



