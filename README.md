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

## Quick Start untuk QA

### Setup pertama kali

1. Salin `.env.example` ke `.env`, lalu isi `ENVIRONMENT`, `BASE_URL`, kredensial, dan nama klinik.
2. Jalankan `npm install` dan `npx playwright install`.
3. Siapkan session login: `npm run auth:setup` (wajib sebelum scenario `@authenticated`).

### Kapan pakai tag auth

| Tag | Kapan dipakai | Persiapan |
| --- | --- | --- |
| `@authenticated` | Modul pasien, pendaftaran, pelayanan — sudah login via session tersimpan | `npm run auth:setup` |
| `@login` | Uji alur login dari Gherkin (landing/direct) | Tidak perlu `auth:setup` |
| `@login-via-landing` | Login mulai dari Landing Page | Tidak perlu `auth:setup` |
| `@login-direct` | Login langsung ke halaman Login | Tidak perlu `auth:setup` |
| `@patient-journey-e2e` | Journey end-to-end (create → register → search) | `auth:setup` + scenario `@login` di awal journey |

### Command cheat sheet

```bash
npm run check
npm run auth:setup
npm run test:headless -- --tags="@smoke"
npm run test:headless -- --module=patient
npm run test:headless -- --feature=patient/create-patient.feature
npm run test:headless -- --tags="@create-patient"
npm run test:headless -- --tags="@patient-journey-e2e"
```

Di PowerShell, ganti `npm run` dengan `npm.cmd run` jika execution policy memblokir `npm.ps1`.

### Troubleshooting singkat

| Masalah | Solusi |
| --- | --- |
| Scenario `@authenticated` gagal / redirect ke login | Jalankan ulang `npm run auth:setup` |
| Session kedaluwarsa | Jalankan ulang `npm run auth:setup` (cek `AUTH_STATE_MAX_AGE_HOURS` di `.env`) |
| `npm` diblokir di PowerShell | Pakai `npm.cmd` / `npx.cmd` |
| Type/lint error sebelum test | Jalankan `npm run check` |

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
- `STEP_TIMEOUT_FORM`
- `STEP_TIMEOUT_LONG`
- `OPTIONAL_DIALOG_TIMEOUT`
- `AUTH_STATE_MAX_AGE_HOURS`
- `AUTH_HOME_QUERY`
- `TERMINAL_PROGRESS`
- `TERMINAL_REPORTER`

Contoh:

```env
ENVIRONMENT=DEV4
DEV4_BASE_URL=https://example.com
DEV4_CLINIC=Nama Klinik
DEV4_USERNAME=admin@example.com
DEV4_PASSWORD=password
HEADLESS=true
BROWSER=chromium
TIMEOUT=15000
```

Catatan: salin `.env.example` ke `.env`, lalu isi nilai sesuai environment yang dipakai. Jangan commit file `.env`.

## Script NPM

| Command                 | Fungsi                                                       |
| ----------------------- | ------------------------------------------------------------ |
| `npm run e2e`           | Menjalankan automation via `src/runner/runner.ts` (headed).  |
| `npm test`              | Alias untuk `npm run e2e`.                                   |
| `npm run test:headed`   | Menjalankan automation dengan browser terlihat.               |
| `npm run test:headless` | Menjalankan automation tanpa UI browser.                     |
| `npm run lint`          | Menjalankan ESLint.                                          |
| `npm run lint:fix`      | Menjalankan ESLint dan auto-fix.                             |
| `npm run type-check`    | Mengecek TypeScript tanpa build.                             |
| `npm run format`        | Format seluruh file dengan Prettier.                         |
| `npm run format:check`  | Cek format tanpa mengubah file.                              |
| `npm run check`         | Menjalankan lint dan type-check.                             |
| `npm run auth:setup`    | Menyiapkan auth state untuk scenario `@authenticated`.       |
| `npm run report:generate` | Generate laporan Cucumber HTML.                            |
| `npm run report:open`   | Membuka laporan Cucumber HTML di browser.                    |

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
npm run test:headless
npm run test:headless -- --feature=authentication/login.feature
npm run e2e -- --module=patient
npm run e2e -- --tags="@smoke"
npm run e2e -- --tags="@patient-journey-e2e"
```

## Alur Aplikasi Saat Ini

### Authentication

**Login via Landing Page** (`@login-via-landing`):

1. Buka Landing Page menggunakan `ENV.BASE_URL`.
2. Hover menu landing.
3. Pilih submenu.
4. Pastikan halaman Login tampil.
5. Login menggunakan fixture user.
6. Verifikasi dashboard sukses dan nama user di navbar.

**Login direct** (`@login-direct`):

1. Buka halaman Login langsung.
2. Login menggunakan akun fixture.
3. Verifikasi dashboard sukses dan nama user di navbar.

**Authenticated session** (`@authenticated`):

- Preload session dari `.auth/` via `npm run auth:setup`.
- Hook `Before` memuat storage state; scenario tidak perlu login ulang.

### Feature yang Tersedia

| Feature file | Tag utama | Keterangan |
| --- | --- | --- |
| `features/authentication/login.feature` | `@login` | Login sukses (landing + direct) dan login gagal |
| `features/authentication/authenticated-session.feature` | `@authenticated` | Akses home dengan session tersimpan |
| `features/patient/create-patient.feature` | `@create-patient` | Create pasien ringkas/lengkap + `@create-pasien-lengkap` |
| `features/patient/register-patient.feature` | `@register-patient` | Registrasi pasien existing/baru + `@register-lengkap` |
| `features/patient/search-patient.feature` | `@search-patient` | Search dan filter daftar pasien |
| `features/patient/patient-journey.feature` | `@patient-journey-e2e` | Journey end-to-end ringkas (3 step bisnis) |

## Alur Patient Saat Ini

### Create Pasien (`@create-patient`)

1. Login dengan session `@authenticated`.
2. Buka menu `pendaftaran` → submenu `createPasien`.
3. Isi form Create Pasien (ringkas/lengkap).
4. Simpan pasien, verifikasi toast, No RM, dan panel kiri.

Scenario `@create-pasien-lengkap`:

- Create pasien data `lengkap` (checkbox Diverifikasi dicentang).
- Assert daftar pasien `/pasien` (nama, NIK, No eRM).

```bash
npm run e2e -- --tags="@create-pasien-lengkap"
```

### Register Pasien (`@register-patient`)

**Flow lama** (existing patient / kunjungan sakit + Lanjutkan):

- Buka pendaftaran create, pilih pasien, isi form kunjungan sakit, klik Lanjutkan.

**Flow lengkap** (`@register-lengkap`):

- Form pendaftaran granular (kunjungan, pelayanan, ruangan, jadwal).
- Simpan via `Simpan & Daftarkan Lainnya`.
- Assert daftar pendaftaran `/pendaftaran/v2`.
- Assert daftar pelayanan Rawat Jalan & IGD `/pemeriksaanmedis`.

```bash
npm run e2e -- --tags="@register-lengkap"
npm run e2e -- --tags="@register-lengkap-form"
npm run e2e -- --tags="@register-lengkap-list"
npm run e2e -- --tags="@register-lengkap-pelayanan"
```

### Search dan Filter Pasien (`@search-patient`)

1. Buka menu `pendaftaran` → submenu `pasien`.
2. Verifikasi halaman `/pasien`.
3. Search by kata kunci atau filter tipe record, verifikasi, general consent.
4. Assert tabel pasien menampilkan hasil per kolom (No. eRM, Nama, NIK).

```bash
npm run e2e -- --tags="@search-patient"
```

### Patient Journey End-to-End (`@patient-journey-e2e`)

Satu scenario ringkas di `patient-journey.feature` (3 step bisnis):

1. Login ke eClinic (`@login`, tanpa `@authenticated`)
2. Buat pasien baru — data lengkap, validasi daftar pasien (nama + NIK), dan halaman detail `/pasien/show/{id}`
3. Daftar ke rawat jalan melalui loket — daftar pendaftaran + Rawat Jalan & IGD

```bash
npm run e2e -- --tags="@patient-journey-e2e"
npm run e2e -- --tags="@journey"
```

Modul terpisah (`@create-patient`, `@register-lengkap`) tetap butuh `npm run auth:setup`.

### Contoh Menjalankan Module Patient

```bash
npm run e2e -- --module=patient
npm run e2e -- --feature=patient/patient-journey.feature
npm run e2e -- --feature=patient/create-patient.feature
npm run e2e -- --feature=patient/register-patient.feature
npm run e2e -- --feature=patient/search-patient.feature
npm run e2e -- --tags="@login-direct"
npm run e2e -- --tags="@create-pasien-lengkap"
npm run e2e -- --tags="@register-lengkap"
```

## Route dan URL

`src/config/routes.ts` menyimpan key route, misalnya `login` dan `home`.

`src/config/url.ts` memakai `UrlHelper` untuk menggabungkan `ENV.BASE_URL` dengan path route dari `ROUTES`.

Contoh:

```ts
UrlHelper.get("login");
UrlHelper.getAuthenticatedHomeUrl();
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
|   |   |-- patient/
|   |   |   |-- create-patient.data.ts
|   |   |   |-- register-patient.data.ts
|   |   |   |-- search-patient.data.ts
|   |   |   `-- patient-show-detail.data.ts
|   |   `-- pelayanan/
|   |       `-- rawat-jalan-igd.data.ts
|   |-- fixtures/
|   |   |-- patient.fixture.ts
|   |   `-- users.fixture.ts
|   |-- helpers/
|   |   |-- auth.helper.ts
|   |   |-- browser.helper.ts
|   |   |-- logger.helper.ts
|   |   |-- patient-display.helper.ts
|   |   |-- patient-panel.helper.ts
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
|   |   |-- pelayanan/
|   |   |   `-- rawat-jalan-igd.locator.ts
|   |   `-- shared/
|   |       |-- navbar.locator.ts
|   |       |-- notify.locator.ts
|   |       |-- patient-common.locator.ts
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
|   |   |-- patient/
|   |   |   |-- create-patient/
|   |   |   |   |-- CreatePatientPage.ts
|   |   |   |   |-- CreatePatientModalSection.ts
|   |   |   |   |-- CreatePatientAddressSection.ts
|   |   |   |   `-- CreatePatientPanelSection.ts
|   |   |   |-- RegisterPatientPage.ts
|   |   |   |-- SearchPatientPage.ts
|   |   |   `-- PatientShowDetailPage.ts
|   |   `-- pelayanan/
|   |       `-- RawatJalanIgdPage.ts
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
|   |   |   |-- patient-journey.steps.ts
|   |   |   |-- patient-show-detail.steps.ts
|   |   |   |-- register-patient.steps.ts
|   |   |   `-- search-patient.steps.ts
|   |   |-- shared/
|   |   |   `-- page.steps.ts
|   |   `-- landing/
|   |       `-- landing.steps.ts
|   |-- support/
|   |   |-- flows/
|   |   |   |-- create-patient.flow.ts
|   |   |   |-- create-patient-lengkap.flow.ts
|   |   |   |-- patient-journey.flow.ts
|   |   |   `-- register-patient.flow.ts
|   |   |-- formatters/
|   |   |   `-- silent.formatter.js
|   |   |-- hooks.ts
|   |   `-- world.ts
|   `-- types/
|       |-- patient-search.type.ts
|       |-- patient.type.ts
|       `-- user.type.ts
|-- .env.example
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- CONTRIBUTING.md
|-- README.md
|-- cucumber.js
|-- eslint.config.js
|-- package.json
|-- package-lock.json
|-- playwright.config.ts
`-- tsconfig.json
```

Folder runtime (tidak di-commit): `.auth/`, `reports/`, `screenshots/`, `test-results/`, `node_modules/`.

## Penjelasan Folder

- `features/` — skenario BDD dalam format Gherkin
- `src/config/` — konfigurasi environment, route, dan URL
- `src/data/` — expected value (message, URL, label, index kolom); teks placeholder/label link untuk resolve locator (`CreatePatientData.placeholder`, `CreatePatientData.linkLabel`)
- `src/fixtures/` — input test data dan navigasi menu
- `src/helpers/` — utility reusable (auth, browser, screenshot, random, patient-panel, patient-display)
- `src/locators/` — selector saja, tanpa logic
- `src/locators/shared/` — selector komponen UI lintas halaman (navbar, notify, sweet-alert, patient-common)
- `src/pages/` — Page Object berisi action, assertion, dan method reusable
- `src/pages/components/` — komponen UI reusable (Navbar, Notify, SweetAlert)
- `src/pages/pelayanan/` — Page Object modul pelayanan (Rawat Jalan & IGD)
- `src/runner/` — entry point command line
- `src/scripts/` — utility script (auth setup, generate report)
- `src/steps/` — step definition yang memanggil Page Object atau flow
- `src/support/` — Cucumber world, hooks, browser lifecycle, screenshot, trace
- `src/support/flows/` — orchestration reusable untuk journey atau setup komposit
- `src/support/formatters/` — formatter output terminal Cucumber
- `src/types/` — type dan interface TypeScript

## File Utama

### Feature

- `features/authentication/login.feature` — login sukses (landing + direct) dan login gagal
- `features/authentication/authenticated-session.feature` — session tersimpan `@authenticated`
- `features/patient/create-patient.feature` — create pasien ringkas/lengkap + `@create-pasien-lengkap`
- `features/patient/register-patient.feature` — registrasi pasien + `@register-lengkap`
- `features/patient/search-patient.feature` — search dan filter pasien
- `features/patient/patient-journey.feature` — journey end-to-end ringkas `@patient-journey-e2e`

### Page Object

- `src/pages/authentication/LoginPage.ts` — halaman login (error notify via `NotifyComponent`)
- `src/pages/landing/LandingPage.ts` — halaman landing (`LandingLocator`)
- `src/pages/patient/create-patient/CreatePatientPage.ts` — facade create pasien
- `src/pages/patient/create-patient/CreatePatientModalSection.ts` — modal, form, simpan
- `src/pages/patient/create-patient/CreatePatientAddressSection.ts` — alamat lengkap, autocomplete
- `src/pages/patient/create-patient/CreatePatientPanelSection.ts` — panel kiri assert & snapshot
- `src/pages/patient/RegisterPatientPage.ts` — form registrasi kunjungan dan daftar pendaftaran
- `src/pages/patient/SearchPatientPage.ts` — search/filter dan tabel pasien
- `src/pages/patient/PatientShowDetailPage.ts` — detail pasien `/pasien/show/{id}`
- `src/pages/pelayanan/RawatJalanIgdPage.ts` — daftar pelayanan Rawat Jalan & IGD
- `src/pages/components/NavbarComponent.ts` — navigasi menu aplikasi
- `src/pages/components/NotifyComponent.ts` — handler toast notify
- `src/pages/components/SweetAlertComponent.ts` — handler dialog SweetAlert

### Locator

- `src/locators/authentication/login.locator.ts` — form login (`LoginLocator`)
- `src/locators/landing/landing.locator.ts` — menu landing (`LandingLocator`)
- `src/locators/patient/create-patient.locator.ts` — form create pasien (compose `PatientCommonLocator`)
- `src/locators/patient/register-patient.locator.ts` — form registrasi & daftar pendaftaran
- `src/locators/patient/search-patient.locator.ts` — filter & tabel pasien
- `src/locators/patient/patient-show-detail.locator.ts` — halaman detail pasien
- `src/locators/pelayanan/rawat-jalan-igd.locator.ts` — daftar pelayanan medis
- `src/locators/shared/navbar.locator.ts` — menu navbar aplikasi
- `src/locators/shared/notify.locator.ts` — toast notify (`NotifyLocator`)
- `src/locators/shared/patient-common.locator.ts` — panel kiri, datatable, tombol tambah, template form group
- `src/locators/shared/sweet-alert.locator.ts` — dialog SweetAlert

### Flow

- `src/support/flows/create-patient.flow.ts` — create pasien by `jenisData`
- `src/support/flows/create-patient-lengkap.flow.ts` — setup pasien lengkap untuk scenario `@authenticated`
- `src/support/flows/register-patient.flow.ts` — helper registrasi dan `registrationSnapshot`
- `src/support/flows/patient-journey.flow.ts` — orchestration 3 fase journey end-to-end

### Step Definition

- `src/steps/authentication/login.steps.ts` — step login
- `src/steps/authentication/auth.steps.ts` — step session `@authenticated`
- `src/steps/landing/landing.steps.ts` — step landing page
- `src/steps/patient/create-patient.steps.ts` — step create pasien
- `src/steps/patient/register-patient.steps.ts` — step registrasi pasien
- `src/steps/patient/search-patient.steps.ts` — step search pasien
- `src/steps/patient/patient-show-detail.steps.ts` — step detail pasien
- `src/steps/patient/patient-journey.steps.ts` — step journey ringkas (3 step bisnis)
- `src/steps/shared/page.steps.ts` — step halaman generik

### Lainnya

- `src/helpers/auth.helper.ts` — auth state dan session
- `src/helpers/patient-display.helper.ts` — formatter No. eRM
- `src/helpers/patient-panel.helper.ts` — akses baris/kolom panel kiri pasien
- `src/fixtures/users.fixture.ts` — credential dari environment
- `src/fixtures/patient.fixture.ts` — navigasi menu, `PatientFormDefaults`, `RegisterFormDefaults`
- `src/types/patient.type.ts` — `PatientFormInput`, `CreatedPatientSnapshot`, `RegistrationSnapshot`
- `cucumber.js` — konfigurasi Cucumber (require paths, timeout, format)

## Naming Convention

### Folder

| Jenis | Format | Contoh benar | Contoh salah |
| --- | --- | --- | --- |
| Module folder | `kebab-case` lowercase | `authentication`, `patient`, `pelayanan` | `Authentication`, `masterData` |
| Shared folder | `kebab-case` lowercase | `shared`, `components`, `flows` | `Shared`, `Components` |

### File

| Jenis file | Format nama file | Suffix | Contoh benar |
| --- | --- | --- | --- |
| Feature | lowercase | `.feature` | `login.feature`, `patient-journey.feature` |
| Page Object | `PascalCase` | `.ts` | `LoginPage.ts`, `RawatJalanIgdPage.ts` |
| Component | `PascalCase` | `.ts` | `NavbarComponent.ts` |
| Locator | `kebab-case` | `.locator.ts` | `login.locator.ts` |
| Data | `kebab-case` | `.data.ts` | `login.data.ts` |
| Fixture | `kebab-case` | `.fixture.ts` | `users.fixture.ts` |
| Helper | `kebab-case` | `.helper.ts` | `browser.helper.ts` |
| Type | `kebab-case` | `.type.ts` | `user.type.ts` |
| Step definition | `kebab-case` | `.steps.ts` | `login.steps.ts` |
| Flow | `kebab-case` | `.flow.ts` | `patient-journey.flow.ts` |
| Script | `kebab-case` | `.ts` | `auth.setup.ts` |
| Config | `kebab-case` | `.ts` | `env.ts`, `routes.ts` |
| Support | `kebab-case` | `.ts` | `hooks.ts`, `world.ts` |
| Formatter (exception) | `kebab-case` | `.formatter.js` | `silent.formatter.js` |

### Class, Type, dan Identifier

| Jenis | Format | Contoh benar |
| --- | --- | --- |
| Class | `PascalCase` | `LoginPage`, `RegisterPatientPage` |
| Interface | `PascalCase` (tanpa prefix `I`) | `UserCredential` |
| Type alias / Enum | `PascalCase` | `UserRole`, `CreatePatientJenisData` |
| Method | `camelCase` | `openLoginPage()`, `verifyLoginSuccess()` |
| Variable / parameter | `camelCase` | `loginPage`, `createdPatientSnapshot` |
| Primitive constant | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT` |
| Object constant (export) | `PascalCase` | `LoginData`, `LoginLocator`, `LandingLocator`, `PatientCommonLocator` |
| Gherkin tag | `@kebab-case` atau `@camelCase` | `@login-direct`, `@patient-journey-e2e` |

### Penempatan File per Layer

| Layer | Path pattern | Aturan export |
| --- | --- | --- |
| Feature | `features/<module>/<name>.feature` | — |
| Step | `src/steps/<module>/<name>.steps.ts` atau `src/steps/<name>.steps.ts` | — |
| Page | `src/pages/<module>/<Name>Page.ts` | 1 class Page per file |
| Component | `src/pages/components/<Name>Component.ts` | 1 class Component per file |
| Locator | `src/locators/<module>/<name>.locator.ts` | 1 object constant `PascalCase` per file |
| Data | `src/data/<module>/<name>.data.ts` | 1 object constant `PascalCase` per file |
| Fixture | `src/fixtures/<name>.fixture.ts` | Input test data; export `PatientFormDefaults` / `RegisterFormDefaults` di `patient.fixture.ts` |
| Flow | `src/support/flows/<name>.flow.ts` | Named export functions |
| Type | `src/types/<name>.type.ts` | Interface/type per domain |

Jangan gunakan prefix `I` untuk interface.

## Rules Pengambilan Selector

### Prioritas Strategi Locator

| Prioritas | Strategi | Kapan dipakai |
| --- | --- | --- |
| 1 | `getByRole(role, { name })` | Button, link, radio, checkbox punya accessible name |
| 2 | `getByLabel(text)` | Input punya `<label>` terhubung |
| 3 | `getByPlaceholder(text)` | Input punya placeholder unik |
| 4 | `getByTestId(id)` | Elemen punya `data-testid` |
| 5 | CSS `#id` singkat | Legacy eClinic: elemen punya `id` stabil |
| 6 | CSS attribute selector | `data-*` atau `name` stabil |
| 7 | CSS `:has-text()` / `text-is()` | Form legacy berbasis label teks |
| 8 | Child structural selector | Setelah parent sudah di-scope (`td`, `tr` dalam tabel) |

**Tidak boleh:** XPath, CSS panjang berantai tanpa scope, selector posisi absolut, selector di feature/step/data/fixture.

### Penyimpanan Selector

| Lokasi | Boleh? | Keterangan |
| --- | --- | --- |
| `src/locators/<module>/*.locator.ts` | Ya (wajib) | Selector utama per module |
| `src/locators/shared/*.locator.ts` | Ya | Navbar, notify, sweet-alert, patient-common |
| `src/pages/*.ts` | Tidak* | Page Object impor dari locator; child scope dari parent boleh |
| `src/data/*.ts` | Tidak* | Expected value; teks placeholder/label untuk resolve locator boleh di data |
| `src/fixtures/*.ts` | Tidak | Hanya input test data |
| `src/steps/*.ts` | Tidak | Hanya panggil Page/flow |
| `features/*.feature` | Tidak | Hanya bahasa bisnis |

### Format Locator File

```ts
export const LoginLocator = {
  loginPageEclinic: {
    usernameInput: "#email",
    passwordInput: "#password",
  },
} as const;
```

Teks placeholder atau label link (untuk `getByPlaceholder` / `filter({ hasText })`) simpan di data file module, contoh `CreatePatientData.placeholder` dan `CreatePatientData.linkLabel`.

- Export object: `PascalCase` (`LoginLocator`, `NavbarLocator`)
- Grouping key: `camelCase` per area UI (`form`, `modal`, `pelayanan`)
- Property key: `camelCase` deskriptif (`usernameInput`, `verifiedCheckbox`)
- Selalu `as const`; hindari duplikasi — reuse `NavbarLocator`, `NotifyLocator`, `PatientCommonLocator`, `SweetAlertLocator`

### Shared Locator Patient

File [`src/locators/shared/patient-common.locator.ts`](src/locators/shared/patient-common.locator.ts) menyimpan selector yang dipakai lintas modul patient:

| Area | Key | Dipakai di |
| --- | --- | --- |
| Header pendaftaran | `pendaftaranPanelTitle`, `tambahButton` | Create pasien, register |
| Panel kiri | `panelKiri.container`, `heading`, `table`, `expandLink` | Create pasien, register |
| Datatable | `datatable.wrapper`, `searchForm`, `table`, `bodyRow` | Search pasien, daftar pendaftaran |
| Form dinamis | `formGroupByLabel` | Create pasien modal |
| Link struktural | `linkAnchor` | Anchor `<a>`; teks di `CreatePatientData.linkLabel` |

Module locator (`create-patient.locator.ts`, dll.) compose dari `PatientCommonLocator`, bukan copy-paste selector yang sama.

### Keputusan Khusus eClinic (Legacy DOM)

| Kondisi UI | Strategi yang disetujui |
| --- | --- |
| Input punya `id` stabil | CSS `#id` di locator file |
| Navbar menu punya `id` | `#navbar a#menu_*` di `navbar.locator.ts` |
| Form group dengan label teks | `div.form-group:has(label:has-text("..."))` |
| Button dengan teks unik | `button:has-text('Simpan Pasien')` |
| Index kolom tabel | Simpan di data file, bukan locator |

### Scoping dan Selector Dinamis

| Situasi | Aturan | Contoh |
| --- | --- | --- |
| Elemen duplikat di DOM | Scope ke wrapper/container dulu | `#datatableMedisWrapper table` |
| Autocomplete / suggest | Scope ke dropdown parent, lalu `filter({ hasText })` | `suggestDropdown` + `suggestItem` |
| Tabel dengan banyak kolom | Simpan index kolom di data file | `RegisterPatientData.tableColumns.nik` |
| Teks dinamis (klinik, pasien) | Parameter di Page method, jangan hardcode di locator | `selectClinic(clinicName)` |
| Child locator (`td`, `tr`, `label`) | Boleh di Page Object jika parent scoped; panel kiri pakai `patient-panel.helper.ts` | `panelKiriTableRowByLabel()` |

### Checklist Sebelum Menambah Selector Baru

1. Cek apakah selector sudah ada di locator file module atau `src/locators/shared/` (utamakan `PatientCommonLocator` untuk panel/datatable).
2. Coba `getByRole` / `getByLabel` dulu di Playwright Inspector.
3. Jika pakai CSS, pastikan `id` atau attribute stabil (bukan class generated).
4. Simpan CSS/attribute di `src/locators/<module>/` atau `shared/`; teks placeholder/label link di data file.
5. Scope ke wrapper jika elemen duplikat (navbar, datatable, modal).
6. Simpan index kolom atau expected text di data file terpisah.
7. Page Object mengimpor locator constant, bukan string mentah inline.

## Aturan Layer

- Feature berisi behavior, bukan detail teknis.
- Step definition memanggil Page methods atau flow reusable.
- Page Object berisi action dan assertion reusable.
- Locator file hanya berisi selector CSS/attribute.
- Data file berisi expected value; teks placeholder/label untuk `getByPlaceholder` / `hasText` boleh di data (`CreatePatientData.placeholder`, `CreatePatientData.linkLabel`).
- Fixture file berisi input test data, bukan assertion value.
- Flow file berisi orchestration reusable, bukan selector atau assertion mentah.
- Component file berisi aksi dan assertion untuk komponen UI reusable.

## Browser dan Viewport

Konfigurasi browser ada di `src/helpers/browser.helper.ts`.

- Viewport default: `1920 x 1080`
- `deviceScaleFactor: 1` untuk konsistensi tampilan di mode headed
- Chromium memakai argumen `--force-device-scale-factor=1`
- Mode headed memakai `slowMo: 300` untuk observasi manual

## Alur Test

1. `runner.ts` membaca argumen `--feature`, `--module`, `--tags`, dan `--headed`.
2. Cucumber memuat feature dari folder `features/`.
3. `Before` hook di `src/support/hooks.ts` membuka browser, context, dan page.
4. Scenario `@authenticated` memuat storage state dari `.auth/`; scenario `@login` login dari step Gherkin.
5. Step memanggil Page Object atau flow di `src/support/flows/`.
6. Assertion dijalankan melalui Page Object.
7. `AfterStep` hook menyimpan screenshot setiap step `Then` ke `screenshots/`.
8. `After` hook menutup browser, menyimpan screenshot scenario, dan trace saat gagal.

## Catatan Pengembangan

- Tambahkan feature baru di `features/<module>/`.
- Tambahkan step di `src/steps/<module>/`.
- Simpan selector di `src/locators/<module>/` atau `src/locators/shared/`.
- Simpan expected value di `src/data/<module>/`.
- Simpan input test data di `src/fixtures/`.
- Simpan orchestration journey di `src/support/flows/`.
- Ikuti **Naming Convention** dan **Rules Pengambilan Selector** di bagian atas dokumen ini.
- Jalankan `npm run check` sebelum commit.

Panduan kontribusi detail ada di [CONTRIBUTING.md](./CONTRIBUTING.md).
