import { Link } from 'react-router-dom'

// The HTTP 404 status comes from the server (vercel.json + dist/404.html); this is the visible page.
export default function NotFound() {
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="inline-block rounded-full bg-forest px-3 py-1 text-sm font-semibold tracking-widest text-cream uppercase">
        404
      </p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4">That page is out of bounds. Let&rsquo;s get you back to the fairway.</p>
      <Link
        to="/"
        className="mt-8 inline-block rounded-full border-2 border-ink bg-accent px-5 py-2.5 font-semibold text-ink hover:bg-accent-hover"
      >
        Back to home
      </Link>
    </section>
  )
}
