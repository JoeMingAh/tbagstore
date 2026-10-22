// POST /api/subscribe  { email, company? }  ->  200 { ok: true }
//
// Provider is chosen by env:
//   SUBSCRIBE_PROVIDER=resend + RESEND_API_KEY + RESEND_AUDIENCE_ID -> add contact to the Resend audience
//   anything else (including missing Resend vars)                    -> log a stub line, still return ok
// The handler must never throw: every path ends in a JSON response.
import { isValidEmail } from '../src/lib/email.js'

const RESEND_TIMEOUT_MS = 8000

// Keep raw addresses out of logs.
export function maskEmail(email) {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

export function getProvider(env = process.env) {
  const wantsResend = (env.SUBSCRIBE_PROVIDER || '').trim().toLowerCase() === 'resend'
  if (wantsResend && env.RESEND_API_KEY && env.RESEND_AUDIENCE_ID) return 'resend'
  return 'stub'
}

function send(res, status, body) {
  res.statusCode = status
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.end(JSON.stringify(body))
}

function readBody(req) {
  const { body } = req
  if (body && typeof body === 'object' && !Buffer.isBuffer(body)) return body
  const text = Buffer.isBuffer(body) ? body.toString('utf8') : body
  if (typeof text !== 'string' || text.trim() === '') return null
  try {
    const parsed = JSON.parse(text)
    return parsed && typeof parsed === 'object' ? parsed : null
  } catch {
    return null
  }
}

async function addResendContact(email, env) {
  const url = `https://api.resend.com/audiences/${encodeURIComponent(env.RESEND_AUDIENCE_ID)}/contacts`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, unsubscribed: false }),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  })
  if (!response.ok) throw new Error(`Resend responded ${response.status}`)
}

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
      res.setHeader('Allow', 'POST')
      return send(res, 405, { ok: false, error: 'Method not allowed' })
    }

    const body = readBody(req)
    if (!body) return send(res, 400, { ok: false, error: 'Invalid request body' })

    // Honeypot: real visitors never see or fill this field. Pretend success for bots.
    if (typeof body.company === 'string' && body.company.trim() !== '') {
      return send(res, 200, { ok: true })
    }

    if (!isValidEmail(body.email)) {
      return send(res, 400, { ok: false, error: 'Please enter a valid email address.' })
    }
    const email = body.email.trim().toLowerCase()

    if (getProvider() === 'resend') {
      try {
        await addResendContact(email, process.env)
      } catch (error) {
        console.error('[subscribe] resend failed:', error.message)
        return send(res, 502, { ok: false, error: 'Could not save your signup. Please try again.' })
      }
    } else {
      console.log(`[subscribe] stub signup ${maskEmail(email)} (Resend not configured)`)
    }

    return send(res, 200, { ok: true })
  } catch (error) {
    console.error('[subscribe] unexpected error:', error?.message)
    return send(res, 500, { ok: false, error: 'Something went wrong. Please try again.' })
  }
}
