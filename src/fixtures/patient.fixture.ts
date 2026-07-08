import { RandomHelper } from "../helpers/random.helper";
import { PatientFormInput, PatientIdentity } from "../types/patient.type";

export const PatientFormDefaults = {
  wargaNegara: "INDONESIA",
  alamatLengkap: {
    rt: "001",
    rw: "002",
    propinsi: "JAWA BARAT",
    kotaKab: "KOTA BANDUNG",
    kecamatan: "BUAHBATU",
    kelurahanDesa: "SEKEJATI",
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

export const RegisterFormDefaults = {
  waktuKunjungan: "Hari ini",
  kunjungan: "BARU",
  jenisKunjunganSakit: "SAKIT",
  jenisKunjunganSehat: "SEHAT",
  penjamin: "umum",
  instalasi: "Rawat Jalan",
  poliRuangan: "Poli Umum - Pagi",
  skriningVisual: "Pasien stabil",
} as const;

function buildBaseRandomInput(identity?: PatientIdentity): Omit<PatientFormInput, "alamatLengkap" | "dataLainnya"> {
  const patientIdentity = identity ?? RandomHelper.generatePatientIdentity();

  return {
    nik: RandomHelper.generateNik(),
    noKK: RandomHelper.generateNoKK(),
    nama: patientIdentity.nama,
    phoneNumber: RandomHelper.generatePhoneNumber(),
    tanggalLahir: RandomHelper.generateBirthDate(),
    tempatLahir: RandomHelper.generateBirthPlace(),
    alamatDomisili: RandomHelper.generateAddress(),
    jenisKelamin: RandomHelper.generateGender(),
    wargaNegara: PatientFormDefaults.wargaNegara,
    golonganDarah: RandomHelper.generateGolonganDarah(),
  };
}

export const PatientFixture = {
  createPatientNavigation: {
    menu: "pendaftaran",
    submenu: "createPasien",
  } as const,

  searchPatientNavigation: {
    menu: "pendaftaran",
    submenu: "pasien",
  } as const,

  registerPatientNavigation: {
    menu: "pendaftaran",
    submenu: "pendaftaranPasienV2",
  } as const,

  searchPatientSamples: {
    ruslani: {
      name: "RUSLANI",
      nik: "1311025512910261",
    },
    andri: {
      name: "ANDRI",
      nik: "1234567890123451",
    },
    rosati: {
      name: "ROSAT",
      nik: "1133444662255133",
    },
  } as const,

  defaultWargaNegara: PatientFormDefaults.wargaNegara,
  defaultInsuranceName: "umum" as const,

  buildRandomInputRingkas(): PatientFormInput {
    return buildBaseRandomInput();
  },

  buildRandomInputLengkap(): PatientFormInput {
    const patientIdentity = RandomHelper.generatePatientIdentity();

    return {
      ...buildBaseRandomInput(patientIdentity),
      insuranceName: PatientFixture.defaultInsuranceName,
      alamatLengkap: {
        rt: PatientFormDefaults.alamatLengkap.rt,
        rw: PatientFormDefaults.alamatLengkap.rw,
        propinsi: PatientFormDefaults.alamatLengkap.propinsi,
        kotaKab: PatientFormDefaults.alamatLengkap.kotaKab,
        kecamatan: PatientFormDefaults.alamatLengkap.kecamatan,
        kelurahanDesa: PatientFormDefaults.alamatLengkap.kelurahanDesa,
      },
      dataLainnya: {
        agama: RandomHelper.generateAgama(),
        pendidikan: RandomHelper.generatePendidikan(),
        statusPerkawinan: RandomHelper.generateStatusPerkawinan(),
        email: patientIdentity.email,
        namaAyah: patientIdentity.namaAyah,
        namaIbu: patientIdentity.namaIbu,
        hubunganKeluarga: RandomHelper.generateHubunganKeluarga(),
      },
    };
  },
} as const;
