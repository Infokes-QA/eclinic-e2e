import { Given } from "@cucumber/cucumber";

import { ENV } from "../../config/env";
import {
  runJourneyCreatePatient,
  runJourneyLogin,
  runJourneyRegisterRawatJalan,
} from "../../support/flows/patient-journey.flow";
import { CustomWorld } from "../../support/world";

Given(
  "user sukses login ke aplikasi eClinic dengan akun {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, role: string) {
    await runJourneyLogin(this, role);
  },
);

Given(
  "user berhasil membuat data pasien baru dengan jenis data {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (this: CustomWorld, jenisData: string) {
    this.journeyJenisData = jenisData;
    await runJourneyCreatePatient(this, jenisData);
  },
);

Given(
  "user mendaftarkan pasien umum ke instalasi rawat jalan melalui loket untuk kunjungan {string} di {string} dengan jadwal {string}",
  { timeout: ENV.STEP_TIMEOUT_LONG },
  async function (
    this: CustomWorld,
    jenisKunjungan: string,
    ruangan: string,
    jadwal: string,
  ) {
    if (!this.journeyJenisData) {
      throw new Error("Jenis data pasien belum tersedia. Jalankan step pembuatan pasien terlebih dahulu.");
    }

    await runJourneyRegisterRawatJalan(
      this,
      this.journeyJenisData,
      jenisKunjungan,
      ruangan,
      jadwal,
    );
  },
);
