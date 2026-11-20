import { readFileSync } from 'node:fs'
import path from 'node:path'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  PRODUCTS,
  PRODUCT_STATUS,
  SHOW_PRICES,
  findProduct,
  formatPrice,
  priceLabel,
  productPath,
} from '../../src/content/products.js'

describe('product catalog (src/content/products.js)', () => {
  it('has the 8 mockup products, each with name, slug, tagline, description and price', () => {
    expect(PRODUCTS).toHaveLength(8)
    for (const product of PRODUCTS) {
      expect(product.name).toBeTruthy()
      expect(product.slug).toMatch(/^[a-z0-9]+(-[a-z0-9]+)*$/)
      expect(product.tagline).toBeTruthy()
      expect(product.description).toBeTruthy()
      expect(typeof product.price).toBe('number')
      expect(product.price).toBeGreaterThan(0)
    }
  })

  it('gives every product a unique slug and a /products/:slug URL', () => {
    expect(new Set(PRODUCTS.map((p) => p.slug)).size).toBe(PRODUCTS.length)
    for (const product of PRODUCTS) {
      expect(productPath(product.slug)).toBe(`/products/${product.slug}`)
      expect(findProduct(product.slug)).toBe(product)
    }
    expect(findProduct('nope')).toBeNull()
  })

  it('marks every product "Coming soon"', () => {
    expect(PRODUCT_STATUS).toBe('Coming soon')
    for (const product of PRODUCTS) expect(product.status).toBe('Coming soon')
  })

  it('uses placeholders, not hotlinked photos', () => {
    for (const product of PRODUCTS) {
      expect(product.image).toBeNull()
      expect(product.secondaryImage).toBeNull()
    }
  })
})

describe('SHOW_PRICES', () => {
  afterEach(() => {
    vi.unstubAllEnvs()
    vi.resetModules()
  })

  it('is off by default, so priceLabel hides every price', () => {
    expect(SHOW_PRICES).toBe(false)
    for (const product of PRODUCTS) expect(priceLabel(product)).toBeNull()
  })

  it('formats prices only when switched on', () => {
    const product = findProduct('the-heavy-hitter')
    expect(priceLabel(product, true)).toBe('$95.00')
    expect(formatPrice(48)).toBe('$48.00')
  })

  it('reads SHOW_PRICES=true from the environment and ignores other values', async () => {
    vi.stubEnv('SHOW_PRICES', 'true')
    vi.resetModules()
    expect((await import('../../src/content/products.js')).SHOW_PRICES).toBe(true)

    vi.stubEnv('SHOW_PRICES', '1')
    vi.resetModules()
    expect((await import('../../src/content/products.js')).SHOW_PRICES).toBe(false)
  })

  it('is exposed to the client build through envPrefix', () => {
    const config = readFileSync(path.resolve(process.cwd(), 'vite.config.js'), 'utf8')
    expect(config).toMatch(/envPrefix:\s*\[[^\]]*'SHOW_PRICES'/)
  })

  it('no component reads product.price directly (all go through priceLabel)', () => {
    const files = ['src/components/ProductCard.jsx', 'src/pages/Product.jsx', 'src/pages/Home.jsx', 'src/pages/Shop.jsx']
    for (const file of files) {
      expect(readFileSync(path.resolve(process.cwd(), file), 'utf8'), file).not.toMatch(/\.price\b/)
    }
  })
})
