export const RegisterPatientData = {
  url: {
    registerPatientPage: /\/pendaftaran\/v2\/create(\?.*)?$/,
  },

  alert: {
    registrationSuccessPattern: /berhasil|sukses|success/i,
    registrationFailurePattern: /gagal|error|invalid|tidak valid/i,
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
      poliRuangan: "Poli Umum",
    },
    poliPlaceholderText: "Silahkan pilih instalasi terlebih dahulu",
  },
} as const;
