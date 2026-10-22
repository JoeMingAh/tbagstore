import { Link } from 'react-router-dom'
import { CONTACT_EMAIL } from '../content/copy.js'

const FOOTER_LINKS = [
  { to: '/faq', label: 'FAQ' },
  { to: '/shipping', label: 'Shipping' },
  { to: '/returns', label: 'Returns' },
  { to: '/privacy', label: 'Privacy' },
]

// Each footer link is at least 44px tall so it's easy to tap on phones (audit: >= 24px).
const TAP_TARGET = 'inline-flex min-h-11 min-w-6 items-center hover:text-brand'

export default function Footer() {
  return (
    <footer className="border-t border-stone-200 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col gap-3 px-4 py-8 text-sm text-stone-600 sm:flex-row sm:items-center sm:justify-between sm:px-6">
        <p>&copy; {new Date().getFullYear()} tbagstore</p>
        <div className="flex flex-wrap gap-x-4 gap-y-1">
          <a href={`mailto:${CONTACT_EMAIL}`} className={TAP_TARGET}>
            {CONTACT_EMAIL}
          </a>
          {FOOTER_LINKS.map((link) => (
            <Link key={link.to} to={link.to} className={TAP_TARGET}>
              {link.label}
            </Link>
          ))}
        </div>
      </div>
    </footer>
  )
}
