export const PatientShowDetailData = {
  panelTitle: "Lihat Data Pasien",

  detailLabels: {
    noErm: "No. eRM",
    nik: "NIK",
    nama: "Nama",
    noKk: "No. KK",
    noHp: "No. HP",
  },

  snapshotToDetailMapping: {
    noRm: { detailLabel: "No. eRM", transform: "noErmLastEight" },
    nik: { detailLabel: "NIK", transform: "exact" },
    nama: { detailLabel: "Nama", transform: "ignoreCase" },
  },
} as const;
