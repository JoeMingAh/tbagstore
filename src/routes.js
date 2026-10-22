// Single list of real page routes. Used by the router, the sitemap, the 404 check in
// vite preview, and a unit test that keeps vercel.json rewrites in sync.
export const PRODUCT_PATH = '/products/magnetic-golf-towel'

export const ROUTES = [
  { path: '/', title: 'Home', inSitemap: true },
  { path: PRODUCT_PATH, title: 'Magnetic Golf Towel with Tee', inSitemap: true },
  { path: '/privacy', title: 'Privacy', inSitemap: true },
]

export const DEFAULT_SITE_URL = 'https://www.tbagstore.com'

export function normalizePath(pathname) {
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.slice(0, -1)
  return pathname
}

export function isKnownRoute(pathname) {
  const path = normalizePath(pathname)
  return ROUTES.some((route) => route.path === path)
}
