export const BuatPesananLocators = (page: any) => ({
    Menumanajemen: page.getByRole('button', { name: 'Manajemen' }),
    MenuPemesananPembelian: page.getByRole('link', { name: 'Pemesanan Pembelian' }),
    TombolbuatBaru: page.getByRole('link', { name: 'Buat Baru' }),
    FieldPemasok: page.getByRole('textbox', { name: 'Nama Pemasok' }),
    FieldPenanggungJawab: page.getByRole('textbox', { name: 'Nama Penanggung Jawab' }),
    FieldDiskonKeseluruhan: page.getByLabel('Diskon Keseluruhan'),
    FieldDiskonPerItem: page.getByLabel('Diskon Per-Item'),
    FieldTanpaDiskon: page.getByLabel('Tanpa Diskon'),
    ModalPpn: '#modal_c_ppn',
    FieldNamaObatAlkes: page.getByRole('textbox', { name: '🔍 Nama Obat/Alkes' }),
    PilihObatAlkes: page.getByText('O2600001 - Atorvastatin', { exact: true }),
    TombolTambahkanItem: page.getByRole('button', { name: 'Tambahkan Item' }),
    TombolReset: page.getByRole('button', { name: 'Reset' }),
    TombolSimpanDraft: page.getByRole('button', { name: 'Simpan Draft' }),
    TombolSimpanKirim: page.getByRole('button', { name: 'Simpan & Kirim' })
  
});