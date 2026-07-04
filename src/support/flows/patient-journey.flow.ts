import { Users } from "../../fixtures/users.fixture";
import { PatientFixture, RegisterFormDefaults } from "../../fixtures/patient.fixture";
import { LoginPage } from "../../pages/authentication/LoginPage";
import { CreatePatientPage } from "../../pages/patient/create-patient/CreatePatientPage";
import { RegisterPatientPage } from "../../pages/patient/RegisterPatientPage";
import { PatientShowDetailPage } from "../../pages/patient/PatientShowDetailPage";
import { SearchPatientPage } from "../../pages/patient/SearchPatientPage";
import { RawatJalanIgdPage } from "../../pages/pelayanan/RawatJalanIgdPage";
import { RawatJalanIgdData } from "../../data/pelayanan/rawat-jalan-igd.data";
import { SearchPatientData } from "../../data/patient/search-patient.data";
import { runRegisterNewPatientByJenisData } from "./create-patient.flow";
import {
  ensurePatientRegisteredByJenisData,
  resolveKunjunganValue,
  resolveRuanganUiLabel,
  updateRegistrationSnapshot,
} from "./register-patient.flow";
import { CustomWorld } from "../world";

function ensureLoginPage(world: CustomWorld): LoginPage {
  if (!world.loginPage) {
    world.loginPage = new LoginPage(world.page);
  }

  return world.loginPage;
}

function ensureCreatePatientPage(world: CustomWorld): CreatePatientPage {
  if (!world.createPatientPage) {
    world.createPatientPage = new CreatePatientPage(world.page);
  }

  return world.createPatientPage;
}

function ensureSearchPatientPage(world: CustomWorld): SearchPatientPage {
  if (!world.searchPatientPage) {
    world.searchPatientPage = new SearchPatientPage(world.page);
  }

  return world.searchPatientPage;
}

function ensureRegisterPatientPage(world: CustomWorld): RegisterPatientPage {
  if (!world.registerPatientPage) {
    world.registerPatientPage = new RegisterPatientPage(world.page);
  }

  return world.registerPatientPage;
}

function ensureRawatJalanIgdPage(world: CustomWorld): RawatJalanIgdPage {
  if (!world.rawatJalanIgdPage) {
    world.rawatJalanIgdPage = new RawatJalanIgdPage(world.page);
  }

  return world.rawatJalanIgdPage;
}

function ensurePatientShowDetailPage(world: CustomWorld): PatientShowDetailPage {
  if (!world.patientShowDetailPage) {
    world.patientShowDetailPage = new PatientShowDetailPage(world.page);
  }

  return world.patientShowDetailPage;
}

export async function runJourneyLogin(world: CustomWorld, role: string): Promise<void> {
  const user = Users[role];

  if (!user) {
    throw new Error(`User role '${role}' tidak ditemukan di users.fixture.ts`);
  }

  const loginPage = ensureLoginPage(world);

  await loginPage.openLoginPage();
  await loginPage.verifyLoginPageDisplayed();
  world.loggedInUser = user;
  await loginPage.loginAs(user);
  await loginPage.verifyLoginSuccess(user);
}

export async function runJourneyCreatePatient(world: CustomWorld, jenisData: string): Promise<void> {
  const createPatientPage = ensureCreatePatientPage(world);
  const { menu, submenu } = PatientFixture.createPatientNavigation;

  await createPatientPage.openFromNavbar(menu, submenu);
  await createPatientPage.verifyCreatePatientPageDisplayed();
  await runRegisterNewPatientByJenisData(world, jenisData);

  if (!world.patientFormInput || !world.createdPatientSnapshot) {
    throw new Error("Data pasien belum tersedia setelah pembuatan pasien.");
  }

  await createPatientPage.verifyPatientSavedSuccess(
    world.patientFormInput,
    world.createdPatientSnapshot,
  );

  const searchPatientPage = ensureSearchPatientPage(world);

  await searchPatientPage.openPatientListAndSearchCreatedPatient(world.createdPatientSnapshot);
  await searchPatientPage.verifyTableDisplaysCreatedPatient(world.createdPatientSnapshot);

  await searchPatientPage.searchCreatedPatient(
    world.createdPatientSnapshot,
    SearchPatientData.searchCriteria.nik,
  );
  await searchPatientPage.verifyTableDisplaysCreatedPatient(world.createdPatientSnapshot);

  await searchPatientPage.openCreatedPatientDetailByDoubleClick(world.createdPatientSnapshot);

  const patientShowDetailPage = ensurePatientShowDetailPage(world);

  await patientShowDetailPage.verifyPatientDetail(world.createdPatientSnapshot);
}

export async function runJourneyRegisterRawatJalan(
  world: CustomWorld,
  jenisData: string,
  jenisKunjungan: string,
  ruangan: string,
  jadwal: string,
): Promise<void> {
  if (!world.createdPatientSnapshot) {
    throw new Error("Data pasien belum tersedia. Jalankan step pembuatan pasien terlebih dahulu.");
  }

  await ensurePatientRegisteredByJenisData(world, jenisData);

  const registerPatientPage = ensureRegisterPatientPage(world);
  const pelayanan = RegisterFormDefaults.instalasi;

  await registerPatientPage.openRegisterPatientCreateWithPatient(
    world.createdPatientSnapshot.nama,
    world.createdPatientSnapshot.nama,
  );

  await registerPatientPage.prepareKunjunganFormDefaults();
  await registerPatientPage.selectJenisKunjungan(jenisKunjungan);
  updateRegistrationSnapshot(world, {
    kunjungan: resolveKunjunganValue(jenisKunjungan),
  });

  await registerPatientPage.selectInstalasi(pelayanan);
  updateRegistrationSnapshot(world, { pelayanan });

  await registerPatientPage.selectPoliRuangan(ruangan);
  updateRegistrationSnapshot(world, { ruangan: resolveRuanganUiLabel(ruangan) });

  const selectedJadwal = await registerPatientPage.selectJadwalPraktikByLabel(jadwal);
  const dokterMatch = selectedJadwal.match(/^(.+?)\s+\d{2}:\d{2}/);

  updateRegistrationSnapshot(world, {
    jadwal: selectedJadwal,
    dokter: dokterMatch?.[1]?.trim(),
  });

  await registerPatientPage.saveAndRegisterAnother();
  await registerPatientPage.verifyRegistrationSavedAfterDaftarkanLainnya();

  if (!world.registrationSnapshot) {
    throw new Error("Registration snapshot belum tersedia setelah pendaftaran.");
  }

  const noPendaftaran = await registerPatientPage.verifyRegistrationOnPendaftaranList(
    world.registrationSnapshot,
  );

  updateRegistrationSnapshot(world, { noPendaftaran });

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);
  const noAntrean = await rawatJalanIgdPage.verifyPatientInPelayananList(
    world.registrationSnapshot,
  );

  updateRegistrationSnapshot(world, { noAntrean });

  if (pelayanan !== RawatJalanIgdData.pelayananFeatureLabel.rawatJalan) {
    throw new Error(`Pelayanan '${pelayanan}' tidak didukung pada journey rawat jalan.`);
  }
}
