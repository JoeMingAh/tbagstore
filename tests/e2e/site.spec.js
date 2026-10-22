import { expect, test } from '@playwright/test'

const PAGES = [
  { path: '/', heading: /stuck right where you need it/i },
  { path: '/products/magnetic-golf-towel', heading: 'Magnetic Golf Towel with Tee' },
  { path: '/privacy', heading: 'Privacy' },
  { path: '/faq', heading: 'Frequently asked questions' },
  { path: '/shipping', heading: 'Shipping' },
  { path: '/returns', heading: 'Returns' },
]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]

function collectConsoleErrors(page) {
  const errors = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  return errors
}

for (const viewport of VIEWPORTS) {
  for (const { path, heading } of PAGES) {
    test(`${path} renders at ${viewport.width}px without overflow or console errors`, async ({ page }) => {
      await page.setViewportSize(viewport)
      const errors = collectConsoleErrors(page)
      const response = await page.goto(path)
      expect(response.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      await expect(page.getByRole('banner').getByTestId('logo-text')).toHaveText('tbagstore')
      const overflow = await page.evaluate(
        () => document.documentElement.scrollWidth - document.documentElement.clientWidth,
      )
      expect(overflow).toBeLessThanOrEqual(0)
      expect(errors).toEqual([])
    })
  }
}

test('header stays visible after scrolling', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/')
  await page.mouse.wheel(0, 1500)
  await expect(page.getByRole('banner')).toBeInViewport()
})

test('product page says coming soon with no price or buy button', async ({ page }) => {
  await page.goto('/products/magnetic-golf-towel')
  await expect(page.getByTestId('product-status')).toHaveText('Coming soon')
  await expect(page.getByText('Magnetic clip')).toBeVisible()
  await expect(page.getByText('Built-in tee holder')).toBeVisible()
  await expect(page.getByRole('button', { name: /buy|add to cart/i })).toHaveCount(0)
  await expect(page.locator('main')).not.toContainText('$')
})

test('home links through to the product page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'See the towel' }).click()
  await expect(page).toHaveURL(/\/products\/magnetic-golf-towel$/)
})

test('footer has contact email and privacy link', async ({ page }) => {
  await page.goto('/')
  const footer = page.getByRole('contentinfo')
  await expect(footer.getByRole('link', { name: /@tbagstore\.com/ })).toHaveAttribute('href', /^mailto:/)
  await footer.getByRole('link', { name: 'Privacy' }).click()
  await expect(page).toHaveURL(/\/privacy$/)
})

test('unknown route returns a real 404 status and a not-found page', async ({ page }) => {
  const response = await page.goto('/this-page-does-not-exist')
  expect(response.status()).toBe(404)
  await expect(page.getByRole('heading', { level: 1, name: 'Page not found' })).toBeVisible()
})

test('robots.txt and sitemap.xml list only www.tbagstore.com URLs', async ({ request }) => {
  const robots = await request.get('/robots.txt')
  expect(robots.status()).toBe(200)
  const robotsText = await robots.text()
  expect(robotsText).toContain('Sitemap: https://www.tbagstore.com/sitemap.xml')

  const sitemap = await request.get('/sitemap.xml')
  expect(sitemap.status()).toBe(200)
  const xml = await sitemap.text()
  const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
  expect(locs.length).toBeGreaterThan(0)
  for (const loc of locs) expect(loc).toMatch(/^https:\/\/www\.tbagstore\.com\//)
  const allUrls = [...`${robotsText}\n${xml}`.matchAll(/https?:\/\/[^\s<"]+/g)].map((m) => m[0])
  for (const url of allUrls) {
    if (url.startsWith('http://www.sitemaps.org/')) continue
    expect(url).toMatch(/^https:\/\/www\.tbagstore\.com\//)
  }
})

test('Open Graph and canonical tags use the canonical origin', async ({ page }) => {
  await page.goto('/')
  await expect(page.locator('meta[property="og:url"]')).toHaveAttribute('content', 'https://www.tbagstore.com/')
  await expect(page.locator('link[rel="canonical"]')).toHaveAttribute('href', 'https://www.tbagstore.com/')
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /tbagstore/)
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg')
})

test('footer links are at least 24px tall and wide on phones', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/')
  const links = page.locator('footer a')
  const count = await links.count()
  expect(count).toBeGreaterThan(0)
  for (let i = 0; i < count; i += 1) {
    const box = await links.nth(i).boundingBox()
    expect(box.height).toBeGreaterThanOrEqual(24)
    expect(box.width).toBeGreaterThanOrEqual(24)
  }
})
