import { signup as copy } from '../content/copy.js'

// Posts a launch-list signup to /api/subscribe (brand=tbagstore is set server-side).
// Resolves to { ok: true } or { ok: false, error } and never throws.
export async function subscribe(email, company = '') {
  try {
    const response = await fetch('/api/subscribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email: email.trim(), company }),
    })
    const data = await response.json().catch(() => ({}))
    if (response.ok && data.ok) return { ok: true }
    return { ok: false, error: data.error || copy.failure }
  } catch {
    return { ok: false, error: copy.failure }
  }
}
