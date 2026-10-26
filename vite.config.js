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

function tbagstoreSite(siteUrl) {
  let outDir
  return {
    name: 'tbagstore-site',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    // Dev server and build both start from the home page's tags; the build then writes a copy per route.
    transformIndexHtml(html) {
      return injectHead(html, pageMeta('/', siteUrl))
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml(siteUrl) })
    },
    writeBundle() {
      // Crawlers and link unfurlers don't run JS, so each route gets its own HTML with that page's
      // title, canonical, Open Graph/Twitter tags and JSON-LD already in <head>.
      const shell = readFileSync(path.join(outDir, 'index.html'), 'utf8')
      for (const route of ROUTES) {
        const file = path.join(outDir, routeHtmlFile(route.path))
        mkdirSync(path.dirname(file), { recursive: true })
        writeFileSync(file, injectHead(shell, pageMeta(route.path, siteUrl)))
      }
      // Vercel serves 404.html with a real 404 status for paths not matched by vercel.json.
      // It is the SPA shell, so React renders the NotFound page on top of it.
      writeFileSync(path.join(outDir, '404.html'), injectHead(shell, pageMeta('/__not_found__', siteUrl)))
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
