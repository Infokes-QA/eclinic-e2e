import { PatientFixture } from "../../fixtures/patient.fixture";
import { CreatePatientPage } from "../../pages/patient/create-patient/CreatePatientPage";
import { CreatePatientData } from "../../data/patient/create-patient.data";
import { runRegisterNewPatientByJenisData } from "./create-patient.flow";
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
  await runRegisterNewPatientByJenisData(world, CreatePatientData.jenisData.lengkap);
}
