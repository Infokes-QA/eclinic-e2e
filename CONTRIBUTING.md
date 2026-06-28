# Contributing Guide

Dokumen ini menjelaskan cara menambahkan atau mengubah automation di project `eclinic-e2e`.

## Alur Kerja

1. Buat branch baru dari `main`.
2. Tentukan module yang akan dikerjakan, misalnya `authentication`, `landing`, `patient`, atau `billing`.
3. Tambahkan atau ubah feature di `features/<module>/`.
4. Tambahkan atau ubah step definition di `src/steps/`.
5. Tambahkan atau ubah Page Object di `src/pages/<module>/`.
6. Tambahkan atau ubah locator di `src/locators/<module>/`.
7. Tambahkan atau ubah expected value di `src/data/<module>/`.
8. Tambahkan fixture di `src/fixtures/` jika butuh input test data reusable.
9. Jalankan test yang relevan.
10. Jalankan `npm run check` sebelum PR.

## Struktur Saat Ini

```text
features/
`-- authentication/
    `-- login.feature

src/
|-- config/
|   |-- env.ts
|   |-- routes.ts
|   `-- url.ts
|-- data/
|   |-- authentication/
|   |   `-- login.data.ts
|   `-- landing/
|       `-- landing.data.ts
|-- fixtures/
|   `-- users.fixture.ts
|-- helpers/
|   |-- browser.helper.ts
|   |-- logger.helper.ts
|   |-- random.helper.ts
|   `-- screenshot.helper.ts
|-- locators/
|   |-- authentication/
|   |   `-- login.locator.ts
|   `-- landing/
|       `-- landing.locator.ts
|-- pages/
|   |-- authentication/
|   |   `-- LoginPage.ts
|   |-- base/
|   |   `-- BasePage.ts
|   `-- landing/
|       `-- LandingPage.ts
|-- runner/
|   `-- runner.ts
|-- steps/
|   |-- authentication/
|   |   `-- login.steps.ts
|   `-- landing.steps.ts
|-- support/
|   |-- hooks.ts
|   `-- world.ts
`-- types/
    `-- user.type.ts
```

## Naming Convention

Ikuti naming convention ini untuk semua file baru.

| Jenis             | Format        | Contoh                          |
| ----------------- | ------------- | ------------------------------- |
| Folder            | `kebab-case`  | `authentication`, `master-data` |
| Feature           | lowercase     | `login.feature`                 |
| Page Object       | `PascalCase`  | `LoginPage.ts`                  |
| Locator           | `kebab-case`  | `login.locator.ts`              |
| Data              | `kebab-case`  | `login.data.ts`                 |
| Fixture           | `kebab-case`  | `users.fixture.ts`              |
| Helper            | `kebab-case`  | `browser.helper.ts`             |
| Type              | `kebab-case`  | `user.type.ts`                  |
| Step Definition   | `kebab-case`  | `login.steps.ts`                |
| Class             | `PascalCase`  | `LoginPage`                     |
| Interface         | `PascalCase`  | `UserCredential`                |
| Type Alias        | `PascalCase`  | `UserRole`                      |
| Enum              | `PascalCase`  | `BrowserType`                   |
| Variable/Function | `camelCase`   | `loginPage`, `loginAs()`        |
| Primitive const   | `UPPER_SNAKE` | `DEFAULT_TIMEOUT`               |
| Object const      | `PascalCase`  | `LoginData`                     |

Jangan gunakan prefix `I` untuk interface.

## Aturan Feature

- Simpan feature di `features/<module>/`.
- Gunakan nama file lowercase.
- Gunakan tag yang singkat dan konsisten seperti `@smoke`, `@regression`, atau `@login`.
- Jangan tulis detail selector atau implementasi teknis di feature.

Contoh:

```text
features/authentication/login.feature
```

## Aturan Step Definition

- Step hanya memanggil method dari Page Object.
- Jangan gunakan `page.click()`, `page.fill()`, atau `page.locator()` langsung di step.
- Jangan letakkan business logic panjang di step.
- Nama file step menggunakan `kebab-case` dan suffix `.steps.ts`.

Contoh:

```text
src/steps/authentication/login.steps.ts
src/steps/landing.steps.ts
```

## Aturan Page Object

- Page Object berisi action, assertion, dan reusable method.
- Setiap Page file export satu class.
- Class memakai `PascalCase`.
- Selector diambil dari file locator.
- Expected value diambil dari file data jika dipakai untuk assertion.

Contoh:

```text
src/pages/authentication/LoginPage.ts
src/pages/landing/LandingPage.ts
```

## Aturan Locator

- Locator file hanya berisi selector.
- Jangan gunakan `expect()`, `click()`, `fill()`, atau `hover()` di locator.
- Object constant locator memakai `PascalCase`.

Contoh:

```text
src/locators/authentication/login.locator.ts
src/locators/landing/landing.locator.ts
```

## Aturan Data dan Fixture

- `src/data/` dipakai untuk expected value seperti message, title, URL, dan label.
- `src/fixtures/` dipakai untuk input test data.
- Jangan masukkan selector ke data.
- Jangan masukkan assertion value ke fixture.

Contoh:

```text
src/data/authentication/login.data.ts
src/data/landing/landing.data.ts
src/fixtures/users.fixture.ts
```

## Contoh Menambah Module Baru

Misalnya menambah module `patient`.

```text
features/patient/create-patient.feature
src/steps/patient/create-patient.steps.ts
src/pages/patient/CreatePatientPage.ts
src/locators/patient/create-patient.locator.ts
src/data/patient/create-patient.data.ts
```

Jika butuh input data reusable:

```text
src/fixtures/patients.fixture.ts
```

Jalankan test:

```bash
npm run e2e -- --module=patient
npm run e2e -- --feature=patient/create-patient.feature
```

## Command Penting

```bash
npm run e2e
npm run e2e -- --headed
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
- Step definition hanya memanggil Page methods.
- Selector hanya berada di locator file.
- Expected value berada di data file.
- Input test data berada di fixture file.
- Credential tidak di-hardcode.
- `npm run e2e` berhasil untuk test yang relevan.
- `npm run check` berhasil.
