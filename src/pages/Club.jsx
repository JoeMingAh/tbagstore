import { useId, useState } from 'react'
import { club as copy, signup } from '../content/copy.js'
import useHydrated from '../hooks/useHydrated.js'
import { isValidEmail } from '../lib/email.js'
import { sandbaggerTier } from '../lib/handicap.js'
import { subscribe } from '../lib/subscribe.js'

const INPUT =
  'w-full rounded-lg border border-forest/25 bg-cream px-4 py-3 text-sm font-medium text-forest placeholder:text-charcoal/70 focus:border-gold focus:outline-none'
const LABEL = 'mb-2 block font-mono text-xs tracking-wider text-forest uppercase'

function MemberCard({ name, course, official, negotiated, tier, serial }) {
  const { card } = copy
  return (
    <div
      data-testid="member-card"
      className="saddle-card leather-stitch relative overflow-hidden rounded-2xl border border-gold/50 p-7 text-cream shadow-2xl"
    >
      <div className="pointer-events-none absolute -right-12 -bottom-12 h-48 w-48 rounded-full bg-gold/10 blur-2xl" />
      <div className="flex items-start justify-between gap-2 border-b border-gold/25 pb-4">
        <div>
          <p className="font-serif text-2xl font-bold tracking-[0.18em] text-cream">{card.wordmark}</p>
          <p className="font-mono text-[9px] tracking-[0.28em] text-gold uppercase">{card.club}</p>
        </div>
        <div className="text-right">
          <span className="block font-mono text-xs text-gold">{serial}</span>
          <span className="font-mono text-[10px] text-cream/50">{card.valid}</span>
        </div>
      </div>
      <div className="my-6 space-y-3">
        <div>
          <p className="font-mono text-[9px] tracking-widest text-cream/50 uppercase">{card.memberLabel}</p>
          <p className="truncate font-serif text-3xl font-semibold tracking-wide text-cream" data-testid="card-name">
            {name || card.defaultName}
          </p>
        </div>
        <div className="grid grid-cols-2 gap-4 pt-2">
          <div className="min-w-0">
            <p className="font-mono text-[9px] tracking-widest text-cream/50 uppercase">{card.courseLabel}</p>
            <p className="truncate font-mono text-xs text-gold">{course || card.defaultCourse}</p>
          </div>
          <div>
            <p className="font-mono text-[9px] tracking-widest text-cream/50 uppercase">{card.hcpLabel}</p>
            <p className="font-mono text-xs text-gold">
              {official.toFixed(1)} GHIN // {negotiated.toFixed(1)} TEE
            </p>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-between gap-2 border-t border-gold/25 pt-4">
        <div>
          <span className="block font-mono text-[9px] tracking-widest text-cream/50 uppercase">{card.tierLabel}</span>
          <span className="font-mono text-xs font-bold tracking-wider text-gold uppercase" data-testid="card-tier">
            {tier}
          </span>
        </div>
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-gold/50 bg-forest font-serif text-sm font-bold text-gold">
          {card.monogram}
        </div>
      </div>
    </div>
  )
}

export default function Club() {
  const id = useId()
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [course, setCourse] = useState('')
  const [drink, setDrink] = useState(copy.drinks[0])
  const [official, setOfficial] = useState(6.5)
  const [negotiated, setNegotiated] = useState(13)
  const [serial, setSerial] = useState(copy.card.serial)
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [error, setError] = useState('')
  const hydrated = useHydrated()
  const { tier, diagnosis } = sandbaggerTier(official, negotiated)

  async function handleSubmit(event) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setError(signup.invalid)
      return
    }
    setError('')
    setStatus('submitting')
    // Only the email leaves the browser; name, club, drink and handicaps just drive the card preview.
    const result = await subscribe(email, company)
    if (!result.ok) {
      setError(result.error)
      setStatus('idle')
      return
    }
    setSerial(`${copy.card.serialPrefix}${Math.floor(1000 + Math.random() * 8999)}`)
    setStatus('success')
  }

  const errorId = `${id}-error`
  return (
    <div className="animate-view-fade">
      <div className="fairway-stripes border-b border-gold/30 py-16 text-cream">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <span className="font-mono text-xs tracking-[0.25em] text-gold uppercase">{copy.eyebrow}</span>
            <h1 className="mt-2 font-serif text-4xl text-cream sm:text-6xl">{copy.heading}</h1>
            <p className="mt-3 text-base text-cream/80 sm:text-lg">{copy.body}</p>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12">
          <div className="rounded-2xl border border-forest/15 bg-cream-warm p-6 shadow-sm sm:p-10 lg:col-span-7">
            <h2 className="mb-2 font-serif text-3xl font-semibold text-forest">{copy.formHeading}</h2>
            <p className="mb-8 font-mono text-xs tracking-wider text-charcoal/70 uppercase">{copy.formNote}</p>

            <form onSubmit={handleSubmit} noValidate className="relative" aria-label={copy.formLabel}>
              {/* Locked until hydrated (src/hooks/useHydrated.js): nothing typed early gets wiped, no native submit. */}
              <fieldset disabled={!hydrated} className="min-w-0 space-y-6">
                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-name`} className={LABEL}>
                      {copy.fields.name}
                    </label>
                    <input
                      id={`${id}-name`}
                      type="text"
                      autoComplete="name"
                      value={name}
                      onChange={(event) => setName(event.target.value)}
                      placeholder={copy.fields.namePlaceholder}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${id}-email`} className={LABEL}>
                      {copy.fields.email}
                    </label>
                    <input
                      id={`${id}-email`}
                      type="email"
                      autoComplete="email"
                      required
                      value={email}
                      onChange={(event) => setEmail(event.target.value)}
                      placeholder={copy.fields.emailPlaceholder}
                      aria-invalid={error ? 'true' : 'false'}
                      aria-describedby={error ? errorId : undefined}
                      className={INPUT}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                  <div>
                    <label htmlFor={`${id}-course`} className={LABEL}>
                      {copy.fields.course}
                    </label>
                    <input
                      id={`${id}-course`}
                      type="text"
                      value={course}
                      onChange={(event) => setCourse(event.target.value)}
                      placeholder={copy.fields.coursePlaceholder}
                      className={INPUT}
                    />
                  </div>
                  <div>
                    <label htmlFor={`${id}-drink`} className={LABEL}>
                      {copy.fields.drink}
                    </label>
                    <select id={`${id}-drink`} value={drink} onChange={(event) => setDrink(event.target.value)} className={INPUT}>
                      {copy.drinks.map((option) => (
                        <option key={option} value={option}>
                          {option}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="space-y-6 rounded-xl border border-gold/40 bg-forest p-6 text-cream">
                  <div className="flex flex-wrap items-center justify-between gap-2 border-b border-gold/20 pb-3">
                    <span className="font-mono text-xs tracking-widest text-gold uppercase">{copy.calibrator}</span>
                    <span className="rounded bg-gold px-2.5 py-0.5 font-mono text-[10px] font-bold text-forest uppercase" data-testid="tier-pill">
                      {tier}
                    </span>
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between gap-3 font-mono text-xs">
                      <label htmlFor={`${id}-official`} className="text-cream/80 uppercase">
                        {copy.official}
                      </label>
                      <span className="shrink-0 text-sm font-bold text-gold">
                        {official.toFixed(1)} {copy.indexUnit}
                      </span>
                    </div>
                    <input
                      id={`${id}-official`}
                      type="range"
                      min="0"
                      max="28"
                      step="0.5"
                      value={official}
                      onChange={(event) => setOfficial(Number(event.target.value))}
                      className="club-slider"
                    />
                  </div>

                  <div>
                    <div className="mb-2 flex justify-between gap-3 font-mono text-xs">
                      <label htmlFor={`${id}-negotiated`} className="text-cream/80 uppercase">
                        {copy.negotiated}
                      </label>
                      <span className="shrink-0 text-sm font-bold text-gold">
                        {negotiated.toFixed(1)} {copy.indexUnit}
                      </span>
                    </div>
                    <input
                      id={`${id}-negotiated`}
                      type="range"
                      min="0"
                      max="36"
                      step="0.5"
                      value={negotiated}
                      onChange={(event) => setNegotiated(Number(event.target.value))}
                      className="club-slider"
                    />
                  </div>

                  <div className="rounded-lg border border-gold/25 bg-charcoal/90 p-3.5">
                    <p className="font-mono text-[10px] tracking-widest text-cream/60 uppercase">{copy.diagnosis}</p>
                    <p className="font-serif text-lg text-gold italic" data-testid="diagnosis">
                      &ldquo;{diagnosis}&rdquo;
                    </p>
                  </div>
                </div>

                {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
                <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
                  <label htmlFor={`${id}-company`}>Company</label>
                  <input
                    id={`${id}-company`}
                    type="text"
                    tabIndex={-1}
                    autoComplete="off"
                    value={company}
                    onChange={(event) => setCompany(event.target.value)}
                  />
                </div>

                {error && (
                  <p id={errorId} role="alert" className="text-sm font-medium text-red-800">
                    {error}
                  </p>
                )}

                {status === 'success' ? (
                  <p role="status" className="rounded-lg border border-gold bg-forest px-4 py-4 font-mono text-xs font-semibold text-gold">
                    {copy.success}
                  </p>
                ) : (
                  <button
                    type="submit"
                    disabled={status === 'submitting'}
                    className="w-full rounded-lg border border-gold bg-forest py-4 font-mono text-xs font-bold tracking-[0.2em] text-gold uppercase shadow-lg transition hover:bg-forest-light disabled:opacity-60"
                  >
                    {status === 'submitting' ? copy.sending : copy.submit}
                  </button>
                )}
                <p className="font-mono text-[10px] tracking-wider text-charcoal/70 uppercase">{copy.privacyNote}</p>
              </fieldset>
            </form>
          </div>

          <div className="space-y-8 lg:col-span-5">
            <div>
              <p className="mb-3 font-mono text-xs tracking-[0.2em] text-forest/70 uppercase">{copy.previewLabel}</p>
              <MemberCard name={name} course={course} official={official} negotiated={negotiated} tier={tier} serial={serial} />
            </div>

            <div className="space-y-4 rounded-2xl border border-forest/15 bg-cream-warm p-7">
              <h2 className="font-serif text-2xl font-semibold text-forest">{copy.privilegesHeading}</h2>
              <ul className="space-y-3 text-sm text-charcoal/85">
                {copy.privileges.map((privilege) => (
                  <li key={privilege.title} className="flex items-start gap-3">
                    <span className="font-bold text-gold" aria-hidden="true">
                      ✦
                    </span>
                    <span>
                      <strong>{privilege.title}</strong> {privilege.body}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
