import { defineConfig, devices } from '@playwright/test'

// An uncommon port so e2e doesn't collide with other Vite previews on the same machine.
const PORT = Number(process.env.E2E_PORT ?? 4317)

export default defineConfig({
  testDir: './e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  workers: process.env.CI ? 2 : undefined,
  reporter: process.env.CI ? [['github'], ['html', { open: 'never' }]] : [['list']],
  expect: { timeout: 7_000 },
  use: {
    baseURL: `http://127.0.0.1:${PORT}`,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure'
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    // A production build with placeholder keys; every API call is mocked in e2e/mocks.ts.
    command: `npx vite build && npx vite preview --host 127.0.0.1 --port ${PORT} --strictPort`,
    url: `http://127.0.0.1:${PORT}`,
    // Always build fresh so e2e never runs against a stale bundle.
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      VITE_OMDB_KEY: 'e2e-omdb-key',
      VITE_TMDB_KEY: 'e2e-tmdb-key',
      VITE_GAPI_KEY: 'e2e-youtube-key'
    }
  }
})
