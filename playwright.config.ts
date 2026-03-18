import { defineConfig, devices } from '@playwright/test';
import { defineBddConfig } from 'playwright-bdd';
import dotenv from 'dotenv';

dotenv.config({
  path: `.env.${process.env.ENV || 'eclinic'}`
});

export default defineConfig({
  timeout: 120_000,

  testDir: defineBddConfig({
    paths: ['features/**/*.feature'],
    require: ['steps/**/*.ts'],
  }),

  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,

  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  use: {
    // 🔥 FIX DI SINI
    baseURL: process.env.BASE_URL || 'https://dev-1.eclinic.id',

    trace: 'retain-on-failure',
    screenshot: 'on',
    video: 'on',
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});