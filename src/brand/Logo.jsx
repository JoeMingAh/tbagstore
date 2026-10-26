// LOGO SWAP: set LOGO_FILE in ./brand.js (see the steps there). This component needs no edits.
import { BRAND_MOTTO, BRAND_NAME, BRAND_WORDMARK, LOGO_FILE } from './brand.js'

export function Crest({ className = 'h-5 w-5' }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
      <path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" />
      <path d="M9 12l2 2 4-4" />
    </svg>
  )
}

// `motto` shows "Held in High Regard" under the wordmark (header only).
export default function Logo({ className = '', motto = false }) {
  if (LOGO_FILE) {
    return <img src={LOGO_FILE} alt={BRAND_NAME} className={`h-10 w-auto ${className}`} />
  }
  return (
    <span className={`inline-flex flex-col items-center ${className}`}>
      <span className="flex items-center justify-center gap-2">
        <Crest className="h-5 w-5 shrink-0 text-gold transition-transform duration-300 group-hover:rotate-12" />
        <span
          className="font-serif text-xl font-bold tracking-[0.06em] whitespace-nowrap text-cream transition group-hover:text-gold sm:text-3xl"
          data-testid="logo-text"
        >
          {BRAND_WORDMARK}
        </span>
      </span>
      {motto && (
        <span className="-mt-1 font-mono text-[9px] tracking-[0.32em] text-gold/80 uppercase">{BRAND_MOTTO}</span>
      )}
    </span>
  )
}
