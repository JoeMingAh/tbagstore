import { shop as copy } from '../content/copy.js'

// Shop grid filtering: category pill and free-text search (as in the design). No price sort
// while prices are hidden.
export function filterProducts(products, { category, search }) {
  const query = search.toLowerCase().trim()
  return products.filter((product) => {
    const matchesCategory = category === copy.allLabel || product.category === category
    const matchesSearch =
      !query ||
      [product.name, product.subtitle, product.description, product.tagline].some((text) => text.toLowerCase().includes(query))
    return matchesCategory && matchesSearch
  })
}
