import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { meta as metaCopy } from '../../src/content/copy.js'
import { PRODUCT_PATH } from '../../src/routes.js'
import { SEO_END, SEO_START, applyHeadMeta, headTags, injectHead, pageMeta, renderHeadHtml } from '../../src/seo.js'

const SITE = 'https://www.tbagstore.com'
const OG_IMAGE = `${SITE}/og-image.png`

const PAGES = [
  { path: '/', key: 'home', title: metaCopy.home.title, canonical: `${SITE}/` },
  { path: PRODUCT_PATH, key: 'product', title: 'Magnetic Golf Towel with Tee | tbagstore', canonical: `${SITE}${PRODUCT_PATH}` },
  { path: '/privacy', key: 'privacy', title: 'Privacy | tbagstore', canonical: `${SITE}/privacy` },
  { path: '/faq', key: 'faq', title: 'FAQ | tbagstore', canonical: `${SITE}/faq` },
  { path: '/shipping', key: 'shipping', title: 'Shipping | tbagstore', canonical: `${SITE}/shipping` },
  { path: '/returns', key: 'returns', title: 'Returns | tbagstore', canonical: `${SITE}/returns` },
]

function tagMap(meta) {
  const map = {}
  for (const { attrs } of headTags(meta)) {
    const key = attrs.property || attrs.name || attrs.rel
    if (key) map[key] = attrs.content ?? attrs.href
  }
  return map
}

function jsonLdTypes(meta) {
  return headTags(meta)
    .filter((t) => t.tag === 'script')
    .map((t) => JSON.parse(t.text)['@type'])
}

describe('per-page meta tags', () => {
  it.each(PAGES)('$path has its own title, description, canonical, OG and Twitter tags', ({ path, key, title, canonical }) => {
    const meta = pageMeta(path, SITE)
    const tags = tagMap(meta)
    expect(meta.title).toBe(title)
    expect(tags.description).toBe(metaCopy[key].description)
    expect(tags.canonical).toBe(canonical)
    expect(tags.robots).toBeUndefined()
    expect(tags['og:title']).toBe(title)
    expect(tags['og:description']).toBe(metaCopy[key].description)
    expect(tags['og:url']).toBe(canonical)
    expect(tags['og:image']).toBe(OG_IMAGE)
    expect(tags['og:image:width']).toBe('1200')
    expect(tags['og:image:height']).toBe('630')
    expect(tags['twitter:card']).toBe('summary_large_image')
    expect(tags['twitter:title']).toBe(title)
    expect(tags['twitter:description']).toBe(metaCopy[key].description)
    expect(tags['twitter:image']).toBe(OG_IMAGE)
  })

  it('treats a trailing slash as the same page', () => {
    expect(pageMeta('/faq/', SITE).canonical).toBe(`${SITE}/faq`)
  })

  it('gives unknown paths the 404 tags with noindex', () => {
    const meta = pageMeta('/nope', SITE)
    const tags = tagMap(meta)
    expect(meta.title).toBe('Page not found | tbagstore')
    expect(tags.robots).toBe('noindex')
    expect(tags.canonical).toBe(`${SITE}/`)
    expect(tags['og:image']).toBe(OG_IMAGE)
    expect(jsonLdTypes(meta)).toEqual([])
  })

  it('every canonical, og:url and image URL is absolute on www.tbagstore.com', () => {
    for (const path of [...PAGES.map((p) => p.path), '/nope']) {
      const tags = tagMap(pageMeta(path, SITE))
      for (const key of ['canonical', 'og:url', 'og:image', 'twitter:image']) {
        expect(tags[key]).toMatch(/^https:\/\/www\.tbagstore\.com\//)
      }
    }
  })
})

describe('JSON-LD', () => {
  it('home has Organization only', () => {
    expect(jsonLdTypes(pageMeta('/', SITE))).toEqual(['Organization'])
  })

  it('product page has Product only, with no price or offers', () => {
    const meta = pageMeta(PRODUCT_PATH, SITE)
    expect(jsonLdTypes(meta)).toEqual(['Product'])
    const product = meta.jsonLd[0]
    expect(product.name).toBe('Magnetic Golf Towel with Tee')
    expect(product.url).toBe(`${SITE}${PRODUCT_PATH}`)
    expect(product.image).toBe(OG_IMAGE)
    const raw = JSON.stringify(product)
    expect(raw).not.toMatch(/offers|price/i)
  })

  it('other pages have no JSON-LD', () => {
    for (const path of ['/privacy', '/faq', '/shipping', '/returns']) expect(jsonLdTypes(pageMeta(path, SITE))).toEqual([])
  })

  it('the rendered script tags are valid JSON', () => {
    for (const path of ['/', PRODUCT_PATH]) {
      const html = renderHeadHtml(pageMeta(path, SITE))
      const scripts = [...html.matchAll(/<script data-seo type="application\/ld\+json">(.*?)<\/script>/g)]
      expect(scripts).toHaveLength(1)
      expect(() => JSON.parse(scripts[0][1])).not.toThrow()
    }
  })
})

describe('head HTML', () => {
  it('escapes attribute values and keeps JSON-LD from closing its script tag', () => {
    const meta = {
      ...pageMeta('/', SITE),
      title: 'A <b>"quoted"</b> & title',
      description: '"><script>alert(1)</script>',
      jsonLd: [{ name: '</script><script>alert(1)</script>' }],
    }
    const html = renderHeadHtml(meta)
    expect(html).toContain('<title>A &lt;b&gt;&quot;quoted&quot;&lt;/b&gt; &amp; title</title>')
    expect(html).toContain('content="&quot;&gt;&lt;script&gt;alert(1)&lt;/script&gt;"')
    expect(html.match(/<\/script>/g)).toHaveLength(1)
    const json = html.match(/application\/ld\+json">(.*?)<\/script>/)[1]
    expect(JSON.parse(json).name).toBe('</script><script>alert(1)</script>')
  })

  it('injectHead replaces only the marked block', () => {
    const shell = `<head><meta charset="UTF-8" />${SEO_START}old${SEO_END}</head>`
    const html = injectHead(shell, pageMeta('/faq', SITE))
    expect(html).toContain('<meta charset="UTF-8" />')
    expect(html).not.toContain('old')
    expect(html).toContain(`<link data-seo rel="canonical" href="${SITE}/faq" />`)
    expect(() => injectHead('<head></head>', pageMeta('/', SITE))).toThrow(/markers/)
  })

  it('index.html has the markers the build fills in', () => {
    const html = readFileSync(path.resolve(process.cwd(), 'index.html'), 'utf8')
    expect(html).toContain(SEO_START)
    expect(html).toContain(SEO_END)
  })
})

describe('applyHeadMeta (client-side navigation)', () => {
  it('replaces the previous page tags instead of stacking them', () => {
    applyHeadMeta(document, pageMeta('/', SITE))
    applyHeadMeta(document, pageMeta(PRODUCT_PATH, SITE))
    expect(document.title).toBe('Magnetic Golf Towel with Tee | tbagstore')
    expect(document.querySelectorAll('link[rel="canonical"]')).toHaveLength(1)
    expect(document.querySelector('link[rel="canonical"]').href).toBe(`${SITE}${PRODUCT_PATH}`)
    expect(document.querySelector('meta[property="og:url"]').content).toBe(`${SITE}${PRODUCT_PATH}`)
    const scripts = document.querySelectorAll('script[type="application/ld+json"]')
    expect(scripts).toHaveLength(1)
    expect(JSON.parse(scripts[0].textContent)['@type']).toBe('Product')

    applyHeadMeta(document, pageMeta('/faq', SITE))
    expect(document.querySelectorAll('script[type="application/ld+json"]')).toHaveLength(0)
    expect(document.querySelectorAll('meta[property="og:title"]')).toHaveLength(1)
  })
})

describe('generated brand images', () => {
  function pngSize(file) {
    const buf = readFileSync(path.resolve(process.cwd(), 'public', file))
    expect(buf.subarray(1, 4).toString('ascii')).toBe('PNG')
    return { width: buf.readUInt32BE(16), height: buf.readUInt32BE(20) }
  }

  it('og-image.png is 1200x630', () => {
    expect(pngSize('og-image.png')).toEqual({ width: 1200, height: 630 })
  })

  it('favicon.ico is a valid 32x32 icon wrapping the PNG favicon', () => {
    const ico = readFileSync(path.resolve(process.cwd(), 'public', 'favicon.ico'))
    expect(ico.readUInt16LE(2)).toBe(1)
    expect(ico.readUInt16LE(4)).toBe(1)
    expect(ico.readUInt8(6)).toBe(32)
    expect(ico.readUInt8(7)).toBe(32)
    const offset = ico.readUInt32LE(18)
    expect(ico.subarray(offset, offset + 8)).toEqual(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))
    expect(ico.readUInt32LE(14)).toBe(ico.length - offset)
  })

  it('apple-touch-icon.png is 180x180 and favicon-32x32.png is 32x32', () => {
    expect(pngSize('apple-touch-icon.png')).toEqual({ width: 180, height: 180 })
    expect(pngSize('favicon-32x32.png')).toEqual({ width: 32, height: 32 })
  })
})
