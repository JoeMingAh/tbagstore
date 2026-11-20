import { useId, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Blueprint from '../components/Blueprint.jsx'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import SignupSection from '../components/SignupSection.jsx'
import { pdp as copy } from '../content/copy.js'
import { PRODUCTS, findProduct, priceLabel } from '../content/products.js'
import { SHOP_PATH } from '../routes.js'
import NotFound from './NotFound.jsx'

// No cart or checkout: "Notify me" (SignupSection, #notify) replaces the buy button.
// Product JSON-LD (no price/offers) is in src/seo.js.
function ProductDetail({ product }) {
  const id = useId()
  const [tab, setTab] = useState('photo')
  const price = priceLabel(product)
  const edition = product.serial.split(' OF ')[1]
  const related = PRODUCTS.filter((other) => other.slug !== product.slug).slice(0, 3)

  return (
    <div className="mx-auto max-w-7xl animate-view-fade px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-10 flex flex-wrap items-center justify-between gap-3 border-b border-forest/15 pb-4">
        <Link
          to={SHOP_PATH}
          className="inline-flex min-h-11 items-center gap-2 font-mono text-xs tracking-widest text-forest uppercase transition hover:text-gold-dark"
        >
          <svg className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          <span>{copy.back}</span>
        </Link>
        <span className="font-mono text-xs tracking-widest text-charcoal/70 uppercase">{product.serial}</span>
      </div>

      <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
        <div className="min-w-0 space-y-4 lg:col-span-6">
          <div
            id={`${id}-gallery`}
            role="tabpanel"
            aria-label={copy.tabs.find((item) => item.id === tab).label}
            className="relative h-[360px] overflow-hidden rounded-2xl border border-gold/40 bg-charcoal shadow-2xl sm:h-[500px]"
          >
            {tab === 'photo' && <ProductImage product={product} className="h-full w-full" />}
            {tab === 'blueprint' && (
              <div className="dimple-pattern-dark flex h-full w-full flex-col items-center justify-center bg-forest p-8">
                <Blueprint product={product} />
              </div>
            )}
            {tab === 'macro' && <ProductImage product={product} variant="secondaryImage" className="h-full w-full" />}

            <div className="pointer-events-none absolute top-4 right-4 left-4 flex flex-wrap items-center justify-between gap-2">
              <span className="rounded-full border border-gold/40 bg-charcoal/90 px-3 py-1 font-mono text-xs tracking-wider text-gold uppercase">
                {product.serial}
              </span>
              <span className="rounded-full border border-gold/30 bg-forest/90 px-3 py-1 font-mono text-xs text-cream">
                {copy.editionOf} {edition}
              </span>
            </div>
          </div>

          <div role="tablist" aria-label={copy.galleryLabel} className="grid grid-cols-3 gap-3">
            {copy.tabs.map((item) => {
              const active = item.id === tab
              return (
                <button
                  key={item.id}
                  type="button"
                  role="tab"
                  aria-selected={active}
                  aria-controls={`${id}-gallery`}
                  onClick={() => setTab(item.id)}
                  className={`min-h-11 rounded-xl border px-2 py-3 font-mono text-[10px] tracking-wider uppercase transition sm:px-3 sm:text-xs ${
                    active ? 'border-gold bg-forest font-bold text-gold' : 'border-forest/15 bg-cream-warm text-charcoal hover:border-forest'
                  }`}
                >
                  {item.label}
                </button>
              )
            })}
          </div>
        </div>

        <div className="min-w-0 space-y-6 lg:col-span-6">
          <div>
            <span className="font-mono text-xs font-semibold tracking-[0.2em] text-gold-dark uppercase">{product.category}</span>
            <h1 className="mt-1 font-serif text-4xl font-bold text-forest sm:text-5xl">{product.name}</h1>
            <p className="mt-1 font-mono text-xs tracking-wider text-charcoal/70 uppercase">{product.subtitle}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 border-b border-forest/15 pb-4">
            <span
              data-testid="product-status"
              className="rounded-full border border-gold/60 bg-gold/15 px-4 py-1.5 font-mono text-xs font-semibold tracking-widest text-forest uppercase"
            >
              {product.status}
            </span>
            {price && (
              <span data-testid="price" className="font-serif text-4xl font-bold text-forest">
                {price}
              </span>
            )}
          </div>

          <blockquote className="rounded-xl border-l-4 border-gold bg-cream-warm p-4 font-serif text-xl text-forest italic">
            &ldquo;{product.tagline}&rdquo;
          </blockquote>

          <p className="text-sm leading-relaxed text-charcoal/85 sm:text-base">{product.description}</p>

          <SignupSection heading={copy.notifyHeading} body={copy.notifyBody} />

          <div className="border-t border-forest/15 pt-6">
            <h2 className="mb-3 font-mono text-xs font-bold tracking-[0.2em] text-forest uppercase">{copy.specsHeading}</h2>
            <dl className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {product.specs.map((spec) => (
                <div key={spec.label} className="rounded-xl border border-forest/10 bg-cream-warm p-3.5">
                  <dt className="font-mono text-[10px] font-semibold tracking-wider text-gold-dark uppercase">{spec.label}</dt>
                  <dd className="mt-1 text-xs font-medium text-forest">{spec.value}</dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      </div>

      <section className="mt-24 border-t border-forest/15 pt-14" aria-labelledby={`${id}-related`}>
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="font-mono text-xs font-semibold tracking-[0.22em] text-gold-dark uppercase">{copy.relatedEyebrow}</p>
            <h2 id={`${id}-related`} className="mt-1 font-serif text-3xl font-semibold text-forest sm:text-4xl">
              {copy.relatedHeading}
            </h2>
          </div>
          <Link
            to={SHOP_PATH}
            className="inline-flex min-h-11 items-center font-mono text-xs tracking-widest text-forest uppercase underline hover:text-gold-dark"
          >
            {copy.relatedCta}
          </Link>
        </div>
        <div className="grid grid-cols-1 gap-7 sm:grid-cols-3">
          {related.map((other) => (
            <ProductCard key={other.slug} product={other} />
          ))}
        </div>
      </section>
    </div>
  )
}

export default function Product() {
  const { slug } = useParams()
  const product = findProduct(slug)
  if (!product) return <NotFound />
  // Keyed by slug so the gallery tab and signup form reset when moving between products.
  return <ProductDetail key={product.slug} product={product} />
}
