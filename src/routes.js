// Single list of real page routes. Used by the router, the sitemap, the per-route HTML
// prerender (head tags for crawlers), the 404 check in vite preview, and a unit test that
// keeps vercel.json rewrites/redirects in sync. `metaKey` points at the page's entry in copy.js
// `meta`; product routes carry `productSlug` and take their tags from src/content/products.js.
import { PRODUCTS, productPath, slugify } from './content/products.js'

export const SHOP_PATH = '/shop'

// The coming-soon site's magnetic towel is now The Clingy Caddie.
export const TOWEL_PATH = productPath(slugify('The Clingy Caddie'))

export const ROUTES = [
  { path: '/', metaKey: 'home', inSitemap: true },
  { path: SHOP_PATH, metaKey: 'shop', inSitemap: true },
  ...PRODUCTS.map((product) => ({
    path: productPath(product.slug),
    metaKey: 'product',
    productSlug: product.slug,
    inSitemap: true,
  })),
  { path: '/about', metaKey: 'about', inSitemap: true },
  { path: '/club', metaKey: 'club', inSitemap: true },
  { path: '/faq', metaKey: 'faq', inSitemap: true },
  { path: '/shipping', metaKey: 'shipping', inSitemap: true },
  { path: '/returns', metaKey: 'returns', inSitemap: true },
  { path: '/privacy', metaKey: 'privacy', inSitemap: true },
]

// Old URLs that moved. Mirrored as permanent redirects in vercel.json and in vite preview.
export const REDIRECTS = [
  { source: '/products/magnetic-golf-towel', destination: TOWEL_PATH },
  { source: '/towel', destination: TOWEL_PATH },
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

export function findRedirect(pathname) {
  const path = normalizePath(pathname)
  return REDIRECTS.find((redirect) => redirect.source === path) || null
}

export function isKnownRoute(pathname) {
  return findRoute(pathname) !== null
}

// Built HTML file (relative to dist/) that serves a route, with that page's head tags baked in.
// vercel.json rewrites each non-root route to this file.
export function routeHtmlFile(path) {
  return path === '/' ? '/index.html' : `${path}/index.html`
}
