// LOGO SWAP (one-value change, then regenerate the share images):
//   1. Add the Designer's file to public/brand/ (e.g. public/brand/logo.svg or logo.png).
//   2. Set LOGO_FILE below to its public path, e.g. '/brand/logo.svg'.
//   3. Run `npm run brand:images` and commit the regenerated PNGs. That rebuilds
//      public/og-image.png (1200x630 share image), public/apple-touch-icon.png (180x180)
//      and public/favicon-32x32.png from LOGO_FILE instead of the text wordmark.
// While LOGO_FILE is null the crest + "TBagger Golf Co." text wordmark is used instead.
// Plain JS (no JSX) so scripts/generate-brand-images.mjs can import it in Node.
export const LOGO_FILE = null

export const BRAND_NAME = 'TBagger Golf Co.'
// Text wordmark drawn next to the crest, and the motto under it (motto is draft copy).
export const BRAND_WORDMARK = BRAND_NAME
export const BRAND_MOTTO = 'Held in High Regard'

// Palette from Joe's design, shared with the generated images. Matches the @theme colors in index.css.
export const BRAND_COLOR = '#0A2116' // forest
export const BRAND_TEXT_COLOR = '#F6F4EE' // cream
export const BRAND_ACCENT_COLOR = '#C5A059' // gold
