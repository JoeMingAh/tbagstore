// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildRobotsTxt, buildSitemapXml, resolveSiteUrl } from '../../src/seo.js'
import { REDIRECTS, ROUTES, TOWEL_PATH, findRedirect, isKnownRoute, routeHtmlFile } from '../../src/routes.js'

const DEFAULT = 'https://www.tbagstore.com'

describe('resolveSiteUrl', () => {
  it('defaults to the www origin', () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT)
    expect(resolveSiteUrl('')).toBe(DEFAULT)
  })
  it('normalizes a trailing slash and path', () => {
    expect(resolveSiteUrl('https://www.tbagstore.com/')).toBe(DEFAULT)
    expect(resolveSiteUrl('https://staging.example.com/foo')).toBe('https://staging.example.com')
  })
  it('rejects non-http values', () => {
    expect(resolveSiteUrl('javascript:alert(1)')).toBe(DEFAULT)
    expect(resolveSiteUrl('not a url')).toBe(DEFAULT)
  })
})

describe('robots.txt and sitemap.xml', () => {
  it('robots.txt points at the sitemap on the canonical origin', () => {
    const robots = buildRobotsTxt(DEFAULT)
    expect(robots).toContain('User-agent: *')
    expect(robots).toContain(`Sitemap: ${DEFAULT}/sitemap.xml`)
  })

  it('sitemap lists only canonical-origin URLs for every public route', () => {
    const xml = buildSitemapXml(DEFAULT)
    const locs = [...xml.matchAll(/<loc>(.*?)<\/loc>/g)].map((m) => m[1])
    expect(locs).toEqual([
      `${DEFAULT}/`,
      `${DEFAULT}/shop`,
      `${DEFAULT}/products/the-first-tee-sack`,
      `${DEFAULT}/products/the-heavy-hitter`,
      `${DEFAULT}/products/the-clingy-caddie`,
      `${DEFAULT}/products/the-sandbaggers-stash`,
      `${DEFAULT}/products/the-crown-jewel`,
      `${DEFAULT}/products/the-yardage-alibi`,
      `${DEFAULT}/products/the-gentlemans-timber`,
      `${DEFAULT}/products/the-back-nine-flask-valet-pouch`,
      `${DEFAULT}/about`,
      `${DEFAULT}/club`,
      `${DEFAULT}/faq`,
      `${DEFAULT}/shipping`,
      `${DEFAULT}/returns`,
      `${DEFAULT}/privacy`,
    ])
    for (const loc of locs) expect(loc.startsWith(`${DEFAULT}/`)).toBe(true)
  })

  it('has no checkout and leaves old URLs out of the sitemap', () => {
    const xml = buildSitemapXml(DEFAULT)
    expect(xml).not.toContain('/checkout')
    expect(xml).not.toContain('/products/magnetic-golf-towel')
    expect(xml).not.toContain('/towel')
  })
})

describe('routes and vercel.json', () => {
  const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))

  it('rewrites exactly the non-root routes to their prerendered HTML (no catch-all, so unknown paths 404)', () => {
    const sources = vercel.rewrites.map((r) => r.source).sort()
    const expected = ROUTES.map((r) => r.path)
      .filter((p) => p !== '/')
      .sort()
    expect(sources).toEqual(expected)
    for (const rewrite of vercel.rewrites) expect(rewrite.destination).toBe(routeHtmlFile(rewrite.source))
  })

  it('permanently redirects the old towel URLs to The Clingy Caddie, matching REDIRECTS', () => {
    expect(TOWEL_PATH).toBe('/products/the-clingy-caddie')
    expect(vercel.redirects).toEqual(REDIRECTS.map((r) => ({ ...r, permanent: true })))
    for (const { source, destination } of vercel.redirects) {
      expect(isKnownRoute(destination)).toBe(true)
      expect(isKnownRoute(source)).toBe(false)
    }
    expect(findRedirect('/products/magnetic-golf-towel')?.destination).toBe(TOWEL_PATH)
    expect(findRedirect('/towel/')?.destination).toBe(TOWEL_PATH)
    expect(findRedirect('/shop')).toBeNull()
  })

  it('isKnownRoute matches real pages only', () => {
    for (const path of ['/', '/shop', '/products/the-clingy-caddie', '/club', '/about', '/privacy/']) {
      expect(isKnownRoute(path), path).toBe(true)
    }
    for (const path of ['/faq', '/shipping', '/returns']) expect(isKnownRoute(path)).toBe(true)
    expect(isKnownRoute('/nope')).toBe(false)
    expect(isKnownRoute('/products')).toBe(false)
    expect(isKnownRoute('/products/magnetic-golf-towel')).toBe(false)
    expect(isKnownRoute('/checkout')).toBe(false)
    expect(isKnownRoute('/shop/the-clingy-caddie')).toBe(false)
    expect(isKnownRoute('/products/not-a-product')).toBe(false)
    expect(isKnownRoute('/products/the-clingy-caddie/extra')).toBe(false)
  })
})
