# Global Repository Rules
- Tech Stack: Vite + React (JavaScript/JSX), Tailwind CSS, Vercel functions in `api/`, Vitest unit tests, Playwright e2e tests in `tests/`, ESLint. Mirror patterns from the sibling repo at /workspace/sip-haven-store (read it for reference; do not modify it).
- Git Safety: Never commit or push directly to `main`. Work only on the current feature branch. PRs merge only after The Refiner posts PASS.
- Never commit `.env*` files or secrets.

# === ACTIVE TICKET PLAN ===
(tbagstore issue #8, branch `tbagger-redesign`. The mockup is also copied at design/tbagger_luxury_golf_storefront.html; the issue's paths under /workspace/tbagstore-design/ are the same file plus screenshots.)

Joe wants the site rebuilt to match his mockup instead of the current coming-soon design.

**Reference (on the shared box):** `/workspace/tbagstore-design/tbagger_luxury_golf_storefront.html` (open in a browser), plus screenshots `tbagger-mock-desktop.png` and `tbagger-mock-phone.png` in the same folder. Branch `tbagger-redesign` from `main`; preview only until Refiner PASS.

## Build
- Port the look into the existing Vite + React app: forest/cream/gold palette, Cormorant Garamond + Plus Jakarta Sans + JetBrains Mono (self-hosted, no Google Fonts or Tailwind CDN), the ticker bar, hero, product grid, the "philosophy" block, the three craft cards and the footer.
- Views as real routes, not hidden sections: `/` home, `/shop`, `/products/:slug`, `/about`, `/club`. Keep `/faq`, `/shipping`, `/returns`, `/privacy`, the real 404, per-route meta/OG/canonical, sitemap, analytics and the 44px tap targets from #3/#5.
- Brand: show **TBagger Golf Co.** as a text wordmark (logo still a placeholder via `public/brand/` + `LOGO_FILE`).
- Products: put the 8 mockup products in one data file (`src/content/products.js`) with name, slug, tagline, description and price. **Prices stay hidden** behind a `SHOW_PRICES` flag (default off) until Joe confirms them. Each product says "Coming soon".
- No checkout: replace "Add to bag" / checkout / card form with a "Notify me" that uses the existing `/api/subscribe` (brand=tbagstore). Do not ship any card-number field. Remove the cart and checkout views.
- Images: no Unsplash photos (they aren't our products). Use the styled placeholders until Joe's samples are photographed.
- Copy: move all copy to `src/content/copy.js` and keep the mockup's wording as a draft. Flag for Joe's approval any factual claims (Scottsdale & St Andrews, Italian leather, CNC brass, N52 magnets, batch numbers, member counts, "est." dates), since we can't verify them yet.

## Acceptance (The Refiner)
- Clean install: build, unit tests, Playwright, lint pass.
- Every route loads at 390 and 1280 with no sideways overflow or console errors, and the look visually matches the mockup screenshots.
- No requests to cdn.tailwindcss.com, fonts.googleapis.com or images.unsplash.com.
- No prices visible with `SHOW_PRICES` unset; no card or checkout fields anywhere.
- Notify-me signup saves to Resend with brand=tbagstore; delete the test contact (with Joe's OK).
- Lighthouse mobile performance at least 90 on home; accessibility, best practices and SEO stay 100.

