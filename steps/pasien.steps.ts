import { createBdd } from 'playwright-bdd';
import { CreatePasienPage } from '../pages/pasien/createPasien.page';
import { PasienListPage } from '../pages/pasien/pasienList.page';
import { createPasien } from '../data/pasien.data';
import { Pasien } from '../data/interfaces/pasien';
import { LoginPage } from '../pages/login/login.page';

const { Given, When, Then } = createBdd();

let createPasienPage: CreatePasienPage;
let currentData: Pasien;

// GIVEN

Given('user berada di halaman tambah pasien', async ({ page }) => {
  
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
When('user membuat data pasien', async () => {
  currentData = createPasien();

  await createPasienPage.fillForm(currentData);
  await createPasienPage.submit();
});

// THEN
Then('data pasien berhasil dibuat', async ({ page }) => {
  await createPasienPage.verifySuccess();

  // After create, ensure the newly created patient is discoverable on list page by NIK.
  if (!currentData?.nik) throw new Error('Test data NIK is missing');

  const pasienListPage = new PasienListPage(page);
  await pasienListPage.gotoBroadcastNotif();
  await pasienListPage.searchByNik(currentData.nik);
  await pasienListPage.expectPasienVisibleByNik(currentData.nik);
});
