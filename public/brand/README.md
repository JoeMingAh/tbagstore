# Brand assets

Drop the Designer's logo file here (for example `logo.svg` or `logo.png`), then set
`LOGO_FILE` in `src/brand/brand.js` to its public path (for example `'/brand/logo.svg'`).

Then run `npm run brand:images` and commit the result. It regenerates the share image
(`public/og-image.png`, 1200x630), `public/apple-touch-icon.png`, `public/favicon-32x32.png`
and `public/favicon.svg` from the logo instead of the text wordmark. No other file needs to change.
