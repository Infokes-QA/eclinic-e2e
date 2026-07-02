export const CreatePatientLocator = {
  page: {
    panelTitle: '.panel-title:has-text("Pendaftaran")',
  },

  actionButtonMenu: {
    fiturTunda: "#button_fitur_tunda",
    tambah: "#button_create",
    daftarLaboratorium: "#button_create_laboratorium",
    daftarRencanaKontrol: "#button_daftar_rencana_kontrol",
    print: "#print_pendaftaran",
    exportExcel: "#export_pendaftaran",
  },

  actionButton: {
    btnNewCreatePatient: "button:has-text('Buat Pasien Baru')",
    btnSavePatient: "button:has-text('Simpan Pasien')",
  },

  modal: {
    dialog: "div.modal.fade.in div.modal-content",
    title: '.modal-title:has-text("Buat Pasien Baru")',
  },

  checkbox: {
    verifiedCheckbox: 'div.form-group:has(label:has-text("Data Pasien")) input[type="checkbox"]',
    noKtpCheckbox: 'div.form-group:has(span:has-text("Tidak Bawa KTP")) input[type="checkbox"]',
  },

  form: {
    namaInput: 'div.form-group:has(label:text-is("Nama")) input[type="text"]',
    tanggalLahir: 'div.form-group:has(label:has-text("Tanggal lahir")) input[type="date"]',
    asuransiSelect: "div.fblock.with-delete-btn select.form-control.input-sm",
    jenisKelaminPerempuan: 'input[type="radio"][value="PEREMPUAN"]',
    jenisKelaminLakiLaki: 'input[type="radio"][value="LAKI-LAKI"]',
    ihsNumber: "#ihs_number_",
    cekSatuSehatButton: "#button_get_ihs",
  },

  select: {
    wargaNegara: 'div.form-group:has(label:has-text("Warga Negara")) select',
    golonganDarah: 'div.form-group:has(label:has-text("Golongan Darah")) select',
    agama: 'div.form-group:has(label:has-text("Agama")) select',
    pendidikan: 'div.form-group:has(label:has-text("Pendidikan")) select',
    statusPerkawinan: 'div.form-group:has(label:has-text("Status Perkawinan")) select',
  },

  alamatLengkap: {
    rt: 'div.form-group:has(label:has-text("RT / RW")) input >> nth=0',
    rw: 'div.form-group:has(label:has-text("RT / RW")) input >> nth=1',
    autocompleteOption: ".ui-autocomplete:visible .ui-menu-item-wrapper",
  },

  placeholder: {
    noDokumenRM: "Nomor Dokumen Rekam Medis",
    noRMLama: "Nomor Rekam Medis Lama",
    noKK: "Nomor KK / NIK Anggota Keluarga",
    nik: "Nomor Induk Kependudukan (KTP)",
    nama: "Nama lengkap",
    tempatLahir: "Tempat lahir",
    noHP: "Nomor HP",
    alamatDomisili: "Alamat Domisili",
    propinsi: "Nama Propinsi",
    kotaKab: "Nama Kota / Kabupaten",
    kecamatan: "Nama Kecamatan",
    kelurahanDesa: "Nama Kelurahan / Desa",
    pekerjaan: "Pekerjaan",
    email: "emailpasien@email.com",
    namaAyah: "Nama Ayah",
    namaIbu: "Nama Ibu",
    hubunganKeluarga: "Hubungan Keluarga",
    negaraAsal: "Negara Asal",
    noPaspor: "No Paspor",
    ihsNumber: "IHS Number",
  },

  link: {
    tambahAsuransi: "Tambah Asuransi/Penjamin",
    inputAlamatLengkap: "Input data alamat lengkap",
    inputDataLainnya: "Input data lainnya",
    sembunyikan: "Sembunyikan",
  },

  panelKiri: {
    container: ".panel-kiri",
    heading: '.panel-kiri .panel-heading:has-text("Data Pasien")',
    table: ".panel-kiri table.table",
    lihatSelengkapnya: '.panel-kiri a.pointer:has-text("Lihat Selengkapnya")',
  },
} as const;
