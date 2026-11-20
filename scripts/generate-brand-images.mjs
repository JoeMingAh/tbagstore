// Generates the placeholder brand images in public/ (run `npm run brand:images`, commit the output):
//   og-image.png          1200x630 share image (Open Graph / Twitter)
//   apple-touch-icon.png  180x180
//   favicon-32x32.png     32x32 PNG fallback for browsers without SVG favicons
//   favicon.svg
//   favicon.ico           32x32 (PNG inside an ICO wrapper) for crawlers that request /favicon.ico directly
// Uses LOGO_FILE from src/brand/brand.js when set, otherwise the crest + "TBAGGER" wordmark from
// the design. Text is drawn with bundled TTFs (Cormorant Garamond for the wordmark, Inter for the
// small caps line) so the output is identical on every machine.
import { readFileSync, writeFileSync } from 'node:fs'
import { createRequire } from 'node:module'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import { Resvg } from '@resvg/resvg-js'
import {
  BRAND_ACCENT_COLOR,
  BRAND_COLOR,
  BRAND_NAME,
  BRAND_TEXT_COLOR,
  BRAND_WORDMARK,
  LOGO_FILE,
} from '../src/brand/brand.js'
import { share } from '../src/content/copy.js'
import { OG_IMAGE_HEIGHT, OG_IMAGE_PATH, OG_IMAGE_WIDTH } from '../src/seo.js'

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..')
const publicDir = path.join(root, 'public')
const require = createRequire(import.meta.url)
const FONT_FILES = [
  require.resolve('@expo-google-fonts/cormorant-garamond/700Bold/CormorantGaramond_700Bold.ttf'),
  require.resolve('@expo-google-fonts/cormorant-garamond/400Regular_Italic/CormorantGaramond_400Regular_Italic.ttf'),
  require.resolve('@expo-google-fonts/inter/600SemiBold/Inter_600SemiBold.ttf'),
]
const SERIF = 'Cormorant Garamond'
const ACCENT = BRAND_ACCENT_COLOR
// Shield crest from the design (24x24 viewBox), drawn as strokes.
const CREST_PATHS = '<path d="M12 2L4 5v6.09c0 5.05 3.41 9.76 8 10.91 4.59-1.15 8-5.86 8-10.91V5l-8-3z" /><path d="M9 12l2 2 4-4" />'

function crest(x, y, size, strokeWidth = 1.5) {
  const scale = size / 24
  return `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${ACCENT}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round">${CREST_PATHS}</g>`
}

// Mowed fairway stripes, as in the design's hero.
function fairwayStripes(id, w, h) {
  return `<defs><pattern id="${id}" width="96" height="96" patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
    <rect width="48" height="96" fill="#ffffff" fill-opacity="0.022" />
    <rect x="48" width="48" height="96" fill="#000000" fill-opacity="0.14" />
  </pattern></defs>
  <rect width="${w}" height="${h}" fill="${BRAND_COLOR}" />
  <rect width="${w}" height="${h}" fill="url(#${id})" />`
}

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
    ? `<image href="${logo}" x="${w / 2 - 400}" y="110" width="800" height="260" preserveAspectRatio="xMidYMid meet" />`
    : `${crest(w / 2 - 36, 120, 72, 1.4)}
  <text x="${w / 2}" y="340" text-anchor="middle" font-family="${SERIF}" font-weight="700" font-size="112" letter-spacing="4" fill="${BRAND_TEXT_COLOR}">${escapeXml(BRAND_WORDMARK)}</text>`
  // The text wordmark already is the brand name; a logo image gets the name spelled out under it.
  const nameLine = logo
    ? `<text x="${w / 2}" y="392" text-anchor="middle" font-family="Inter" font-weight="600" font-size="26" letter-spacing="9" fill="${ACCENT}">${escapeXml(BRAND_NAME.toUpperCase())}</text>`
    : ''
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  ${fairwayStripes('stripes', w, h)}
  <rect x="40" y="40" width="${w - 80}" height="${h - 80}" rx="28" fill="none" stroke="${ACCENT}" stroke-opacity="0.45" stroke-width="3" stroke-dasharray="14 10" />
  ${mark}
  ${nameLine}
  <rect x="${w / 2 - 60}" y="420" width="120" height="3" rx="1.5" fill="${ACCENT}" fill-opacity="0.7" />
  <text x="${w / 2}" y="500" text-anchor="middle" font-family="${SERIF}" font-style="italic" font-size="60" fill="${ACCENT}">${escapeXml(share.imageTagline)}</text>
</svg>`
}

// Square icon: forest tile with the logo, or the gold crest while the text wordmark is in use.
function iconSvg(logo) {
  const mark = logo
    ? `<image href="${logo}" x="8" y="8" width="48" height="48" preserveAspectRatio="xMidYMid meet" />`
    : crest(10, 9, 44, 2)
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
const squareIcon = iconSvg(logo).replace('rx="14"', 'rx="0"')
write('apple-touch-icon.png', renderPng(squareIcon, 180))
const favicon32 = renderPng(iconSvg(logo), 32)
write('favicon-32x32.png', favicon32)
write('favicon.ico', pngToIco(favicon32, 32))
write('favicon.svg', `<!-- Placeholder favicon generated by scripts/generate-brand-images.mjs. -->\n${iconSvg(logo)}\n`)
