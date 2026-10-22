// @vitest-environment node
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'
import handler, { contactProperties, getProvider, maskEmail, welcomeEmailFrom } from '../../api/subscribe.js'
import { buildWelcomeEmail, escapeHtml } from '../../src/emails/welcome.js'
import { welcomeEmail } from '../../src/content/copy.js'

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

const RESEND_VARS = [
  'SUBSCRIBE_PROVIDER',
  'RESEND_API_KEY',
  'RESEND_BRAND',
  'RESEND_SEGMENT_ID',
  'WELCOME_EMAIL_ENABLED',
  'RESEND_FROM',
  'SITE_URL',
]

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

describe('/api/subscribe welcome email', () => {
  const FROM = 'tbagstore <hello@tbagstore.com>'
  const emailCalls = (fetchSpy) => fetchSpy.mock.calls.filter(([url]) => url === 'https://api.resend.com/emails')

  beforeEach(() => {
    for (const key of RESEND_VARS) vi.stubEnv(key, '')
    vi.stubEnv('RESEND_API_KEY', 're_test')
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.unstubAllGlobals()
    vi.restoreAllMocks()
  })

  it('sends no email when WELCOME_EMAIL_ENABLED is unset, and still returns ok', async () => {
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn().mockResolvedValue(reply(200, { id: 'c_1' }))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).toHaveBeenCalledTimes(1)
    expect(emailCalls(fetchSpy)).toHaveLength(0)
    expect(JSON.parse(fetchSpy.mock.calls[0][1].body).properties.brand).toBe('tbagstore')
  })

  it.each([['TRUE'], ['1'], ['yes'], ['false']])('treats WELCOME_EMAIL_ENABLED=%s as off', async (value) => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', value)
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn().mockResolvedValue(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    await call({ body: { email: 'golfer@example.com' } })
    expect(emailCalls(fetchSpy)).toHaveLength(0)
  })

  it('sends no email when enabled but RESEND_FROM is missing', async () => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    const fetchSpy = vi.fn().mockResolvedValue(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.body).toEqual({ ok: true })
    expect(emailCalls(fetchSpy)).toHaveLength(0)
  })

  it('sends no email from the stub provider even when enabled', async () => {
    vi.stubEnv('RESEND_API_KEY', '')
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn()
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).not.toHaveBeenCalled()
  })

  it('sends one welcome email to a new contact when enabled', async () => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn().mockResolvedValue(reply(200, { id: 'x' }))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: ' Golfer@Example.com ' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy.mock.calls[0][0]).toBe('https://api.resend.com/contacts')
    const sends = emailCalls(fetchSpy)
    expect(sends).toHaveLength(1)
    const [, init] = sends[0]
    expect(init.method).toBe('POST')
    expect(init.headers.Authorization).toBe('Bearer re_test')
    const payload = JSON.parse(init.body)
    expect(payload.from).toBe(FROM)
    expect(payload.to).toEqual(['golfer@example.com'])
    expect(payload.subject).toBe(welcomeEmail.subject)
    expect(payload.html).toContain('https://www.tbagstore.com/products/magnetic-golf-towel')
    expect(payload.text).toContain(welcomeEmail.heading)
  })

  it.each([
    [409, {}],
    [422, { message: 'Contact already exists' }],
  ])('sends no email to an existing contact (%i) when enabled', async (status, body) => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn().mockResolvedValueOnce(reply(status, body)).mockResolvedValue(reply(200))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.body).toEqual({ ok: true })
    expect(fetchSpy).toHaveBeenCalledTimes(2)
    expect(fetchSpy.mock.calls[1][1].method).toBe('PATCH')
    expect(emailCalls(fetchSpy)).toHaveLength(0)
  })

  it.each([
    ['rejects', () => reply(422, { message: 'from address not verified' })],
    ['is unreachable', () => Promise.reject(new Error('network down'))],
  ])('still returns ok and logs when the welcome send %s', async (_label, failure) => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn((url) => (url.endsWith('/emails') ? failure() : Promise.resolve(reply(200))))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(200)
    expect(res.body).toEqual({ ok: true })
    expect(emailCalls(fetchSpy)).toHaveLength(1)
    const logged = console.error.mock.calls.map(([message]) => message)
    expect(logged.some((message) => message.startsWith('[subscribe] welcome email'))).toBe(true)
  })

  it('does not send a welcome email when saving the contact fails', async () => {
    vi.stubEnv('WELCOME_EMAIL_ENABLED', 'true')
    vi.stubEnv('RESEND_FROM', FROM)
    const fetchSpy = vi.fn().mockResolvedValue(reply(500))
    vi.stubGlobal('fetch', fetchSpy)
    const res = await call({ body: { email: 'golfer@example.com' } })
    expect(res.statusCode).toBe(502)
    expect(emailCalls(fetchSpy)).toHaveLength(0)
  })
})

describe('welcome email template', () => {
  it('builds subject, html and text with links on the canonical site', () => {
    const email = buildWelcomeEmail({ siteUrl: 'https://www.tbagstore.com' })
    expect(email.subject).toBe(welcomeEmail.subject)
    expect(email.html).toMatch(/^<!doctype html>/)
    expect(email.html).toContain('href="https://www.tbagstore.com/products/magnetic-golf-towel"')
    expect(email.text).toContain('https://www.tbagstore.com/products/magnetic-golf-towel')
    for (const paragraph of welcomeEmail.paragraphs) expect(email.text).toContain(paragraph)
  })

  it('escapes HTML in copy', () => {
    expect(escapeHtml(`<a href="x">'&'</a>`)).toBe('&lt;a href=&quot;x&quot;&gt;&#39;&amp;&#39;&lt;/a&gt;')
    // Copy apostrophes are escaped rather than injected raw.
    const html = buildWelcomeEmail({ siteUrl: 'https://www.tbagstore.com' }).html
    expect(html).toContain(escapeHtml(welcomeEmail.heading))
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

  it('welcomeEmailFrom needs WELCOME_EMAIL_ENABLED exactly "true" and a RESEND_FROM', () => {
    expect(welcomeEmailFrom({})).toBeNull()
    expect(welcomeEmailFrom({ RESEND_FROM: 'a@b.co' })).toBeNull()
    expect(welcomeEmailFrom({ WELCOME_EMAIL_ENABLED: 'true' })).toBeNull()
    expect(welcomeEmailFrom({ WELCOME_EMAIL_ENABLED: 'true', RESEND_FROM: '  ' })).toBeNull()
    expect(welcomeEmailFrom({ WELCOME_EMAIL_ENABLED: 'True', RESEND_FROM: 'a@b.co' })).toBeNull()
    expect(welcomeEmailFrom({ WELCOME_EMAIL_ENABLED: 'true', RESEND_FROM: ' a@b.co ' })).toBe('a@b.co')
  })

  it('maskEmail hides the local part', () => {
    expect(maskEmail('golfer@example.com')).toBe('g***@example.com')
  })
})
