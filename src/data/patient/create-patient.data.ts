export const CreatePatientData = {
  url: {
    createPatientPage: /\/pendaftaran\/v2(\?.*)?$/,
    createRegistrationPage: /\/pendaftaran\/v2\/create(\?.*)?$/,
  },

  modal: {
    title: "Buat Pasien Baru",
  },

  placeholder: {
    noDokumenRM: "Nomor Dokumen Rekam Medis",
    noRMLama: "Nomor Rekam Medis Lama",
    noKK: "Nomor KK / NIK Anggota Keluarga",
    nik: "Nomor Induk Kependudukan (KTP)",
    nama: "Nama lengkap",
    tempatLahir: "Tempat lahir",
    noHP: "Nomor HP",
    alamatDomisili: "Alamat Domisili",
    propinsi: "Nama Propinsi",
    kotaKab: "Nama Kota / Kabupaten",
    kecamatan: "Nama Kecamatan",
    kelurahanDesa: "Nama Kelurahan / Desa",
    pekerjaan: "Pekerjaan",
    email: "emailpasien@email.com",
    namaAyah: "Nama Ayah",
    namaIbu: "Nama Ibu",
    hubunganKeluarga: "Hubungan Keluarga",
    negaraAsal: "Negara Asal",
    noPaspor: "No Paspor",
    ihsNumber: "IHS Number",
  },

  linkLabel: {
    tambahAsuransi: "Tambah Asuransi/Penjamin",
    inputAlamatLengkap: "Input data alamat lengkap",
    inputDataLainnya: "Input data lainnya",
    sembunyikan: "Sembunyikan",
  },

  alert: {
    saveSuccessMessage: /Data berhasil disimpan/i,
    saveFailurePattern: /gagal|error|invalid|tidak valid/i,
    validationPattern: /wajib diisi|perhatian/i,
  },

  panelKiri: {
    heading: "Data Pasien",
    expandLink: "Lihat Selengkapnya",
    labels: {
      noRm: "No RM",
      nik: "NIK",
      namaLengkap: "Nama Lengkap",
      jenisKelamin: "Jenis kelamin",
      usia: "Usia",
      golonganDarah: "Golongan Darah",
      noHp: "No HP",
      noRmLama: "No RM Lama",
      wargaNegara: "Warga Negara",
      noKk: "No. KK",
      alamat: "Alamat",
      rtRw: "Rt / Rw",
      propinsi: "Propinsi",
      kota: "Kota",
      kecamatan: "Kecamatan",
      kelurahan: "Kelurahan",
      pekerjaan: "Pekerjaan",
      agama: "Agama",
      pendidikan: "Pendidikan",
      statusPerkawinan: "Status Perkawinan",
      email: "Email",
    },
    usiaPattern: /tahun/i,
    noRmPattern: /\d+/,
  },

  formMode: {
    verifiedCheckboxLabel: "Diverifikasi (Lengkap)",
    ringkas: {
      requiredLabels: ["NIK", "Nama", "Jenis Kelamin", "Nomor HP"],
      optionalVisibleLabels: ["Alamat Domisili"],
    },
    lengkap: {
      requiredLabels: [
        "Alamat Domisili",
        "RT / RW",
        "Propinsi",
        "Kota/Kab",
        "Kecamatan",
        "Kelurahan/Desa",
        "Pekerjaan",
        "Agama",
        "Pendidikan",
        "Status Perkawinan",
        "Tanggal lahir",
      ],
    },
  },

  autocomplete: {
    spaceTriggerCount: 3,
  },

  jenisData: {
    lengkap: "lengkap",
  } as const,
} as const;

export type CreatePatientJenisData = keyof typeof CreatePatientData.jenisData;
