export const PengkajianAwalLocator = {
  page: {
    title: '#app h4 strong:has-text("Pemeriksaan")',
    panelKiri: ".col-md-3.panel-kiri",
    panelPengkajianHeading: '.panel-heading strong:has-text("Pengkajian Awal")',
  },

  panelPasien: {
    wrapper: '.panel:has(.panel-heading strong:has-text("Data Pasien"))',
    heading: '.panel-heading strong:has-text("Data Pasien")',
    table:
      '.panel:has(.panel-heading strong:has-text("Data Pasien")) table.table-responsive',
  },

  landing: {
    mulaiPemeriksaanText: "text=Silakan Panggil Pasien / Mulai Pemeriksaan",
    buttonPengkajianAwal: 'button.btn-info:has-text("Pengkajian Awal")',
    buttonMulaiPemeriksaanDokter: 'button.btn-info:has-text("Mulai Pemeriksaan Dokter")',
  },

  form: {
    wrapper: ".main-form-container form.form-horizontal",
    asistenPerawatBidan: {
      multiselect:
        'div.form-group:has(label:has-text("Asisten / Perawat / Bidan")) div.multiselect:not(.multiselect--disabled)',
      tags: ".multiselect__tags",
      input: "input.multiselect__input",
      contentWrapper: ".multiselect__content-wrapper",
      optionItem: 'li.multiselect__element[role="option"]',
    },
    keluhanUtama: 'textarea[placeholder*="Keluhan Utama"]',
    lamaSakitGroup: 'div.form-group.row:has(label:has-text("Lama Sakit")) .input-group',
    skriningAwal: {
      wrapper: "#skrining_awal",
      heading: "#skrining_awal .panel-heading",
      body: "#skrining_awal .panel-collapse",
      accordionHeader: "#headerThree",
      accordionBody: "#accordionThree",
    },
    skriningAwalDetail: {
      ambulasiInput: 'div.form-group:has(label:has-text("Ambulasi")) input.form-control:visible',
      skalaNyeriRange: "input.input-type-range-min",
      kapanNyeriInput:
        'div.form-group:has(label:has-text("Kapan Nyeri Berulang")) input.form-control:visible',
      sifatNyeriInput: 'div.form-group:has(label:has-text("Sifat Nyeri")) input.form-control:visible',
      namaPenyakitInput: 'div.form-group:has(label:has-text("Nama Penyakit")) input.form-control:visible',
    },
    riwayatPenyakit: {
      section:
        'div.col-sm-6:has(div.form-group.row label.control-label:has-text("Riwayat Penyakit"))',
      rps: 'textarea[placeholder="Riwayat Penyakit Sekarang"]',
      rpd: 'textarea[placeholder="Riwayat Penyakit Dulu"]',
      rpk: 'textarea[placeholder="Riwayat Penyakit Keluarga"]',
    },
    alergi: {
      section:
        'div.col-sm-6:has(div.form-group.row label.control-label:has-text("Alergi"))',
      tidakAdaCheckbox:
        'div.form-group.row:has(label:has-text("Alergi")) input[type="checkbox"]',
      obatInput: "#getObats",
      makananInput: "#getMakanans",
      udaraInput: "#getUdaras",
      lainnya: 'textarea[placeholder="Alergi Umum atau Lainnya"]',
    },
    vitalSign: {
      section: 'div.row:has(div.form-group.row label:has-text("Kesadaran"))',
      kesadaran: 'div.form-group.row:has(label:has-text("Kesadaran")) select.form-control',
      sistoleGroup: 'div.form-group.row:has(label:has-text("Sistole")) .input-group',
      diastoleGroup: 'div.form-group.row:has(label:has-text("Diastole")) .input-group',
      tinggiBadanGroup: 'div.form-group.row:has(label:has-text("Tinggi Badan")) .input-group',
      beratBadanGroup: 'div.form-group.row:has(label:has-text("Berat Badan")) .input-group',
      detakNadiGroup: 'div.form-group.row:has(label:has-text("Detak Nadi")) .input-group',
      nafasGroup: 'div.form-group.row:has(label:has-text("Nafas")) .input-group',
      saturasiGroup: 'div.form-group.row:has(label:has-text("Saturasi")) .input-group',
      suhuGroup: 'div.form-group.row:has(label:has-text("Suhu")) .input-group',
      detakJantungRegular:
        'div.form-group.row:has(label:has-text("Detak Jantung")) input[type="radio"][value="REGULAR"]',
      triageTidakGawat:
        'div.form-group.row:has(label:has-text("Triage")) input[type="radio"][value="TIDAK GAWAT DARURAT"]',
    },
    accordion: {
      pemeriksaanFisikHeader: "#headerOne",
      pemeriksaanFisikBody: "#accordionOne",
      riwayatPengobatanHeader: "#headerTwo",
      riwayatPengobatanBody: "#accordionTwo",
      diagnosisKeperawatanHeader: "#diagnosis_keperawatan",
      diagnosisKeperawatanBody: "#accordionAskep",
      tambahDiagnosisButton:
        'a.btn.btn-success:has-text("Tambah Baru Diagnosis Keperawatan")',
    },
    pemeriksaanFisik: {
      rencanaTindakan: 'textarea[placeholder="Rencana Tindakan"]',
      tindakanKeperawatan: 'textarea[placeholder="Tindakan Keperawatan"]',
      observasi: 'textarea[placeholder="Observasi"]',
      merokokTidak:
        'div.form-group:has(label:has-text("Merokok")) input[type="radio"][value="0"]',
      alkoholTidak:
        'div.form-group:has(label:has-text("Konsumsi Alkohol")) input[type="radio"][value="0"]',
      kurangSayurTidak:
        'div.form-group:has(label:has-text("Kurang Sayur/Buah")) input[type="radio"][value="0"]',
      anatomiTubuh: {
        image: ".image-container img.tag-image",
        popover: ".vueit-popover-container",
        bagianTubuhInput: 'input[name="bagiantubuh"]',
        keteranganInput: 'input[name="keterangan"]',
        tambahButton: "button.vueit-popover-button",
      },
    },
    riwayatPengobatan: {
      obatSteroid: 'input[placeholder="Obat Steroid"]',
      pengencerDarah: 'input[placeholder="Pengencer Darah"]',
      obatPengencerDahak: 'input[placeholder="Obat Pengencer Dahak"]',
      obatPenyakitKronik: 'input[placeholder="Obat Penyakit Kronik"]',
      obatLainnya: 'input[placeholder="Obat Lainnya"]',
      obatSeringDikonsumsi: 'input[placeholder="Obat Yang Sering Dikonsumsi"]',
    },
    implementasi: {
      wrapper: 'div.form-group:has(label:has-text("Implementasi"))',
    },
    evaluasi: {
      wrapper: 'div.form-group:has(input[name="askep-evaluasi"])',
      sudahTeratasi: 'input[type="radio"][name="askep-evaluasi"][value="1"]',
      belumTeratasi: 'input[type="radio"][name="askep-evaluasi"][value="2"]',
      teratasiSebagian: 'input[type="radio"][name="askep-evaluasi"][value="3"]',
      dischargePlanning: 'textarea[placeholder="Discharge Planning"]',
    },
  },

  button: {
    wrapper: ".form-cta-wrapper",
    simpan: 'button:has-text("Simpan Pemeriksaan")',
    simpanDanMulaiDokter:
      'button:has-text("Selesaikan Pelayanan")',
  },

  rekamMedis: {
    kunjunganPanel:
      '.col-md-3.panel-kiri .panel:has(.panel-heading:has-text("Lihat Rekam Medis Kunjungan"))',
    kunjunganPanelHeading:
      '.col-md-3.panel-kiri .panel-heading:has-text("Lihat Rekam Medis Kunjungan")',
    kunjunganTable:
      '.col-md-3.panel-kiri .panel:has(.panel-heading:has-text("Lihat Rekam Medis Kunjungan")) table tbody tr',
    cpptLink: '.col-md-3.panel-kiri a[href*="/cppt/show/"]',
  },

  modal: {
    skriningLansia: "#modal-konfirmasi-skrining-lansia",
    skriningLansiaLakukanNanti: '#modal-konfirmasi-skrining-lansia button:has-text("Lakukan Nanti")',
    antrol: "#modal-konfrimasi-antrol",
    antrolLanjutkan: '#modal-konfrimasi-antrol button:has-text("Lanjutkan Pelayanan")',
    diagnosisKeperawatan: {
      wrapper:
        '.modal-content:has(.modal-title:has-text("Diagnosis Keperawatan")):visible',
      diagnosisSearchInput:
        'input.multiselect__input[placeholder*="Cari Diagnosa Keperawatan"]',
      diagnosisOption: ".multiselect__option:visible",
      kriteriaEvaluasi: ".modal-body",
      rencanaIntervensi: ".modal-body",
      simpan: '.modal-footer button.btn-success:has-text("Simpan")',
    },
    riwayatPelayanan: {
      wrapper: '#modal.fade.in:has-text("Riwayat Pelayanan")',
      tutup: "#button_close",
    },
  },

  multiselect: {
    option: ".multiselect__option:visible",
    optionHighlight: ".multiselect__option--highlight",
  },
} as const;
