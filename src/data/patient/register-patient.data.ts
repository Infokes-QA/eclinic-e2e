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

  button: {
    simpanDaftarkanLainnya: "Simpan & Daftarkan Lainnya",
    tutupModalAntrean: "Tutup",
    cetakModalAntrean: "Cetak",
  },

  status: {
    belumDiperiksa: "Belum Diperiksa",
    belumDiperiksaFilterValue: "1",
    pelayananPendaftaran: "Pendaftaran",
    kunjunganBaru: "BARU",
    kunjunganLama: "LAMA",
    kunjunganSakit: "SAKIT",
  },

  jenisData: {
    lengkap: "lengkap",
  } as const,

  jenisKunjungan: {
    sakit: "SAKIT",
    sehat: "SEHAT",
  } as const,

  ruangan: {
    poliUmum: {
      featureLabel: "Poli Umum",
      uiLabel: "Poli Umum - Pagi",
      selectValue: "0001",
    },
  },

  pelayananMenu: {
    rawatJalan: "rawatJalanIgd",
  } as const,

  list: {
    panelTitle: "Pendaftaran Pasien",
    columnIndex: {
      noPendaftaran: 3,
      dataPasien: 4,
      ruanganDaftar: 6,
      kunjungan: 10,
      statusPelayanan: 11,
    },
    rowClass: {
      sedangDiperiksa: "danger",
      sudahDiperiksa: "success",
    },
  },

  jadwal: {
    dokterHariIniFeatureLabel: "Dokter Hari Ini",
  },

  pelayanan: {
    heading: "Data pelayanan",
    poliPlaceholderText: "Silahkan pilih instalasi terlebih dahulu",
  },
} as const;

export type RegisterPatientJenisData = keyof typeof RegisterPatientData.jenisData;
