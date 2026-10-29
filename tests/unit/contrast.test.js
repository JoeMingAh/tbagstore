// @vitest-environment node
import { readFileSync } from 'node:fs'
import { describe, expect, it } from 'vitest'

// Palette tokens from src/index.css, checked against WCAG AA (4.5:1 for normal-size text).
const css = readFileSync(new URL('../../src/index.css', import.meta.url), 'utf8')
const token = (name) => {
  const match = css.match(new RegExp(`--color-${name}:\\s*(#[0-9a-f]{6})`, 'i'))
  if (!match) throw new Error(`--color-${name} not found in src/index.css`)
  return match[1]
}

function luminance(hex) {
  const [r, g, b] = [1, 3, 5].map((i) => {
    const v = parseInt(hex.slice(i, i + 2), 16) / 255
    return v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4
  })
  return 0.2126 * r + 0.7152 * g + 0.0722 * b
}

function contrast(a, b) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x)
  return (hi + 0.05) / (lo + 0.05)
}

describe('palette contrast (WCAG AA)', () => {
  // gold-dark is the gold used for text on light surfaces (eyebrows, spec labels, hovers).
  it.each(['cream', 'cream-warm'])('gold-dark text on %s is at least 4.5:1', (bg) => {
    expect(contrast(token('gold-dark'), token(bg))).toBeGreaterThanOrEqual(4.5)
  })

  // Plain gold is for dark surfaces only.
  it.each(['forest', 'forest-light', 'charcoal', 'charcoal-light'])('gold text on %s is at least 4.5:1', (bg) => {
    expect(contrast(token('gold'), token(bg))).toBeGreaterThanOrEqual(4.5)
  })
})
