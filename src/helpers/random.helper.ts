import { PatientFormDefaults } from "../fixtures/patient.fixture";
import {
  PatientAgama,
  PatientGender,
  PatientGolonganDarah,
  PatientIdentity,
  PatientPendidikan,
  PatientStatusPerkawinan,
  PatientWargaNegara,
} from "../types/patient.type";

export class RandomHelper {
  private static readonly BIRTH_PLACES = [
    "Jakarta",
    "Bandung",
    "Surabaya",
    "Medan",
    "Semarang",
    "Makassar",
    "Palembang",
  ] as const;
  private static readonly STREET_NAMES = [
    "Merdeka",
    "Sudirman",
    "Gatot Subroto",
    "Thamrin",
    "Diponegoro",
    "Kartini",
    "Ahmad Yani",
  ] as const;
  private static readonly GENDERS: readonly PatientGender[] = ["LAKI-LAKI", "PEREMPUAN"];
  private static readonly WARGA_NEGARA_OPTIONS: readonly PatientWargaNegara[] = [
    "INDONESIA",
    "ASING",
  ];
  private static readonly GOLONGAN_DARAH_OPTIONS: readonly PatientGolonganDarah[] = [
    "A",
    "B",
    "O",
    "AB",
    "O+",
  ];
  private static readonly AGAMA_OPTIONS: readonly PatientAgama[] = [
    "ISLAM",
    "KATOLIK",
    "KRISTEN",
    "HINDU",
    "BUDDHA",
    "KONGHUCU",
    "LAINNYA",
  ];
  private static readonly PENDIDIKAN_OPTIONS: readonly PatientPendidikan[] = [
    "TIDAK/BELUM SEKOLAH",
    "SLTA/SEDERAJAT",
    "DIPLOMA IV/STRATA I",
  ];
  private static readonly STATUS_PERKAWINAN_OPTIONS: readonly PatientStatusPerkawinan[] = [
    "BELUM KAWIN",
    "KAWIN",
    "CERAI HIDUP",
    "CERAI MATI",
  ];
  private static readonly PROVINCE_SEARCH = ["Jakarta", "Jawa Barat", "Banten"] as const;
  private static readonly CITY_SEARCH = ["Jakarta", "Bandung", "Tangerang"] as const;
  private static readonly DISTRICT_SEARCH = ["Menteng", "Cilandak", "Kebayoran"] as const;
  private static readonly VILLAGE_SEARCH = ["Menteng", "Cipete", "Senayan"] as const;
  private static readonly JOB_SEARCH = ["Karyawan", "Wiraswasta", "Pelajar"] as const;
  private static readonly FAMILY_RELATIONS = ["Anak", "Istri", "Suami", "Saudara"] as const;
  private static readonly MIN_BIRTH_YEAR = 1950;
  private static readonly MAX_BIRTH_YEAR = 2005;
  /**
   * Generate random numeric string.
   * @param length Jumlah digit yang diinginkan
   */
  public static generateRandomNumber(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  /**
   * Generate random NIK (16 digit)
   */
  public static generateNik(): string {
    return this.generateRandomNumber(16);
  }

  /**
   * Generate random No. KK (16 digit)
   */
  public static generateNoKK(): string {
    return this.generateRandomNumber(16);
  }

  /**
   * Generate random phone number (Indonesia)
   */
  public static generatePhoneNumber(): string {
    return `08${this.generateRandomNumber(10)}`;
  }

  /**
   * Generate patient identity with shared sequence for nama, ayah, ibu, and email.
   * Example: Pasien Auto 001, Pasien Auto Ayah 001, Pasien Auto Ibu 001, PasienAuto001@yopmail.com
   */
  public static generatePatientIdentity(): PatientIdentity {
    const { namePrefix, fatherLabel, motherLabel, emailPrefix, emailDomain, sequenceLength } =
      PatientFormDefaults.patientIdentity;
    const sequence = this.generateRandomNumber(sequenceLength);

    return {
      sequence,
      nama: `${namePrefix} ${sequence}`,
      namaAyah: `${namePrefix} ${fatherLabel} ${sequence}`,
      namaIbu: `${namePrefix} ${motherLabel} ${sequence}`,
      email: `${emailPrefix}${sequence}@${emailDomain}`,
    };
  }

  /**
   * Generate patient name for automation
   */
  public static generatePatientName(): string {
    return this.generatePatientIdentity().nama;
  }

  /**
   * Generate random birth date in DD/MM/YYYY format
   */
  public static generateBirthDate(): string {
    const year =
      this.MIN_BIRTH_YEAR +
      Math.floor(Math.random() * (this.MAX_BIRTH_YEAR - this.MIN_BIRTH_YEAR + 1));
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);

    return `${this.padTwoDigits(day)}/${this.padTwoDigits(month)}/${year}`;
  }

  /**
   * Generate random birth place
   */
  public static generateBirthPlace(): string {
    return this.pickRandom(this.BIRTH_PLACES);
  }

  /**
   * Generate random domicile address
   */
  public static generateAddress(): string {
    const street = this.pickRandom(this.STREET_NAMES);
    const number = this.generateRandomNumber(3);

    return `Jl. ${street} No. ${number}`;
  }

  /**
   * Generate random patient gender
   */
  public static generateGender(): PatientGender {
    return this.pickRandom(this.GENDERS);
  }

  /**
   * Default warga negara untuk automation (selalu INDONESIA).
   */
  public static generateWargaNegara(): PatientWargaNegara {
    return "INDONESIA";
  }

  /**
   * Generate random golongan darah option value
   */
  public static generateGolonganDarah(): PatientGolonganDarah {
    return this.pickRandom(this.GOLONGAN_DARAH_OPTIONS);
  }

  /**
   * Generate random RT or RW value (3 digit)
   */
  public static generateRtRw(): string {
    return this.generateRandomNumber(3);
  }

  /**
   * Generate email for patient (uses same sequence pattern as patient identity)
   */
  public static generateEmail(): string {
    return this.generatePatientIdentity().email;
  }

  /**
   * Generate father name for patient (uses same sequence pattern as patient identity)
   */
  public static generateFatherName(): string {
    return this.generatePatientIdentity().namaAyah;
  }

  /**
   * Generate mother name for patient (uses same sequence pattern as patient identity)
   */
  public static generateMotherName(): string {
    return this.generatePatientIdentity().namaIbu;
  }

  /**
   * Generate random family relation
   */
  public static generateHubunganKeluarga(): string {
    return this.pickRandom(this.FAMILY_RELATIONS);
  }

  /**
   * Generate random agama option value
   */
  public static generateAgama(): PatientAgama {
    return this.pickRandom(this.AGAMA_OPTIONS);
  }

  /**
   * Generate random pendidikan option value
   */
  public static generatePendidikan(): PatientPendidikan {
    return this.pickRandom(this.PENDIDIKAN_OPTIONS);
  }

  /**
   * Generate random status perkawinan option value
   */
  public static generateStatusPerkawinan(): PatientStatusPerkawinan {
    return this.pickRandom(this.STATUS_PERKAWINAN_OPTIONS);
  }

  /**
   * Generate autocomplete search keyword for propinsi
   */
  public static generateProvinceSearch(): string {
    return this.pickRandom(this.PROVINCE_SEARCH);
  }

  /**
   * Generate autocomplete search keyword for kota/kabupaten
   */
  public static generateCitySearch(): string {
    return this.pickRandom(this.CITY_SEARCH);
  }

  /**
   * Generate autocomplete search keyword for kecamatan
   */
  public static generateDistrictSearch(): string {
    return this.pickRandom(this.DISTRICT_SEARCH);
  }

  /**
   * Generate autocomplete search keyword for kelurahan/desa
   */
  public static generateVillageSearch(): string {
    return this.pickRandom(this.VILLAGE_SEARCH);
  }

  /**
   * Generate autocomplete search keyword for pekerjaan
   */
  public static generateJobSearch(): string {
    return this.pickRandom(this.JOB_SEARCH);
  }

  private static padTwoDigits(value: number): string {
    return String(value).padStart(2, "0");
  }

  private static pickRandom<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
  }

  /**
   * Pick random index for list options (0-based)
   */
  public static pickRandomIndex(totalItems: number): number {
    if (totalItems <= 0) {
      throw new Error("Total items must be greater than 0");
    }

    return Math.floor(Math.random() * totalItems);
  }
}
