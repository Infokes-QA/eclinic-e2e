import { PatientFixture } from "../../fixtures/patient.fixture";
import { CreatePatientPage } from "../../pages/patient/CreatePatientPage";
import { CustomWorld } from "../world";

function ensureCreatePatientPage(world: CustomWorld): CreatePatientPage {
  if (!world.createPatientPage) {
    world.createPatientPage = new CreatePatientPage(world.page);
  }

  return world.createPatientPage;
}

export async function runCreatePatientLengkapFlow(world: CustomWorld): Promise<void> {
  const createPatientPage = ensureCreatePatientPage(world);
  const { menu, submenu } = PatientFixture.createPatientNavigation;

  await createPatientPage.openFromNavbar(menu, submenu);
  await createPatientPage.openCreatePatientModal();
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
