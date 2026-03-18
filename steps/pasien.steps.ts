import { createBdd } from 'playwright-bdd';
import { CreatePasienPage } from '../pages/pasien/createPasien.page';
import { createPasienLaki, createPasienPerempuan } from '../data/pasien.data';
import { Pasien } from '../data/interfaces/pasien';
import { LoginPage } from '../pages/login/login.page';

const { Given, When, Then } = createBdd();

let createPasienPage: CreatePasienPage;
let currentData: Pasien;

// GIVEN

Given('user is on create pasien page', async ({ page }) => {
  
  // login dulu
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.login(
    process.env.EC_USERNAME!,
    process.env.EC_PASSWORD!,
    process.env.EC_FASKES!
  );

  // baru ke halaman pasien
  createPasienPage = new CreatePasienPage(page);

  await createPasienPage.goto();
  await createPasienPage.openCreatePasienForm(); // ini penting
  await createPasienPage.waitForFormReady();     // ini penting
});

// WHEN
When(
  'user creates pasien with data {string}',
  async ({}, type: 'laki' | 'perempuan') => {
    const dataMap = {
      laki: createPasienLaki,
      perempuan: createPasienPerempuan
    };

    currentData = dataMap[type]();

    await createPasienPage.fillForm(currentData);
    await createPasienPage.submit();
  }
);

// THEN
Then('pasien should be successfully created', async () => {
  await createPasienPage.verifySuccess();
});