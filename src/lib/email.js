// Shared by the signup form and /api/subscribe so both sides agree on what's valid.
export const MAX_EMAIL_LENGTH = 254
// Pragmatic check: one @, no spaces, a dot in the domain, letters-only TLD.
const EMAIL_PATTERN = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)*\.[a-z]{2,}$/i

export function isValidEmail(value) {
  if (typeof value !== 'string') return false
  const email = value.trim()
  return email.length > 0 && email.length <= MAX_EMAIL_LENGTH && EMAIL_PATTERN.test(email)
}
