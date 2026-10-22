import { expect, test } from '@playwright/test'

test.describe('email signup', () => {
  test('valid email shows success and the API returns 200 {ok:true}', async ({ page }) => {
    await page.goto('/')
    const form = page.locator('#signup')
    await form.getByLabel('Email address').fill('golfer@example.com')
    const [response] = await Promise.all([
      page.waitForResponse('**/api/subscribe'),
      form.getByRole('button', { name: 'Notify me' }).click(),
    ])
    expect(response.status()).toBe(200)
    expect(await response.json()).toEqual({ ok: true })
    await expect(form.getByRole('status')).toContainText("You're on the list")
  })

  test('invalid email shows an inline error and does not call the API', async ({ page }) => {
    let apiCalls = 0
    page.on('request', (req) => {
      if (req.url().includes('/api/subscribe')) apiCalls += 1
    })
    await page.goto('/products/magnetic-golf-towel')
    const form = page.locator('#signup')
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
