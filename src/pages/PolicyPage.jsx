import { DRAFT_NOTE } from '../content/copy.js'

// DRAFT COPY: FAQ, shipping and returns text lives in src/content/copy.js. The draft note stays
// visible until Joe approves the copy; remove it here (one place) once he does.
export default function PolicyPage({ copy }) {
  return (
    <article className="mx-auto max-w-2xl px-4 py-12 sm:px-6 md:py-20">
      <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
      <p
        role="note"
        data-testid="draft-note"
        className="mt-4 inline-block rounded-full bg-amber-100 px-4 py-2 text-sm font-semibold text-amber-900"
      >
        {DRAFT_NOTE}
      </p>
      <div className="mt-8 space-y-8">
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="text-lg font-semibold text-brand">{section.heading}</h2>
            {section.body.map((paragraph) => (
              <p key={paragraph} className="mt-2 break-words text-stone-700">
                {paragraph}
              </p>
            ))}
          </section>
        ))}
      </div>
    </article>
  )
}
