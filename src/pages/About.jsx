import { about } from '../content/copy.js'

export default function About() {
  const { rules, essay, table } = about
  return (
    <div className="animate-view-fade">
      <div className="fairway-stripes border-b border-gold/30 py-20 text-cream">
        <div className="mx-auto max-w-4xl space-y-6 px-4 text-center sm:px-6 lg:px-8">
          <span className="inline-block rounded-full border border-gold/40 bg-gold/15 px-4 py-1 font-mono text-xs tracking-[0.25em] text-gold uppercase">
            {about.badge}
          </span>
          <h1 className="font-serif text-5xl leading-none font-normal text-cream sm:text-7xl">{about.heading}</h1>
          <p className="mx-auto max-w-2xl font-serif text-2xl text-gold italic sm:text-3xl">{about.quote}</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-10 md:grid-cols-12">
          <div className="leather-stitch rounded-2xl border border-gold/30 bg-forest p-7 text-cream md:col-span-4">
            <p className="mb-2 font-mono text-xs tracking-widest text-gold uppercase">{rules.eyebrow}</p>
            <h2 className="mb-4 font-serif text-3xl text-cream">{rules.heading}</h2>
            <ul className="space-y-4 font-mono text-xs leading-relaxed text-cream/85">
              {rules.items.map((rule, index) => (
                <li key={rule.title} className={index < rules.items.length - 1 ? 'border-b border-gold/20 pb-3' : ''}>
                  <span className="mb-1 block font-bold text-gold">{rule.title}</span>
                  {rule.body}
                </li>
              ))}
            </ul>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-charcoal/90 sm:text-lg md:col-span-8">
            <h2 className="font-serif text-3xl font-semibold text-forest sm:text-4xl">{essay.heading}</h2>
            <p>{essay.intro}</p>
            <p>
              {essay.builtBefore} <strong className="text-forest">{essay.builtName}</strong> {essay.builtAfter}
            </p>
            <blockquote className="rounded-xl border-l-4 border-gold bg-cream-warm p-6 font-serif text-2xl text-forest italic">
              {essay.pullQuote}
            </blockquote>
            <p>{essay.closing}</p>
          </div>
        </div>

        <div className="mt-20">
          <div className="mb-10 text-center">
            <p className="font-mono text-xs font-semibold tracking-[0.25em] text-gold-dark uppercase">{table.eyebrow}</p>
            <h2 className="mt-1 font-serif text-4xl font-semibold text-forest sm:text-5xl">{table.heading}</h2>
          </div>

          {/* Scrolls inside its own box on phones so the page itself never scrolls sideways. */}
          <div className="overflow-x-auto rounded-2xl border border-forest/20 shadow-xl" tabIndex={0} aria-label={table.heading}>
            <table className="w-full min-w-[640px] border-collapse text-left">
              <thead>
                <tr className="border-b border-gold/30 bg-forest text-cream">
                  <th scope="col" className="p-5 font-mono text-xs tracking-widest text-gold uppercase">
                    {table.columns[0]}
                  </th>
                  <th scope="col" className="border-x border-gold/25 bg-forest-light p-5 font-serif text-2xl text-gold">
                    {table.columns[1]}
                  </th>
                  <th scope="col" className="p-5 font-serif text-xl text-cream/70">
                    {table.columns[2]}
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-forest/10 bg-cream-warm text-sm">
                {table.rows.map(([spec, reserve, standard]) => (
                  <tr key={spec}>
                    <th scope="row" className="p-5 font-mono text-xs font-semibold text-forest uppercase">
                      {spec}
                    </th>
                    <td className="border-x border-gold/25 bg-gold/10 p-5 font-medium text-forest">{reserve}</td>
                    <td className="p-5 text-charcoal/70">{standard}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}
