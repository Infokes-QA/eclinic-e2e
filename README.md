# Playwright BDD Automation Template

Automation testing project using **Playwright** with **playwright-bdd** (Cucumber-style).

---

## 🚀 Overview

This project is designed for **end-to-end testing** using:

* Playwright (browser automation)
* BDD approach (Gherkin feature files)
* Page Object Model (POM)

---

## 📦 Installation

1. Install dependencies:

   ```bash
   npm install
   ```

2. Install Playwright browsers (first time only):

   ```bash
   npx playwright install
   ```

---

## ⚙️ Environment Setup

Create `.env.eclinic` file in root directory:

```env
BASE_URL=https://dev-1.eclinic.id

EC_USERNAME=your-username
EC_PASSWORD=your-password
EC_FASKES=your-faskes
```

> ⚠️ Do not commit `.env` files to Git.

---

## 📁 Project Structure

```
├── features/               # Gherkin feature files
│   └── *.feature
├── steps/                 # Step definitions
│   └── *.steps.ts
├── pages/                 # Page Object Model
│   └── **/*.page.ts
├── data/                  # Test data & generator
│   └── pasien.data.ts
├── .features-gen/         # Auto-generated test files (BDD)
├── playwright.config.ts   # Playwright + BDD config
```

---

## 🧪 Running Tests

### 1. Generate BDD test files

```bash
npm run bdd:gen
```

### 2. Run all tests

```bash
npm test
```

### 3. Run in headed mode

```bash
npm run test:headed
```

### 4. Run by tag

```bash
npm run test:tag
```

### 5. Run specific tag (example)

```bash
npx playwright test --grep @pasien
```

### 6. Run without parallel (non-parallel)
Jika ingin memastikan skenario tidak berjalan paralel (mis. saat test bergantung data dinamis), gunakan 1 worker:
```bash
npm test -- --grep @pasien --project=chromium --headed --workers=1
```

---

## 🏷️ Tags Convention

Use tags in feature files to organize tests:

* `@smoke` → critical flow
* `@sanity` → basic validation
* `@eclinic` → environment specific
* `@pasien` → feature specific

---

## 🧠 Best Practices

* Use **Page Object Model (POM)** for maintainability
* Use **data generator** for dynamic test data (e.g., NIK)
* Avoid hardcoded values
* Always use **specific locators** (avoid generic selectors)
* Scope locators to component (e.g., dialog, form)

---

## ⚠️ Important Notes

* Run `bdd:gen` after updating `.feature` files
* Do not edit files inside `.features-gen/`
* Ensure `.env` is properly configured before running tests

---

## 📊 Reports

After running tests:

```bash
npx playwright show-report
```

---

## 🚀 Example Use Case

Implemented test scenarios:

* ✅ Login Eclinic
* ✅ Create pasien umum (laki-laki & perempuan)
* ✅ Setelah create: pasien bisa ditemukan di `/pasien?broadcastNotif=1` dengan pencarian `NIK`
* ✅ Scenario Outline with dynamic data

---

## 👨‍💻 Author

Automation QA Project – Playwright BDD
