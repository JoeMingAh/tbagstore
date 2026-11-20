import { Link } from 'react-router-dom'
import { productCard as copy } from '../content/copy.js'
import { priceLabel, productPath } from '../content/products.js'
import ProductImage from './ProductImage.jsx'

// No cart: the card links to the product page, and "Notify me" jumps to its signup form.
export default function ProductCard({ product }) {
  const href = productPath(product.slug)
  const price = priceLabel(product)
  return (
    <article
      data-testid="product-card"
      className="group dimple-pattern flex flex-col overflow-hidden rounded-2xl border border-forest/15 bg-cream-warm shadow-sm transition-all duration-300 hover:border-gold hover:shadow-xl"
    >
      {/* Same destination as the title link, so it's skipped by keyboard and screen readers. */}
      <Link to={href} tabIndex={-1} aria-hidden="true" className="relative block h-64 overflow-hidden bg-charcoal">
        <ProductImage product={product} className="h-full w-full transition duration-700 group-hover:scale-105" compact />
        <div className="absolute inset-0 bg-gradient-to-t from-charcoal/80 via-transparent to-transparent" />
        <div className="absolute top-3 right-3 left-3 flex items-center justify-between gap-2">
          <span className="rounded border border-gold/40 bg-charcoal/90 px-2.5 py-1 font-mono text-[10px] tracking-wider text-gold uppercase">
            {product.serial}
          </span>
          {price && (
            <span data-testid="price" className="rounded border border-gold/30 bg-forest/90 px-2.5 py-1 font-mono text-xs font-bold text-cream">
              {price}
            </span>
          )}
        </div>
        <div className="absolute right-3 bottom-3 left-3 flex items-center justify-between gap-2">
          <span className="rounded bg-charcoal/85 px-2.5 py-1 font-mono text-[10px] tracking-widest text-gold uppercase">
            {product.category}
          </span>
          <span className="rounded bg-gold px-2.5 py-1 font-mono text-[10px] font-bold text-forest uppercase opacity-0 transition group-hover:opacity-100">
            {copy.inspect}
          </span>
        </div>
      </Link>

      <div className="flex flex-grow flex-col justify-between space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-serif text-2xl font-bold text-forest transition group-hover:text-gold-dark">
              <Link to={href}>{product.name}</Link>
            </h3>
            <span
              data-testid="product-status"
              className="mt-1 shrink-0 rounded-full border border-gold/60 bg-gold/15 px-2.5 py-0.5 font-mono text-[10px] font-semibold tracking-wider text-forest uppercase"
            >
              {product.status}
            </span>
          </div>
          <p className="mt-0.5 font-mono text-xs tracking-wider text-charcoal/70 uppercase">{product.subtitle}</p>
          <p className="mt-3 line-clamp-2 font-serif text-sm text-charcoal/85 italic">&ldquo;{product.tagline}&rdquo;</p>
        </div>

        <div className="flex items-center gap-2 border-t border-forest/10 pt-3">
          <Link
            to={`${href}#notify`}
            aria-label={`Notify me when ${product.name} is available`}
            className="inline-flex min-h-11 flex-grow items-center justify-center rounded-lg bg-forest px-4 font-mono text-[11px] font-bold tracking-widest text-cream uppercase transition hover:bg-gold hover:text-forest"
          >
            {copy.notify}
          </Link>
          <Link
            to={href}
            aria-label={`View details for ${product.name}`}
            className="inline-flex min-h-11 items-center rounded-lg border border-forest/25 px-3 font-mono text-[11px] font-semibold tracking-widest text-forest uppercase transition hover:border-forest hover:bg-forest/5"
          >
            {copy.details}
          </Link>
        </div>
      </div>
    </article>
  )
}
