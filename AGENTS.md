# Automated Verification Guidelines
- Unit tests: Vitest (`npm test`). E2E: Playwright (`npx playwright test`, headless) in `tests/`, using a webServer that serves the built app (vite preview) so tests run against production output.
- Lint: `npm run lint` must be clean. Build: `npm run build` must pass.
- Review Criteria:
  1. No hardcoded secrets, API keys, or unvalidated user inputs.
  2. Build, unit tests, Playwright, and lint all pass from a clean install.
  3. Never push to `main`; never commit `.env*` files.
