import { Link } from 'react-router-dom'
import { notFound as copy } from '../content/copy.js'

// The HTTP 404 status comes from the server (vercel.json + dist/404.html); this is the visible page.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="font-mono text-xs font-semibold tracking-[0.25em] text-gold-dark uppercase">{copy.eyebrow}</p>
      <h1 className="mt-2 font-serif text-5xl font-semibold text-forest">{copy.heading}</h1>
      <p className="mt-4 text-charcoal/75">{copy.body}</p>
      <Link
        to="/"
        className="mt-8 inline-flex min-h-11 items-center rounded-lg bg-forest px-6 font-mono text-xs font-bold tracking-widest text-gold uppercase hover:bg-forest-light"
      >
        {copy.cta}
      </Link>
    </section>
  )
}
