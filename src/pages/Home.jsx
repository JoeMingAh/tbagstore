import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import ProductImagePlaceholder from '../components/ProductImagePlaceholder.jsx'
import SignupSection from '../components/SignupSection.jsx'
import { home, product } from '../content/copy.js'
import usePageTitle from '../hooks/usePageTitle.js'
import { PRODUCT_PATH } from '../routes.js'

export default function Home() {
  usePageTitle(null)
  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <Logo className="text-5xl text-brand sm:text-6xl" />
          <p className="mt-6 text-sm font-semibold tracking-widest text-green-700 uppercase">{home.eyebrow}</p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{home.headline}</h1>
          <p className="mt-4 text-lg text-stone-600">{home.pitch}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href="#signup" className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-light">
              Get notified at launch
            </a>
            <Link
              to={PRODUCT_PATH}
              className="rounded-full border border-stone-300 px-6 py-3 font-semibold hover:border-brand hover:text-brand"
            >
              {home.cta}
            </Link>
          </div>
        </div>
        <div>
          <ProductImagePlaceholder />
          <p className="mt-3 text-center text-sm text-stone-500">{product.name}</p>
        </div>
      </section>
      <SignupSection />
    </>
  )
}
