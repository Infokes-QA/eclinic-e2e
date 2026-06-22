import { createBdd } from 'playwright-bdd';
import { expect } from '@playwright/test';

const { Given, When, Then } = createBdd();

// Given('pasien sudah terdaftar', async () => {
//   // TODO: create pasien via API atau database
// });


let noRm: string;

Given('pasien sudah terdaftar', async ({ page }) => {
  const response = await page.request.post(
    'https://dev4.eclinic.id/pasien/store',
    {
      data: {
        MPasien: {
          nama: `AUTO-${Date.now()}`,
          nik: `${Date.now()}`,
          jenis_kelamin: 'L',
          no_hp: '08123456789',
          warganegara: 'INDONESIA',
          penjamins: [
            {
              value: {
                asuransi_id: '',
                no_asuransi: '',
              },
            },
          ],
        },
        cekBpjs: 'default',
      },
    }
  );
  
  const body = await response.json();
  
  noRm = body.data.no_rm;
});

Given('user sudah berada di halaman pendaftaran', async ({ page }) => {
  await page.goto('/pendaftaran');
});

When('user melakukan pendaftaran pasien', async ({ page }) => {
  await page.click('[data-testid="btn-tambah-pendaftaran"]');

  await page.fill(
    '[data-testid="nomor-rm"]',
    noRm
  );

  await page.click('[data-testid="btn-simpan"]');
});

Then('pendaftaran pasien berhasil dibuat', async ({ page }) => {
  await expect(page.getByText('Pendaftaran berhasil')).toBeVisible();
});
