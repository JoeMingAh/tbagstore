// LOGO SWAP (one-value change, then regenerate the share images):
//   1. Add the Designer's file to public/brand/ (e.g. public/brand/logo.svg or logo.png).
//   2. Set LOGO_FILE below to its public path, e.g. '/brand/logo.svg'.
//   3. Run `npm run brand:images` and commit the regenerated PNGs. That rebuilds
//      public/og-image.png (1200x630 share image), public/apple-touch-icon.png (180x180)
//      and public/favicon-32x32.png from LOGO_FILE instead of the text wordmark.
// While LOGO_FILE is null the text wordmark "tbagstore" is used everywhere instead.
// Plain JS (no JSX) so scripts/generate-brand-images.mjs can import it in Node.
export const LOGO_FILE = null

export const BRAND_NAME = 'tbagstore'

// Placeholder palette, shared with the generated images. Matches --color-brand in index.css.
export const BRAND_COLOR = '#14532d'
export const BRAND_TEXT_COLOR = '#f5f5f4'
