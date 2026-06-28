import { defineConfig, devices } from "@playwright/test";
import { ENV } from "./src/config/env";

export default defineConfig({
  testDir: "./features",
  timeout: ENV.TIMEOUT,
  expect: {
    timeout: ENV.TIMEOUT,
  },
  fullyParallel: false,
  retries: 0,
  reporter: [
    ["html", { outputFolder: "playwright-report", open: "never" }],
  ],
  use: {
    baseURL: ENV.BASE_URL,
    headless: ENV.HEADLESS,
    screenshot: "only-on-failure",
    video: "retain-on-failure",
    trace: "retain-on-failure",
    actionTimeout: ENV.TIMEOUT,
    navigationTimeout: ENV.TIMEOUT,
  },
  projects: [
    {
      name: "chromium",
      use: {
        ...devices["Desktop Chrome"],
      },
    },
  ],
  outputDir: "test-results",
});