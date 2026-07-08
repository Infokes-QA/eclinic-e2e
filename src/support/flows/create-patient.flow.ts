import { CreatePatientData } from "../../data/patient/create-patient.data";
import { CreatePatientPage } from "../../pages/patient/create-patient/CreatePatientPage";
import { CustomWorld } from "../world";

function ensureCreatePatientPage(world: CustomWorld): CreatePatientPage {
  if (!world.createPatientPage) {
    world.createPatientPage = new CreatePatientPage(world.page);
  }

  return world.createPatientPage;
}

export async function runRegisterNewPatientByJenisData(world: CustomWorld, jenisData: string): Promise<void> {
  const createPatientPage = ensureCreatePatientPage(world);

  if (jenisData === CreatePatientData.jenisData.lengkap) {
    await createPatientPage.openCreatePatientModal();
    await createPatientPage.setVerifiedCheckboxState("dicentang");
    world.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataLengkap();
    await createPatientPage.clickSavePatientButton();
    await createPatientPage.verifySaveAlertSuccess();
    await createPatientPage.verifyOnCreateRegistrationPage();
  } else if (jenisData === CreatePatientData.jenisData.ringkas) {
    await createPatientPage.openCreatePatientModal();
    world.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataRingkas();
    await createPatientPage.clickSavePatientButton();
    await createPatientPage.verifySaveAlertSuccess();
    await createPatientPage.verifyOnCreateRegistrationPage();
  } else {
    throw new Error(`Jenis data pasien tidak valid: ${jenisData}`);
  }

  if (!world.patientFormInput) {
    throw new Error("Data pasien belum tersedia setelah pembuatan pasien.");
  }

  await createPatientPage.verifyPatientPanelKiri(world.patientFormInput);
  world.createdPatientSnapshot = await createPatientPage.captureCreatedPatientSnapshot(
    world.patientFormInput,
  );
}
