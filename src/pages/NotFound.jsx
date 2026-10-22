import { Link } from 'react-router-dom'
import usePageTitle from '../hooks/usePageTitle.js'

// The HTTP 404 status comes from the server (vercel.json + dist/404.html); this is the visible page.
export default function NotFound() {
  usePageTitle('Page not found')
  return (
    <section className="mx-auto max-w-2xl px-4 py-20 text-center sm:px-6">
      <p className="text-sm font-semibold tracking-widest text-green-700 uppercase">404</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="mt-4 text-stone-600">That page is out of bounds. Let&rsquo;s get you back to the fairway.</p>
      <Link to="/" className="mt-8 inline-block rounded-full bg-brand px-6 py-3 font-semibold text-white">
        Back to home
      </Link>
    </section>
  )
}
