# Contributing Guide

Dokumen ini menjelaskan cara menambahkan atau mengubah automation di project `eclinic-e2e`.

## Alur Kerja

1. Buat branch baru dari `main`.
2. Tentukan module yang akan dikerjakan, misalnya `authentication`, `landing`, `patient`, `pelayanan`, atau module baru.
3. Tambahkan atau ubah feature di `features/<module>/`.
4. Tambahkan atau ubah step definition di `src/steps/`.
5. Tambahkan atau ubah Page Object di `src/pages/<module>/`.
6. Tambahkan atau ubah locator di `src/locators/<module>/` atau `src/locators/shared/`.
7. Tambahkan atau ubah expected value di `src/data/<module>/`.
8. Tambahkan fixture di `src/fixtures/` jika butuh input test data reusable.
9. Tambahkan flow di `src/support/flows/` jika butuh orchestration lintas step atau lintas feature.
10. Jalankan test yang relevan.
11. Jalankan `npm run check` sebelum PR.

## Struktur Saat Ini

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

File lokal (tidak di-commit): `.env`.

## Module yang Tersedia

| Module | Feature | Page Object | Keterangan |
| --- | --- | --- | --- |
| `authentication` | `login.feature`, `authenticated-session.feature` | `LoginPage.ts` | Login via landing/direct, session `@authenticated` |
| `landing` | (via `login.feature`) | `LandingPage.ts` | Navigasi menu landing ke halaman login |
| `patient` | `create-patient.feature`, `register-patient.feature`, `search-patient.feature`, `patient-journey.feature` | `create-patient/CreatePatientPage.ts` (facade), `RegisterPatientPage.ts`, `SearchPatientPage.ts`, `PatientShowDetailPage.ts` | CRUD pasien, registrasi, search, journey E2E |
| `pelayanan` | (via `register-patient.feature`, `patient-journey.feature`) | `RawatJalanIgdPage.ts` | Daftar pelayanan Rawat Jalan & IGD |

## Naming Convention

Ikuti naming convention ini untuk semua file baru. Ringkasan lengkap juga ada di [README.md](./README.md#naming-convention).

### Folder

| Jenis | Format | Contoh benar | Contoh salah |
| --- | --- | --- | --- |
| Module folder | `kebab-case` lowercase | `authentication`, `patient`, `pelayanan` | `Authentication`, `masterData` |
| Shared folder | `kebab-case` lowercase | `shared`, `components`, `flows` | `Shared`, `Components` |
| Feature module | `kebab-case` lowercase | `features/patient/` | `features/Patient/` |

### File

| Jenis file | Format nama file | Suffix | Contoh benar | Contoh salah |
| --- | --- | --- | --- | --- |
| Feature | lowercase | `.feature` | `login.feature`, `patient-journey.feature` | `Login.feature` |
| Page Object | `PascalCase` | `.ts` | `LoginPage.ts`, `RawatJalanIgdPage.ts` | `loginPage.ts` |
| Component | `PascalCase` | `.ts` | `NavbarComponent.ts` | `navbar.component.ts` |
| Locator | `kebab-case` | `.locator.ts` | `login.locator.ts` | `loginLocator.ts` |
| Data | `kebab-case` | `.data.ts` | `login.data.ts` | `loginData.ts` |
| Fixture | `kebab-case` | `.fixture.ts` | `users.fixture.ts` | `Users.fixture.ts` |
| Helper | `kebab-case` | `.helper.ts` | `browser.helper.ts` | `BrowserHelper.ts` |
| Type | `kebab-case` | `.type.ts` | `user.type.ts` | `UserType.ts` |
| Step definition | `kebab-case` | `.steps.ts` | `login.steps.ts` | `loginSteps.ts` |
| Flow | `kebab-case` | `.flow.ts` | `patient-journey.flow.ts` | `patientJourney.flow.ts` |
| Script | `kebab-case` | `.ts` | `auth.setup.ts` | `authSetup.ts` |
| Config | `kebab-case` | `.ts` | `env.ts`, `routes.ts` | `Env.ts` |
| Support | `kebab-case` | `.ts` | `hooks.ts`, `world.ts` | `Hooks.ts` |
| Formatter (exception) | `kebab-case` | `.formatter.js` | `silent.formatter.js` | `silentFormatter.js` |

### Class, Type, dan Identifier

| Jenis | Format | Contoh benar | Contoh salah |
| --- | --- | --- | --- |
| Class | `PascalCase` | `LoginPage`, `RegisterPatientPage` | `loginPage`, `login_page` |
| Interface | `PascalCase` (tanpa prefix `I`) | `UserCredential` | `IUser` |
| Type alias / Enum | `PascalCase` | `UserRole`, `CreatePatientJenisData` | `userRole` |
| Method | `camelCase` (aksi bisnis) | `openLoginPage()`, `verifyLoginSuccess()` | `doClick()`, `process()` |
| Variable / parameter | `camelCase` | `loginPage`, `createdPatientSnapshot` | `LoginPage` |
| Primitive constant | `UPPER_SNAKE_CASE` | `DEFAULT_TIMEOUT` | `defaultTimeout` |
| Object constant (export) | `PascalCase` | `LoginData`, `LoginLocator`, `LandingLocator`, `PatientCommonLocator` | `loginData` |
| Locator key (property) | `camelCase` | `usernameInput`, `verifiedCheckbox` | `USERNAME` |
| Fixture key | `camelCase` | `createPatientNavigation` | `CreatePatientNavigation` |
| Gherkin tag | `@kebab-case` atau `@camelCase` | `@login-direct`, `@patient-journey-e2e` | `@Login_Direct` |

### Penempatan File per Layer

| Layer | Path pattern | Satu file export |
| --- | --- | --- |
| Feature | `features/<module>/<name>.feature` | — |
| Step | `src/steps/<module>/<name>.steps.ts` | — |
| Page | `src/pages/<module>/<Name>Page.ts` | 1 class Page |
| Component | `src/pages/components/<Name>Component.ts` | 1 class Component |
| Locator | `src/locators/<module>/<name>.locator.ts` | 1 object constant |
| Data | `src/data/<module>/<name>.data.ts` | 1 object constant |
| Fixture | `src/fixtures/<name>.fixture.ts` | Input test data |
| Flow | `src/support/flows/<name>.flow.ts` | Named export functions |
| Type | `src/types/<name>.type.ts` | Interface/type per domain |

Jangan gunakan prefix `I` untuk interface.

## Rules Pengambilan Selector

Aturan lengkap juga ada di [README.md](./README.md#rules-pengambilan-selector).

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
| 8 | Child structural selector | Setelah parent sudah di-scope |

**Tidak boleh:** XPath, CSS panjang tanpa scope, selector di feature/step/data/fixture.

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

Teks placeholder atau label link simpan di data file (`CreatePatientData.placeholder`, `CreatePatientData.linkLabel`), bukan di locator.

| Aturan | Detail |
| --- | --- |
| Export object | `PascalCase` + suffix konsep: `LoginLocator`, `NavbarLocator` |
| Grouping key | `camelCase` per area UI: `form`, `modal`, `pelayanan` |
| Property key | `camelCase` deskriptif: `usernameInput`, `verifiedCheckbox` |
| Nilai string | CSS/attribute selector; untuk `getByRole` simpan label di data lalu resolve di Page |
| Immutability | Selalu `as const` |
| Duplikasi | Reuse `NavbarLocator`, `NotifyLocator`, `PatientCommonLocator`, `SweetAlertLocator` |

### Scoping dan Selector Dinamis

| Situasi | Aturan | Contoh |
| --- | --- | --- |
| Elemen duplikat di DOM | Scope ke wrapper/container dulu | `#datatableMedisWrapper table` |
| Autocomplete / suggest | Scope ke dropdown parent, lalu `filter({ hasText })` | `suggestDropdown` + `suggestItem` |
| Tabel dengan banyak kolom | Simpan index kolom di data file | `RegisterPatientData.tableColumns.nik` |
| Teks dinamis | Parameter di Page method | `selectClinic(clinicName)` |
| Child locator | Boleh di Page Object jika parent scoped; gunakan `patient-panel.helper.ts` untuk panel kiri | `panelKiriTableRowByLabel()` |

### Keputusan Khusus eClinic (Legacy DOM)

| Kondisi UI | Strategi yang disetujui |
| --- | --- |
| Input punya `id` stabil (`#email`, `#button_create`) | CSS `#id` di locator file |
| Navbar menu punya `id` | `#navbar a#menu_*` di `navbar.locator.ts` |
| Form group dengan label teks | `div.form-group:has(label:has-text("..."))` |
| Button dengan teks unik | `button:has-text('Simpan Pasien')` |
| Radio/checkbox tanpa id | Locator by `value` atau label di `register-patient.locator.ts` |

**Prinsip:** utamakan Playwright semantic API; fallback ke CSS `#id` / `:has-text()` hanya jika DOM legacy tidak mendukung.

### Checklist Sebelum Menambah Selector

1. Cek apakah selector sudah ada di locator file module atau `src/locators/shared/` (utamakan `PatientCommonLocator` untuk panel kiri, datatable, tombol tambah).
2. Coba `getByRole` / `getByLabel` dulu.
3. Jika pakai CSS, pastikan `id` atau attribute stabil.
4. Simpan CSS/attribute di `src/locators/<module>/` atau `shared/`; teks placeholder/label link di data file.
5. Scope ke wrapper jika elemen duplikat.
6. Simpan index kolom / expected text di data file.
7. Page Object mengimpor locator constant.

## Aturan Penulisan Gherkin

Feature file hanya berisi bahasa bisnis. Key teknis navigasi disimpan di fixture, bukan di scenario.

### Boleh di feature

| Jenis data | Contoh |
| --- | --- |
| Role akun | `"admin"` |
| Jenis data bisnis | `"lengkap"`, `"sakit"` |
| Label bisnis | `"Poli Umum"`, `"Dokter Hari Ini"` |
| Nama pasien contoh | `"RUSLANI"`, `"FAKHRI ARIA FADHILLAH"` |

### Tidak boleh di feature

| Jenis | Contoh yang salah |
| --- | --- |
| Key fixture / navbar | `"pendaftaranPasienV2"`, `"createPasien"` |
| Selector CSS/XPath | `#email`, `button.login` |
| URL path | `/pendaftaran/v2` |
| Detail implementasi UI | `checkbox Diverifikasi`, `id field` |
| Kredensial asli | password dari `.env` |

### Pola navigasi yang disarankan

| Disarankan (bisnis) | Hindari (teknis) |
| --- | --- |
| `When user membuka halaman pasien` | `... menu "pendaftaran" dan submenu "pasien"` |
| `When user membuka halaman pembuatan pasien` | `... submenu "createPasien"` |
| `When user membuka halaman daftar pendaftaran pasien` | `... submenu "pendaftaranPasienV2"` |

Step granular `melalui menu {string} dan submenu {string}` tetap ada untuk debug, jangan dipakai di feature default.

### Jenis data `lengkap` vs `ringkas`

- `lengkap` — create pasien dengan data diverifikasi lengkap (flow `@create-pasien-lengkap`)
- `ringkas` — create pasien data minimal (belum didukung di semua flow journey)

## Kamus Step Reusable

Gunakan step berikut sebelum membuat step navigasi baru. Key menu/submenu ada di `src/fixtures/patient.fixture.ts`.

### Authentication

| Step | Tag / auth | Fixture / key |
| --- | --- | --- |
| `Given user berada di halaman Landing Page` | `@login-via-landing` | `ENV.BASE_URL` |
| `Given user berada di halaman Login` | `@login-direct` | — |
| `When user login menggunakan akun "admin"` | `@login` | `Users` |
| `Given user sudah login sebagai "admin"` | `@authenticated` | `.auth/` via `auth:setup` |
| `Given user sukses login ke aplikasi eClinic dengan akun "admin"` | `@login` / journey | `Users` |
| `Then user berada di halaman Home` | `@authenticated` | — |

### Patient — navigasi halaman

| Step | Tag / auth | Fixture key |
| --- | --- | --- |
| `When user membuka halaman pasien` | `@authenticated` | `searchPatientNavigation` |
| `When user membuka halaman pembuatan pasien` | `@authenticated` | `createPatientNavigation` |
| `When user membuka halaman daftar pendaftaran pasien` | `@authenticated` | `registerPatientNavigation` |
| `Then user berada di halaman "Pembuatan Pasien"` | `@authenticated` | — |
| `Then user berada di halaman "Pasien"` | `@authenticated` | — |

Step granular `melalui menu {string} dan submenu {string}` tetap tersedia untuk debug; hindari di feature default.

### Template feature untuk QA

```gherkin
@authenticated @patient @<flow>
Feature: <Nama Bisnis>

  Background:
    Given user sudah login sebagai "admin"

  @smoke @positive
  Scenario: <judul scenario>
    When user membuka halaman <nama bisnis>
    Then user berada di halaman "<Nama Halaman>"
```

Contoh modul pasien:

```gherkin
@authenticated @patient @create-patient
Feature: Pembuatan Pasien

  Background:
    Given user sudah login sebagai "admin"

  @smoke @positive
  Scenario: Buka halaman pembuatan pasien
    When user membuka halaman pembuatan pasien
    Then user berada di halaman "Pembuatan Pasien"
```

## Konvensi Tag

| Tag | Fungsi |
| --- | --- |
| `@smoke` | Scenario cepat untuk sanity check |
| `@regression` | Cakupan regression modul |
| `@positive` | Happy path |
| `@negative` | Negative / error path |
| `@authenticated` | Pakai session `.auth/` |
| `@login` | Login via step Gherkin |
| `@login-via-landing` | Login mulai landing |
| `@login-direct` | Login langsung ke halaman login |
| `@<module>` | Scope modul, mis. `@patient`, `@authentication` |
| `@<flow>-e2e` | Journey end-to-end, mis. `@patient-journey-e2e` |
| `@<flow>` | Flow spesifik, mis. `@create-patient`, `@register-patient` |

## Pola Navigasi Wajib

Setiap halaman yang diakses lewat menu navbar harus punya:

1. **Satu step bisnis** di feature (mis. `user membuka halaman pasien`)
2. **Key navigasi** di fixture (`PatientFixture.searchPatientNavigation`)
3. **Step granular** `melalui menu ... dan submenu ...` hanya untuk edge case / debug

Jangan menaruh key fixture seperti `pendaftaranPasienV2` atau `createPasien` di feature file.

## Checklist Module Baru

Centang sebelum buka PR modul baru:

```text
[ ] features/<module>/*.feature
[ ] src/steps/<module>/*.steps.ts
[ ] src/pages/<module>/*Page.ts
[ ] src/locators/<module>/*.locator.ts
[ ] (opsional) src/locators/shared/patient-common.locator.ts jika selector dipakai lintas flow patient
[ ] src/data/<module>/*.data.ts
[ ] (opsional) src/fixtures/<module>.fixture.ts
[ ] (opsional) src/support/flows/<flow>.flow.ts
[ ] CustomWorld property jika Page dipakai lintas step
[ ] Step navigasi bisnis + fixture navigation key
[ ] README + CONTRIBUTING + .cursor/rules
[ ] npm run check
[ ] npm run e2e -- --module=<module>
```

## Aturan Feature

- Simpan feature di `features/<module>/`.
- Gunakan nama file lowercase.
- Gunakan tag yang singkat dan konsisten seperti `@smoke`, `@regression`, `@login`, `@authenticated`, `@patient-journey-e2e`.
- Jangan tulis detail selector atau implementasi teknis di feature.

Contoh feature saat ini:

```text
features/authentication/login.feature
features/authentication/authenticated-session.feature
features/patient/create-patient.feature
features/patient/register-patient.feature
features/patient/search-patient.feature
features/patient/patient-journey.feature
```

## Aturan Step Definition

- Step hanya memanggil method dari Page Object atau flow di `src/support/flows/`.
- Jangan gunakan `page.click()`, `page.fill()`, atau `page.locator()` langsung di step.
- Jangan letakkan business logic panjang di step.
- Nama file step menggunakan `kebab-case` dan suffix `.steps.ts`.

Contoh step file saat ini:

```text
src/steps/authentication/login.steps.ts
src/steps/authentication/auth.steps.ts
src/steps/landing/landing.steps.ts
src/steps/patient/create-patient.steps.ts
src/steps/patient/register-patient.steps.ts
src/steps/patient/search-patient.steps.ts
src/steps/patient/patient-show-detail.steps.ts
src/steps/patient/patient-journey.steps.ts
src/steps/shared/page.steps.ts
```

Step komposit boleh memanggil flow di `src/support/flows/`, contoh:

```text
src/support/flows/create-patient.flow.ts
src/support/flows/create-patient-lengkap.flow.ts
src/support/flows/register-patient.flow.ts
src/support/flows/patient-journey.flow.ts
```

Jangan menaruh selector atau `expect()` Playwright langsung di flow.

## Aturan Page Object

- Page Object berisi action, assertion, dan reusable method.
- Setiap Page file export satu class.
- Class memakai `PascalCase`.
- Selector diambil dari file locator.
- Expected value diambil dari file data jika dipakai untuk assertion.
- Komponen UI reusable (navbar, notify, sweet-alert) berada di `src/pages/components/`.
- `LoginPage` memakai `NotifyComponent` untuk assertion error login (bukan selector notify di `LoginLocator`).
- Create pasien dipecah ke facade + section di `src/pages/patient/create-patient/`.

Contoh:

```text
src/pages/authentication/LoginPage.ts
src/pages/landing/LandingPage.ts
src/pages/patient/create-patient/CreatePatientPage.ts
src/pages/patient/create-patient/CreatePatientModalSection.ts
src/pages/patient/create-patient/CreatePatientAddressSection.ts
src/pages/patient/create-patient/CreatePatientPanelSection.ts
src/pages/patient/RegisterPatientPage.ts
src/pages/patient/SearchPatientPage.ts
src/pages/patient/PatientShowDetailPage.ts
src/pages/pelayanan/RawatJalanIgdPage.ts
src/pages/components/NavbarComponent.ts
src/pages/components/NotifyComponent.ts
src/pages/components/SweetAlertComponent.ts
```

## Aturan Locator

- Locator file hanya berisi selector CSS/attribute (bukan teks placeholder atau label link).
- Jangan gunakan `expect()`, `click()`, `fill()`, atau `hover()` di locator.
- Object constant locator memakai `PascalCase` dan selalu `as const`.
- Selector lintas halaman masuk ke `src/locators/shared/`.
- Module locator boleh compose dari shared, contoh `CreatePatientLocator.panelKiri` memakai `PatientCommonLocator.panelKiri`.

### Shared locator patient

[`src/locators/shared/patient-common.locator.ts`](src/locators/shared/patient-common.locator.ts) — sumber tunggal untuk selector yang dipakai lintas flow patient:

| Key | Dipakai di |
| --- | --- |
| `pendaftaranPanelTitle`, `tambahButton` | Create pasien, register pasien |
| `panelKiri.*` | Create pasien (panel assert), register pasien |
| `datatable.*` | Search pasien, daftar pendaftaran |
| `formGroupByLabel` | Template dinamis form create pasien |
| `linkAnchor` | Selector struktural `<a>`; teks link di `CreatePatientData.linkLabel` |

Toast notify: pakai `NotifyLocator` + `NotifyComponent` (bukan duplikat di `LoginLocator`).

Export landing: `LandingLocator` (bukan `LandingPageLocator`).

Contoh:

```text
src/locators/authentication/login.locator.ts
src/locators/landing/landing.locator.ts
src/locators/patient/create-patient.locator.ts
src/locators/pelayanan/rawat-jalan-igd.locator.ts
src/locators/shared/navbar.locator.ts
src/locators/shared/notify.locator.ts
src/locators/shared/patient-common.locator.ts
src/locators/shared/sweet-alert.locator.ts
```

## Aturan Data dan Fixture

- `src/data/` dipakai untuk expected value seperti message, title, URL, label, index kolom tabel, serta **teks placeholder/label** untuk resolve locator di Page (`CreatePatientData.placeholder`, `CreatePatientData.linkLabel`).
- `src/fixtures/` dipakai untuk input test data dan navigasi menu.
- `PatientFormDefaults` dan `RegisterFormDefaults` di `patient.fixture.ts` untuk default form input.
- Jangan masukkan CSS selector ke data.
- Jangan masukkan assertion value ke fixture.
- Kredensial harus berasal dari `ENV`, bukan hardcode di fixture.

Contoh:

```text
src/data/authentication/login.data.ts
src/data/landing/landing.data.ts
src/data/patient/create-patient.data.ts
src/data/patient/register-patient.data.ts
src/data/pelayanan/rawat-jalan-igd.data.ts
src/fixtures/users.fixture.ts
src/fixtures/patient.fixture.ts
```

## Aturan Flow

Flow file di `src/support/flows/` dipakai untuk orchestration reusable:

- `create-patient.flow.ts` — create pasien by `jenisData` (ringkas/lengkap)
- `create-patient-lengkap.flow.ts` — setup pasien lengkap untuk scenario `@authenticated`
- `register-patient.flow.ts` — helper registrasi dan `registrationSnapshot`
- `patient-journey.flow.ts` — orchestration 3 fase journey end-to-end

Aturan flow:

- Flow memanggil Page Object dan helper, bukan Playwright mentah.
- Flow boleh menyimpan snapshot ke `CustomWorld` (`createdPatientSnapshot`, `registrationSnapshot`, dll.).
- Jangan duplikasi assertion yang sudah ada di Page Object.

## Contoh Menambah Patient Journey End-to-End

Journey ringkas di `patient-journey.feature` memakai 3 step bisnis:

1. Login ke eClinic (`@login`, tanpa `@authenticated`)
2. Buat pasien baru — data lengkap, validasi daftar pasien, dan halaman detail
3. Daftar ke rawat jalan melalui loket — daftar pendaftaran + Rawat Jalan & IGD

File terkait:

```text
features/patient/patient-journey.feature
src/steps/patient/patient-journey.steps.ts
src/support/flows/patient-journey.flow.ts
src/support/flows/create-patient.flow.ts
src/support/flows/register-patient.flow.ts
src/pages/patient/PatientShowDetailPage.ts
src/pages/pelayanan/RawatJalanIgdPage.ts
src/locators/patient/patient-show-detail.locator.ts
src/locators/pelayanan/rawat-jalan-igd.locator.ts
src/data/patient/patient-show-detail.data.ts
src/data/pelayanan/rawat-jalan-igd.data.ts
```

Jalankan test:

```bash
npm run e2e -- --tags="@patient-journey-e2e"
npm run e2e -- --tags="@journey"
npm run e2e -- --feature=patient/patient-journey.feature
```

Catatan: scenario `@patient-journey-e2e` login dari step Gherkin. Scenario modul terpisah (`@create-patient`, `@register-lengkap`) butuh `npm run auth:setup` terlebih dahulu.

## Contoh Menambah Register Pasien Lengkap

Flow registrasi lengkap mencakup form pendaftaran, daftar `/pendaftaran/v2`, dan Rawat Jalan & IGD `/pemeriksaanmedis`.

```text
features/patient/register-patient.feature
src/steps/patient/register-patient.steps.ts
src/support/flows/register-patient.flow.ts
src/pages/patient/RegisterPatientPage.ts
src/pages/pelayanan/RawatJalanIgdPage.ts
src/locators/patient/register-patient.locator.ts
src/locators/shared/patient-common.locator.ts
src/locators/pelayanan/rawat-jalan-igd.locator.ts
src/data/patient/register-patient.data.ts
src/data/pelayanan/rawat-jalan-igd.data.ts
src/helpers/patient-panel.helper.ts
```

Jalankan test:

```bash
npm run e2e -- --tags="@register-lengkap"
npm run e2e -- --tags="@register-lengkap-form"
npm run e2e -- --tags="@register-lengkap-list"
npm run e2e -- --tags="@register-lengkap-pelayanan"
```

## Contoh Menambah Create Pasien Lengkap

```text
features/patient/create-patient.feature
src/steps/patient/create-patient.steps.ts
src/support/flows/create-patient.flow.ts
src/pages/patient/create-patient/CreatePatientPage.ts
src/pages/patient/create-patient/CreatePatientModalSection.ts
src/pages/patient/create-patient/CreatePatientAddressSection.ts
src/pages/patient/create-patient/CreatePatientPanelSection.ts
src/pages/patient/SearchPatientPage.ts
src/locators/patient/create-patient.locator.ts
src/locators/shared/patient-common.locator.ts
src/data/patient/create-patient.data.ts
src/helpers/patient-panel.helper.ts
```

Jalankan test:

```bash
npm run e2e -- --tags="@create-pasien-lengkap"
npm run e2e -- --tags="@create-patient"
```

## Contoh Menambah Search Pasien

```text
features/patient/search-patient.feature
src/steps/patient/search-patient.steps.ts
src/pages/patient/SearchPatientPage.ts
src/locators/patient/search-patient.locator.ts
src/locators/shared/patient-common.locator.ts
src/data/patient/search-patient.data.ts
src/types/patient-search.type.ts
```

Jika butuh input data reusable, tambahkan ke fixture module yang sama:

```text
src/fixtures/patient.fixture.ts
```

Jalankan test:

```bash
npm run e2e -- --module=patient
npm run e2e -- --feature=patient/search-patient.feature
npm run e2e -- --tags="@search-patient"
```

## Contoh Menambah Module Baru

Misalnya menambah module `billing`.

1. Buat folder `features/billing/`.
2. Buat layer di `src/steps/billing/`, `src/pages/billing/`, `src/locators/billing/`, `src/data/billing/`.
3. Tambahkan property Page Object baru di `src/support/world.ts` jika dipakai lintas step.
4. Update dokumentasi di `README.md` dan `CONTRIBUTING.md`.

## Command Penting

```bash
npm run e2e
npm run e2e -- --headed
npm run test:headless
npm run e2e -- --module=patient
npm run e2e -- --tags="@patient-journey-e2e"
npm run e2e -- --tags="@login-direct"
npm run e2e -- --tags="@create-pasien-lengkap"
npm run e2e -- --tags="@register-lengkap"
npm run auth:setup
npm run lint
npm run type-check
npm run check
```

Di PowerShell yang memblokir `npm.ps1`, gunakan:

```bash
npm.cmd run check
```

## Checklist Sebelum PR

- Folder dan file mengikuti naming convention.
- Feature sudah terhubung dengan step definition.
- Step definition hanya memanggil Page methods atau flow.
- Selector hanya berada di locator file.
- Expected value berada di data file.
- Input test data berada di fixture file.
- Journey reusable berada di `src/support/flows/` bila dipakai lintas feature.
- Naming convention dan rules selector mengikuti bagian **Naming Convention** dan **Rules Pengambilan Selector** di dokumen ini.
- Snapshot state disimpan di `CustomWorld` bila dipakai lintas step.
- Screenshot setiap step `Then` sudah ditangani `AfterStep` hook; jangan duplikasi manual kecuali ada kebutuhan khusus.
- Credential tidak di-hardcode.
- `npm run e2e` berhasil untuk test yang relevan.
- `npm run check` berhasil.
- `README.md` dan `CONTRIBUTING.md` diperbarui jika struktur folder atau tanggung jawab layer berubah.
