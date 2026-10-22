// Stand-in until real product photos exist. Keeps a fixed aspect ratio so layout won't shift
// when the <img> replaces it.
export default function ProductImagePlaceholder({ className = '' }) {
  return (
    <div
      role="img"
      aria-label="Product photo coming soon"
      className={`flex aspect-square w-full items-center justify-center rounded-3xl border-2 border-dashed border-stone-300 bg-gradient-to-br from-green-50 to-stone-100 ${className}`}
    >
      <span className="px-4 text-center text-sm font-medium text-stone-500">Product photo coming soon</span>
    </div>
  )
}
