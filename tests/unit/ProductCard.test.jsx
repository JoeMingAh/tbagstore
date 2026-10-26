import { render, screen, within } from '@testing-library/react'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { describe, expect, it } from 'vitest'
import ProductCard from '../../src/components/ProductCard.jsx'
import { PRODUCTS } from '../../src/content/products.js'
import Product from '../../src/pages/Product.jsx'

describe('ProductCard', () => {
  it.each(PRODUCTS)('$name shows "Coming soon", a Notify me link and no price', (product) => {
    const { container } = render(
      <MemoryRouter>
        <ProductCard product={product} />
      </MemoryRouter>,
    )
    expect(screen.getByTestId('product-status')).toHaveTextContent('Coming soon')
    expect(screen.queryByTestId('price')).toBeNull()
    expect(container.textContent).not.toContain('$')
    expect(screen.getByRole('link', { name: /notify me/i })).toHaveAttribute('href', `/products/${product.slug}#notify`)
    expect(screen.queryByRole('button', { name: /add|bag|sack|cart/i })).toBeNull()
  })
})

describe('Product page', () => {
  function renderProduct(path) {
    return render(
      <MemoryRouter initialEntries={[path]}>
        <Routes>
          <Route path="/products/:slug" element={<Product />} />
        </Routes>
      </MemoryRouter>,
    )
  }

  it('has a Notify me form instead of a buy button, and no price', () => {
    const { container } = renderProduct('/products/the-clingy-caddie')
    expect(screen.getByRole('heading', { level: 1, name: 'The Clingy Caddie' })).toBeInTheDocument()
    const notify = container.querySelector('#notify')
    expect(notify).not.toBeNull()
    expect(within(notify).getByLabelText('Email address')).toHaveAttribute('type', 'email')
    expect(within(notify).getByRole('button', { name: 'Notify me' })).toBeInTheDocument()
    expect(screen.queryByTestId('price')).toBeNull()
    expect(container.textContent).not.toMatch(/\$\d/)
    expect(screen.queryByRole('button', { name: /add to|checkout|buy/i })).toBeNull()
  })

  it('has no card or payment fields', () => {
    const { container } = renderProduct('/products/the-heavy-hitter')
    for (const input of container.querySelectorAll('input')) {
      expect(input.getAttribute('autocomplete') || '').not.toMatch(/^cc-/)
      expect(`${input.name} ${input.id}`).not.toMatch(/card|cvc|cvv|expir/i)
    }
  })

  it('renders the not-found page for an unknown slug', () => {
    renderProduct('/products/not-a-product')
    expect(screen.getByRole('heading', { level: 1, name: 'Page not found' })).toBeInTheDocument()
  })
})
