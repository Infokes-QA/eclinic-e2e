export const CreatePatientData = {
  url: {
    createPatientPage: /\/pendaftaran\/v2(\?.*)?$/,
    createRegistrationPage: /\/pendaftaran\/v2\/create(\?.*)?$/,
  },

  modal: {
    title: "Buat Pasien Baru",
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

  alamatLengkap: {
    rt: "001",
    rw: "002",
    propinsi: "JAWA BARAT",
    kotaKab: "KOTA BANDUNG",
    kecamatan: "BUAHBATU",
    kelurahanDesa: "SEKEJATI",
  },

  defaults: {
    wargaNegara: "INDONESIA",
  },

  patientIdentity: {
    namePrefix: "Pasien Auto",
    fatherLabel: "Ayah",
    motherLabel: "Ibu",
    emailPrefix: "PasienAuto",
    emailDomain: "yopmail.com",
    sequenceLength: 3,
  },
} as const;
