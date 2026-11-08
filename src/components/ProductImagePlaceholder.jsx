// Stand-in until real product photos exist. Keeps a fixed aspect ratio so layout won't shift
// when the <img> replaces it.
export default function ProductImagePlaceholder({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Product photo coming soon"
      data-photo-placeholder
      className={`flex aspect-square w-full items-center justify-center rounded-3xl border-2 border-dashed border-gold bg-cream ${className}`}
    >
      <span className="px-4 text-center text-sm font-medium text-ink">Product photo coming soon</span>
    </div>
  )
}
