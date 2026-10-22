# Global Repository Rules
- Tech Stack: Vite + React (JavaScript/JSX), Tailwind CSS, Vercel functions in `api/`, Vitest unit tests, Playwright e2e tests in `tests/`, ESLint. Mirror patterns from the sibling repo at /workspace/sip-haven-store (read it for reference; do not modify it).
- Git Safety: Never commit or push directly to `main`. Work only on the current feature branch. PRs merge only after The Refiner posts PASS.
- Never commit `.env*` files or secrets.

# === ACTIVE TICKET PLAN ===
## Goal
Launch tbagstore.com as a simple, fast "coming soon" store for Joe's golf accessories brand, with an email signup, so the domain is live while the Designer finishes the brand name art and logo. First product: a **magnetic golf towel with golf tee**.

## Infra (already set up by The Architect)
- Repo: this one, default branch `main`. Vercel project `tbagstore` (`prj_yLyPZxpHwHWy3dTHD4z3nuUXfJRY`, team joemingahs-projects), auto-deploys from `main`; branches get private previews.
- Domains: `www.tbagstore.com` primary, `tbagstore.com` 308 to www. DNS at GoDaddy is Joe's step.
- No env vars yet. Email signup provider TBD (see step 4).

## Stack
Match sip-haven-store so the team can reuse patterns: Vite + React + Tailwind, `api/` Vercel functions, Vitest unit tests + Playwright e2e in `tests/`, ESLint. Add `CLAUDE.md`/`AGENTS.md` with the house rules (never push to main directly; PR + Refiner PASS first).

## Build
1. **Home page** (`/`): hero with the brand wordmark as a **text placeholder** (`src/brand/Logo.jsx` renders the text "tbagstore" until Designer files land; swapping in an SVG/PNG must be a one-file change in `public/brand/`). Headline and short pitch for the magnetic golf towel with tee (DRAFT COPY, Joe approves). Product image placeholder.
2. **Product section/page** (`/products/magnetic-golf-towel`): name, placeholder photo, key features (magnetic clip that sticks to the cart or clubs, built-in tee holder), "Coming soon" instead of a price or buy button. No checkout in this ticket.
3. **Email signup** ("Get notified at launch"), posting to `/api/subscribe`. For now, validate the email and return `{ok:true}`. Behind an env flag `SUBSCRIBE_PROVIDER`, it writes to Resend when `RESEND_API_KEY` + `RESEND_AUDIENCE_ID` exist; otherwise it logs a stub. The Architect sets up the Resend audience after merge.
4. **Basics:** sticky header, footer with contact email placeholder plus privacy page stub, real 404 status, `robots.txt` and `sitemap.xml` using `SITE_URL` (default `https://www.tbagstore.com`), favicon placeholder, Open Graph tags, mobile-first layout.

## Not in this ticket
Checkout/Stripe, real product photos, final logo and brand name, more products.

## Acceptance (The Refiner, on the preview deploy)
- Clean install: build, unit tests, Playwright and lint all pass.
- Home and product pages render at 390px and 1280px with no horizontal overflow or console errors.
- Signup: a valid email gives a success message and a 200 `{ok:true}`; an invalid email shows an inline error; nothing crashes when Resend env vars are absent.
- Unknown route returns 404; robots and sitemap list only `https://www.tbagstore.com` URLs.
- Swapping the logo means only adding a file in `public/brand/` and changing `Logo.jsx` (check by reading the code).

