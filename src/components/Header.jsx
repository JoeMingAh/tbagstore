import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import { BRAND_NAME } from '../brand/brand.js'
import { announcement, header, nav } from '../content/copy.js'

const NOTIFY_HREF = '#footer-signup'

function AnnouncementBar() {
  return (
    <div className="relative z-40 border-b border-gold/25 bg-charcoal px-4 py-2 text-center text-cream">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2 font-mono text-[11px] tracking-widest uppercase">
        <span className="hidden items-center gap-2 text-gold md:inline-flex">
          <span className="h-2 w-2 animate-pulse rounded-full bg-gold" aria-hidden="true" />
          {announcement.left}
        </span>
        <span className="mx-auto text-cream/90 md:mx-0">
          {announcement.middle}{' '}
          <a href={NOTIFY_HREF} className="font-semibold text-gold underline hover:text-gold-light">
            {announcement.middleCta}
          </a>
        </span>
        <span className="hidden text-cream/70 lg:inline">{announcement.right}</span>
      </div>
    </div>
  )
}

function navClass({ isActive }) {
  return `inline-flex min-h-11 items-center border-b-2 font-mono text-[11px] tracking-[0.12em] whitespace-nowrap uppercase transition ${
    isActive ? 'border-gold text-gold hover:text-gold-light' : 'border-transparent text-cream/80 hover:text-gold'
  }`
}

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <AnnouncementBar />
      <header className="sticky top-0 z-40 border-b border-gold/25 bg-forest/95 text-cream backdrop-blur-md">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid h-20 grid-cols-[2.75rem_1fr_2.75rem] items-center gap-2 xl:grid-cols-[1fr_auto_1fr]">
            <nav aria-label="Main" className="hidden items-center gap-4 xl:flex xl:gap-5">
              {nav.map((item) => (
                <NavLink key={item.to} to={item.to} end={item.to === '/'} className={navClass}>
                  {item.label}
                </NavLink>
              ))}
            </nav>

            <button
              type="button"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={header.menu}
              aria-expanded={menuOpen}
              aria-controls="mobile-menu"
              className="inline-flex h-11 w-11 items-center justify-center rounded-lg border border-gold/20 text-cream hover:text-gold xl:hidden"
            >
              <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>

            <Link to="/" onClick={closeMenu} className="group inline-flex min-h-11 min-w-0 items-center justify-self-center text-center" aria-label={`${BRAND_NAME} home`}>
              <Logo motto />
            </Link>

            <div className="flex items-center justify-end">
              <a
                href={NOTIFY_HREF}
                className="hidden min-h-11 items-center gap-2 rounded-lg bg-gold px-4 font-mono text-xs font-semibold tracking-widest text-forest uppercase shadow-md transition hover:bg-gold-light xl:inline-flex"
              >
                <span className="h-1.5 w-1.5 rounded-full bg-forest" aria-hidden="true" />
                {header.notify}
              </a>
            </div>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-menu" aria-label="Mobile" className="border-b border-gold/30 bg-charcoal px-6 py-3 xl:hidden">
            {nav.map((item, index) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                onClick={closeMenu}
                className={({ isActive }) =>
                  `flex min-h-11 w-full items-center font-mono text-xs tracking-widest uppercase ${
                    index < nav.length - 1 ? 'border-b border-white/5' : ''
                  } ${isActive ? 'text-gold' : 'text-cream/90 hover:text-gold'}`
                }
              >
                {item.mobileLabel}
              </NavLink>
            ))}
          </nav>
        )}
      </header>
    </>
  )
}
