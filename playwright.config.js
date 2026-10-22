import { defineConfig, devices } from '@playwright/test'

const PORT = 4173

// Runs against the production build via `vite preview`, which mirrors vercel.json routing
// (real 404s) and mounts /api/subscribe locally. SITE_URL/Resend vars are cleared so tests
// exercise the defaults and the stub provider.
export default defineConfig({
  testDir: 'tests/e2e',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: process.env.CI ? 'github' : 'list',
  use: {
    baseURL: `http://localhost:${PORT}`,
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: {
    command: `npm run build && npm run preview -- --port ${PORT} --strictPort`,
    url: `http://localhost:${PORT}`,
    reuseExistingServer: !process.env.CI,
    timeout: 120_000,
    env: { SITE_URL: '', SUBSCRIBE_PROVIDER: '', RESEND_API_KEY: '', RESEND_AUDIENCE_ID: '' },
  },
})
