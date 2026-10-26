import { existsSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import Logo from '../../src/brand/Logo.jsx'
import { BRAND_NAME, BRAND_WORDMARK, LOGO_FILE } from '../../src/brand/brand.js'

describe('Logo', () => {
  it('renders the "TBagger Golf Co." text wordmark while no logo file is configured', () => {
    expect(LOGO_FILE).toBeNull()
    render(<Logo motto />)
    expect(screen.getByTestId('logo-text')).toHaveTextContent(/^TBagger Golf Co\.$/)
    expect(screen.getByText('Held in High Regard')).toBeInTheDocument()
    expect(BRAND_WORDMARK).toBe('TBagger Golf Co.')
    expect(BRAND_NAME).toBe('TBagger Golf Co.')
  })

  it('has a public/brand/ folder ready for the Designer file', () => {
    expect(existsSync(path.resolve(process.cwd(), 'public/brand'))).toBe(true)
  })
})
