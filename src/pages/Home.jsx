import { Link } from 'react-router-dom'
import Logo from '../brand/Logo.jsx'
import ProductImagePlaceholder from '../components/ProductImagePlaceholder.jsx'
import SignupSection from '../components/SignupSection.jsx'
import { home, product } from '../content/copy.js'
import { PRODUCT_PATH } from '../routes.js'

export default function Home() {
  return (
    <>
      <section className="mx-auto grid max-w-5xl items-center gap-10 px-4 py-12 sm:px-6 md:grid-cols-2 md:py-20">
        <div>
          <Logo className="text-5xl text-ink sm:text-6xl" />
          <p className="mt-6 w-fit rounded-full bg-forest px-3 py-1 text-sm font-semibold tracking-widest text-cream uppercase">
            {home.eyebrow}
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">{home.headline}</h1>
          <p className="mt-4 text-lg">{home.pitch}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a
              href="#signup"
              className="btn-primary px-5 py-2.5"
            >
              Get notified at launch
            </a>
            <Link
              to={PRODUCT_PATH}
              className="btn-secondary px-5 py-2.5"
            >
              {home.cta}
            </Link>
          </div>
        </div>
        <div>
          <ProductImagePlaceholder />
          <p className="mt-3 text-center text-sm">{product.name}</p>
        </div>
      </section>
      <SignupSection />
    </>
  )
}
