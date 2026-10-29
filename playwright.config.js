import { defineConfig, devices } from '@playwright/test'

// Not Vite's default 4173: sibling repos on the shared box run their own preview there.
const PORT = 4183

// Runs against the production build via `vite preview`, which mirrors vercel.json routing
// (real 404s, per-route prerendered HTML) and mounts /api/subscribe locally. SITE_URL/Resend/welcome
// email vars are cleared and the stub provider is forced so tests exercise the defaults, never call
// Resend and send no welcome email. Every run builds and starts its own server: reusing one left
// running (stale build, other env, or a dist/ being rebuilt under it) made results flaky.
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
    reuseExistingServer: false,
    timeout: 120_000,
    env: {
      SHOW_PRICES: '',
      SITE_URL: '',
      SUBSCRIBE_PROVIDER: 'stub',
      RESEND_API_KEY: '',
      RESEND_BRAND: '',
      RESEND_SEGMENT_ID: '',
      WELCOME_EMAIL_ENABLED: '',
      RESEND_FROM: '',
    },
  },
})
