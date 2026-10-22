// Generates the placeholder brand images in public/ (run `npm run brand:images`, commit the output):
//   og-image.png          1200x630 share image (Open Graph / Twitter)
//   apple-touch-icon.png  180x180
//   favicon-32x32.png     32x32 PNG fallback for browsers without SVG favicons
//   favicon.svg
//   favicon.ico           32x32 (PNG inside an ICO wrapper) for crawlers that request /favicon.ico directly
// Uses LOGO_FILE from src/brand/brand.js when set, otherwise the text wordmark. Text is drawn
// with the bundled Inter TTF so the output is identical on every machine.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import { BRAND_COLOR, BRAND_NAME, BRAND_TEXT_COLOR, LOGO_FILE } from '../src/brand/brand.js'
import { share } from '../src/content/copy.js'
import { OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH } from '../src/seo.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const require = createRequire(import.meta.url)
const FONT_FILES = [
  require.resolve('@expo-google-fonts/inter/800ExtraBold/Inter_800ExtraBold.ttf'),
  require.resolve('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
]
const ACCENT = '#bbf7d0'

function escapeXml(value) {
  return String(value).replaceAll('&', '&amp;').replaceAll('<', '&lt;').replaceAll('>', '&gt;').replaceAll('"', '&quot;')
}

// The logo as a data URI so resvg (and browsers, for favicon.svg) need no external file.
function logoDataUri() {
  if (!LOGO_FILE) return null
  const file = path.join(publicDir, LOGO_FILE.replace(/^\/+/, ''))
  const ext = path.extname(file).toLowerCase()
  const types = { '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg' }
  if (!types[ext]) throw new Error(`Unsupported LOGO_FILE type: ${ext} (use svg, png or jpg)`)
  return `data:${types[ext]};base64,${readFileSync(file).toString('base64')}`
}

function ogImageSvg(logo) {
  const w = OG_IMAGE_WIDTH
  const h = OG_IMAGE_HEIGHT
  const mark = logo
    ? `<image href="${logo}" x="${w / 2 - 400}" y="140" width="800" height="260" preserveAspectRatio="xMidYMid meet" />`
    : `<text x="${w / 2}" y="330" text-anchor="middle" font-family="Inter" font-weight="800" font-size="168" letter-spacing="-6" fill="${BRAND_TEXT_COLOR}">${escapeXml(BRAND_NAME)}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <rect width="${w}" height="${h}" fill="${BRAND_COLOR}" />
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="32" fill="none" stroke="${ACCENT}" stroke-opacity="0.35" stroke-width="4" />
  ${mark}
  <rect x="${w / 2 - 60}" y="388" width="120" height="6" rx="3" fill="${ACCENT}" />
  <text x="${w / 2}" y="470" text-anchor="middle" font-family="Inter" font-weight="600" font-size="48" fill="${ACCENT}">${escapeXml(share.imageTagline)}</text>
</svg>`
}

// Square icon: rounded brand tile with the logo, or a "t" while the text placeholder is in use.
function iconSvg(logo, { fontFamily }) {
  const mark = logo
    ? `<image href="${logo}" x="8" y="8" width="48" height="48" preserveAspectRatio="xMidYMid meet" />`
    : `<text x="32" y="45" text-anchor="middle" font-family="${fontFamily}" font-size="38" font-weight="800" fill="${BRAND_TEXT_COLOR}">${escapeXml(BRAND_NAME[0])}</text>`
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
  <rect width="64" height="64" rx="14" fill="${BRAND_COLOR}" />
  ${mark}
</svg>`
}

function renderPng(svg, width) {
  const resvg = new Resvg(svg, {
    fitTo: { mode: 'width', value: width },
    font: { fontFiles: FONT_FILES, loadSystemFonts: false, defaultFontFamily: 'Inter' },
  })
  return resvg.render().asPng()
}

// An ICO file may hold a PNG image as-is: a 6-byte header, one 16-byte directory entry, then the PNG.
function pngToIco(png, size) {
  const header = Buffer.alloc(6)
  header.writeUInt16LE(0, 0) // reserved
  header.writeUInt16LE(1, 2) // type: icon
  header.writeUInt16LE(1, 4) // image count
  const entry = Buffer.alloc(16)
  entry.writeUInt8(size >= 256 ? 0 : size, 0) // width
  entry.writeUInt8(size >= 256 ? 0 : size, 1) // height
  entry.writeUInt8(0, 2) // palette colours
  entry.writeUInt8(0, 3) // reserved
  entry.writeUInt16LE(1, 4) // colour planes
  entry.writeUInt16LE(32, 6) // bits per pixel
  entry.writeUInt32LE(png.length, 8) // image size
  entry.writeUInt32LE(header.length + entry.length, 12) // image offset
  return Buffer.concat([header, entry, Buffer.from(png)])
}

function write(name, data) {
  writeFileSync(path.join(publicDir, name), data)
  console.log(`wrote public/${name}`)
}

const logo = logoDataUri()
write(OG_IMAGE_PATH.slice(1), renderPng(ogImageSvg(logo), OG_IMAGE_WIDTH))
// Apple touch icons are shown without transparency, so render the tile edge to edge (iOS rounds it).
const squareIcon = iconSvg(logo, { fontFamily: 'Inter' }).replace('rx="14"', 'rx="0"')
write('apple-touch-icon.png', renderPng(squareIcon, 180))
const favicon32 = renderPng(iconSvg(logo, { fontFamily: 'Inter' }), 32)
write('favicon-32x32.png', favicon32)
write('favicon.ico', pngToIco(favicon32, 32))
write(
  'favicon.svg',
  `<!-- Placeholder favicon generated by scripts/generate-brand-images.mjs. -->\n${iconSvg(logo, {
    fontFamily: 'system-ui, sans-serif',
  })}\n`,
)
