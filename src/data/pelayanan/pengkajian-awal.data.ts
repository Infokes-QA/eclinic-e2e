export const PengkajianAwalData = {
  page: {
    title: "Pemeriksaan",
    panelPengkajianHeading: "Pengkajian Awal",
    landingMessage: "Silakan Panggil Pasien / Mulai Pemeriksaan",
  },

  jenisPengkajian: {
    lengkap: "lengkap",
  } as const,

  pelayananFeatureLabel: {
    rawatJalan: "Rawat Jalan",
  } as const,

  button: {
    pengkajianAwal: "Pengkajian Awal",
    simpan: "Simpan Pemeriksaan",
    simpanDanMulaiDokter: "Selesaikan Pelayanan",
    mulaiPemeriksaanDokter: "Mulai Pemeriksaan Dokter",
  },

  alert: {
    saveSuccessPattern: /Data berhasil disimpan|berhasil|sukses|success/i,
  },

  status: {
    belumDiperiksa: "Belum Diperiksa",
    sedangDiperiksaPerawat: "Sedang Diperiksa Perawat",
    sudahDiperiksaPerawat: "Sudah Diperiksa Perawat",
    sedangDiperiksaDokter: "Sedang Diperiksa Dokter",
    sudahDiperiksaDokter: "Sudah Diperiksa Dokter",
  },

  statusGherkinLabel: {
    "Sudah diperiksa perawat": "Sudah Diperiksa Perawat",
    "Sedang diperiksa perawat": "Sedang Diperiksa Perawat",
    "Sedang diperiksa dokter": "Sedang Diperiksa Dokter",
    "Sudah diperiksa dokter": "Sudah Diperiksa Dokter",
    "Belum diperiksa": "Belum Diperiksa",
  } as const,

  panelPasien: {
    tanggal: "Tanggal",
    poliRuangan: "Poli / Ruangan",
    noErm: "No eRM",
    nik: "NIK",
    namaPasien: "Nama Pasien",
  },

  registerDefaults: {
    jenisKunjungan: "sakit",
    ruangan: "Poli Umum",
    jadwal: "Dokter Hari Ini",
  },

  skriningAwal: {
    accordionTitle: "Skrining Awal",
    pemeriksaanFisikTitle: "Pemeriksaan Fisik",
    riwayatPengobatanTitle: "Riwayat Pengobatan",
    diagnosisKeperawatanTitle: "Diagnosis Keperawatan",
    tambahDiagnosisButton: "Tambah Baru Diagnosis Keperawatan",
    diagnosisModalTitle: "Diagnosis Keperawatan",
  },
} as const;

export type PengkajianJenisData = keyof typeof PengkajianAwalData.jenisPengkajian;

export type PengkajianStatusGherkinLabel = keyof typeof PengkajianAwalData.statusGherkinLabel;

export function resolveStatusLabelFromGherkin(gherkinLabel: string): string {
  const mapped =
    PengkajianAwalData.statusGherkinLabel[
      gherkinLabel as PengkajianStatusGherkinLabel
    ];

  if (!mapped) {
    throw new Error(`Status pelayanan Gherkin '${gherkinLabel}' belum didukung.`);
  }

  return mapped;
}
