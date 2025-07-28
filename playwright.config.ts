import { defineConfig, devices } from '@playwright/test';

const isCI = !!process.env.CI;
const baseURL = process.env.E2E_BASE_URL || 'http://localhost:3000';

export default defineConfig({
  testDir: 'tests/e2e',
  testMatch: '**/*.e2e.ts',
  timeout: 30000,
  retries: isCI ? 2 : 0,
  use: {
    baseURL,
    headless: true,
    locale: 'en', // Set the locale to "en"
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
  },
  reporter: isCI ? 'github' : 'list',
  projects: [
    {
      name: 'chrome',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
