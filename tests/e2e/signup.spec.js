import { expect, test } from '@playwright/test'

test.describe('Notify me signup (/api/subscribe)', () => {
  test('product page Notify me saves the email and shows success', async ({ page }) => {
    await page.goto('/products/the-first-tee-sack')
    const form = page.locator('#notify')
    await form.getByLabel('Email address').fill('golfer@example.com')
    const [request, response] = await Promise.all([
      page.waitForRequest('**/api/subscribe'),
      page.waitForResponse('**/api/subscribe'),
      form.getByRole('button', { name: 'Notify me' }).click(),
    ])
    expect(request.method()).toBe('POST')
    expect(request.postDataJSON()).toEqual({ email: 'golfer@example.com', company: '' })
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    await expect(form.getByRole('status')).toContainText("You're on the list")
  })

  test('footer Notify me works on every page type', async ({ page }) => {
    await page.goto('/about')
    const form = page.getByTestId('footer-signup')
    await form.getByLabel('Email address').fill('golfer@example.com')
    const [response] = await Promise.all([
      page.waitForResponse('**/api/subscribe'),
      form.getByRole('button', { name: 'Notify me' }).click(),
    ])
    expect(response.status()).toBe(200)
    await expect(form.getByRole('status')).toContainText("You're on the list")
  })

  test('header Notify me jumps to the footer signup', async ({ page }) => {
    await page.setViewportSize({ width: 1280, height: 800 })
    await page.goto('/shop')
    await page.getByRole('banner').getByRole('link', { name: 'NOTIFY ME' }).click()
    await expect(page.getByTestId('footer-signup')).toBeInViewport()
  })

  test('clubhouse application sends only the email', async ({ page }) => {
    await page.goto('/club')
    await page.getByLabel('Full Name (For Brass Plate)').fill('Harrison Vance')
    await page.getByLabel('Private Dispatch Email *').fill('golfer@example.com')
    await expect(page.getByTestId('card-name')).toHaveText('Harrison Vance')
    const [request] = await Promise.all([
      page.waitForRequest('**/api/subscribe'),
      page.getByRole('button', { name: /MINT MY CREDENTIALS/ }).click(),
    ])
    expect(request.postDataJSON()).toEqual({ email: 'golfer@example.com', company: '' })
    await expect(page.getByRole('main').getByRole('status')).toContainText('Welcome to the Roster')
  })

  test('invalid email shows an inline error and does not call the API', async ({ page }) => {
    let apiCalls = 0
    page.on('request', (req) => {
      if (req.url().includes('/api/subscribe')) apiCalls += 1
    })
    await page.goto('/products/the-clingy-caddie')
    const form = page.locator('#notify')
    await form.getByLabel('Email address').fill('not-an-email')
    await form.getByRole('button', { name: 'Notify me' }).click()
    await expect(form.getByRole('alert')).toHaveText('Please enter a valid email address.')
    await expect(form.getByLabel('Email address')).toHaveAttribute('aria-invalid', 'true')
    expect(apiCalls).toBe(0)
  })

  test('API works with no Resend env vars and validates server-side', async ({ request }) => {
    const ok = await request.post('/api/subscribe', { data: { email: 'golfer@example.com' } })
    expect(ok.status()).toBe(200)
    expect(await ok.json()).toEqual({ ok: true })

    const bad = await request.post('/api/subscribe', { data: { email: 'nope' } })
    expect(bad.status()).toBe(400)
    expect((await bad.json()).ok).toBe(false)

    const wrongMethod = await request.get('/api/subscribe')
    expect(wrongMethod.status()).toBe(405)
  })
})
