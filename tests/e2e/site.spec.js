import { expect, test } from '@playwright/test'
import { PRODUCTS } from '../../src/content/products.js'

const PAGES = [
  { path: '/', heading: /Bag the Best/ },
  { path: '/shop', heading: 'The Equipment Locker' },
  ...PRODUCTS.map((product) => ({ path: `/products/${product.slug}`, heading: product.name })),
  { path: '/about', heading: 'The Bagger Ethos' },
  { path: '/club', heading: 'Join The Clubhouse' },
  { path: '/faq', heading: 'Frequently asked questions' },
  { path: '/shipping', heading: 'Shipping' },
  { path: '/returns', heading: 'Returns' },
  { path: '/privacy', heading: 'Privacy' },
]
const VIEWPORTS = [
  { width: 390, height: 844 },
  { width: 1280, height: 800 },
]
const FORBIDDEN_HOSTS = ['cdn.tailwindcss.com', 'fonts.googleapis.com', 'fonts.gstatic.com', 'images.unsplash.com']

function watchPage(page) {
  const errors = []
  const requests = []
  page.on('console', (msg) => {
    if (msg.type() === 'error') errors.push(msg.text())
  })
  page.on('pageerror', (err) => errors.push(err.message))
  page.on('request', (req) => requests.push(req.url()))
  return { errors, requests }
}

for (const viewport of VIEWPORTS) {
  for (const { path, heading } of PAGES) {
    test(`${path} at ${viewport.width}px: no overflow, console errors, prices, card fields or third-party assets`, async ({
      page,
    }) => {
      await page.setViewportSize(viewport)
      const { errors, requests } = watchPage(page)
      const response = await page.goto(path)
      expect(response.status()).toBe(200)
      await expect(page.getByRole('heading', { level: 1, name: heading })).toBeVisible()
      await expect(page.getByRole('banner').getByTestId('logo-text')).toHaveText('TBagger Golf Co.')
      await page.waitForLoadState('networkidle')

      const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth)
      expect(overflow).toBeLessThanOrEqual(0)
      expect(errors).toEqual([])
      for (const url of requests) {
        expect(FORBIDDEN_HOSTS.some((host) => new URL(url).hostname === host), url).toBe(false)
      }
      // SHOW_PRICES is unset in playwright.config.js, so no price may appear anywhere.
      await expect(page.locator('body')).not.toContainText(/\$\s?\d/)
      await expect(page.getByTestId('price')).toHaveCount(0)
      await expect(page.locator('input[autocomplete^="cc-"], input[name*="card" i], input[id*="card" i]')).toHaveCount(0)
      await expect(page.getByRole('button', { name: /add to (bag|sack|cart)|checkout/i })).toHaveCount(0)
    })
  }
}

test('fonts are self-hosted from /assets', async ({ page }) => {
  const fonts = []
  page.on('request', (req) => {
    if (req.resourceType() === 'font') fonts.push(new URL(req.url()))
  })
  await page.goto('/')
  await page.waitForLoadState('networkidle')
  expect(fonts.length).toBeGreaterThan(0)
  for (const url of fonts) {
    expect(url.origin).toBe(new URL(page.url()).origin)
    expect(url.pathname).toMatch(/^\/assets\/(cormorant-garamond|plus-jakarta-sans|jetbrains-mono)-/)
  }
  const families = await page.evaluate(() => [...document.fonts].map((font) => font.family.replaceAll('"', '')))
  for (const family of ['Cormorant Garamond', 'Plus Jakarta Sans', 'JetBrains Mono']) expect(families).toContain(family)
})

test('home has the ticker, hero, product grid, philosophy block and three craft cards', async ({ page }) => {
  await page.goto('/')
  await expect(page.getByText('CNC-MILLED IN SMALL BATCHES').first()).toBeAttached()
  await expect(page.getByRole('heading', { level: 1, name: /Leave Nothing on the Lip/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'First-Tee Hardware & Leather' })).toBeVisible()
  await expect(page.getByTestId('product-card')).not.toHaveCount(0)
  await expect(page.getByRole('heading', { name: /Look Like a \+2 Index/ })).toBeVisible()
  await expect(page.getByRole('heading', { name: 'Built to Outlast Your Swing Changes' })).toBeVisible()
  for (const title of ['Full-Grain Bridle Leather', '5-Axis CNC Billet Brass', 'N52 Rare-Earth Magnetics']) {
    await expect(page.getByRole('heading', { level: 3, name: title })).toBeVisible()
  }
})

test('shop lists all 8 products as "Coming soon" and filters them', async ({ page }) => {
  await page.goto('/shop')
  const cards = page.getByTestId('product-card')
  await expect(cards).toHaveCount(8)
  await expect(page.getByTestId('product-status')).toHaveCount(8)
  for (const status of await page.getByTestId('product-status').allTextContents()) expect(status).toMatch(/coming soon/i)
  await page.getByRole('button', { name: /^Covers & Sleeves/ }).click()
  await expect(cards).toHaveCount(2)
  await page.getByRole('button', { name: /^All Gear/ }).click()
  await page.getByLabel('Search products').fill('chronograph')
  await expect(cards).toHaveCount(1)
  await expect(cards.first()).toContainText('The Back-Nine Flask & Valet Pouch')
})

test('a product card "Notify me" opens the product page at its signup form', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 })
  await page.goto('/shop')
  await page.getByRole('link', { name: 'Notify me when The Heavy Hitter is available' }).click()
  await expect(page).toHaveURL(/\/products\/the-heavy-hitter#notify$/)
  await expect(page.locator('#notify')).toBeInViewport()
})

test('product page says coming soon with Notify me and no buy button or price', async ({ page }) => {
  await page.goto('/products/the-clingy-caddie')
  await expect(page.getByRole('main').getByTestId('product-status').first()).toHaveText(/coming soon/i)
  await expect(page.locator('#notify').getByRole('button', { name: 'Notify me' })).toBeVisible()
  await expect(page.getByText('TECHNICAL SPECIFICATIONS & TOLERANCES')).toBeVisible()
  await page.getByRole('tab', { name: '02. CAD Blueprint' }).click()
  await expect(page.getByRole('img', { name: 'The Clingy Caddie CAD blueprint' })).toBeVisible()
})

test('cart and checkout are gone', async ({ page, request }) => {
  expect((await request.get('/checkout')).status()).toBe(404)
  expect((await request.get('/cart')).status()).toBe(404)
  await page.goto('/')
  await expect(page.getByRole('button', { name: /sack|cart|bag/i })).toHaveCount(0)
  await expect(page.getByTestId('cart-count')).toHaveCount(0)
})

test('old product URLs 404 or redirect to /products/:slug', async ({ page, request }) => {
  expect((await request.get('/shop/the-clingy-caddie')).status()).toBe(404)
  for (const old of ['/products/magnetic-golf-towel', '/towel']) {
    const response = await request.get(old, { maxRedirects: 0 })
    expect(response.status(), old).toBe(308)
    expect(response.headers().location).toBe('/products/the-clingy-caddie')
  }
  await page.goto('/products/magnetic-golf-towel')
  await expect(page).toHaveURL(/\/products\/the-clingy-caddie$/)
})

test('header stays visible after scrolling and the phone menu navigates', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 600 })
  await page.goto('/')
  await page.mouse.wheel(0, 1500)
  await expect(page.getByRole('banner')).toBeInViewport()
  await page.getByRole('button', { name: 'Toggle menu' }).click()
  await page.getByRole('navigation', { name: 'Mobile' }).getByRole('link', { name: /The Bagger Ethos/ }).click()
  await expect(page).toHaveURL(/\/about$/)
  await expect(page.getByRole('heading', { level: 1, name: 'The Bagger Ethos' })).toBeVisible()
})

test('home links through to the shop and a product page', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('link', { name: 'SHOP THE ARCHIVE' }).click()
  await expect(page).toHaveURL(/\/shop$/)
  await page.getByRole('link', { name: 'The Crown Jewel', exact: true }).click()
  await expect(page).toHaveURL(/\/products\/the-crown-jewel$/)
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
  await expect(page.locator('meta[property="og:title"]')).toHaveAttribute('content', /TBagger Golf Co\./)
  await expect(page.locator('link[rel="icon"][type="image/svg+xml"]')).toHaveAttribute('href', '/favicon.svg')
})

for (const path of ['/', '/products/the-first-tee-sack']) {
  test(`links and buttons on ${path} are at least 44px tall on phones`, async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 })
    await page.goto(path)
    // Footer links, header controls and every visible button / call-to-action link in main.
    const targets = page.locator(
      'footer a, header button:visible, header a:visible, main button:visible, main a[href^="/products/"]:not([tabindex="-1"]):visible',
    )
    const count = await targets.count()
    expect(count).toBeGreaterThan(0)
    for (let i = 0; i < count; i += 1) {
      const target = targets.nth(i)
      const box = await target.boundingBox()
      const label = (await target.textContent()).trim() || (await target.getAttribute('aria-label'))
      expect(box, `${label} should be on screen`).not.toBeNull()
      // Inline links inside a heading (product titles) are text links, not tap targets.
      if (await target.evaluate((el) => Boolean(el.closest('h1, h2, h3')))) continue
      expect(box.height, label).toBeGreaterThanOrEqual(44)
      expect(box.width, label).toBeGreaterThanOrEqual(24)
    }
  })
}
