export const SearchPatientData = {
  url: {
    patientPage: /\/pasien(\?.*)?$/,
  },

  filter: {
    typeRecord: {
      aktif: "Aktif",
      dihapus: "Dihapus",
      semua: "Semua",
    },
    verification: {
      semua: "Semua",
      verifikasi: "Verifikasi",
      belumVerifikasi: "Belum Verifikasi",
    },
    generalConsent: {
      semua: { label: "- Semua Status General Consent -", value: "0" },
      sudah: { label: "Sudah", value: "sudah" },
      belum: { label: "Belum", value: "belum" },
    },
    limitPerPage: {
      ten: "10",
      twentyFive: "25",
      fifty: "50",
      hundred: "100",
    },
  },

  table: {
    noRmAssertDigits: 8,
    columns: {
      no: "No.",
      noErm: "No. eRM",
      noRmLama: "No. RM Lama",
      noDokRm: "No. Dok. RM",
      nama: "Nama",
      nik: "NIK",
      noPenjamin: "No. Penjamin",
      jenisKelamin: "Jenis Kelamin",
      tempatTglLahir: "Tempat & Tgl.Lahir",
      kelurahan: "Kelurahan",
      alamat: "Alamat",
      generalConsent: "Status General Consent",
      cetak: "Cetak",
    },
  },

  panelToTableMapping: {
    noRm: { tableColumn: "No. eRM", transform: "noErmLastEight" },
    nama: { tableColumn: "Nama", transform: "ignoreCase" },
    nik: { tableColumn: "NIK", transform: "exact" },
  },

  footer: {
    infoPattern: /Menampilkan \d+-\d+ dari \d+/,
    hasResultsPattern: /Menampilkan \d+-\d+ dari [1-9]\d*/,
  },

  searchCriteria: {
    nama: "nama",
    nik: "nik",
    noRm: "no rm",
  },
} as const;
