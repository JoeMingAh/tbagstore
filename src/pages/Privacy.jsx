import { CONTACT_EMAIL, privacy } from '../content/copy.js'

// STUB / DRAFT COPY: placeholder privacy notice pending Joe's approval. Needs a real policy reviewed before checkout launches.
export default function Privacy() {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-20">
      <h1 className="font-serif text-5xl font-semibold text-forest">{privacy.title}</h1>
      <p className="mt-2 text-sm text-charcoal/60">{privacy.placeholderNote}</p>
      <div className="mt-6 space-y-4 text-charcoal/85">
        <p>{privacy.email}</p>
        <p data-testid="privacy-club">{privacy.club}</p>
        <p data-testid="privacy-analytics">{privacy.analytics}</p>
        <p className="break-words">
          {privacy.removal}{' '}
          <a href={`mailto:${CONTACT_EMAIL}`} className="text-forest underline hover:text-gold-dark">
            {CONTACT_EMAIL}
          </a>
          .
        </p>
      </div>
    </article>
  )
}
