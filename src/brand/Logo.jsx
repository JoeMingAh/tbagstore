// LOGO SWAP (one-file change):
//   1. Add the Designer's file to public/brand/ (e.g. public/brand/logo.svg).
//   2. Set LOGO_FILE below to its public path, e.g. '/brand/logo.svg'.
// While LOGO_FILE is null the text wordmark "tbagstore" is rendered instead.
export const LOGO_FILE = null

export const BRAND_NAME = 'tbagstore'

export default function Logo({ className = '' }) {
  if (LOGO_FILE) {
    return <img src={LOGO_FILE} alt={BRAND_NAME} className={`h-8 w-auto ${className}`} />
  }
  return (
    <span className={`font-extrabold tracking-tight lowercase ${className}`} data-testid="logo-text">
      {BRAND_NAME}
    </span>
  )
}
