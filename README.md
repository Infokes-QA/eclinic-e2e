# eclinic-e2e

Project ini berisi automated end-to-end test untuk eClinic menggunakan Cucumber BDD, Playwright, TypeScript, dan Page Object Model.

## Install

Prasyarat:

- Node.js
- npm
- browser Playwright

Jalankan:

```bash
npm install
npx playwright install
```

Di PowerShell, kalau `npm` atau `npx` diblokir oleh execution policy, pakai `npm.cmd` dan `npx.cmd`.

## Environment

Konfigurasi dibaca dari `.env` lewat `src/config/env.ts`.

Environment yang valid:

- `DEV1`
- `DEV2`
- `DEV3`
- `DEV4`
- `UAT`

Pola variabel yang dipakai kode saat ini:

- `ENVIRONMENT`
- `${ENVIRONMENT}_BASE_URL`
- `${ENVIRONMENT}_CLINIC`
- `${ENVIRONMENT}_USERNAME`
- `${ENVIRONMENT}_PASSWORD`
- `HEADLESS`
- `BROWSER`
- `TIMEOUT`

Contoh:

```env
ENVIRONMENT=DEV4
DEV4_BASE_URL=https://example.com
DEV4_CLINIC=Nama Klinik
DEV4_USERNAME=admin@example.com
DEV4_PASSWORD=password
HEADLESS=true
BROWSER=chromium
TIMEOUT=30000
```

Catatan: salin `.env.example` ke `.env`, lalu isi nilai sesuai environment yang dipakai.

## Script NPM

| Command                 | Fungsi                                             |
| ----------------------- | -------------------------------------------------- |
| `npm run e2e`           | Menjalankan automation via `src/runner/runner.ts`. |
| `npm test`              | Alias untuk `npm run e2e`.                         |
| `npm run test:headed`   | Menjalankan automation dengan browser terlihat.    |
| `npm run test:headless` | Menjalankan automation tanpa UI browser.           |
| `npm run lint`          | Menjalankan ESLint.                                |
| `npm run lint:fix`      | Menjalankan ESLint dan auto-fix.                   |
| `npm run type-check`    | Mengecek TypeScript tanpa build.                   |
| `npm run format`        | Format seluruh file dengan Prettier.               |
| `npm run format:check`  | Cek format tanpa mengubah file.                    |
| `npm run check`         | Menjalankan lint dan type-check.                   |
| `npm run auth:setup`    | Menyiapkan auth state untuk scenario `@authenticated`. |
| `npm run report:open`   | Membuka laporan Cucumber HTML di browser.          |

## Cara Menjalankan Test

Entry point test ada di `src/runner/runner.ts`.

Argumen yang tersedia:

- `--feature` untuk menjalankan satu feature file relatif ke folder `features/`
- `--module` untuk menjalankan semua feature dalam satu folder module di `features/`
- `--tags` untuk menjalankan scenario berdasarkan tag
- `--headed` untuk menampilkan browser

Contoh:

```bash
npm run e2e
npm run e2e -- --headed
npm run test:headed
npm run test:headed -- --feature=authentication/login.feature
npm run e2e -- --feature=authentication/login.feature
npm run e2e -- --module=authentication
npm run e2e -- --tags="@smoke"
npm run e2e -- --module=authentication --tags="@smoke"
```

## Alur Aplikasi Saat Ini

Automation login dimulai dari Landing Page.

1. Buka Landing Page menggunakan `ENV.BASE_URL`.
2. Hover menu landing.
3. Pilih submenu.
4. Pastikan halaman Login tampil.
5. Login menggunakan fixture user atau data invalid.
6. Verifikasi dashboard sukses atau pesan error login.

Feature yang tersedia:

- `features/authentication/login.feature`
- `features/authentication/authenticated-session.feature`
- `features/patient/create-patient.feature`
- `features/patient/register-patient.feature`
- `features/patient/search-patient.feature`
- `features/patient/patient-journey.feature`

Scenario login saat ini:

- Login berhasil menggunakan akun Admin (`@smoke @login @positive`)
- Login gagal menggunakan data invalid (`@login @negative`)

Scenario authenticated session:

- User dapat mengakses aplikasi dengan session tersimpan (`@authenticated @smoke`)

## Alur Patient Saat Ini

### Create Pasien

1. Login dengan session `@authenticated`.
2. Buka menu `pendaftaran` → submenu `createPasien`.
3. Isi form Create Pasien (ringkas/lengkap).
4. Simpan pasien, verifikasi toast `Data berhasil disimpan`, redirect, dan panel kiri.

### Register Pasien

1. Buat pasien baru di halaman pendaftaran create.
2. Isi form Data Pelayanan kunjungan sakit.
3. Klik Lanjutkan dan verifikasi pendaftaran berhasil.

### Search dan Filter Pasien

1. Buka menu `pendaftaran` → submenu `pasien`.
2. Verifikasi halaman `/pasien`.
3. Search by kata kunci atau filter tipe record, verifikasi, general consent.
4. Assert tabel pasien menampilkan hasil per kolom (No. eRM, Nama, NIK).

### Patient Journey Happy Flow

1. Buat pasien lengkap via flow reusable `create-patient-lengkap.flow.ts`.
2. Search pasien yang baru dibuat berdasarkan `nama` dan `nik`.
3. Assert baris hasil pencarian cocok dengan data snapshot.
4. Double-click baris hasil untuk membuka halaman detail `/pasien/show/{noRm}`.
5. Assert halaman `Lihat Data Pasien` menampilkan No. eRM, Nama, dan NIK.

Contoh menjalankan module patient:

```bash
npm run e2e -- --module=patient
npm run e2e -- --feature=patient/search-patient.feature
npm run e2e -- --feature=patient/patient-journey.feature
npm run e2e -- --tags="@search-patient"
npm run e2e -- --tags="@journey"
npm run e2e -- --tags="@full-case"
```

## Route dan URL

`src/config/routes.ts` menyimpan key route, misalnya `login`.

`src/config/url.ts` memakai `UrlHelper.get(route)` untuk menggabungkan `ENV.BASE_URL` dengan path route dari `ROUTES`.

Contoh:

```ts
UrlHelper.get("login");
```

## Struktur Folder dan File

```text
eclinic-e2e/
|-- features/
|   |-- authentication/
|   |   |-- login.feature
|   |   `-- authenticated-session.feature
|   `-- patient/
|       |-- create-patient.feature
|       |-- register-patient.feature
|       |-- search-patient.feature
|       `-- patient-journey.feature
|-- src/
|   |-- config/
|   |   |-- env.ts
|   |   |-- routes.ts
|   |   `-- url.ts
|   |-- data/
|   |   |-- authentication/
|   |   |   `-- login.data.ts
|   |   |-- landing/
|   |   |   `-- landing.data.ts
|   |   `-- patient/
|   |       |-- create-patient.data.ts
|   |       |-- register-patient.data.ts
|   |       |-- search-patient.data.ts
|   |       `-- patient-show-detail.data.ts
|   |-- fixtures/
|   |   |-- patient.fixture.ts
|   |   `-- users.fixture.ts
|   |-- helpers/
|   |   |-- auth.helper.ts
|   |   |-- browser.helper.ts
|   |   |-- logger.helper.ts
|   |   |-- patient-display.helper.ts
|   |   |-- random.helper.ts
|   |   `-- screenshot.helper.ts
|   |-- locators/
|   |   |-- authentication/
|   |   |   `-- login.locator.ts
|   |   |-- landing/
|   |   |   `-- landing.locator.ts
|   |   |-- patient/
|   |   |   |-- create-patient.locator.ts
|   |   |   |-- register-patient.locator.ts
|   |   |   |-- search-patient.locator.ts
|   |   |   `-- patient-show-detail.locator.ts
|   |   `-- shared/
|   |       |-- navbar.locator.ts
|   |       |-- notify.locator.ts
|   |       `-- sweet-alert.locator.ts
|   |-- pages/
|   |   |-- authentication/
|   |   |   `-- LoginPage.ts
|   |   |-- base/
|   |   |   `-- BasePage.ts
|   |   |-- components/
|   |   |   |-- NavbarComponent.ts
|   |   |   |-- NotifyComponent.ts
|   |   |   `-- SweetAlertComponent.ts
|   |   |-- landing/
|   |   |   `-- LandingPage.ts
|   |   `-- patient/
|   |       |-- CreatePatientPage.ts
|   |       |-- RegisterPatientPage.ts
|   |       |-- SearchPatientPage.ts
|   |       `-- PatientShowDetailPage.ts
|   |-- runner/
|   |   `-- runner.ts
|   |-- scripts/
|   |   |-- auth.setup.ts
|   |   `-- generate-report.ts
|   |-- steps/
|   |   |-- authentication/
|   |   |   |-- auth.steps.ts
|   |   |   `-- login.steps.ts
|   |   |-- patient/
|   |   |   |-- create-patient.steps.ts
|   |   |   |-- register-patient.steps.ts
|   |   |   |-- search-patient.steps.ts
|   |   |   `-- patient-show-detail.steps.ts
|   |   |-- shared/
|   |   |   `-- page.steps.ts
|   |   `-- landing.steps.ts
|   |-- support/
|   |   |-- flows/
|   |   |   `-- create-patient-lengkap.flow.ts
|   |   |-- hooks.ts
|   |   `-- world.ts
|   `-- types/
|       |-- patient-search.type.ts
|       |-- patient.type.ts
|       `-- user.type.ts
|-- .env.example
|-- CONTRIBUTING.md
|-- README.md
|-- cucumber.js
|-- eslint.config.js
|-- package.json
|-- playwright.config.ts
`-- tsconfig.json
```

## Penjelasan Folder

- `features/` -> skenario BDD dalam format Gherkin
- `src/config/` -> konfigurasi environment, route, dan URL
- `src/data/` -> expected value seperti message, title, URL, dan label
- `src/fixtures/` -> input test data
- `src/helpers/` -> helper reusable
- `src/locators/` -> selector saja, tanpa logic
- `src/locators/shared/` -> selector komponen UI yang dipakai lintas halaman
- `src/pages/` -> Page Object berisi action, assertion, dan reusable method
- `src/pages/components/` -> komponen UI reusable yang dipakai oleh Page Object
- `src/runner/` -> entry point command line
- `src/scripts/` -> utility script seperti auth setup dan generate report
- `src/steps/` -> step definition yang hanya memanggil Page methods
- `src/support/` -> Cucumber world, hooks, browser lifecycle, screenshot, trace, dan flows
- `src/support/flows/` -> orchestration reusable untuk journey atau setup komposit
- `src/types/` -> type dan interface TypeScript

## File Utama

- `features/authentication/login.feature` -> scenario login
- `features/authentication/authenticated-session.feature` -> scenario session tersimpan
- `features/patient/create-patient.feature` -> scenario create pasien
- `features/patient/register-patient.feature` -> scenario registrasi pasien
- `features/patient/search-patient.feature` -> scenario search dan filter pasien
- `features/patient/patient-journey.feature` -> happy flow create, search, dan detail pasien
- `src/pages/authentication/LoginPage.ts` -> Page Object halaman login
- `src/pages/landing/LandingPage.ts` -> Page Object halaman landing
- `src/pages/patient/CreatePatientPage.ts` -> Page Object create pasien
- `src/pages/patient/RegisterPatientPage.ts` -> Page Object registrasi pasien
- `src/pages/patient/SearchPatientPage.ts` -> Page Object search/filter pasien
- `src/pages/patient/PatientShowDetailPage.ts` -> Page Object detail pasien `/pasien/show/{id}`
- `src/pages/components/NavbarComponent.ts` -> navigasi menu aplikasi
- `src/pages/components/NotifyComponent.ts` -> handler toast notify
- `src/pages/components/SweetAlertComponent.ts` -> handler dialog SweetAlert
- `src/locators/patient/search-patient.locator.ts` -> selector halaman pasien/datatable
- `src/locators/patient/patient-show-detail.locator.ts` -> selector halaman detail pasien
- `src/support/flows/create-patient-lengkap.flow.ts` -> flow reusable create pasien lengkap
- `src/helpers/patient-display.helper.ts` -> formatter No. eRM untuk assert tabel/detail
- `src/helpers/auth.helper.ts` -> helper auth state dan session
- `src/fixtures/patient.fixture.ts` -> navigasi dan sample data patient
- `src/fixtures/users.fixture.ts` -> input credential dari environment

## Naming Convention

- Folder menggunakan `kebab-case` lowercase.
- Page Object menggunakan `PascalCase`, contoh `LoginPage.ts`.
- Component menggunakan `PascalCase`, contoh `SweetAlertComponent.ts`.
- Locator menggunakan `kebab-case`, contoh `login.locator.ts`.
- Data menggunakan `kebab-case`, contoh `login.data.ts`.
- Fixture menggunakan `kebab-case`, contoh `users.fixture.ts`.
- Helper menggunakan `kebab-case`, contoh `browser.helper.ts`.
- Type menggunakan `kebab-case`, contoh `user.type.ts`.
- Step definition menggunakan `kebab-case`, contoh `login.steps.ts`.
- Flow file menggunakan `kebab-case`, contoh `create-patient-lengkap.flow.ts`.
- Class, interface, type alias, dan enum menggunakan `PascalCase`.
- Variable dan function menggunakan `camelCase`.
- Primitive constants menggunakan `UPPER_SNAKE_CASE`.
- Object constants menggunakan `PascalCase`, contoh `LoginData`, `LandingPageLocator`, dan `SweetAlertLocator`.

## Aturan Layer

- Feature berisi behavior, bukan detail teknis.
- Step definition hanya memanggil Page methods.
- Page Object berisi action dan assertion reusable.
- Locator file hanya berisi selector.
- Data file berisi expected value, bukan selector.
- Fixture file berisi input test data, bukan assertion value.
- Flow file berisi orchestration reusable, bukan selector atau assertion mentah.
- Component file berisi aksi dan assertion untuk komponen UI reusable, bukan halaman penuh.

## Browser dan Viewport

Konfigurasi browser ada di `src/helpers/browser.helper.ts`.

- Viewport default: `1920 x 1080`
- `deviceScaleFactor: 1` untuk konsistensi tampilan di mode headed
- Chromium memakai argumen `--force-device-scale-factor=1` agar tidak terpengaruh scaling Windows
- Mode headed memakai `slowMo: 300` untuk memudahkan observasi manual

## Alur Test

1. `runner.ts` membaca argumen command seperti `--feature`, `--module`, `--tags`, dan `--headed`.
2. Cucumber memuat feature dari folder `features/`.
3. `Before` hook di `src/support/hooks.ts` membuka browser, context, dan page baru.
4. Step membuat Page Object yang dibutuhkan.
5. Step memanggil method di Page Object atau flow reusable di `src/support/flows/`.
6. Page Object memakai locator dan data sesuai kebutuhan.
7. Assertion dijalankan melalui Page Object.
8. `AfterStep` hook menyimpan screenshot setiap step `Then` ke `screenshots/` dan melampirkannya ke laporan Cucumber.
9. `After` hook menutup browser, menyimpan screenshot ringkasan scenario, dan menyimpan trace hanya saat scenario gagal.

## Catatan Pengembangan

- Tambahkan feature baru di `features/<module>/`.
- Tambahkan step definition baru di `src/steps/<module>/` atau `src/steps/<feature>.steps.ts` sesuai kebutuhan module.
- Simpan selector baru di `src/locators/<module>/` atau `src/locators/shared/` untuk komponen lintas halaman.
- Simpan expected value di `src/data/<module>/`.
- Simpan input test data di `src/fixtures/`.
- Simpan action dan assertion halaman di `src/pages/<module>/`.
- Simpan komponen UI reusable di `src/pages/components/`.
- Simpan orchestration journey reusable di `src/support/flows/`.
- Jalankan `npm run check` sebelum commit.

Panduan kontribusi detail ada di [CONTRIBUTING.md](./CONTRIBUTING.md).
