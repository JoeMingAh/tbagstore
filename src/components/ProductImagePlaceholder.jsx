import { productCard as copy } from '../content/copy.js'

// Stand-in until real product photos exist. It fills whatever box the caller sizes (className),
// so the layout won't shift when a real photo is set in src/content/products.js.
export default function ProductImagePlaceholder({ label, className = '', compact = false }) {
  return (
    <div
      role="img"
      aria-label={label ? `${label}: ${copy.photoComingSoon.toLowerCase()}` : copy.photoComingSoon}
      className={`dimple-pattern-dark flex items-center justify-center bg-forest text-center ${className}`}
    >
      {!compact && (
        <span className="flex flex-col items-center gap-1 px-4" aria-hidden="true">
          <span className="font-mono text-[10px] tracking-[0.25em] text-gold uppercase">{copy.photoComingSoon}</span>
          {label && <span className="font-serif text-lg text-cream/80 italic">{label}</span>}
        </span>
      )}
    </div>
  )
}
