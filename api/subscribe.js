// POST /api/subscribe  { email, company? }  ->  200 { ok: true }
//
// Provider is chosen by env:
//   RESEND_API_KEY set (and SUBSCRIBE_PROVIDER not 'stub') -> create/update a Resend contact via the
//     current contacts API, tagged properties.brand = RESEND_BRAND (default 'tbagstore') so it stays
//     out of every Sip Haven list; added to RESEND_SEGMENT_ID only if that is set.
//   anything else (including a missing key)               -> log a stub line, still return ok
// The handler must never throw: every path ends in a JSON response.
import { isValidEmail } from '../src/lib/email.js'

const RESEND_TIMEOUT_MS = 8000

// Keep raw addresses out of logs.
export function maskEmail(email) {
  const [local, domain] = email.split('@')
  return `${local.slice(0, 1)}***@${domain}`
}

const RESEND_API = 'https://api.resend.com'
export const DEFAULT_BRAND = 'tbagstore'

export function getProvider(env = process.env) {
  if ((env.SUBSCRIBE_PROVIDER || '').trim().toLowerCase() === 'stub') return 'stub'
  return (env.RESEND_API_KEY || '').trim() ? 'resend' : 'stub'
}

export function contactProperties(env = process.env) {
  return { brand: (env.RESEND_BRAND || '').trim() || DEFAULT_BRAND, signup_source: 'site' }
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

function resendRequest(method, path, env, body) {
  return fetch(`${RESEND_API}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${env.RESEND_API_KEY.trim()}`,
      'Content-Type': 'application/json',
    },
    body: body === undefined ? undefined : JSON.stringify(body),
    signal: AbortSignal.timeout(RESEND_TIMEOUT_MS),
  })
}

async function readError(response) {
  try {
    const data = await response.json()
    return typeof data?.message === 'string' ? data.message : ''
  } catch {
    return ''
  }
}

// A contact that is already on the list comes back as 409, or with a message saying it
// "already exists". Anything else is a real failure.
async function isDuplicate(response) {
  if (response.status === 409) return true
  if (response.status !== 400 && response.status !== 422) return false
  return /already\s+exist/i.test(await readError(response))
}

export async function saveResendContact(email, env = process.env) {
  const properties = contactProperties(env)
  const created = await resendRequest('POST', '/contacts', env, { email, unsubscribed: false, properties })
  if (!created.ok) {
    if (!(await isDuplicate(created))) throw new Error(`Resend create responded ${created.status}`)
    const updated = await resendRequest('PATCH', `/contacts/${encodeURIComponent(email)}`, env, { properties })
    if (!updated.ok) throw new Error(`Resend update responded ${updated.status}`)
  }

  const segmentId = (env.RESEND_SEGMENT_ID || '').trim()
  if (segmentId) {
    // Optional: the signup already counts, so a segment failure is logged, not surfaced.
    try {
      const added = await resendRequest(
        'POST',
        `/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`,
        env,
      )
      if (!added.ok) console.error(`[subscribe] resend segment add responded ${added.status}`)
    } catch (error) {
      console.error('[subscribe] resend segment add failed:', error.message)
    }
  }
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
        await saveResendContact(email, process.env)
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
