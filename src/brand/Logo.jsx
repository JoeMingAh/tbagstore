// LOGO SWAP: set LOGO_FILE in ./brand.js (see the steps there). This component needs no edits.
import { BRAND_NAME, LOGO_FILE } from './brand.js'

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
