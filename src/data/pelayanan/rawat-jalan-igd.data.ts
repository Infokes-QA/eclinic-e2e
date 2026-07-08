export const RawatJalanIgdData = {
  url: {
    listPage: /\/pemeriksaanmedis(\?.*)?$/,
  },

  panel: {
    title: "Data Pemeriksaan Medis",
  },

  status: {
    belumDiperiksa: "Belum Diperiksa",
    belumDiperiksaFilterValue: "1",
  },

  ruangan: {
    poliUmumPagi: {
      label: "Poli Umum - Pagi",
      selectValue: "0001",
    },
  },

  pelayananFeatureLabel: {
    rawatJalan: "Rawat Jalan",
  },

  list: {
    columnIndex: {
      noAntrean: 1,
      poliRuangan: 2,
      nik: 8,
      namaPasien: 9,
    },
    rowClass: {
      sedangDiperiksaPerawat: "danger",
      sudahDiperiksa: "success",
    },
    noAntreanPattern: /^[A-Z]{2,3}-\d+$/,
  },
} as const;
