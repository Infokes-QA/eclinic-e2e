export const RegisterPatientLocator = {
  pelayanan: {
    heading: '.col-md-9 .panel-heading:has-text("Data pelayanan")',
    waktuKunjunganHariIni:
      'button.radio-btn-selected:has-text("Hari ini"), button.radio-btn:has-text("Hari ini")',
    kunjunganBaru: 'input[type="radio"][value="BARU"]',
    kunjunganSakit: 'input[type="radio"][value="SAKIT"]',
    kunjunganSehat: 'input[type="radio"][value="SEHAT"]',
    penjaminSelect: 'div.form-group:has(label:has-text("Penjamin")) select',
    instalasiRawatJalan: 'button.radio-btn:has-text("Rawat Jalan")',
    poliRuanganContainer: 'div.form-group:has(label:has-text("Poli Ruangan"))',
    poliRuanganSelect: 'div.form-group:has(label:has-text("Poli Ruangan")) select',
    poliRuanganPlaceholder: 'div.form-group:has(label:has-text("Poli Ruangan")) span.font-gray',
    jadwalPraktikContainer: 'div.form-group:has(label:has-text("Jadwal Praktik"))',
    jadwalPraktikOption:
      'div.form-group:has(label:has-text("Jadwal Praktik")) .poli-card button.radio-btn',
    btnLanjutkan: 'button.btn-primary:has-text("Lanjutkan")',
  },
} as const;
