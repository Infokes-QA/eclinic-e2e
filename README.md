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

## Environment

Copy file contoh environment lalu isi sesuai kebutuhan:

```bash
cp .env.example .env
```

Variabel yang dipakai oleh kode ada di `src/config/env.ts`.

| Variable           | Fungsi                                                                        |
| ------------------ | ----------------------------------------------------------------------------- |
| `ENVIRONMENT`      | Menentukan base URL environment yang dipakai oleh `UrlHelper`, contoh `dev4`. |
| `CLINIC_NAME`      | Nama klinik/faskes yang dipilih saat login.                                   |
| `ECLINIC_USERNAME` | Username akun eClinic.                                                        |
| `ECLINIC_PASSWORD` | Password akun eClinic.                                                        |
| `HEADLESS`         | Menjalankan browser tanpa UI jika `true`.                                     |
| `BROWSER`          | Browser yang dipakai, `chromium`, `firefox`, atau `webkit`.                   |
| `TIMEOUT`          | Timeout Playwright dan Cucumber dalam milidetik.                              |

Contoh isi `.env`:

```env
ENVIRONMENT=dev4
CLINIC_NAME=Nama Klinik
ECLINIC_USERNAME=admin@example.com
ECLINIC_PASSWORD=password
HEADLESS=true
BROWSER=chromium
TIMEOUT=30000
```

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

## Cara Menjalankan Test

Entry point test ada di `src/runner/runner.ts`.

```bash
npm run e2e
npm run e2e -- --headed
npm run e2e -- --feature=authentication/login.feature
npm run e2e -- --module=authentication
npm run e2e -- --tags="@smoke"
npm run e2e -- --module=authentication --tags="@smoke"
```

Argumen yang tersedia:

- `--feature` untuk menjalankan satu feature file
- `--module` untuk menjalankan semua feature dalam satu folder module
- `--tags` untuk menjalankan scenario berdasarkan tag
- `--headed` untuk menampilkan browser

## Struktur Folder dan File

Struktur source yang dipakai saat ini:

```text
eclinic-e2e/
|-- features/
|   `-- authentication/
|       `-- login.feature
|-- src/
|   |-- config/
|   |   |-- env.ts
|   |   |-- routes.ts
|   |   `-- url.ts
|   |-- data/
|   |   |-- authentication/
|   |   |   `-- login.data.ts
|   |   `-- landing/
|   |       `-- landing.data.ts
|   |-- fixtures/
|   |   `-- users.fixture.ts
|   |-- helpers/
|   |   |-- browser.helper.ts
|   |   |-- logger.helper.ts
|   |   |-- random.helper.ts
|   |   `-- screenshot.helper.ts
|   |-- locators/
|   |   |-- authentication/
|   |   |   `-- login.locator.ts
|   |   `-- landing/
|   |       `-- landing.locator.ts
|   |-- pages/
|   |   |-- authentication/
|   |   |   `-- LoginPage.ts
|   |   |-- base/
|   |   |   `-- BasePage.ts
|   |   `-- landing/
|   |       `-- LandingPage.ts
|   |-- runner/
|   |   `-- runner.ts
|   |-- steps/
|   |   |-- authentication/
|   |   |   `-- login.steps.ts
|   |   `-- landing.steps.ts
|   |-- support/
|   |   |-- hooks.ts
|   |   `-- world.ts
|   `-- types/
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
- `src/pages/` -> Page Object berisi action, assertion, dan reusable method
- `src/runner/` -> entry point command line
- `src/steps/` -> step definition yang hanya memanggil Page methods
- `src/support/` -> Cucumber world, hooks, browser lifecycle, screenshot, dan trace
- `src/types/` -> type dan interface TypeScript

## File Utama

- `features/authentication/login.feature` -> scenario login
- `src/pages/authentication/LoginPage.ts` -> Page Object halaman login
- `src/pages/landing/LandingPage.ts` -> Page Object halaman landing
- `src/locators/authentication/login.locator.ts` -> selector halaman login
- `src/locators/landing/landing.locator.ts` -> selector halaman landing
- `src/data/authentication/login.data.ts` -> expected value login
- `src/data/landing/landing.data.ts` -> expected value landing
- `src/steps/authentication/login.steps.ts` -> step definition login
- `src/steps/landing.steps.ts` -> step definition landing
- `src/fixtures/users.fixture.ts` -> input credential dari environment

## Naming Convention

- Folder menggunakan `kebab-case` lowercase.
- Page Object menggunakan `PascalCase`, contoh `LoginPage.ts`.
- Locator menggunakan `kebab-case`, contoh `login.locator.ts`.
- Data menggunakan `kebab-case`, contoh `login.data.ts`.
- Fixture menggunakan `kebab-case`, contoh `users.fixture.ts`.
- Helper menggunakan `kebab-case`, contoh `browser.helper.ts`.
- Type menggunakan `kebab-case`, contoh `user.type.ts`.
- Step definition menggunakan `kebab-case`, contoh `login.steps.ts`.
- Class, interface, type alias, dan enum menggunakan `PascalCase`.
- Variable dan function menggunakan `camelCase`.
- Primitive constants menggunakan `UPPER_SNAKE_CASE`.
- Object constants menggunakan `PascalCase`, contoh `LoginData` dan `LandingPageLocator`.

## Aturan Layer

- Feature berisi behavior, bukan detail teknis.
- Step definition hanya memanggil Page methods.
- Page Object berisi action dan assertion reusable.
- Locator file hanya berisi selector.
- Data file berisi expected value, bukan selector.
- Fixture file berisi input test data, bukan assertion value.

## Alur Test

1. `runner.ts` membaca argumen command seperti `--feature`, `--module`, `--tags`, dan `--headed`.
2. Cucumber memuat feature dari folder `features/`.
3. `Before` hook di `src/support/hooks.ts` membuka browser, context, dan page baru.
4. Step membuat Page Object yang dibutuhkan.
5. Step memanggil method di Page Object.
6. Page Object memakai locator dan data sesuai kebutuhan.
7. Assertion dijalankan melalui Page Object.
8. `After` hook menutup browser dan menyimpan screenshot atau trace saat scenario gagal.

## Catatan Pengembangan

- Tambahkan feature baru di `features/<module>/`.
- Tambahkan step definition baru di `src/steps/<module>/` atau `src/steps/<feature>.steps.ts` sesuai kebutuhan module.
- Simpan selector baru di `src/locators/<module>/`.
- Simpan expected value di `src/data/<module>/`.
- Simpan input test data di `src/fixtures/`.
- Simpan action dan assertion halaman di `src/pages/<module>/`.
- Jalankan `npm run check` sebelum commit.

Panduan kontribusi detail ada di [CONTRIBUTING.md](./CONTRIBUTING.md).
