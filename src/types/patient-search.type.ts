export type PatientTypeRecordFilter = "Aktif" | "Dihapus" | "Semua";

export type PatientVerificationFilter = "Semua" | "Verifikasi" | "Belum Verifikasi";

export type PatientGeneralConsentFilter =
  | "Semua"
  | "Sudah"
  | "Belum"
  | "- Semua Status General Consent -";

export type PatientLimitPerPage = "10" | "25" | "50" | "100";

export interface PatientSearchFilterInput {
  typeRecord?: PatientTypeRecordFilter;
  typeVerification?: PatientVerificationFilter;
  generalConsent?: PatientGeneralConsentFilter;
  birthDate?: string;
  searchKey?: string;
  limitPerPage?: PatientLimitPerPage;
}