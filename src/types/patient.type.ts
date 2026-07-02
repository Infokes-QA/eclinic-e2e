export type PatientGender = "LAKI-LAKI" | "PEREMPUAN";

export type PatientWargaNegara = "INDONESIA" | "ASING";

export type PatientGolonganDarah =
  | "A"
  | "B"
  | "AB"
  | "O"
  | "A-"
  | "A+"
  | "B-"
  | "B+"
  | "AB+"
  | "AB-"
  | "O+"
  | "O-";

export type PatientAgama =
  | "ISLAM"
  | "KATOLIK"
  | "KRISTEN"
  | "HINDU"
  | "BUDDHA"
  | "KONGHUCU"
  | "LAINNYA";

export type PatientStatusPerkawinan = "BELUM KAWIN" | "KAWIN" | "CERAI HIDUP" | "CERAI MATI";

export type PatientPendidikan =
  | "TIDAK/BELUM SEKOLAH"
  | "BELUM TAMAT SD/SEDERAJAT"
  | "TAMAT SD/SEDERAJAT"
  | "SLTP/SEDERAJAT"
  | "SLTA/SEDERAJAT"
  | "DIPLOMA I"
  | "DIPLOMA II"
  | "AKADEMI/DIPLOMA III/SARJANA MUDA"
  | "DIPLOMA IV/STRATA I"
  | "STRATA II"
  | "STRATA III";

export interface PatientIdentity {
  sequence: string;
  nama: string;
  namaAyah: string;
  namaIbu: string;
  email: string;
}

export interface PatientAlamatLengkapInput {
  rt: string;
  rw: string;
  propinsi?: string;
  kotaKab?: string;
  kecamatan?: string;
  kelurahanDesa?: string;
}

export interface PatientDataLainnyaInput {
  pekerjaan?: string;
  agama: PatientAgama;
  pendidikan: PatientPendidikan;
  statusPerkawinan: PatientStatusPerkawinan;
  email: string;
  namaAyah: string;
  namaIbu: string;
  hubunganKeluarga: string;
}

export interface PatientFormInput {
  nik: string;
  noKK: string;
  nama: string;
  phoneNumber: string;
  tanggalLahir: string;
  tempatLahir: string;
  alamatDomisili: string;
  jenisKelamin: PatientGender;
  wargaNegara?: PatientWargaNegara;
  golonganDarah?: PatientGolonganDarah;
  insuranceName?: string;
  alamatLengkap?: PatientAlamatLengkapInput;
  dataLainnya?: PatientDataLainnyaInput;
}

export interface CreatedPatientSnapshot {
  noRm: string;
  nik: string;
  nama: string;
  phoneNumber: string;
}
