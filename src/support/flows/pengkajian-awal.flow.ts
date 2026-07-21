import { PengkajianAwalData } from "../../data/pelayanan/pengkajian-awal.data";
import { RawatJalanIgdData } from "../../data/pelayanan/rawat-jalan-igd.data";
import { RegisterPatientData } from "../../data/patient/register-patient.data";
import { RegisterFormDefaults } from "../../fixtures/patient.fixture";
import { PengkajianAwalPage } from "../../pages/pelayanan/PengkajianAwalPage";
import { RegisterPatientPage } from "../../pages/patient/RegisterPatientPage";
import { RawatJalanIgdPage } from "../../pages/pelayanan/RawatJalanIgdPage";
import { PengkajianFormInput } from "../../types/pengkajian.type";
import { CustomWorld } from "../world";
import {
  ensurePatientRegisteredByJenisData,
  isRawatJalanPelayanan,
  resolveKunjunganValue,
  resolveRuanganUiLabel,
  updateRegistrationSnapshot,
} from "./register-patient.flow";

function ensurePengkajianAwalPage(world: CustomWorld): PengkajianAwalPage {
  if (!world.pengkajianAwalPage) {
    world.pengkajianAwalPage = new PengkajianAwalPage(world.page);
  }

  return world.pengkajianAwalPage;
}

function ensureRawatJalanIgdPage(world: CustomWorld): RawatJalanIgdPage {
  if (!world.rawatJalanIgdPage) {
    world.rawatJalanIgdPage = new RawatJalanIgdPage(world.page);
  }

  return world.rawatJalanIgdPage;
}

function ensureRegisterPatientPage(world: CustomWorld): RegisterPatientPage {
  if (!world.registerPatientPage) {
    world.registerPatientPage = new RegisterPatientPage(world.page);
  }

  return world.registerPatientPage;
}

async function runDefaultRegistrationOnPelayanan(world: CustomWorld): Promise<void> {
  if (!world.createdPatientSnapshot) {
    throw new Error("Data pasien belum tersedia. Jalankan step pembuatan pasien terlebih dahulu.");
  }

  const registerPatientPage = ensureRegisterPatientPage(world);
  const pelayanan = RegisterFormDefaults.instalasi;
  const jenisKunjungan = PengkajianAwalData.registerDefaults.jenisKunjungan;
  const ruangan = PengkajianAwalData.registerDefaults.ruangan;
  const jadwal = PengkajianAwalData.registerDefaults.jadwal;

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
}

export async function ensurePatientRegisteredOnPelayanan(
  world: CustomWorld,
  jenisData: string,
  pelayanan: string,
): Promise<void> {
  if (!isRawatJalanPelayanan(pelayanan)) {
    throw new Error(`Pelayanan '${pelayanan}' belum didukung pada automation pengkajian awal.`);
  }

  await ensurePatientRegisteredByJenisData(world, jenisData);

  if (!world.registrationSnapshot?.noAntrean) {
    await runDefaultRegistrationOnPelayanan(world);
    return;
  }

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);
  await rawatJalanIgdPage.verifyPatientExistsOnList(world.registrationSnapshot);
}

async function verifyStatusAfterPengkajianAwalStarted(world: CustomWorld): Promise<void> {
  if (!world.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
    );
  }

  const registerPatientPage = ensureRegisterPatientPage(world);
  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);

  await registerPatientPage.verifyPatientStatusOnPendaftaranList(
    world.registrationSnapshot,
    RegisterPatientData.status.sedangDiperiksa,
  );

  await rawatJalanIgdPage.verifyPatientStatusOnList(
    world.registrationSnapshot,
    RawatJalanIgdData.status.sedangDiperiksaPerawat,
  );
}

async function resumePengkajianAwalForm(world: CustomWorld): Promise<void> {
  if (!world.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
    );
  }

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);
  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  await rawatJalanIgdPage.reopenPatientOnPemeriksaanPage(world.registrationSnapshot);
  await pengkajianAwalPage.verifyOnPemeriksaanPage();
  await pengkajianAwalPage.ensurePengkajianFormReady();
}

export async function runPengkajianAwalByJenisData(
  world: CustomWorld,
  jenisPengkajian: string,
): Promise<void> {
  if (jenisPengkajian !== PengkajianAwalData.jenisPengkajian.lengkap) {
    throw new Error(`jenisPengkajian '${jenisPengkajian}' belum didukung.`);
  }

  if (!world.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
    );
  }

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);
  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  await rawatJalanIgdPage.openFromNavbar();
  await rawatJalanIgdPage.openPatientFromListByDoubleClick(world.registrationSnapshot);
  await pengkajianAwalPage.verifyOnPemeriksaanPage();
  await pengkajianAwalPage.verifyPanelDataPasien(world.registrationSnapshot);
  await pengkajianAwalPage.clickPengkajianAwal();
  await verifyStatusAfterPengkajianAwalStarted(world);
  await resumePengkajianAwalForm(world);

  world.pengkajianFormInput = await pengkajianAwalPage.fillPengkajianFormLengkap();
  world.pengkajianSnapshot = {
    anamnesa: world.pengkajianFormInput.anamnesa,
    keluhanUtama: world.pengkajianFormInput.keluhanUtama,
  };
}

export async function runSavePengkajianAwal(world: CustomWorld): Promise<void> {
  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  await pengkajianAwalPage.clickSave();
}

export async function runSaveAndStartDoctorExam(world: CustomWorld): Promise<void> {
  if (!world.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran pelayanan terlebih dahulu.",
    );
  }

  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  if (!(await pengkajianAwalPage.isOnPemeriksaanPage())) {
    const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);

    await rawatJalanIgdPage.reopenPatientOnPemeriksaanPage(world.registrationSnapshot);
    await pengkajianAwalPage.verifyOnPemeriksaanPage();
  }

  await pengkajianAwalPage.clickSaveAndStartDoctorExam();
}

export async function runPengkajianAwalSavedComposite(
  world: CustomWorld,
  jenisPengkajian: string,
): Promise<void> {
  await runPengkajianAwalByJenisData(world, jenisPengkajian);
  await runSavePengkajianAwal(world);

  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  await pengkajianAwalPage.verifySaveSuccess();
}

export async function runJourneyPengkajianAwal(
  world: CustomWorld,
  jenisPengkajian: string,
): Promise<void> {
  if (!world.registrationSnapshot) {
    throw new Error(
      "Registration snapshot belum tersedia. Jalankan step pendaftaran rawat jalan terlebih dahulu.",
    );
  }

  await runPengkajianAwalByJenisData(world, jenisPengkajian);
  await runSavePengkajianAwal(world);

  const pengkajianAwalPage = ensurePengkajianAwalPage(world);

  await pengkajianAwalPage.verifySaveSuccess();

  const rawatJalanIgdPage = ensureRawatJalanIgdPage(world);

  await rawatJalanIgdPage.verifyPatientStatusOnList(
    world.registrationSnapshot,
    RawatJalanIgdData.status.sudahDiperiksaPerawat,
  );

  if (!world.pengkajianFormInput) {
    throw new Error("Data pengkajian awal belum tersedia setelah pengisian form.");
  }

  if (!(await pengkajianAwalPage.isOnPemeriksaanPage())) {
    await rawatJalanIgdPage.reopenPatientOnPemeriksaanPage(world.registrationSnapshot);
    await pengkajianAwalPage.verifyOnPemeriksaanPage();
  }

  await pengkajianAwalPage.verifyAnamnesaOnRekamMedisKunjungan(world.pengkajianFormInput);
  await pengkajianAwalPage.verifyAnamnesaOnCppt(world.pengkajianFormInput);

  await runSaveAndStartDoctorExam(world);

  await rawatJalanIgdPage.verifyPatientStatusOnList(
    world.registrationSnapshot,
    RawatJalanIgdData.status.sedangDiperiksaDokter,
  );
}

export function getPengkajianFormInput(world: CustomWorld): PengkajianFormInput {
  if (!world.pengkajianFormInput) {
    throw new Error("Data pengkajian awal belum tersedia. Jalankan step pengisian form terlebih dahulu.");
  }

  return world.pengkajianFormInput;
}
