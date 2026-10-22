import { useId, useState } from 'react'
import { signup as copy } from '../content/copy.js'
import { isValidEmail } from '../lib/email.js'

export default function SignupForm() {
  const id = useId()
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
    try {
      const response = await fetch('/api/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), company }),
      })
      const data = await response.json().catch(() => ({}))
      if (response.ok && data.ok) {
        setStatus('success')
        return
      }
      setError(data.error || copy.failure)
    } catch {
      setError(copy.failure)
    }
    setStatus('idle')
  }

  if (status === 'success') {
    return (
      <p role="status" className="rounded-xl bg-green-100 px-4 py-3 font-medium text-green-900">
        {copy.success}
      </p>
    )
  }

  const errorId = `${id}-error`
  return (
    <form onSubmit={handleSubmit} noValidate className="w-full">
      <label htmlFor={`${id}-email`} className="sr-only">
        Email address
      </label>
      <div className="flex flex-col gap-2 sm:flex-row">
        <input
          id={`${id}-email`}
          type="email"
          name="email"
          autoComplete="email"
          placeholder="you@example.com"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          aria-invalid={error ? 'true' : 'false'}
          aria-describedby={error ? errorId : undefined}
          className="min-w-0 flex-1 rounded-full border border-stone-300 bg-white px-4 py-3 text-base outline-none focus:border-brand focus:ring-2 focus:ring-brand/30"
        />
        <button
          type="submit"
          disabled={status === 'submitting'}
          className="rounded-full bg-brand px-6 py-3 font-semibold text-white hover:bg-brand-light disabled:opacity-60"
        >
          {status === 'submitting' ? 'Sending…' : copy.button}
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
        <p id={errorId} role="alert" className="mt-2 text-sm font-medium text-red-700">
          {error}
        </p>
      )}
    </form>
  )
}
