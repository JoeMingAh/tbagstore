import ProductImagePlaceholder from './ProductImagePlaceholder.jsx'

// Renders a product photo from src/content/products.js, or a sized placeholder while it's null.
// `variant` picks `image` (main) or `secondaryImage` (material macro).
export default function ProductImage({ product, variant = 'image', className = '', compact = false }) {
  const src = product[variant]
  const label = variant === 'secondaryImage' ? `${product.name} detail` : product.name
  if (src) {
    return <img src={src} alt={product.imageAlt || label} loading="lazy" className={`object-cover object-center ${className}`} />
  }
  return <ProductImagePlaceholder label={label} className={className} compact={compact} />
}
