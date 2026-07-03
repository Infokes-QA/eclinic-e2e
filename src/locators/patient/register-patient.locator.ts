export const RegisterPatientLocator = {
  page: {
    panelTitle: '.panel-title:has-text("Pendaftaran")',
    tambah: "#button_create",
  },

  patientSearch: {
    container: ".input-patient-search",
    input: ".input-patient-search input[type='search']",
    suggestDropdown: ".sf-suggest:visible",
    suggestItem: ".sf-suggest .sfg-item",
    suggestItemName: ".sfgi-name",
  },

  panelKiri: {
    container: ".panel-kiri",
    heading: '.panel-kiri .panel-heading:has-text("Data Pasien")',
    table: ".panel-kiri table.table",
  },

  pelayanan: {
    container: ".col-md-9",
    heading: '.col-md-9 .panel-heading:has-text("Data pelayanan")',
    pilihPoliSection: ".col-md-9 .row.pilih-poli",
    waktuKunjunganHariIni:
      '.col-md-9 .main-form-container button:has-text("Hari ini")',
    kunjunganBaru: '.col-md-9 .main-form-container input[type="radio"][value="BARU"]',
    kunjunganSakit: '.col-md-9 .main-form-container input[type="radio"][value="SAKIT"]',
    kunjunganSehat: '.col-md-9 .main-form-container input[type="radio"][value="SEHAT"]',
    penjaminSelect:
      '.col-md-9 .main-form-container select:has(option[value="0000"])',
    skriningVisualPasienStabil:
      '.col-md-9 .main-form-container label.sv1 input[type="radio"][value="Pasien stabil"]',
    instalasiButtons:
      ".col-md-9 .row.pilih-poli > .col-sm-12:nth-child(1) .poli-card button",
    poliRuanganFormGroup:
      ".col-md-9 .row.pilih-poli > .col-sm-12:nth-child(2) .form-group",
    poliRuanganButtons:
      ".col-md-9 .row.pilih-poli > .col-sm-12:nth-child(2) .poli-card button",
    jadwalPraktikFormGroup:
      ".col-md-9 .row.pilih-poli > .col-sm-12:nth-child(3) .form-group",
    jadwalPraktikOption:
      ".col-md-9 .row.pilih-poli > .col-sm-12:nth-child(3) .poli-card button",
    btnLanjutkan: '.col-md-9 .form-cta-wrapper button.btn-primary:has-text("Lanjutkan")',
  },

  queuePrintModal: {
    dialog: ".modal-dialog:visible",
    continueButton: ".modal-dialog:visible #lanjutkan_btn",
  },
} as const;
