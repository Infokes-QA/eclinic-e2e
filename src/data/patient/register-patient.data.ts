export const RegisterPatientData = {
  url: {
    pendaftaranListPage: /\/pendaftaran\/v2(\?.*)?$/,
    registerPatientPage: /\/pendaftaran\/v2\/create(\?.*)?$/,
  },

  alert: {
    registrationSuccessPattern: /berhasil|sukses|success/i,
    registrationFailurePattern: /gagal|error|invalid|tidak valid/i,
    queuePrintModalPattern: /cetak nomor antrian/i,
    queuePrintContinueButton: "Lanjutkan Ke Pelayanan",
    screenshotFileName: "alert-pendaftaran-pasien",
  },

  pelayanan: {
    heading: "Data pelayanan",
    defaults: {
      waktuKunjungan: "Hari ini",
      kunjungan: "BARU",
      jenisKunjunganSakit: "SAKIT",
      jenisKunjunganSehat: "SEHAT",
      penjamin: "umum",
      instalasi: "Rawat Jalan",
      poliRuangan: "Poli Umum - Pagi",
      skriningVisual: "Pasien stabil",
    },
    poliPlaceholderText: "Silahkan pilih instalasi terlebih dahulu",
  },
} as const;