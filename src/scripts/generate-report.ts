import fs from "fs";
import os from "os";
import path from "path";

import { ENV } from "../config/env";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const report = require("multiple-cucumber-html-reporter") as {
  generate: (options: Record<string, unknown>) => void;
};

const JSON_DIR = path.resolve("reports/cucumber");
const REPORT_PATH = path.resolve("reports/cucumber/html");

function ensureJsonReportExists(): void {
  if (!fs.existsSync(JSON_DIR)) {
    throw new Error(`Folder JSON report tidak ditemukan: ${JSON_DIR}. Jalankan test terlebih dahulu.`);
  }

  const jsonFiles = fs.readdirSync(JSON_DIR).filter((file) => file.endsWith(".json"));

  if (jsonFiles.length === 0) {
    throw new Error(`Tidak ada file JSON di ${JSON_DIR}. Jalankan test terlebih dahulu.`);
  }
}

function generateReport(): void {
  ensureJsonReportExists();

  if (!fs.existsSync(REPORT_PATH)) {
    fs.mkdirSync(REPORT_PATH, { recursive: true });
  }

  report.generate({
    jsonDir: JSON_DIR,
    reportPath: REPORT_PATH,
    displayReportTime: true,
    pageTitle: "eClinic E2E Report",
    reportName: "eClinic E2E Automation Report",
    metadata: {
      browser: {
        name: ENV.BROWSER,
        version: "latest",
      },
      device: os.hostname(),
      platform: {
        name: process.platform,
        version: os.release(),
      },
    },
    customData: {
      title: "Run Info",
      data: [
        { label: "Environment", value: ENV.ENVIRONMENT },
        { label: "Base URL", value: ENV.BASE_URL },
        { label: "Headless", value: String(ENV.HEADLESS) },
      ],
    },
  });

  console.log(`Report HTML tersedia di: ${path.join(REPORT_PATH, "index.html")}`);
}

generateReport();
