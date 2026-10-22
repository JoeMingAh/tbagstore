import { DEFAULT_SITE_URL, ROUTES } from './routes.js'

// Returns the canonical origin (no trailing slash). Falls back to the default when
// SITE_URL is unset or not an absolute http(s) URL, so a bad env value can't leak
// odd URLs into robots.txt or the sitemap.
export function resolveSiteUrl(value) {
  if (!value || typeof value !== 'string') return DEFAULT_SITE_URL
  try {
    const url = new URL(value.trim())
    if (url.protocol !== 'https:' && url.protocol !== 'http:') return DEFAULT_SITE_URL
    return url.origin
  } catch {
    return DEFAULT_SITE_URL
  }
}

export function absoluteUrl(siteUrl, path) {
  return path === '/' ? `${siteUrl}/` : `${siteUrl}${path}`
}

export function buildRobotsTxt(siteUrl) {
  return ['User-agent: *', 'Allow: /', 'Disallow: /api/', '', `Sitemap: ${siteUrl}/sitemap.xml`, ''].join('\n')
}

export function buildSitemapXml(siteUrl) {
  const urls = ROUTES.filter((route) => route.inSitemap)
    .map((route) => `  <url>\n    <loc>${absoluteUrl(siteUrl, route.path)}</loc>\n  </url>`)
    .join('\n')
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`
}
