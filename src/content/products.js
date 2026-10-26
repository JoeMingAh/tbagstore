// DRAFT CATALOG: names, prices, batch numbers, specs and all copy below come from Joe's mockup
// (tbagger_luxury_golf_storefront.html) and are DRAFT pending Joe's approval. Material and spec
// claims (Italian leather, C360 brass, N52 magnets, batch sizes...) are unverified; see the
// "FOR JOE'S APPROVAL" list at the top of src/content/copy.js.
// Plain JS (no JSX) so vite.config.js, routes.js and scripts can import it in Node.
//
// PRICES: hidden everywhere until Joe confirms them. Build with SHOW_PRICES=true to show them
// (exposed to the client by `envPrefix` in vite.config.js). Anything unset or not exactly "true"
// keeps them hidden. Components must go through priceLabel(), never read `price` directly.
//
// PHOTO SWAP: `image` and `secondaryImage` are null while there are no real photos, so a sized
// placeholder block is shown instead. To add a photo, put the file in public/products/ and set
// e.g. image: '/products/the-first-tee-sack.jpg' (and an `imageAlt` if the name isn't enough).
// Never hotlink third-party image hosts (no Unsplash: those photos aren't our products).

const env = typeof import.meta.env === 'object' ? import.meta.env : {}
export const SHOW_PRICES = env.SHOW_PRICES === 'true'

export const CATEGORIES = ['Tees & Pouches', 'On-Green Hardware', 'Covers & Sleeves', 'Towels & Textiles']

// Every product is pre-launch for now.
export const PRODUCT_STATUS = 'Coming soon'

// "The Sandbagger's Stash" -> "the-sandbaggers-stash"
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/['’]/g, '')
    .replace(/&/g, ' ')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

const CATALOG = [
  {
    key: 'first-tee-sack',
    name: 'The First-Tee Sack',
    subtitle: 'Premium Leather Tee Pouch',
    category: 'Tees & Pouches',
    price: 125,
    serial: 'BATCH 01 // 018 OF 250',
    featured: true,
    tagline: 'Because fishing around in your pockets on the first box is beneath your tax bracket.',
    description:
      'Hand-cut from vegetable-tanned Tuscan bridle leather and lined with plush pigskin suede, The First-Tee Sack clips effortlessly to your tour bag via a solid C360 milled brass spring carabiner. Finished with waxed linen saddle stitching and a weighted brass drawstring toggle that silences tee rattle forever.',
    specs: [
      { label: 'Exterior Hide', value: 'Full-Grain Italian Vegetable-Tanned Bridle Leather' },
      { label: 'Hardware', value: 'Solid C360 Billet Brass Carabiner & Cinches' },
      { label: 'Capacity', value: '35 Tour Tees + 2 Coins + Divot Tool Loop' },
      { label: 'Dimensions', value: '6.2" H × 4.0" Diameter (115g Empty Weight)' },
    ],
  },
  {
    key: 'heavy-hitter',
    name: 'The Heavy Hitter',
    subtitle: 'CNC-Milled Brass Divot Tool Set',
    category: 'On-Green Hardware',
    price: 95,
    serial: 'BATCH 01 // 042 OF 250',
    featured: true,
    tagline: 'Fix the crater on the green you barely made.',
    description:
      'Machined on a 5-axis CNC mill from a single billet of C360 free-machining solid brass. Engineered with dual-bevel turf tines that lift compressed bentgrass without tearing roots, plus a recessed N52 rare-earth magnetic dock housing a matching knurled brass ball marker.',
    specs: [
      { label: 'Metallurgy', value: '5-Axis CNC-Milled C360 Solid Billet Brass' },
      { label: 'Marker Dock', value: 'Recessed N52 Neodymium Rare-Earth Magnet' },
      { label: 'Pocket Weight', value: '78 Grams (Substantial Hand Feel)' },
      { label: 'Finish', value: 'Hand-Burnished Satin (Develops Living Patina)' },
    ],
  },
  {
    // The magnetic golf towel from the coming-soon site; the old towel URLs redirect here.
    key: 'clingy-caddie',
    name: 'The Clingy Caddie',
    subtitle: 'Rare-Earth Magnetic Waffle Towel',
    category: 'Towels & Textiles',
    price: 68,
    serial: 'BATCH 01 // 089 OF 300',
    featured: true,
    tagline: 'Holds onto your irons tighter than your playing partner holds onto a two-dollar Nassau.',
    description:
      'Woven from 650 GSM deep-channel microfiber waffle fabric in Deep Forest Green with contrast Bridle Gold whipstitching. Houses a removable saddle-leather patch concealing an industrial 45-lb pull N52 magnet—allowing you to snatch the towel from your cart frame with a wedge head.',
    specs: [
      { label: 'Textile Weight', value: '650 GSM Deep-Groove Waffle Microfiber' },
      { label: 'Magnetic Core', value: '45-lb Pull N52 Neodymium in Leather Housing' },
      { label: 'Dimensions', value: '18" × 38" Tour Caddie Proportions' },
      { label: 'Care', value: 'Quick-Release Magnet Removes for Machine Wash' },
    ],
  },
  {
    key: 'sandbaggers-stash',
    name: "The Sandbagger's Stash",
    subtitle: '4-Piece Milled Ball Marker Collection',
    category: 'On-Green Hardware',
    price: 110,
    serial: 'BATCH 01 // 012 OF 150',
    featured: false,
    tagline: 'Weighted coin markers in brass, copper, and obsidian enamel for settling press bets on the 18th.',
    description:
      'Four heavy-gauge 32mm milled coins housed in a quad-slot Tuscan leather pocket roll. Includes Raw C360 Brass, Tellurium Copper, Obsidian Black PVD with Gold Enamel Fill, and Brushed Nickel—each double-sided for decisive "Heads or Tails" press settlements on the 18th tee box.',
    specs: [
      { label: 'Coin Metals', value: 'C360 Brass, C145 Copper, Obsidian PVD, Nickel' },
      { label: 'Coin Specs', value: '32mm Diameter × 4.0mm Thick (28g Per Coin)' },
      { label: 'Carry Case', value: '4-Slot Bridle Leather Pocket Roll Included' },
      { label: 'Edge Detail', value: 'Diamond-Knurled Grip Perimeter' },
    ],
  },
  {
    key: 'crown-jewel',
    name: 'The Crown Jewel',
    subtitle: 'Merino & Leather Mallet Headcover',
    category: 'Covers & Sleeves',
    price: 165,
    serial: 'BATCH 01 // 031 OF 200',
    featured: true,
    tagline: 'Weatherproof Scottish waxed canvas and saddle leather with plush shearling interior.',
    description:
      'Tailored to cradle modern high-MOI mallets and mid-mallets alike. Constructed from Halley Stevensons 12oz dry-waxed Scottish cotton canvas, reinforced with Hermann Oak saddle leather piping, and lined with dense 100% Australian Merino wool shearling with a silent magnetic Fidlock closure.',
    specs: [
      { label: 'Outer Shell', value: 'Halley Stevensons 12oz Scottish Waxed Canvas' },
      { label: 'Trim & Piping', value: 'Full-Grain Saddle Leather with Gold Foil Crest' },
      { label: 'Interior Lining', value: 'Plush 100% Australian Merino Shearling' },
      { label: 'Closure System', value: 'Dual Silent Magnetic Fidlock Bar (Zero Velcro)' },
    ],
  },
  {
    key: 'yardage-alibi',
    name: 'The Yardage Alibi',
    subtitle: 'Leather Rangefinder Sleeve',
    category: 'Covers & Sleeves',
    price: 140,
    serial: 'BATCH 01 // 064 OF 250',
    featured: false,
    tagline: 'Know the exact laser distance before coming up 15 yards short.',
    description:
      'Wet-molded over custom hardwood lasts from thick Hermann Oak saddle leather to fit Bushnell, Precision Pro, and Leica rangefinders like a bespoke holster. Features a whisper-quiet magnetic quick-draw flap so you can shoot the flag in two seconds flat without alerting your group.',
    specs: [
      { label: 'Shell Construction', value: 'Wet-Molded 9oz Hermann Oak Saddle Leather' },
      { label: 'Quick-Draw Flap', value: 'Concealed Magnetic Tab for One-Hand Access' },
      { label: 'Mounting', value: 'Solid Brass Snap Hook + Leather Cart-Pillar Strap' },
      { label: 'Interior', value: 'Lens-Safe Micro-Suede Cushioning' },
    ],
  },
  {
    key: 'gentlemans-timber',
    name: "The Gentleman's Timber",
    subtitle: 'Reserve Bamboo & Brass Tee Pack',
    category: 'Tees & Pouches',
    price: 48,
    serial: 'BATCH 01 // 114 OF 500',
    featured: false,
    tagline: '100 heavyweight striped tour tees housed in a reusable brushed brass cigar-style tube.',
    description:
      'Crafted from high-tensile Moso bamboo that resists snapping against 118 mph forged titanium driver faces. Painted in our signature Deep Forest and Burnished Gold club bands for consistent tee-height calibration, and delivered inside an heirloom knurled-cap brass cigar tube.',
    specs: [
      { label: 'Quantity & Length', value: '100× Tour-Length 3.25" Striped Tees' },
      { label: 'Timber Grade', value: 'High-Tensile Kiln-Dried Moso Bamboo' },
      { label: 'Vessel', value: 'Brushed Brass Screw-Top Cigar Humidor Tube' },
      { label: 'Depth Gauge', value: 'Dual Gold-Leaf Consistent Tee-Height Rings' },
    ],
  },
  {
    key: 'back-nine-flask',
    name: 'The Back-Nine Flask & Valet Pouch',
    subtitle: 'Stealth Leather Valuables & Titanium Flask',
    category: 'Tees & Pouches',
    price: 185,
    serial: 'BATCH 01 // 007 OF 100',
    featured: false,
    tagline: 'Stealth saddle-leather valuables pouch with a concealed 6oz matte-black titanium swing-oil flask.',
    description:
      'Our most scarce Batch 01 allocation. On one side: a micro-suede lined sanctuary for your mechanical chronograph, signet ring, and car key. In the concealed rear sleeve: a custom 6oz Grade-5 matte-black titanium flask with a captive machined brass pour spout for emergency back-nine calibration.',
    specs: [
      { label: 'Valet Exterior', value: 'Dual-Chamber Italian Saddle Leather' },
      { label: 'Concealed Vessel', value: '6oz Grade-5 Matte Titanium Flask (Zero Metallic Taste)' },
      { label: 'Zipper Hardware', value: 'YKK Excella Polished Solid Brass Teeth' },
      { label: 'Watch Chamber', value: 'Scratch-Free Alcantara® Divider Pad' },
    ],
  },
]

// `key` picks the CAD blueprint drawing (src/components/Blueprint.jsx); `slug` is the URL.
export const PRODUCTS = CATALOG.map((product) => ({
  ...product,
  slug: slugify(product.name),
  status: PRODUCT_STATUS,
  image: null,
  secondaryImage: null,
}))

export const FEATURED_PRODUCTS = PRODUCTS.filter((product) => product.featured)

export function productPath(slug) {
  return `/products/${slug}`
}

export function findProduct(slug) {
  return PRODUCTS.find((product) => product.slug === slug) || null
}

export function formatPrice(amount) {
  return `$${amount.toFixed(2)}`
}

// The only way components should show a price: null (render nothing) unless prices are switched on.
export function priceLabel(product, showPrices = SHOW_PRICES) {
  return showPrices ? formatPrice(product.price) : null
}
