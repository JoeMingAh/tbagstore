import { useId, useMemo, useState } from 'react'
import ProductCard from '../components/ProductCard.jsx'
import { shop as copy } from '../content/copy.js'
import { CATEGORIES, PRODUCTS } from '../content/products.js'
import { filterProducts } from '../lib/shop.js'

const PILLS = [copy.allLabel, ...CATEGORIES].map((label) => ({
  label,
  count: label === copy.allLabel ? PRODUCTS.length : PRODUCTS.filter((product) => product.category === label).length,
}))

export default function Shop() {
  const id = useId()
  const [category, setCategory] = useState(copy.allLabel)
  const [search, setSearch] = useState('')
  const products = useMemo(() => filterProducts(PRODUCTS, { category, search }), [category, search])

  function reset() {
    setSearch('')
    setCategory(copy.allLabel)
  }

  return (
    <div className="animate-view-fade">
      <div className="fairway-stripes border-b border-gold/30 py-14 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="font-mono text-xs tracking-[0.25em] text-gold uppercase">{copy.eyebrow}</p>
              <h1 className="mt-2 font-serif text-4xl text-cream sm:text-6xl">{copy.heading}</h1>
            </div>
            <p className="max-w-md text-sm text-cream/80">{copy.body}</p>
          </div>
        </div>
      </div>

      <div className="sticky top-20 z-30 border-b border-forest/15 bg-cream/95 py-4 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-col items-stretch justify-between gap-4 px-4 sm:px-6 lg:flex-row lg:items-center lg:px-8">
          <div role="group" aria-label={copy.filterLabel} className="flex items-center gap-2 overflow-x-auto pb-1 lg:pb-0">
            {PILLS.map((pill) => {
              const active = pill.label === category
              return (
                <button
                  key={pill.label}
                  type="button"
                  onClick={() => setCategory(pill.label)}
                  aria-pressed={active}
                  className={`min-h-11 shrink-0 rounded-lg px-4 font-mono text-xs tracking-wider uppercase transition ${
                    active ? 'bg-forest font-semibold text-gold' : 'bg-cream-warm text-charcoal hover:bg-forest/10'
                  }`}
                >
                  {pill.label} ({pill.count})
                </button>
              )
            })}
          </div>

          <div className="relative min-w-0 sm:w-64">
            <label htmlFor={`${id}-search`} className="sr-only">
              {copy.searchLabel}
            </label>
            <input
              id={`${id}-search`}
              type="search"
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={copy.searchPlaceholder}
              className="min-h-11 w-full rounded-lg border border-forest/20 bg-cream-warm pr-3 pl-9 font-mono text-xs text-charcoal placeholder:text-charcoal/60 focus:border-forest focus:outline-none"
            />
            <svg className="absolute top-3.5 left-3 h-4 w-4 text-charcoal/60" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        {products.length === 0 ? (
          <div className="rounded-2xl border border-forest/15 bg-cream-warm p-8 py-16 text-center">
            <p className="font-serif text-3xl text-forest">{copy.emptyHeading}</p>
            <p className="mt-2 text-sm text-charcoal/75">{copy.emptyBody}</p>
            <button
              type="button"
              onClick={reset}
              className="mt-5 min-h-11 rounded-lg bg-forest px-6 font-mono text-xs tracking-widest text-gold uppercase"
            >
              {copy.reset}
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.slug} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
