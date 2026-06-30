export const BuatPesananLocators = (page: any) => ({

    Menumanajemen: page.getByRole('button', { name: 'Manajemen' }),
    MenuPemesananPembelian: page.getByText('Pesanan Pembelian', { exact: true }),
    TombolbuatBaru: page.getByRole('link', { name: 'Buat Baru' }),
    FieldPemasok: page.locator(".v2multiselect__tags").first(),
    FieldPenanggungJawab: page.getByPlaceholder('Nama Penanggung Jawab'),
    FieldDiskonKeseluruhan: page.getByLabel('Diskon Keseluruhan'),
    DiskonkeseluruhanPersen: page.getByLabel('Persentase'),
    JumlahPersenDiskon: page.getByText('Nilai Diskon').locator('xpath=following::input[1]'),
    DiskonkeseluruhanRupiah: page.getByLabel('Nilai Rupiah'),
    FieldDiskonPerItem: page.getByLabel('Diskon Per-Item'),
    FieldTanpaDiskon: page.getByLabel('Tanpa Diskon'),
    ModalPpn: '#modal_c_ppn',
    FieldNamaObatAlkes: page.getByRole('textbox', { name: '🔍 Nama Obat/Alkes' }),
    JumlahOrder: page.locator('.form-group').filter({ hasText: 'Jumlah Order' }).locator('input'),
    TombolTambahkanItem: page.getByRole('button', { name: 'Tambahkan Item' }),
    TombolReset: page.getByRole('button', { name: 'Reset' }),
    TombolSimpanDraft: page.getByRole('button', { name: 'Simpan Draft' }),
    TombolSimpanKirim: page.getByRole('button', { name: 'Simpan & Kirim' }),
    FieldTotalDiskon: page.getByText('Total Diskon').locator('..').locator('div.col-md-9'),
    FieldTotalHarga: page.getByText('Total Harga').locator('..').locator('div.col-md-9'),
  
});