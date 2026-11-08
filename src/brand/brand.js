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

// Hybrid palette. Orange is for primary CTAs only (.btn-primary). Do not use it
// on bars, borders, badges, or section fills. Matches the --color-* tokens in src/index.css.
export const COLOR_CREAM = '#F6F4EE'
export const COLOR_INK = '#0A0A0A'
// Sunset orange. Primary CTAs only. Hover and active are the same hue, darkened,
// and still clear WCAG AA with an ink label (7.6:1, 5.9:1, 5.2:1).
export const COLOR_ACCENT = '#FF7A1A'
export const COLOR_ACCENT_HOVER = '#E06B17'
export const COLOR_ACCENT_ACTIVE = '#D16415'
export const COLOR_GOLD = '#C5A059'
export const COLOR_FOREST = '#0A2116'
