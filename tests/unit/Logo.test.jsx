import { existsSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo from '../../src/brand/Logo.jsx'
import { BRAND_NAME, LOGO_FILE } from '../../src/brand/brand.js'

describe('Logo', () => {
  it('renders the text wordmark while no logo file is configured', () => {
    expect(LOGO_FILE).toBeNull()
    render(<Logo />)
    expect(screen.getByTestId('logo-text')).toHaveTextContent('tbagstore')
    expect(BRAND_NAME).toBe('tbagstore')
  })

  it('has a public/brand/ folder ready for the Designer file', () => {
    expect(existsSync(path.resolve(process.cwd(), 'public/brand'))).toBe(true)
  })
})
