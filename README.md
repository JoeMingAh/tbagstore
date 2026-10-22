# tbagstore
tbagstore.com - golf accessories store (coming soon page).

## Develop
```sh
npm ci
npx playwright install chromium   # once, for e2e
npm run dev        # local dev server (also serves /api/subscribe)
npm run build      # production build to dist/ (+ robots.txt, sitemap.xml, 404.html)
npm test           # Vitest unit tests (tests/unit)
npm run test:e2e   # Playwright against `vite preview` of the build (tests/e2e)
npm run lint
```

## Where things live
- Copy (DRAFT, pending Joe's approval): `src/content/copy.js`
- Logo swap: add the file to `public/brand/`, set `LOGO_FILE` in `src/brand/Logo.jsx`
- Routes: `src/routes.js`. Add new pages there **and** to `vercel.json` rewrites (a unit test checks they match). Paths not in the rewrites get Vercel's `404.html` with a real 404 status.
- Email signup: `api/subscribe.js`. See `.env.example` for `SUBSCRIBE_PROVIDER` / Resend vars. With them missing it logs a stub and still returns `{ ok: true }`.
