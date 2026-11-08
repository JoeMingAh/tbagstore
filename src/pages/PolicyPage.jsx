import { DRAFT_NOTE } from '../content/copy.js'

// DRAFT COPY: FAQ, shipping and returns text lives in src/content/copy.js. The draft note stays
// visible until Joe approves the copy; remove it here (one place) once he does.
export default function PolicyPage({ copy }) {
  return (
    <article className="pb-12 md:pb-20">
      <header className="mx-auto max-w-2xl px-4 pt-12 pb-8 sm:px-6 md:pt-20">
        <h1 className="text-3xl font-bold tracking-tight">{copy.title}</h1>
        <p
          role="note"
          data-testid="draft-note"
          className="mt-4 inline-block rounded-full bg-forest px-4 py-2 text-sm font-semibold text-cream"
        >
          {DRAFT_NOTE}
        </p>
      </header>
      <div>
        {copy.sections.map((section) => (
          <section key={section.heading}>
            <h2 className="border-b border-gold bg-ink py-3 text-lg font-semibold text-cream">
              <span className="mx-auto block max-w-2xl px-4 sm:px-6">{section.heading}</span>
            </h2>
            <div className="mx-auto max-w-2xl space-y-2 px-4 py-5 sm:px-6">
              {section.body.map((paragraph) => (
                <p key={paragraph} className="break-words">
                  {paragraph}
                </p>
              ))}
            </div>
          </section>
        ))}
      </div>
    </article>
  )
}
