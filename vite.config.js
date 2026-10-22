/// <reference types="vitest/config" />
import { existsSync, readFileSync, statSync, copyFileSync } from 'node:fs'
import path from 'node:path'
import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { isKnownRoute } from './src/routes.js'
import { buildRobotsTxt, buildSitemapXml, resolveSiteUrl } from './src/seo.js'
import subscribeHandler from './api/subscribe.js'

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

// Mirrors vercel.json: known routes get the SPA, unknown routes get 404.html with a 404 status.
function notFoundMiddleware(outDir) {
  return (req, res, next) => {
    if (req.method !== 'GET' && req.method !== 'HEAD') return next()
    let pathname
    try {
      pathname = decodeURIComponent((req.url || '/').split('?')[0])
    } catch {
      pathname = '/__malformed__'
    }
    if (pathname.startsWith('/api/') || isKnownRoute(pathname)) return next()
    const file = path.join(outDir, pathname)
    if (file.startsWith(outDir + path.sep) && existsSync(file) && statSync(file).isFile()) return next()
    res.statusCode = 404
    res.setHeader('Content-Type', 'text/html; charset=utf-8')
    res.end(readFileSync(path.join(outDir, '404.html')))
  }
}

function tbagstoreSite(siteUrl) {
  let outDir
  return {
    name: 'tbagstore-site',
    configResolved(config) {
      outDir = path.resolve(config.root, config.build.outDir)
    },
    transformIndexHtml(html) {
      return html.replaceAll('%SITE_URL%', siteUrl)
    },
    generateBundle() {
      this.emitFile({ type: 'asset', fileName: 'robots.txt', source: buildRobotsTxt(siteUrl) })
      this.emitFile({ type: 'asset', fileName: 'sitemap.xml', source: buildSitemapXml(siteUrl) })
    },
    writeBundle() {
      // Vercel serves 404.html with a real 404 status for paths not matched by vercel.json.
      // It is the SPA shell, so React renders the NotFound page on top of it.
      copyFileSync(path.join(outDir, 'index.html'), path.join(outDir, '404.html'))
    },
    configureServer(server) {
      server.middlewares.use(apiMiddleware)
    },
    configurePreviewServer(server) {
      server.middlewares.use(apiMiddleware)
      server.middlewares.use(notFoundMiddleware(outDir))
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
    test: {
      environment: 'jsdom',
      include: ['tests/unit/**/*.test.{js,jsx}'],
      setupFiles: ['tests/unit/setup.js'],
    },
  }
})
