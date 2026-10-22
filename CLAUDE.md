# Global Repository Rules
- Tech Stack: Vite + React (JavaScript/JSX), Tailwind CSS, Vercel functions in `api/`, Vitest unit tests, Playwright e2e tests in `tests/`, ESLint. Mirror patterns from the sibling repo at /workspace/sip-haven-store (read it for reference; do not modify it).
- Git Safety: Never commit or push directly to `main`. Work only on the current feature branch. PRs merge only after The Refiner posts PASS.
- Never commit `.env*` files or secrets.

# === ACTIVE TICKET PLAN ===
(tbagstore issue #3; #1 is already merged and its code is the baseline)

Overnight follow-up to #1. Work on a new branch from `main` (e.g. `launch-polish`). Same stack and rules as #1: preview only until The Refiner posts PASS.

## Scope
1. **Share previews + SEO**: Open Graph and Twitter card tags on every page (title, description, `og:image`, canonical URL on `https://www.tbagstore.com`). Generate a 1200x630 share image in `public/` that uses the text-logo placeholder (easy to swap later, same as the logo). Add favicon and apple-touch icon from the placeholder.
2. **Product structured data**: JSON-LD `Product` on the towel page with no price/offer yet (coming soon). Organization JSON-LD on home.
3. **Analytics**: add Vercel Web Analytics (`@vercel/analytics`). No cookies, no banner needed. Mention it in the privacy page.
4. **Policy pages**: `/faq`, `/shipping`, `/returns` with placeholder copy in `src/content/copy.js`, each showing a visible "Draft, pending approval" note until Joe approves. Link them in the footer; add to sitemap (www only).
5. **Welcome email (off by default)**: a React Email (or plain HTML) welcome template in the repo plus a send step in `/api/subscribe` that runs only when `WELCOME_EMAIL_ENABLED=true` and the contact is new. Use `RESEND_FROM` env for the sender. No env changes needed now: leave it disabled. Copy is draft for Joe.

## Out of scope
Checkout, prices, real product photos, final logo.

## Acceptance (The Refiner)
- Build, unit tests, Playwright and lint pass on a clean install.
- OG/Twitter tags and canonical present on home, product, privacy, faq, shipping, returns; share image returns 200 at 1200x630.
- JSON-LD validates as JSON and has no price.
- New pages load at 390 and 1280 wide with no sideways overflow or console errors; sitemap lists only www URLs; 404 still real.
- Analytics script loads in production build.
- With `WELCOME_EMAIL_ENABLED` unset, a signup sends **no** email and still returns `{ok:true}` with `brand=tbagstore`; a unit test covers the enabled path with Resend mocked.
- Delete any test contacts.
