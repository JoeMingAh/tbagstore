import { expect, test } from '@playwright/test'

const SITE = 'https://www.tbagstore.com'
const OG_IMAGE = `${SITE}/og-image.png`

const PAGES = [
  { path: '/', title: 'tbagstore | Golf accessories, coming soon', canonical: `${SITE}/`, jsonLd: ['Organization'] },
  {
    path: '/products/magnetic-golf-towel',
    title: 'Magnetic Golf Towel with Tee | tbagstore',
    canonical: `${SITE}/products/magnetic-golf-towel`,
    jsonLd: ['Product'],
  },
  { path: '/privacy', title: 'Privacy | tbagstore', canonical: `${SITE}/privacy`, jsonLd: [] },
  { path: '/faq', title: 'FAQ | tbagstore', canonical: `${SITE}/faq`, jsonLd: [] },
  { path: '/shipping', title: 'Shipping | tbagstore', canonical: `${SITE}/shipping`, jsonLd: [] },
  { path: '/returns', title: 'Returns | tbagstore', canonical: `${SITE}/returns`, jsonLd: [] },
]

const DRAFT_PAGES = [
  { path: '/faq', heading: 'Frequently asked questions' },
  { path: '/shipping', heading: 'Shipping' },
  { path: '/returns', heading: 'Returns' },
]

// Reads tags from raw HTML the way a crawler or link unfurler would (no JS).
function parseHead(html) {
  const attr = (tag, name) => tag.match(new RegExp(`\\s${name}="([^"]*)"`))?.[1]
  const meta = {}
  for (const [tag] of html.matchAll(/<meta\s[^>]*>/g)) {
    const key = attr(tag, 'property') || attr(tag, 'name')
    if (key) meta[key] = attr(tag, 'content')
  }
  return {
    title: html.match(/<title>(.*?)<\/title>/)?.[1],
    canonical: [...html.matchAll(/<link\s[^>]*rel="canonical"[^>]*>/g)].map(([tag]) => attr(tag, 'href')),
    meta,
    jsonLd: [...html.matchAll(/<script[^>]*type="application\/ld\+json"[^>]*>(.*?)<\/script>/gs)].map((m) => m[1]),
  }
}

function expectShareTags(head, { title, canonical }) {
  expect(head.meta.description).toBeTruthy()
  expect(head.meta['og:title']).toBe(title)
  expect(head.meta['og:description']).toBe(head.meta.description)
  expect(head.meta['og:url']).toBe(canonical)
  expect(head.meta['og:image']).toBe(OG_IMAGE)
  expect(head.meta['og:image:width']).toBe('1200')
  expect(head.meta['og:image:height']).toBe('630')
  expect(head.meta['og:type']).toBe('website')
  expect(head.meta['twitter:card']).toBe('summary_large_image')
  expect(head.meta['twitter:title']).toBe(title)
  expect(head.meta['twitter:description']).toBe(head.meta.description)
  expect(head.meta['twitter:image']).toBe(OG_IMAGE)
}

function collectConsoleErrors(page) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

test.describe('share tags in the served HTML (no JS)', () => {
  for (const pageSpec of PAGES) {
    test(`${pageSpec.path} has title, canonical, Open Graph, Twitter and JSON-LD`, async ({ request }) => {
      const response = await request.get(pageSpec.path)
      expect(response.status()).toBe(200)
      const head = parseHead(await response.text())
      expect(head.title).toBe(pageSpec.title)
      expect(head.canonical).toEqual([pageSpec.canonical])
      expect(head.meta.robots).toBeUndefined()
      expectShareTags(head, pageSpec)
      const types = head.jsonLd.map((json) => JSON.parse(json)['@type'])
      expect(types).toEqual(pageSpec.jsonLd)
      for (const json of head.jsonLd) expect(json).not.toMatch(/offers|price/i)
    })
  }

  test('404 keeps a real 404 status and has its own noindex tags', async ({ request }) => {
    const response = await request.get('/definitely-not-a-page')
    expect(response.status()).toBe(404)
    const head = parseHead(await response.text())
    expect(head.title).toBe('Page not found | tbagstore')
    expect(head.meta.robots).toBe('noindex')
    expect(head.canonical).toEqual([`${SITE}/`])
    expectShareTags(head, { title: 'Page not found | tbagstore', canonical: `${SITE}/` })
    expect(head.jsonLd).toEqual([])
  })

  test('look-alike paths of new pages still 404', async ({ request }) => {
    for (const path of ['/products', '/faq/extra', '/faq/index.htm', '/shipping.html']) {
      expect((await request.get(path)).status(), path).toBe(404)
    }
  })
})

test('tags follow in-app navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('contentinfo').getByRole('link', { name: 'FAQ' }).click()
  await expect(page).toHaveURL(/\/faq$/)
  await expect(page).toHaveTitle('FAQ | tbagstore')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', `${SITE}/faq`)
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', `${SITE}/faq`)
  await expect(page.locator('script[type="application/ld+json"]')).toHaveCount(0)

  await page.getByRole('link', { name: 'Towel' }).click()
  await expect(page).toHaveTitle('Magnetic Golf Towel with Tee | tbagstore')
  await expect(page.locator('link[rel="canonical"]')).toHaveCount(1)
  const jsonLd = await page.locator('script[type="application/ld+json"]').allTextContents()
  expect(jsonLd.map((json) => JSON.parse(json)['@type'])).toEqual(['Product'])
})

test('share image and icons are served at the right size', async ({ page, request }) => {
  const og = await request.get('/og-image.png')
  expect(og.status()).toBe(200)
  expect(og.headers()['content-type']).toContain('image/png')
  const buf = await og.body()
  expect([buf.readUInt32BE(16), buf.readUInt32BE(20)]).toEqual([1200, 630])

  const apple = await request.get('/apple-touch-icon.png')
  expect(apple.status()).toBe(200)
  const appleBuf = await apple.body()
  expect([appleBuf.readUInt32BE(16), appleBuf.readUInt32BE(20)]).toEqual([180, 180])

  for (const icon of ['/favicon.svg', '/favicon-32x32.png', '/favicon.ico']) expect((await request.get(icon)).status(), icon).toBe(200)

  // The browser decodes it at 1200x630 too.
  await page.goto('/')
  const size = await page.evaluate(async () => {
    const img = new Image()
    img.src = '/og-image.png'
    await img.decode()
    return [img.naturalWidth, img.naturalHeight]
  })
  expect(size).toEqual([1200, 630])
  await expect(page.locator('link[rel="apple-touch-icon"]')).toHaveAttribute('href', '/apple-touch-icon.png')
})

for (const viewport of [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]) {
  for (const { path, heading } of DRAFT_PAGES) {
    test(`${path} shows the draft note at ${viewport.width}px with no overflow or console errors`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)
      const response = await page.goto(path)
      expect(response.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      await expect(page.getByTestId('draft-note')).toHaveText('Draft, pending approval')
      await expect(page.getByTestId('draft-note')).toBeVisible()
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
      await page.waitForLoadState('networkidle')
      expect(errors).toEqual([])
    })
  }
}

test('footer links to the policy pages', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  for (const [name, path] of [
    ['FAQ', '/faq'],
    ['Shipping', '/shipping'],
    ['Returns', '/returns'],
    ['Privacy', '/privacy'],
  ]) {
    await expect(footer.getByRole('link', { name, exact: true })).toHaveAttribute('href', path)
  }
})

test('sitemap lists every page, including the policy pages, on www only', async ({ request }) => {
  const xml = await (await request.get('/sitemap.xml')).text()
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  expect(locs.sort()).toEqual(PAGES.map((p) => p.canonical).sort())
  for (const loc of locs) expect(loc).toMatch(/^https:\/\/www\.tbagstore\.com\//)
})

test('Vercel Web Analytics script is loaded by the production build', async ({ page }) => {
  const scriptResponse = page.waitForResponse('**/_vercel/insights/script.js')
  await page.goto('/')
  await expect(page.locator('script[src="/_vercel/insights/script.js"]')).toHaveCount(1)
  expect((await scriptResponse).status()).toBe(200)
})

test('privacy page mentions Vercel Web Analytics', async ({ page }) => {
  await page.goto('/privacy')
  await expect(page.getByTestId('privacy-analytics')).toContainText('Vercel Web Analytics')
  await expect(page.getByTestId('privacy-analytics')).toContainText('cookies')
})

test('signup sends no welcome email by default and returns ok', async ({ request }) => {
  // Welcome email env is cleared in playwright.config.js; the stub provider never calls Resend.
  const response = await request.post('/api/subscribe', { data: { email: 'golfer@example.com' } })
  expect(response.status()).toBe(200)
  expect(await response.json()).toEqual({ ok: true })
})
