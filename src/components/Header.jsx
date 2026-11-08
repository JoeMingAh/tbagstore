import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import { PRODUCT_PATH } from '../routes.js'

export default function Header() {
  return (
    <header className="sticky top-0 z-20 border-b border-gold bg-cream">
      <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link to="/" className="text-2xl text-ink" aria-label="tbagstore home">
          <Logo />
        </Link>
        <nav aria-label="Main" className="flex items-center gap-4 text-sm font-medium">
          <Link to={PRODUCT_PATH} className="hover:underline">
            Towel
          </Link>
          <a
            href="/#signup"
            className="rounded-full border-2 border-ink bg-accent px-3.5 py-1.5 font-semibold text-ink hover:bg-accent-hover"
          >
            Get notified
          </a>
        </nav>
      </div>
    </header>
  )
}
