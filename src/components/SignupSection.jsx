import SignupForm from './SignupForm.jsx'
import { signup as copy } from '../content/copy.js'

// "Notify me" card (product pages). Posts to /api/subscribe like every signup form on the site.
export default function SignupSection({ id = 'notify', heading = copy.heading, body = copy.body }) {
  const headingId = `${id}-heading`
  return (
    <section
      id={id}
      aria-labelledby={headingId}
      className="leather-stitch scroll-mt-28 rounded-2xl border border-gold/30 bg-forest p-6 text-cream sm:p-8"
    >
      <h2 id={headingId} className="font-serif text-3xl font-semibold text-cream">
        {heading}
      </h2>
      <p className="mt-2 text-sm text-cream/80">{body}</p>
      <div className="relative z-10 mt-6">
        <SignupForm variant="dark" />
      </div>
    </section>
  )
}
