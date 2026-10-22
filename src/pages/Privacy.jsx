import { CONTACT_EMAIL } from '../content/copy.js'
import usePageTitle from '../hooks/usePageTitle.js'

// STUB / DRAFT COPY: placeholder privacy notice pending Joe's approval. Needs a real policy reviewed before checkout launches.
export default function Privacy() {
  usePageTitle('Privacy')
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight">Privacy</h1>
      <p className="mt-2 text-sm text-stone-500">This page is a placeholder and will be updated before launch.</p>
      <div className="mt-6 space-y-4 text-stone-700">
        <p>
          If you sign up to be notified at launch, we store your email address only to tell you when tbagstore
          products are available. We don&rsquo;t sell or share it.
        </p>
        <p>
          To have your email removed, contact us at{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-brand underline">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </article>
  )
}
