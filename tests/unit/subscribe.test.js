// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler, { getProvider, maskEmail } from '../../api/subscribe.js'

function mockRes() {
  const res = { statusCode: 0, headers: {}, body: undefined }
  res.setHeader = (key, value) => {
    res.headers[key.toLowerCase()] = value
  }
  res.end = (payload) => {
    res.body = payload === undefined ? undefined : JSON.parse(payload)
  }
  return res
}

async function call({ method = 'POST', body } = {}) {
  const res = mockRes()
  await handler({ method, body }, res)
  return res
}

const RESEND_VARS = ['SUBSCRIBE_PROVIDER', 'RESEND_API_KEY', 'RESEND_AUDIENCE_ID']

describe('/api/subscribe', () => {
  beforeEach(() => {
    for (const key of RESEND_VARS) vi.stubEnv(key, '')
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('returns 200 {ok:true} for a valid email with no Resend env vars (stub)', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
    expect(console.log).toHaveBeenCalledWith(expect.stringContaining('g***@example.com'))
  })

  it('accepts a JSON string body (unparsed)', async () => {
    const res = await call({ body: JSON.stringify({ email: 'golfer@example.com' }) })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it.each([['not-an-email'], [''], ['a@b'], ['two@@example.com'], [`${'a'.repeat(250)}@example.com`], [42]])(
    'rejects invalid email %j with 400',
    async (email) => {
      const res = await call({ body: { email } })
      expect(res.statusCode).toBe(400)
      expect(res.body.ok).toBe(false)
    },
  )

  it('rejects missing or malformed bodies with 400', async () => {
    expect((await call({ body: undefined })).statusCode).toBe(400)
    expect((await call({ body: '{not json' })).statusCode).toBe(400)
    expect((await call({ body: 'null' })).statusCode).toBe(400)
  })

  it('rejects non-POST methods with 405', async () => {
    const res = await call({ method: 'GET' })
    expect(res.statusCode).toBe(405)
    expect(res.headers.allow).toBe('POST')
  })

  it('silently accepts honeypot submissions without storing', async () => {
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    vi.stubEnv('SUBSCRIBE_PROVIDER', 'resend')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_AUDIENCE_ID', 'aud_123')
    const res = await call({ body: { email: 'bot@example.com', company: 'Spam Inc' } })
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('falls back to the stub when SUBSCRIBE_PROVIDER=resend but keys are missing', async () => {
    vi.stubEnv('SUBSCRIBE_PROVIDER', 'resend')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('adds the contact to the Resend audience when fully configured', async () => {
    vi.stubEnv('SUBSCRIBE_PROVIDER', 'resend')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_AUDIENCE_ID', 'aud_123')
    const fetchSpy = vi.fn().mockResolvedValue({ ok: true, status: 200 })
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: '  Golfer@Example.com ' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://api.resend.com/audiences/aud_123/contacts')
    expect(init.headers.Authorization).toBe('Bearer re_test')
    expect(JSON.parse(init.body)).toEqual({ email: 'golfer@example.com', unsubscribed: false })
  })

  it('returns 502 (not a crash) when Resend fails', async () => {
    vi.stubEnv('SUBSCRIBE_PROVIDER', 'resend')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_AUDIENCE_ID', 'aud_123')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(502)
    expect(res.body.ok).toBe(false)
  })
})

describe('helpers', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('getProvider only picks resend when all three vars are set', () => {
    expect(getProvider({})).toBe('stub')
    expect(getProvider({ SUBSCRIBE_PROVIDER: 'resend' })).toBe('stub')
    expect(getProvider({ SUBSCRIBE_PROVIDER: 'resend', RESEND_API_KEY: 'k' })).toBe('stub')
    expect(getProvider({ RESEND_API_KEY: 'k', RESEND_AUDIENCE_ID: 'a' })).toBe('stub')
    expect(getProvider({ SUBSCRIBE_PROVIDER: 'Resend', RESEND_API_KEY: 'k', RESEND_AUDIENCE_ID: 'a' })).toBe('resend')
  })

  it('maskEmail hides the local part', () => {
    expect(maskEmail('golfer@example.com')).toBe('g***@example.com')
  })
})
