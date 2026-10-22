// Single list of real page routes. Used by the router, the sitemap, the per-route HTML
// prerender (head tags for crawlers), the 404 check in vite preview, and a unit test that
// keeps vercel.json rewrites in sync. `metaKey` points at the page's entry in copy.js `meta`.
export const PRODUCT_PATH = '/products/magnetic-golf-towel'

export const ROUTES = [
  { path: '/', metaKey: 'home', inSitemap: true },
  { path: PRODUCT_PATH, metaKey: 'product', inSitemap: true },
  { path: '/faq', metaKey: 'faq', inSitemap: true },
  { path: '/shipping', metaKey: 'shipping', inSitemap: true },
  { path: '/returns', metaKey: 'returns', inSitemap: true },
  { path: '/privacy', metaKey: 'privacy', inSitemap: true },
]

export const DEFAULT_SITE_URL = 'https://www.tbagstore.com'

export function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function findRoute(pathname) {
  const path = normalizePath(pathname)
  return ROUTES.find((route) => route.path === path) || null
}

export function isKnownRoute(pathname) {
  return findRoute(pathname) !== null
}

// Built HTML file (relative to dist/) that serves a route, with that page's head tags baked in.
// vercel.json rewrites each non-root route to this file.
export function routeHtmlFile(path) {
  return path === '/' ? '/index.html' : `${path}/index.html`
}
