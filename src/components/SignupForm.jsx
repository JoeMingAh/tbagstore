import { useId, useState } from 'react'
import { signup as copy } from '../content/copy.js'
import { isValidEmail } from '../lib/email.js'
import { subscribe } from '../lib/subscribe.js'

const STYLES = {
  light: {
    input:
      'rounded-lg border border-forest/25 bg-cream px-4 py-3 text-base text-forest placeholder:text-charcoal/50 focus:border-gold',
    button: 'rounded-lg bg-forest px-6 py-3 text-gold hover:bg-forest-light',
    success: 'rounded-lg border border-forest/20 bg-cream-warm px-4 py-3 text-forest',
    error: 'text-red-800',
  },
  dark: {
    input:
      'rounded-lg border border-gold/30 bg-forest px-4 py-3 text-sm text-cream placeholder:text-cream/40 focus:border-gold',
    button: 'rounded-lg bg-gold px-5 py-3 text-forest hover:bg-gold-light',
    success: 'rounded-lg border border-gold/40 bg-forest px-4 py-3 text-gold',
    error: 'text-red-300',
  },
}

export default function SignupForm({ variant = 'light', buttonLabel = copy.button, placeholder = copy.placeholder }) {
  const id = useId()
  const styles = STYLES[variant]
  const [email, setEmail] = useState('')
  const [company, setCompany] = useState('') // honeypot
  const [status, setStatus] = useState('idle') // idle | submitting | success
  const [error, setError] = useState('')

  async function handleSubmit(event) {
    event.preventDefault()
    if (!isValidEmail(email)) {
      setError(copy.invalid)
      return
    }
    setError('')
    setStatus('submitting')
    const result = await subscribe(email, company)
    if (result.ok) {
      setStatus('success')
      return
    }
    setError(result.error)
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <p role="status" className={`font-mono text-xs font-semibold ${styles.success}`}>
        {copy.success}
      </p>
    )
  }

  const errorId = `${id}-error`
  return (
    <form onSubmit={handleSubmit} noValidate className="relative w-full">
      <label htmlFor={`${id}-email`} className="sr-only">
        {copy.label}
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder={placeholder}
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className={`min-w-0 flex-1 font-mono outline-none focus:ring-2 focus:ring-gold/30 ${styles.input}`}
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className={`min-h-11 font-mono text-xs font-bold tracking-wider uppercase transition disabled:opacity-60 ${styles.button}`}
        >
          {status === 'submitting' ? copy.sending : buttonLabel}
        </button>
      </div>
      {/* Honeypot: hidden from people and assistive tech; bots tend to fill it. */}
      <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
        <label htmlFor={`${id}-company`}>Company</label>
        <input
          id={`${id}-company`}
          type="text"
          name="company"
          tabIndex={-1}
          autoComplete="off"
          value={company}
          onChange={(event) => setCompany(event.target.value)}
        />
      </div>
      {error && (
        <p id={errorId} role="alert" className={`mt-2 text-sm font-medium ${styles.error}`}>
          {error}
        </p>
      )}
    </form>
  )
}
