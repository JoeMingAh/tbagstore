import { Link } from 'react-router-dom'
import ProductCard from '../components/ProductCard.jsx'
import ProductImage from '../components/ProductImage.jsx'
import { home } from '../content/copy.js'
import { FEATURED_PRODUCTS, findProduct, priceLabel, productPath, slugify } from '../content/products.js'
import { SHOP_PATH } from '../routes.js'

const FLAGSHIP = findProduct(slugify('The First-Tee Sack'))

function Arrow() {
  return (
    <svg className="h-4 w-4 transition-transform group-hover:translate-x-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" aria-hidden="true">
      <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
    </svg>
  )
}

function Hero() {
  const { hero, spotlight } = home
  const price = priceLabel(FLAGSHIP)
  const flagshipHref = productPath(FLAGSHIP.slug)
  return (
    <div className="fairway-stripes relative overflow-hidden border-b border-gold/30 text-cream">
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-gold/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-96 w-96 rounded-full bg-gold/5 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 md:py-24 lg:px-8 lg:py-28">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="space-y-8 lg:col-span-7">
            <div className="inline-flex items-center gap-3 rounded-full border border-gold/40 bg-charcoal/80 px-4 py-1.5">
              <span className="font-mono text-[11px] tracking-[0.22em] text-gold uppercase">{hero.eyebrow}</span>
            </div>

            <h1 className="font-serif text-5xl leading-[1.04] font-normal tracking-tight text-cream sm:text-6xl lg:text-7xl">
              {hero.headline} <br />
              <span className="font-normal text-gold italic">{hero.headlineAccent}</span>
            </h1>

            <p className="max-w-2xl text-base leading-relaxed text-cream/80 sm:text-lg">{hero.pitch}</p>

            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to={SHOP_PATH}
                className="group flex items-center gap-3 rounded-lg bg-gold px-8 py-4 font-mono text-xs font-bold tracking-[0.2em] text-forest uppercase shadow-lg transition hover:bg-gold-light"
              >
                <span>{hero.primaryCta}</span>
                <Arrow />
              </Link>
              <Link
                to="/club"
                className="rounded-lg border border-gold/50 bg-transparent px-8 py-4 font-mono text-xs font-semibold tracking-[0.2em] text-cream uppercase transition hover:border-gold hover:bg-gold/10"
              >
                {hero.secondaryCta}
              </Link>
            </div>

            <dl className="grid max-w-xl grid-cols-3 gap-4 border-t border-gold/20 pt-6">
              {hero.metrics.map((metric) => (
                <div key={metric.label}>
                  <dt className="font-mono text-xs tracking-wider text-gold uppercase">{metric.label}</dt>
                  <dd className="mt-0.5 font-serif text-xl text-cream">{metric.value}</dd>
                </div>
              ))}
            </dl>
          </div>

          <div className="lg:col-span-5">
            <div className="saddle-card leather-stitch group relative rounded-2xl border border-gold/30 p-6 sm:p-8">
              <div className="mb-4 flex items-center justify-between gap-2">
                <span className="rounded border border-gold/30 bg-gold/10 px-3 py-1 font-mono text-[11px] tracking-widest text-gold uppercase">
                  {spotlight.badge}
                </span>
                {price ? (
                  <span data-testid="price" className="font-mono text-sm text-cream/80">
                    {price}
                  </span>
                ) : (
                  <span data-testid="product-status" className="font-mono text-[11px] tracking-widest text-cream/80 uppercase">
                    {FLAGSHIP.status}
                  </span>
                )}
              </div>

              <Link
                to={flagshipHref}
                className="relative block h-72 overflow-hidden rounded-xl border border-gold/20 bg-charcoal sm:h-80"
              >
                <ProductImage product={FLAGSHIP} className="h-full w-full opacity-85 transition duration-700 group-hover:scale-105" compact />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/20 to-transparent" />
                <div className="absolute right-4 bottom-4 left-4 flex items-end justify-between gap-2">
                  <div>
                    <p className="font-mono text-[10px] tracking-[0.2em] text-gold uppercase">{FLAGSHIP.category}</p>
                    <h2 className="font-serif text-2xl font-semibold text-cream sm:text-3xl">{FLAGSHIP.name}</h2>
                  </div>
                  <span className="shrink-0 rounded-lg bg-gold px-3 py-1.5 font-mono text-[10px] font-bold tracking-wider text-forest uppercase">
                    {spotlight.inspect}
                  </span>
                </div>
              </Link>

              <p className="mt-4 font-serif text-lg text-cream/80 italic">&ldquo;{FLAGSHIP.tagline}&rdquo;</p>

              <Link
                to={`${flagshipHref}#notify`}
                className="relative z-10 mt-5 flex min-h-11 w-full items-center justify-center rounded-lg bg-cream font-mono text-xs font-bold tracking-widest text-forest uppercase transition hover:bg-gold"
              >
                {spotlight.notify}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Marquee() {
  // Rendered twice for a seamless loop; the copy is hidden from screen readers.
  const items = [...home.marquee, ...home.marquee]
  return (
    <div className="overflow-hidden border-b border-gold/30 bg-charcoal py-3.5 select-none">
      <p className="sr-only">{home.marquee.join('. ')}</p>
      <div className="marquee-track flex w-max animate-marquee font-mono text-xs tracking-[0.25em] text-gold uppercase" aria-hidden="true">
        {items.map((item, index) => (
          <span key={index} className="mx-6 whitespace-nowrap">
            ✦ {item}
          </span>
        ))}
      </div>
    </div>
  )
}

function Featured() {
  const { featured } = home
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
        <div>
          <p className="font-mono text-xs font-semibold tracking-[0.25em] text-gold-dark uppercase">{featured.eyebrow}</p>
          <h2 className="mt-2 font-serif text-4xl font-semibold text-forest sm:text-5xl">{featured.heading}</h2>
        </div>
        <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
          <p className="max-w-md text-sm text-charcoal/70">{featured.body}</p>
          <Link
            to={SHOP_PATH}
            className="shrink-0 rounded-lg border border-forest px-5 py-3 font-mono text-xs font-semibold tracking-widest text-forest uppercase transition hover:bg-forest hover:text-cream"
          >
            {featured.cta}
          </Link>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-7 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURED_PRODUCTS.map((product) => (
          <ProductCard key={product.slug} product={product} />
        ))}
      </div>
    </div>
  )
}

function EthosTeaser() {
  const { lexicon, ethos } = home
  return (
    <div className="fairway-stripes border-y border-gold/30 py-20 text-cream">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <div className="saddle-card leather-stitch space-y-6 rounded-2xl border border-gold/30 p-8">
              <div className="flex items-center justify-between gap-2 border-b border-gold/20 pb-4">
                <span className="font-mono text-xs tracking-widest text-gold uppercase">{lexicon.entry}</span>
                <span className="font-mono text-xs text-cream/50">{lexicon.tag}</span>
              </div>
              <h3 className="font-serif text-4xl text-gold italic">
                {lexicon.word} <span className="font-mono text-lg text-cream/60 not-italic">{lexicon.pronunciation}</span>
              </h3>
              <ol className="list-inside list-decimal space-y-4 text-sm leading-relaxed text-cream/85">
                {lexicon.definitions.map((definition) => (
                  <li key={definition}>{definition}</li>
                ))}
              </ol>
              <div className="flex items-center justify-between gap-2 border-t border-gold/20 pt-4 font-mono text-xs text-gold">
                <span>{lexicon.mottoLabel}</span>
                <span>{lexicon.motto}</span>
              </div>
            </div>
          </div>

          <div className="space-y-6 lg:col-span-7">
            <span className="font-mono text-xs tracking-[0.25em] text-gold uppercase">{ethos.eyebrow}</span>
            <h2 className="font-serif text-4xl leading-tight text-cream sm:text-5xl">
              {ethos.heading} <br />
              <span className="text-gold italic">{ethos.headingAccent}</span>
            </h2>
            {ethos.paragraphs.map((paragraph) => (
              <p key={paragraph} className="text-base leading-relaxed text-cream/80 sm:text-lg">
                {paragraph}
              </p>
            ))}
            <p className="text-base leading-relaxed text-cream/80 sm:text-lg">
              <strong className="font-semibold text-cream">{ethos.foundedName}</strong> {ethos.founded}
            </p>
            <div className="flex flex-wrap gap-4 pt-4">
              <Link
                to="/about"
                className="rounded-lg bg-gold px-7 py-3.5 font-mono text-xs font-bold tracking-widest text-forest uppercase transition hover:bg-gold-light"
              >
                {ethos.primaryCta}
              </Link>
              <Link
                to="/club"
                className="rounded-lg border border-gold/40 px-7 py-3.5 font-mono text-xs tracking-widest text-cream uppercase transition hover:border-gold"
              >
                {ethos.secondaryCta}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function Pillars() {
  const { pillars } = home
  return (
    <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
      <div className="mx-auto mb-14 max-w-3xl text-center">
        <p className="font-mono text-xs font-semibold tracking-[0.25em] text-gold-dark uppercase">{pillars.eyebrow}</p>
        <h2 className="mt-2 font-serif text-4xl font-semibold text-forest sm:text-5xl">{pillars.heading}</h2>
      </div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {pillars.items.map((pillar, index) => (
          <div key={pillar.title} className="dimple-pattern rounded-2xl border border-forest/15 bg-cream-warm p-8 transition hover:border-gold">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-xl bg-forest font-mono text-sm font-bold text-gold">
              {String(index + 1).padStart(2, '0')}
            </div>
            <h3 className="mb-3 font-serif text-2xl font-bold text-forest">{pillar.title}</h3>
            <p className="text-sm leading-relaxed text-charcoal/80">{pillar.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default function Home() {
  return (
    <div className="animate-view-fade">
      <Hero />
      <Marquee />
      <Featured />
      <EthosTeaser />
      <Pillars />
    </div>
  )
}
