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
 
  public static generateRandomNumber(length: number): string {
    return Array.from({ length }, () => Math.floor(Math.random() * 10)).join("");
  }

  public static generateNik(): string {
    return this.generateRandomNumber(16);
  }

  public static generateNoKK(): string {
    return this.generateRandomNumber(16);
  }

  public static generatePhoneNumber(): string {
    return `08${this.generateRandomNumber(10)}`;
  }

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

  public static generatePatientName(): string {
    return this.generatePatientIdentity().nama;
  }

  public static generateBirthDate(): string {
    const year =
      this.MIN_BIRTH_YEAR +
      Math.floor(Math.random() * (this.MAX_BIRTH_YEAR - this.MIN_BIRTH_YEAR + 1));
    const month = 1 + Math.floor(Math.random() * 12);
    const day = 1 + Math.floor(Math.random() * 28);

    return `${this.padTwoDigits(day)}/${this.padTwoDigits(month)}/${year}`;
  }

  public static generateBirthPlace(): string {
    return this.pickRandom(this.BIRTH_PLACES);
  }

  public static generateAddress(): string {
    const street = this.pickRandom(this.STREET_NAMES);
    const number = this.generateRandomNumber(3);

    return `Jl. ${street} No. ${number}`;
  }

  public static generateGender(): PatientGender {
    return this.pickRandom(this.GENDERS);
  }

  public static generateWargaNegara(): PatientWargaNegara {
    return "INDONESIA";
  }

  public static generateGolonganDarah(): PatientGolonganDarah {
    return this.pickRandom(this.GOLONGAN_DARAH_OPTIONS);
  }

  public static generateRtRw(): string {
    return this.generateRandomNumber(3);
  }

  public static generateEmail(): string {
    return this.generatePatientIdentity().email;
  }

  public static generateFatherName(): string {
    return this.generatePatientIdentity().namaAyah;
  }

  public static generateMotherName(): string {
    return this.generatePatientIdentity().namaIbu;
  }

  public static generateHubunganKeluarga(): string {
    return this.pickRandom(this.FAMILY_RELATIONS);
  }

  public static generateAgama(): PatientAgama {
    return this.pickRandom(this.AGAMA_OPTIONS);
  }

  public static generatePendidikan(): PatientPendidikan {
    return this.pickRandom(this.PENDIDIKAN_OPTIONS);
  }

  public static generateStatusPerkawinan(): PatientStatusPerkawinan {
    return this.pickRandom(this.STATUS_PERKAWINAN_OPTIONS);
  }

  public static generateProvinceSearch(): string {
    return this.pickRandom(this.PROVINCE_SEARCH);
  }

  public static generateCitySearch(): string {
    return this.pickRandom(this.CITY_SEARCH);
  }

  public static generateDistrictSearch(): string {
    return this.pickRandom(this.DISTRICT_SEARCH);
  }

  public static generateVillageSearch(): string {
    return this.pickRandom(this.VILLAGE_SEARCH);
  }

  public static generateJobSearch(): string {
    return this.pickRandom(this.JOB_SEARCH);
  }

  private static padTwoDigits(value: number): string {
    return String(value).padStart(2, "0");
  }

  private static pickRandom<T>(items: readonly T[]): T {
    return items[Math.floor(Math.random() * items.length)] as T;
  }

  public static pickRandomIndex(totalItems: number): number {
    if (totalItems <= 0) {
      throw new Error("Total items must be greater than 0");
    }

    return Math.floor(Math.random() * totalItems);
  }
}
