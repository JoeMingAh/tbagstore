// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler, { contactProperties, getProvider, maskEmail } from '../../api/subscribe.js'

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

const RESEND_VARS = ['SUBSCRIBE_PROVIDER', 'RESEND_API_KEY', 'RESEND_BRAND', 'RESEND_SEGMENT_ID']

function reply(status, body = {}) {
  return { ok: status >= 200 && status < 300, status, json: async () => body }
}

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
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const res = await call({ body: { email: 'bot@example.com', company: 'Spam Inc' } })
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('uses the stub when SUBSCRIBE_PROVIDER=stub even with a key', async () => {
    vi.stubEnv('SUBSCRIBE_PROVIDER', 'stub')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('creates a contact with the current contacts API, tagged brand=tbagstore, and no segment', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchSpy = vi.fn().mockResolvedValue(reply(200, { id: 'c_1' }))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: '  Golfer@Example.com ' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    const [url, init] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://api.resend.com/contacts')
    expect(url).not.toContain('audiences')
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer re_test')
    expect(JSON.parse(init.body)).toEqual({
      email: 'golfer@example.com',
      unsubscribed: false,
      properties: { brand: 'tbagstore', signup_source: 'site' },
    })
  })

  it('uses RESEND_BRAND when set', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_BRAND', 'otherbrand')
    const fetchSpy = vi.fn().mockResolvedValue(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    await call({ body: { email: 'golfer@example.com' } })
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).properties.brand).toBe('otherbrand')
  })

  it.each([
    [409, {}],
    [422, { message: 'Contact already exists' }],
  ])('updates the properties of an existing contact (%i) and returns ok', async (status, body) => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    const fetchSpy = vi.fn().mockResolvedValueOnce(reply(status, body)).mockResolvedValueOnce(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    const [url, init] = fetchSpy.mock.calls[1]
    expect(url).toBe('https://api.resend.com/contacts/golfer%40example.com')
    expect(init.method).toBe('PATCH')
    expect(JSON.parse(init.body)).toEqual({ properties: { brand: 'tbagstore', signup_source: 'site' } })
  })

  it('adds the contact to RESEND_SEGMENT_ID only when it is set', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_SEGMENT_ID', 'seg_9')
    const fetchSpy = vi.fn().mockResolvedValue(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    const [url, init] = fetchSpy.mock.calls[1]
    expect(url).toBe('https://api.resend.com/contacts/golfer%40example.com/segments/seg_9')
    expect(init.method).toBe('POST')
  })

  it('still returns ok when only the optional segment add fails', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubEnv('RESEND_SEGMENT_ID', 'seg_9')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValueOnce(reply(200)).mockRejectedValueOnce(new Error('boom')))
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
  })

  it('returns 502 (not a crash) when Resend rejects the contact', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(reply(401, { message: 'Invalid API key' })))
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(502)
    expect(res.body.ok).toBe(false)
  })

  it('returns 502 (not a crash) when Resend is unreachable', async () => {
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('network down')))
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(502)
    expect(res.body.ok).toBe(false)
  })
})

describe('helpers', () => {
  afterEach(() => vi.unstubAllEnvs())

  it('getProvider picks resend whenever a key is set, unless forced to stub', () => {
    expect(getProvider({})).toBe('stub')
    expect(getProvider({ RESEND_API_KEY: '  ' })).toBe('stub')
    expect(getProvider({ SUBSCRIBE_PROVIDER: 'resend' })).toBe('stub')
    expect(getProvider({ RESEND_API_KEY: 'k' })).toBe('resend')
    expect(getProvider({ SUBSCRIBE_PROVIDER: 'Stub', RESEND_API_KEY: 'k' })).toBe('stub')
  })

  it('contactProperties defaults the brand to tbagstore', () => {
    expect(contactProperties({})).toEqual({ brand: 'tbagstore', signup_source: 'site' })
    expect(contactProperties({ RESEND_BRAND: ' x ' })).toEqual({ brand: 'x', signup_source: 'site' })
  })

  it('maskEmail hides the local part', () => {
    expect(maskEmail('golfer@example.com')).toBe('g***@example.com')
  })
})
