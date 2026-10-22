# tbagstore
tbagstore.com - golf accessories store (coming soon page).

## Develop
```sh
npm ci
npx playwright install chromium   # once, for e2e
npm run dev        # local dev server (also serves /api/subscribe)
npm run build      # production build to dist/ (+ per-route HTML, robots.txt, sitemap.xml, 404.html)
npm run brand:images  # regenerate og-image.png / apple-touch-icon.png / favicons in public/
npm test           # Vitest unit tests (tests/unit)
npm run test:e2e   # Playwright against `vite preview` of the build (tests/e2e)
npm run lint
```

## Where things live
- Copy (DRAFT, pending Joe's approval): `src/content/copy.js`
- Logo swap: add the file to `public/brand/`, set `LOGO_FILE` in `src/brand/brand.js`, then run `npm run brand:images` and commit the regenerated share image and icons
- Routes: `src/routes.js`. Add new pages there, give them a `meta` entry in `src/content/copy.js`, **and** add a `vercel.json` rewrite to `/<path>/index.html` (a unit test checks they match). Paths not in the rewrites get Vercel's `404.html` with a real 404 status.
- SEO: `src/seo.js` builds each page's title, description, canonical (`SITE_URL`, default `https://www.tbagstore.com`), Open Graph/Twitter tags and JSON-LD (Organization on home, Product with no price on the towel page). The build writes them into a separate HTML file per route so crawlers see them without JS; the app updates them on in-app navigation.
- Analytics: Vercel Web Analytics (`<Analytics />` in `src/App.jsx`), cookieless. Enable Web Analytics for the project in the Vercel dashboard for data to show up.
- Policy pages: `/faq`, `/shipping`, `/returns` (copy in `src/content/copy.js`) show a "Draft, pending approval" note until approved; remove it in `src/pages/PolicyPage.jsx`.
- Email signup: `api/subscribe.js`. See `.env.example` for `SUBSCRIBE_PROVIDER` / Resend vars. With them missing it logs a stub and still returns `{ ok: true }`.
- Welcome email: template `src/emails/welcome.js` (DRAFT copy in `copy.js`). Off by default; sends only for new contacts when `WELCOME_EMAIL_ENABLED=true` and `RESEND_FROM` are set.
