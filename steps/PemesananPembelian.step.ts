import { createBdd } from "playwright-bdd";
import { BuatPesananPage } from "../pages/PemesananPembelian/BuatPesanan.page";
import { PemesananPembelian } from "../data/interfaces/PemesananPembelian";
import { createPemesananPembelian } from "../data/PemesananPembelian";
import { LoginPage } from "../pages/login/login.page";
import { expect, test } from "@playwright/test";

const { Given, When, Then, After } = createBdd();

let buatPesananPage: BuatPesananPage;
let currentData: PemesananPembelian;

//Scenario: User melakukan tambah item pemesanan pembelian
// GIVEN
Given("user sudah berada di halaman pemesanan pembelian", async ({ page }) => {

    await page.goto("/");

    // baru ke halaman pemesanan pembelian
    buatPesananPage = new BuatPesananPage(page);
    await buatPesananPage.gotoManajemenPemesananPembelian();
    await buatPesananPage.gotoBuatPesanan();

    // pastikan halaman sudah siap
    await expect(page).toHaveURL(/.*\/pemesananobat\/v2\/create/);
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


// AND
Then("item {string} dengan jumlah order {string} muncul di daftar pemesanan pembelian", 
    async ({page}, nama_item: string, jumlah_order: string) => {
        await buatPesananPage.verifyItemInTable(nama_item, jumlah_order);
});


//Scenario: User melakukan tambah item pemesanan pembelian dengan jumlah order negatif
//Then
Then("tidak bisa menginputkan character negatif pada field jumlah order pemesanan pembelian",
    async ({page}) => {
        await expect(buatPesananPage['locators'].JumlahOrder).not.toHaveValue('-');
        
    });


// //Scenario: User melakukan tambah item pemesanan pembelian dengan jumlah order kosong
// Then("muncul pesan error \"Jumlah order tidak boleh kosong\"",
//     async ({page}) => {
//         const testInfo = test.info();
//         await expect(page.locator('.alert.alert-danger')).toBeVisible();
//         await expect(page.locator('.alert.alert-danger')).toHaveText('Jumlah order tidak boleh 0');

//          await page.screenshot({ 
//             path: `Avidance/${testInfo.title}-${Date.now()}.png`, 
//             fullPage: true });
//     });



//Scenario: User menambahkan "diskon Keseluruhan" persentase pada pemesanan pembelian
When("user memilih \"diskon Keseluruhan\" pemesanan pembelian", 
    async ({ page }) => {
        
        // isi form dengan data awal
        currentData = createPemesananPembelian();
        await buatPesananPage.fillfieldPemasok(currentData.namaPemasok);
        await buatPesananPage.fillfieldPenanggungJawab(currentData.namaPenanggungJawab);

        // pilih jenis diskon
        await buatPesananPage.selectDiskonKeseluruhan()
        
});

When("user pilih diskon \"persen\" pada field diskon pemesanan pembelian", 
    async ({ page }) => {
        await buatPesananPage.selectpersenDiskonKeseluruhan();
});

When ("user mengisi nilai {string} pada field diskon pemesanan pembelian",
    async ({ page }, diskon: string) => {
        await buatPesananPage.filljumlahdiskonpersen(diskon);

                // isi form obat/alkes
        await buatPesananPage.fillObat();

        // isi jumlah order 
        await buatPesananPage.fillJumlahOrder("3");

        // klik tombol tambahkan item
        await buatPesananPage.clickTambahkanItem();
});

//Scenario: User menambahkan "diskon Keseluruhan" rupiah pada pemesanan pembelian
When("user pilih diskon \"rupiah\" pada field diskon pemesanan pembelian", 
    async ({ page }) => {
        await buatPesananPage.selectrupiahDiskonKeseluruhan();
});

When ("user mengisi nilai {string} pada field diskon rupiah pemesanan pembelian",
    async ({ page }, diskon: string) => {
        await buatPesananPage.filljumlahdiskonpersen(diskon);
});

Then("Jumalah {string} tampil pada field diskon pemesanan pembelian",
    async ({ page }, jumlah_diskon: string) => {
        await buatPesananPage.verifyJumlahDiskonPersen(jumlah_diskon);
});

Then("jumlah bayar pemesanan pembelian akan terupdate menjadi {string}",
    async ({ page }, jumlah_harga: string) => {
        await buatPesananPage.verifyJumlahHarga(jumlah_harga);
});
