import { RegisterPatientData } from "../../data/patient/register-patient.data";
import { RawatJalanIgdData } from "../../data/pelayanan/rawat-jalan-igd.data";
import { RegisterFormDefaults } from "../../fixtures/patient.fixture";
import { RegisterPatientPage } from "../../pages/patient/RegisterPatientPage";
import { RegistrationSnapshot } from "../../types/patient.type";
import { CustomWorld } from "../world";
import { runCreatePatientLengkapFlow, runCreatePatientRingkasFlow } from "./create-patient-lengkap.flow";

export async function verifyRegistrationWithAlertDiagnostic(
  world: CustomWorld,
  registerPatientPage: RegisterPatientPage,
  verifyFn: () => Promise<void>,
): Promise<void> {
  try {
    await verifyFn();
  } catch (error) {
    const alertScreenshot = await registerPatientPage.captureRegistrationAlertScreenshot();

    if (alertScreenshot) {
      await world.attach(alertScreenshot, {
        mediaType: "image/png",
        fileName: `${RegisterPatientData.alert.screenshotFileName}-failed.png`,
      });
    }

    throw error;
  }
}

export async function ensurePatientRegisteredByJenisData(
  world: CustomWorld,
  jenisData: string,
): Promise<void> {
  if (jenisData == RegisterPatientData.jenisData.lengkap) {
    if (!world.createdPatientSnapshot) {
      await runCreatePatientLengkapFlow(world);
    }

    world.registrationSnapshot = initRegistrationSnapshotFromCreatedPatient(world);
    return;
  } else if (jenisData == RegisterPatientData.jenisData.ringkas) {
    if (!world.createdPatientSnapshot) {
      await runCreatePatientRingkasFlow(world);
    }

    world.registrationSnapshot = initRegistrationSnapshotFromCreatedPatient(world);
    return;
  }

  throw new Error(`jenisData '${jenisData}' belum didukung.`);
}

export function initRegistrationSnapshotFromCreatedPatient(
  world: CustomWorld,
): RegistrationSnapshot {
  if (!world.createdPatientSnapshot) {
    throw new Error(
      "Data pasien yang dibuat belum tersedia. Jalankan step pembuatan pasien terlebih dahulu.",
    );
  }

  return {
    nama: world.createdPatientSnapshot.nama,
    nik: world.createdPatientSnapshot.nik,
    noRm: world.createdPatientSnapshot.noRm,
    kunjungan: "",
    pelayanan: "",
    ruangan: "",
    jadwal: "",
  };
}

export function updateRegistrationSnapshot(
  world: CustomWorld,
  partial: Partial<RegistrationSnapshot>,
): void {
  if (!world.registrationSnapshot) {
    throw new Error("Registration snapshot belum diinisialisasi.");
  }

  world.registrationSnapshot = {
    ...world.registrationSnapshot,
    ...partial,
  };
}

export function resolveRuanganUiLabel(featureRuangan: string): string {
  if (featureRuangan === RegisterPatientData.ruangan.poliUmum.featureLabel) {
    return RegisterPatientData.ruangan.poliUmum.uiLabel;
  }

  return featureRuangan;
}

export function resolveKunjunganValue(jenisKunjungan: string): string {
  const normalized = jenisKunjungan.toLowerCase();

  if (normalized === "sakit") {
    return RegisterPatientData.jenisKunjungan.sakit;
  }

  if (normalized === "sehat") {
    return RegisterPatientData.jenisKunjungan.sehat;
  }

  throw new Error(`Jenis kunjungan '${jenisKunjungan}' belum didukung.`);
}

export function isRawatJalanPelayanan(pelayanan: string): boolean {
  return (
    pelayanan === RawatJalanIgdData.pelayananFeatureLabel.rawatJalan ||
    pelayanan === RegisterFormDefaults.instalasi
  );
}
