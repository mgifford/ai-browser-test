import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  reporter: 'html',
  use: {
    trace: 'on-first-retry',
    baseURL: 'http://localhost:8080',
  },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] } },
    { name: 'firefox', use: { ...devices['Desktop Firefox'] } },
    { name: 'webkit', use: { ...devices['Desktop Safari'] } },
  ],
  webServer: {
    command: 'npx serve docs -p 8080',
    url: 'http://localhost:8080',
    reuseExistingServer: !process.env.CI,
  },
});
