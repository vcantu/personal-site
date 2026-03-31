import { existsSync } from 'fs';
import { resolve } from 'path';
import { defineConfig, devices } from '@playwright/test';

/**
 * Detect backend type by checking for package.json (Bun/Node) or app/main.py (Python).
 * Must stay in sync with hatch/coordinator/preview.py _detect_backend_type().
 */
function getBackendCommand(): string {
  const backendDir = resolve(__dirname, '../backend');
  if (existsSync(resolve(backendDir, 'package.json'))) {
    return 'cd ../backend && bun run dev';
  }
  return 'cd ../backend && uvicorn app.main:app --reload --host 0.0.0.0 --port 8000';
}

/**
 * Playwright configuration for E2E tests.
 * See https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',

  /* Run tests in files in parallel */
  fullyParallel: true,

  /* Fail the build on CI if you accidentally left test.only in the source code */
  forbidOnly: !!process.env.CI,

  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,

  /* Opt out of parallel tests on CI */
  workers: process.env.CI ? 1 : undefined,

  /* Reporter to use */
  reporter: [
    ['list'],
    ['html', { open: 'never' }],
  ],

  /* Shared settings for all the projects below */
  use: {
    /* Base URL for all tests */
    baseURL: 'http://localhost:5173',

    /* Collect trace when retrying the failed test */
    trace: 'on-first-retry',

    /* Take screenshot on failure */
    screenshot: 'only-on-failure',

    /* Video on failure */
    video: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  /* Run your local dev server before starting the tests */
  webServer: [
    {
      command: getBackendCommand(),
      url: 'http://localhost:8000/api/health',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
    {
      command: 'cd ../frontend && bun run dev',
      url: 'http://localhost:5173',
      reuseExistingServer: !process.env.CI,
      timeout: 120 * 1000,
    },
  ],

  /* Global timeout for each test */
  timeout: 30 * 1000,

  /* Expect timeout */
  expect: {
    timeout: 10 * 1000,
  },
});
