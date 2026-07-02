import { CreatePatientData } from "../data/patient/create-patient.data";
import { RandomHelper } from "../helpers/random.helper";
import { PatientFormInput, PatientIdentity } from "../types/patient.type";

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
    wargaNegara: CreatePatientData.defaults.wargaNegara,
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

  defaultWargaNegara: CreatePatientData.defaults.wargaNegara,
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
        // rt: RandomHelper.generateRtRw(),
        // rw: RandomHelper.generateRtRw(),
        rt: CreatePatientData.alamatLengkap.rt,
        rw: CreatePatientData.alamatLengkap.rw,
        propinsi: CreatePatientData.alamatLengkap.propinsi,
        kotaKab: CreatePatientData.alamatLengkap.kotaKab,
        kecamatan: CreatePatientData.alamatLengkap.kecamatan,
        kelurahanDesa: CreatePatientData.alamatLengkap.kelurahanDesa,
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
