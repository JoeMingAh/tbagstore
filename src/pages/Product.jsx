import ProductImagePlaceholder from '../components/ProductImagePlaceholder.jsx'
import SignupSection from '../components/SignupSection.jsx'
import { product } from '../content/copy.js'

// No price or buy button in this ticket: checkout ships later. Product JSON-LD (no offers) is in src/seo.js.
export default function Product() {
  return (
    <>
      <article className="mx-auto grid max-w-5xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <ProductImagePlaceholder />
        <div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">{product.name}</h1>
          <p className="mt-3 text-lg text-stone-600">{product.tagline}</p>
          <p
            className="mt-6 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
            data-testid="product-status"
          >
            {product.status}
          </p>
          <h2 className="mt-8 text-lg font-semibold">Key features</h2>
          <ul className="mt-3 space-y-4">
            {product.features.map((feature) => (
              <li key={feature.title} className="rounded-2xl border border-stone-200 bg-white p-4">
                <h3 className="font-semibold text-brand">{feature.title}</h3>
                <p className="mt-1 text-stone-600">{feature.body}</p>
              </li>
            ))}
          </ul>
        </div>
      </article>
      <SignupSection />
    </>
  )
}
