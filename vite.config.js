/// <reference types="vitest/config" />
import { existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { ROUTES, findRedirect, findRoute, routeHtmlFile } from './src/routes.js'
import { buildRobotsTxt, buildSitemapXml, injectHead, pageMeta, resolveSiteUrl } from './src/seo.js'
import subscribeHandler from './api/subscribe.js'

// Vercel serves the Web Analytics script itself in production. Locally there is nothing at that
// path, so preview answers with an empty script (no 404 console error, nothing gets sent).
const ANALYTICS_SCRIPT_PATH = '/_vercel/insights/script.js'

function analyticsStubMiddleware(req, res, next) {
  if ((req.url || '').split('?')[0] !== ANALYTICS_SCRIPT_PATH) return next()
  res.setHeader('Content-Type', 'text/javascript; charset=utf-8')
  res.end('// Vercel Web Analytics is only active on Vercel deployments.\n')
}

// Local stand-in for the Vercel function so dev, preview and Playwright hit the real handler.
function apiMiddleware(req, res, next) {
  const pathname = (req.url || '').split('?')[0]
  if (pathname !== '/api/subscribe') return next()
  let raw = ''
  req.setEncoding('utf8')
  req.on('data', (chunk) => {
    raw += chunk
  })
  req.on('end', () => {
    req.body = raw
    subscribeHandler(req, res)
  })
}

function sendHtml(res, status, file) {
  res.statusCode = status
  res.setHeader('Content-Type', 'text/html; charset=utf-8')
  res.end(readFileSync(file))
}

// Mirrors vercel.json: moved URLs get a permanent redirect, known routes get their prerendered
// HTML (rewrites), real files are served as-is, and everything else gets 404.html with a 404 status.
function routingMiddleware(outDir) {
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    let pathname
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0])
    } catch {
      pathname = '/__malformed__'
    }
    if (pathname.startsWith('/api/')) return next()
    const redirect = findRedirect(pathname)
    if (redirect) {
      res.statusCode = 308
      res.setHeader('Location', redirect.destination)
      return res.end()
    }
    const route = findRoute(pathname)
    if (route) return sendHtml(res, 200, path.join(outDir, routeHtmlFile(route.path)))
    const file = path.join(outDir, pathname)
    if (file.startsWith(outDir + path.sep) && existsSync(file) && statSync(file).isFile()) return next()
    sendHtml(res, 404, path.join(outDir, '404.html'))
  }
}

// Font files the hero paints with (headline in Cormorant 400 + 400 italic, pitch in Jakarta 400).
// They're preloaded so the swap from the fallback font lands early; every other face (all
// font-display: swap) loads only when the CSS needs it. Matched against the built asset names.
const CRITICAL_FONTS = [
  /^assets\/cormorant-garamond-latin-400-normal-[\w-]+\.woff2$/,
  /^assets\/cormorant-garamond-latin-400-italic-[\w-]+\.woff2$/,
  /^assets\/plus-jakarta-sans-latin-400-normal-[\w-]+\.woff2$/,
]

function fontPreloadTags(bundle) {
  return CRITICAL_FONTS.map((pattern) => {
    const fileName = Object.keys(bundle).find((name) => pattern.test(name))
    if (!fileName) throw new Error(`Critical font ${pattern} is missing from the build`)
    return {
      tag: 'link',
      attrs: { rel: 'preload', href: `/${fileName}`, as: 'font', type: 'font/woff2', crossorigin: '' },
      injectTo: 'head',
    }
  })
}

const ROOT_MARKUP = '<div id="root"></div>'

// The pages are prerendered, so the app bundle is only needed to hydrate. Starting it after the
// first frame lets the browser paint the HTML first instead of parsing ~100 KB of JS before it.
// Forms keep their submit buttons disabled until hydrated (src/hooks/useHydrated.js).
const ENTRY_SCRIPT = /<script type="module" crossorigin src="(\/assets\/[^"]+\.js)"><\/script>/

function deferEntryScript(html) {
  if (!ENTRY_SCRIPT.test(html)) throw new Error('Built index.html has no entry <script type="module" src=...>')
  return html.replace(
    ENTRY_SCRIPT,
    (_, src) => `<script type="module">requestAnimationFrame(() => setTimeout(() => import(${JSON.stringify(src)})))</script>`,
  )
}

// Renders App for each route at build time with the project's own Vite config (same env,
// SHOW_PRICES and SITE_URL as the client bundle), so the markup matches what hydrates it.
async function loadRenderer(root, mode) {
  const { createServer } = await import('vite')
  const server = await createServer({
    root,
    mode,
    logLevel: 'error',
    appType: 'custom',
    server: { middlewareMode: true, hmr: false, ws: false },
  })
  const { render } = await server.ssrLoadModule('/src/entry-server.jsx')
  return { render, close: () => server.close() }
}

// Fails the build instead of shipping (or testing) a dist/ with a route page missing or empty.
function verifyPrerender(outDir) {
  const problems = []
  for (const route of ROUTES) {
    const file = path.join(outDir, routeHtmlFile(route.path))
    if (!existsSync(file)) problems.push(`${route.path}: ${file} was not written`)
    else if (readFileSync(file, 'utf8').includes(ROOT_MARKUP)) problems.push(`${route.path}: #root is empty`)
  }
  if (!existsSync(path.join(outDir, '404.html'))) problems.push('404.html was not written')
  if (problems.length) throw new Error(`Prerender incomplete:\n  ${problems.join('\n  ')}`)
}

function tbagstoreSite(siteUrl) {
  let outDir
  let config
  return {
    name: 'tbagstore-site',
    configResolved(resolved) {
      config = resolved
      outDir = path.resolve(resolved.root, resolved.build.outDir)
    },
    // Dev server and build both start from the home page's tags; the build then writes a copy per route.
    transformIndexHtml(html, ctx) {
      const out = injectHead(html, pageMeta('/', siteUrl))
      return ctx.bundle ? { html: deferEntryScript(out), tags: fontPreloadTags(ctx.bundle) } : out
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml(siteUrl) })
    },
    async writeBundle() {
      // Crawlers and link unfurlers don't run JS, so each route gets its own HTML with that page's
      // title, canonical, Open Graph/Twitter tags and JSON-LD already in <head>, and the page's
      // markup already in #root (first paint without waiting for the JS bundle).
      const shell = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      if (!shell.includes(ROOT_MARKUP)) throw new Error(`index.html is missing ${ROOT_MARKUP}`)
      const renderer = await loadRenderer(config.root, config.mode)
      try {
        for (const route of ROUTES) {
          const file = path.join(outDir, routeHtmlFile(route.path))
          const html = injectHead(shell, pageMeta(route.path, siteUrl)).replace(
            ROOT_MARKUP,
            () => `<div id="root">${renderer.render(route.path)}</div>`,
          )
          mkdirSync(path.dirname(file), { recursive: true })
          writeFileSync(file, html)
        }
      } finally {
        await renderer.close()
      }
      // Vercel serves 404.html with a real 404 status for paths not matched by vercel.json.
      // It is the empty SPA shell, so React renders the NotFound page on top of it.
      writeFileSync(path.join(outDir, '404.html'), injectHead(shell, pageMeta('/__not_found__', siteUrl)))
      verifyPrerender(outDir)
    },
    configureServer(server) {
      server.middlewares.use(apiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware)
      server.middlewares.use(analyticsStubMiddleware)
      server.middlewares.use(routingMiddleware(outDir))
    },
  }
}

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '')
  // Make .env.local values visible to the local /api handler (Vercel injects them in prod).
  for (const [key, value] of Object.entries(env)) {
    if (process.env[key] === undefined) process.env[key] = value
  }
  const siteUrl = resolveSiteUrl(process.env.SITE_URL)

  return {
    plugins: [react(), tailwindcss(), tbagstoreSite(siteUrl)],
    // SHOW_PRICES=true (env or .env.local) reveals draft prices; see src/content/products.js.
    envPrefix: ['VITE_', 'SHOW_PRICES'],
    // Lets the browser build the same canonical/OG URLs as the prerendered HTML.
    define: { 'import.meta.env.SITE_URL': JSON.stringify(siteUrl) },
    test: {
      environment: 'jsdom',
      include: ['tests/unit/**/*.test.{js,jsx}'],
      setupFiles: ['tests/unit/setup.js'],
    },
  }
})
