// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'
import { buildRobotsTxt, buildSitemapXml, resolveSiteUrl } from '../../src/seo.js'
import { ROUTES, isKnownRoute } from '../../src/routes.js'

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
    expect(locs).toEqual([`${DEFAULT}/`, `${DEFAULT}/products/magnetic-golf-towel`, `${DEFAULT}/privacy`])
    for (const loc of locs) expect(loc.startsWith(`${DEFAULT}/`)).toBe(true)
  })
})

describe('routes and vercel.json', () => {
  const vercel = JSON.parse(readFileSync(new URL('../../vercel.json', import.meta.url), 'utf8'))

  it('rewrites exactly the non-root routes to the SPA (no catch-all, so unknown paths 404)', () => {
    const sources = vercel.rewrites.map((r) => r.source).sort()
    const expected = ROUTES.map((r) => r.path)
      .filter((p) => p !== '/')
      .sort()
    expect(sources).toEqual(expected)
    for (const rewrite of vercel.rewrites) expect(rewrite.destination).toBe('/index.html')
  })

  it('isKnownRoute matches real pages only', () => {
    expect(isKnownRoute('/')).toBe(true)
    expect(isKnownRoute('/products/magnetic-golf-towel')).toBe(true)
    expect(isKnownRoute('/privacy/')).toBe(true)
    expect(isKnownRoute('/nope')).toBe(false)
    expect(isKnownRoute('/products')).toBe(false)
  })
})
