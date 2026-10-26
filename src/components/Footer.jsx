import { Link } from 'react-router-dom'
import { Crest } from '../brand/Logo.jsx'
import { BRAND_WORDMARK } from '../brand/brand.js'
import { CONTACT_EMAIL, footer as copy } from '../content/copy.js'
import SignupForm from './SignupForm.jsx'

// Each footer link is at least 44px tall so it's easy to tap on phones (audit: >= 24px).
const TAP_TARGET = 'inline-flex min-h-11 min-w-6 items-center transition hover:text-gold'

export default function Footer() {
  return (
    <footer className="mt-20 border-t border-gold/30 bg-charcoal text-cream">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-12 border-b border-gold/20 pb-12 md:grid-cols-12">
          <div className="space-y-4 md:col-span-5">
            <div className="flex items-center gap-2.5">
              <Crest className="h-6 w-6 shrink-0 text-gold" />
              <span className="font-serif text-3xl font-bold tracking-[0.06em] text-cream">{BRAND_WORDMARK}</span>
            </div>
            <p className="font-serif text-xl text-gold italic">{copy.motto}</p>
            <p className="max-w-sm text-xs leading-relaxed text-cream/70">{copy.blurb}</p>
            <p className="pt-2 font-mono text-[11px] tracking-widest text-gold/90 uppercase">{copy.locations}</p>
          </div>

          <nav aria-label="Clubhouse directory" className="space-y-3 md:col-span-3">
            <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">{copy.directoryHeading}</p>
            <ul className="font-mono text-xs text-cream/75">
              {copy.directory.map((link) => (
                <li key={link.to}>
                  <Link to={link.to} className={TAP_TARGET}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div id="footer-signup" className="scroll-mt-28 space-y-4 md:col-span-4">
            <p className="font-mono text-xs tracking-[0.2em] text-gold uppercase">{copy.dispatchHeading}</p>
            <p className="text-xs leading-relaxed text-cream/75">{copy.dispatchBody}</p>
            <div data-testid="footer-signup">
              <SignupForm variant="dark" buttonLabel={copy.dispatchButton} placeholder={copy.dispatchPlaceholder} />
            </div>
            <p className="font-mono text-[10px] text-cream/60">{copy.dispatchNote}</p>
          </div>
        </div>

        <div className="flex flex-col items-center justify-between gap-4 pt-8 font-mono text-xs text-cream/70 lg:flex-row">
          <p className="text-center">{copy.copyright}</p>
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-1">
            <a href={`mailto:${CONTACT_EMAIL}`} className={TAP_TARGET}>
              {CONTACT_EMAIL}
            </a>
            {copy.policyLinks.map((link) => (
              <Link key={link.to} to={link.to} className={TAP_TARGET}>
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
