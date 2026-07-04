import { CreatePatientData } from "../../data/patient/create-patient.data";
import { CreatePatientPage } from "../../pages/patient/create-patient/CreatePatientPage";
import { CustomWorld } from "../world";

function ensureCreatePatientPage(world: CustomWorld): CreatePatientPage {
  if (!world.createPatientPage) {
    world.createPatientPage = new CreatePatientPage(world.page);
  }

  return world.createPatientPage;
}

export async function runRegisterNewPatientByJenisData(
  world: CustomWorld,
  jenisData: string,
): Promise<void> {
  if (jenisData !== CreatePatientData.jenisData.lengkap) {
    throw new Error(`jenisData '${jenisData}' belum didukung.`);
  }

  const createPatientPage = ensureCreatePatientPage(world);

  await createPatientPage.openCreatePatientModal();
  await createPatientPage.setVerifiedCheckboxState("dicentang");
  world.patientFormInput = await createPatientPage.fillPatientFormWithFakeDataLengkap();
  await createPatientPage.clickSavePatientButton();
  await createPatientPage.verifySaveAlertSuccess();
  await createPatientPage.verifyOnCreateRegistrationPage();

  if (!world.patientFormInput) {
    throw new Error("Data pasien belum tersedia setelah pembuatan pasien.");
  }

  await createPatientPage.verifyPatientPanelKiri(world.patientFormInput);
  world.createdPatientSnapshot = await createPatientPage.captureCreatedPatientSnapshot(
    world.patientFormInput,
  );
}
