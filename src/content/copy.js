// DRAFT COPY: every string in this file is placeholder marketing copy pending Joe's approval.
// Most of it is the wording from Joe's mockup (tbagger_luxury_golf_storefront.html).
// Edit text here only; components read from this file. Product copy lives in src/content/products.js.
//
// FOR JOE'S APPROVAL: factual claims we can't verify yet. Confirm, correct or cut each before launch.
//   - Locations: "Scottsdale & St. Andrews" (ticker, footer).
//   - Dates: "Est. MMXXVI", "Held in high regard since MMXXVI", "© MMXXVI", "Valid thru MMXXX".
//   - Leather: full-grain Italian / Tuscan vegetable-tanned bridle leather, tanned in Santa Croce
//     sull'Arno; Hermann Oak saddle leather; pigskin suede lining; Alcantara divider.
//   - Metals: 5-axis CNC-milled solid C360 billet brass, tellurium (C145) copper, Grade-5 titanium,
//     "+/- 0.01mm tolerances", "zero zinc alloys", YKK Excella brass zipper.
//   - Magnets: N52 neodymium, "45-lb pull", Fidlock closures.
//   - Textiles: 650 GSM waffle microfiber, Halley Stevensons 12oz waxed canvas, Australian Merino shearling.
//   - Batches & scarcity: "Batch 01", per-item serials ("018 of 250" etc.), "batches of 100 to 500",
//     "tooling is retired", "individually numbered".
//   - Weights, sizes and capacities in product specs (e.g. 115g, 78g, 28g coins, 35 tees, 18" x 38").
//   - Membership: member serial "#00842", Founders Roster privileges (48-hour early access,
//     free monogramming, annual invitational).
//   - Monogramming (laser / 24K gold foil) as an offered service.

export const CONTACT_EMAIL = 'hello@tbagstore.com' // PLACEHOLDER contact address

// Thin bar above the header.
export const announcement = {
  left: 'AUTUMN/WINTER RESERVE — BATCH 01 COMING SOON',
  middle: 'NOT TAKING ORDERS YET //',
  middleCta: 'GET NOTIFIED AT LAUNCH',
  right: 'EST. MMXXVI • SCOTTSDALE & ST. ANDREWS',
}

export const nav = [
  { to: '/', label: '01. Reserve', mobileLabel: '01. Reserve Home' },
  { to: '/shop', label: '02. The Archive', mobileLabel: '02. Shop The Archive (All 8 Items)' },
  { to: '/about', label: '03. Bagger Ethos', mobileLabel: '03. The Bagger Ethos' },
  { to: '/club', label: '04. The Clubhouse', mobileLabel: '04. Join The Clubhouse' },
]

export const header = {
  menu: 'Toggle menu',
  notify: 'NOTIFY ME',
}

export const home = {
  hero: {
    eyebrow: 'ALLOCATION BATCH 01 // AUTUMN TOUR DIVISION',
    headline: 'Bag the Best.',
    headlineAccent: 'Leave Nothing on the Lip.',
    pitch:
      'Unapologetic small-batch golf hardware, full-grain Italian bridle leather pouches, and CNC-milled brass essentials. Engineered for players who protect their handicap in the grill room and bring the finest sack to the first tee.',
    primaryCta: 'SHOP THE ARCHIVE',
    secondaryCta: 'ENTER THE CLUBHOUSE',
    metrics: [
      { label: 'C360 BILLET', value: 'CNC-Milled Brass' },
      { label: 'TUSCANY HIDES', value: 'Full-Grain Bridle' },
      { label: 'SERIALIZED', value: '250-Unit Batches' },
    ],
  },
  spotlight: {
    badge: 'FLAGSHIP RELEASE // 018 OF 250',
    inspect: 'INSPECT →',
    notify: 'NOTIFY ME AT LAUNCH',
  },
  marquee: [
    'COMPLIMENTARY HANDICAP INFLATION WITH EVERY ORDER',
    'CNC-MILLED IN SMALL BATCHES',
    'FULL-GRAIN ITALIAN BRIDLE LEATHER',
    'ZERO THREE-PUTT GUARANTEES',
    'ENGINEERED FOR HIGH-STAKES NASSAU NEGOTIATIONS',
    'HELD IN HIGH REGARD SINCE MMXXVI',
  ],
  featured: {
    eyebrow: 'CURATED ALLOCATION // BATCH 01',
    heading: 'First-Tee Hardware & Leather',
    body: 'Every piece is individually numbered, stitched with waxed linen thread, or milled from solid billet metal.',
    cta: 'VIEW ALL 8 PIECES →',
  },
  lexicon: {
    entry: 'LEXICON ENTRY NO. 01',
    tag: '[USGA UNSANCTIONED]',
    word: 'bag·ger',
    pronunciation: '/ˈbaɡər/ • noun',
    definitions: [
      'A player of impeccable taste who carries tour-grade milled brass and Italian bridle leather while claiming to "haven\'t touched a club since October."',
      'A custodian of the finest tee pouch on the property; one who refuses to rummage through cargo pockets when honors are on the line.',
    ],
    mottoLabel: 'OFFICIAL CLUB MOTTO',
    motto: '"HELD IN HIGH REGARD"',
  },
  ethos: {
    eyebrow: 'THE PHILOSOPHY OF THE SACK',
    heading: 'Look Like a +2 Index.',
    headingAccent: 'Negotiate Like a 14.',
    paragraphs: [
      'Most golf accessories are designed for fluorescent big-box aisles: plastic divot forks that snap on firm Bermuda, synthetic headcovers that peel by July, and towels that drag through greenside bunkers.',
    ],
    foundedName: 'TBagger',
    founded:
      'was founded in the back corner of the grill room for players who appreciate heavy billet metals, heritage leathercraft, and a well-timed press bet on the 16th tee.',
    primaryCta: 'READ THE BAGGER ETHOS →',
    secondaryCta: 'CALCULATE YOUR SANDBAGGER INDEX',
  },
  pillars: {
    eyebrow: 'UNCOMPROMISING MATERIALITY',
    heading: 'Built to Outlast Your Swing Changes',
    items: [
      {
        title: 'Full-Grain Bridle Leather',
        body: "Vegetable-tanned in Santa Croce sull'Arno, Italy, and infused with tallow and beeswax. Every pouch and rangefinder holster develops a rich, bourbon-dark patina over hundreds of rounds.",
      },
      {
        title: '5-Axis CNC Billet Brass',
        body: 'Zero poured zinc alloys or flimsy plating. Our divot tools and press-bet markers are machined from solid C360 brass and tellurium copper blocks to aerospace +/- 0.01mm tolerances.',
      },
      {
        title: 'N52 Rare-Earth Magnetics',
        body: 'Industrial-grade neodymium magnetic closures and towel docks that snap cleanly onto forged carbon steel wedges and cart uprights without ever scratching a PVD finish.',
      },
    ],
  },
}

// Shared by product cards and the product page.
export const productCard = {
  photoComingSoon: 'Product photo coming soon',
  inspect: 'INSPECT SPEC →',
  details: 'VIEW DETAILS',
  notify: 'NOTIFY ME',
}

export const shop = {
  eyebrow: 'COMPLETE ARCHIVE // BATCH 01 ALLOCATION',
  heading: 'The Equipment Locker',
  body: 'All eight flagship pieces from our inaugural allocation. Nothing is on sale yet: open any piece and tap "Notify me" to hear the moment it is.',
  allLabel: 'All Gear',
  filterLabel: 'Filter by category',
  searchLabel: 'Search products',
  searchPlaceholder: 'Search gear or material...',
  resultsHeading: 'Products', // screen readers only
  emptyHeading: 'No matching hardware in the locker.',
  emptyBody: 'Try clearing your search filter or selecting "All Gear".',
  reset: 'RESET FILTERS',
}

export const pdp = {
  back: 'BACK TO THE ARCHIVE',
  galleryLabel: 'Gallery view',
  tabs: [
    { id: 'photo', label: '01. Studio Editorial' },
    { id: 'blueprint', label: '02. CAD Blueprint' },
    { id: 'macro', label: '03. Material Macro' },
  ],
  editionOf: 'EDITION OF',
  notifyHeading: 'Notify me when it’s ready',
  notifyBody: "We're not taking orders yet. Leave your email and we'll send one note when Batch 01 opens. No spam, nothing charged.",
  specsHeading: 'TECHNICAL SPECIFICATIONS & TOLERANCES',
  relatedEyebrow: 'PAIR WITH YOUR ALLOCATION',
  relatedHeading: 'Complete the Sack',
  relatedCta: 'View Full Catalog',
}

export const about = {
  badge: 'MANIFESTO & HERITAGE // EST. MMXXVI',
  heading: 'The Bagger Ethos',
  quote:
    '"In a game governed by polite fiction and negotiated strokes, your hardware should be the only honest thing in your bag."',
  rules: {
    eyebrow: 'THE ANATOMY OF A BAGGER',
    heading: 'Three Unwritten Rules',
    items: [
      {
        title: 'RULE I. NEVER FUMBLE ON THE BOX',
        body: 'If you have to dig past three receipts and a loose breath mint to find a wooden tee, you have already lost the psychological war on Hole 1.',
      },
      {
        title: 'RULE II. RESPECT THE GREEN',
        body: 'Even if your approach shot missed the putting surface by twenty yards, carry a solid C360 brass divot tool heavy enough to anchor a yacht.',
      },
      {
        title: 'RULE III. GUARD THE HANDICAP',
        body: 'Equipment should project scratch pedigree. Verbal negotiations on the first tee should suggest a lingering lower-back tightness.',
      },
    ],
  },
  essay: {
    heading: 'Why We Named It TBagger',
    intro:
      'Golf takes itself extraordinarily seriously—right up until someone four-putts for a triple bogey and blames air density. For decades, the golf equipment industry offered only two extremes: stuffy, joyless country-club traditionalism or loud novelty gear covered in neon skulls.',
    builtBefore: 'We built',
    builtName: 'TBagger Golf Co.',
    builtAfter:
      "to occupy the razor's edge between heritage craftsmanship and self-aware clubhouse wit. Yes, the name makes the starter look twice when it's stamped in gold foil on a bespoke Italian leather tee pouch. And then he picks it up, feels the weight of the solid brass hardware, smells the vegetable-tanned bridle hide, and asks how he can get on the allocation list.",
    pullQuote:
      '"We don\'t promise to shave four strokes off your index. We promise you\'ll look extraordinarily composed while negotiating for two extra pops on the back nine."',
    closing:
      'Every pouch, magnetic caddy towel, rangefinder holster, and milled marker set is produced in strictly numbered batches of 100 to 500 units. Once a batch closes, the tooling is retired to our archive.',
  },
  table: {
    eyebrow: 'TALE OF THE TAPE',
    heading: 'TBagger Reserve vs. Pro Shop Standard',
    columns: ['Specification', 'TBagger Reserve', 'Pro Shop Standard'],
    rows: [
      [
        'Hide & Textile Origin',
        'Full-Grain Tuscan Bridle Leather & 12oz Scottish Waxed Canvas',
        'Peeling "Genuine" Split Leather or Mystery Polyurethane',
      ],
      [
        'Hardware Metallurgy',
        '5-Axis CNC-Milled C360 Solid Billet Brass & Grade-5 Titanium',
        'Pot-Metal Zinc Alloy with Flaking Chrome Paint',
      ],
      [
        'Magnetic Retention',
        '45-lb Pull N52 Neodymium Rare-Earth Core (Wedge-Pickup Rated)',
        'Fridge Magnet That Drops Your Towel on the 3rd Fairway',
      ],
      [
        'First-Tee Intimidation',
        'Opponents Immediately Question If You Played D1 College Golf',
        'Zero. Plastic Bag Tag Rattling Like a Maraca',
      ],
      ['Patina Trajectory', 'Ages Like a 25-Year Islay Single Malt & Heirloom Saddle', "Replaced Every Father's Day"],
      ['Batch Scarcity', 'Individually Serialized Editions of 100 to 500 Pieces', 'Mass-Produced by the Shipping Container'],
    ],
  },
}

export const club = {
  eyebrow: 'MEMBERSHIP COMMITTEE // PRIVATE ALLOCATION ROSTER',
  heading: 'Join The Clubhouse',
  body: 'Apply for complimentary Founders Roster credentials. Declare both your official USGA index and your negotiated first-tee handicap to generate your serialized TBagger Membership Card.',
  formHeading: 'Candidate Dossier & Handicap Declaration',
  formNote: 'ALL DISCLOSURES KEPT STRICTLY BETWEEN YOU AND THE STARTER',
  formLabel: 'Clubhouse application',
  fields: {
    name: 'Full Name (For Brass Plate)',
    namePlaceholder: 'e.g. Sterling Archer',
    email: 'Private Dispatch Email *',
    emailPlaceholder: 'harrison@cypresshollow.club',
    course: 'Home Club or Municipal Sanctuary',
    coursePlaceholder: 'e.g. Bethpage Black / Local Muni',
    drink: 'Preferred Turn Refreshment',
  },
  drinks: [
    'Double Transfusion (No Ginger)',
    'Bourbon Neat in Titanium Flask',
    'Arnold Palmer (Spiked on Hole 4)',
    'Ranch Water & Unsolicited Advice',
  ],
  calibrator: 'INTERACTIVE HANDICAP CALIBRATOR',
  official: '1. Official GHIN / USGA Handicap Index:',
  negotiated: '2. "Negotiated First-Tee" Handicap (When Money is on the Line):',
  indexUnit: 'INDEX',
  diagnosis: 'COMMITTEE DIAGNOSIS',
  submit: 'MINT MY CREDENTIALS & NOTIFY ME AT LAUNCH →',
  sending: 'Sending…',
  // Only the email is sent (to the launch list via /api/subscribe); everything else stays in the browser.
  privacyNote: 'Only your email is sent, to join the launch list. Everything else stays on this device.',
  success: "Welcome to the Roster. You're on the launch list and we'll email you when Batch 01 opens.",
  previewLabel: 'LIVE DIGITAL CREDENTIAL PREVIEW',
  card: {
    wordmark: 'TBAGGER',
    club: 'FOUNDERS ALLOCATION CLUB',
    serial: 'MBR // #00842',
    serialPrefix: 'MBR // #0',
    valid: 'VALID THRU MMXXX',
    memberLabel: 'MEMBER IN GOOD STANDING',
    defaultName: 'Harrison Vance III',
    courseLabel: 'HOME SANCTUARY',
    defaultCourse: 'Whispering Pines C.C.',
    hcpLabel: 'DECLARED / NEGOTIATED',
    tierLabel: 'CLASSIFICATION',
    monogram: 'TB',
  },
  privilegesHeading: 'Founders Roster Privileges',
  privileges: [
    { title: '48-Hour Private Drop Access:', body: 'Secure Batch 02 milled hardware before public locker release.' },
    { title: 'Complimentary Custom Monogramming:', body: 'Free 3-initial laser or gold-foil stamping on your first order.' },
    { title: 'Annual Member Invitational:', body: 'Priority lottery entry for our autumn two-man scramble.' },
  ],
}

export const footer = {
  motto: '"TBagger Golf Co. — Held in High Regard."',
  blurb:
    'Small-batch CNC-milled golf hardware, full-grain Italian bridle leather pouches, and tour-spec accessories for players who respect the craft and protect their strokes.',
  locations: 'SCOTTSDALE, AZ • ST. ANDREWS, FIFESHIRE',
  directoryHeading: 'Clubhouse Directory',
  directory: [
    { to: '/', label: '01. Reserve Homepage' },
    { to: '/shop', label: '02. Equipment Archive (All 8)' },
    { to: '/about', label: '03. The Bagger Ethos & Specs' },
    { to: '/club', label: '04. Handicap Calibrator & Club' },
  ],
  dispatchHeading: 'Private Drop Dispatch',
  dispatchBody: 'Get one email when Batch 01 opens, plus advance notice of future drops.',
  dispatchButton: 'Notify me',
  dispatchPlaceholder: 'Enter club email...',
  dispatchNote: 'Zero spam. Strictly small-batch allocation notices.',
  policyLinks: [
    { to: '/faq', label: 'FAQ' },
    { to: '/shipping', label: 'Shipping' },
    { to: '/returns', label: 'Returns' },
    { to: '/privacy', label: 'Privacy' },
  ],
  copyright: '© MMXXVI TBagger Golf Co. All rights reserved. Held in High Regard.',
}

export const notFound = {
  eyebrow: '404 // OUT OF BOUNDS',
  heading: 'Page not found',
  body: 'That page is out of bounds. Take your drop and head back to the fairway.',
  cta: 'Back to home',
}

// Per-page <title>, meta description and share text (Open Graph / Twitter). Titles other than
// home get " | TBagger Golf Co." appended. Product pages use the product name and tagline.
export const meta = {
  home: {
    title: 'TBagger Golf Co. — Held in High Regard | Luxury Golf Hardware & Leather Goods',
    description:
      'Small-batch milled brass golf hardware and leather goods from TBagger Golf Co. Batch 01 is coming soon. Get notified at launch.',
  },
  shop: {
    title: 'The Equipment Locker',
    description:
      'All eight Batch 01 pieces from TBagger Golf Co.: leather tee pouches, brass divot tools and markers, headcovers, and the magnetic Clingy Caddie towel. Coming soon.',
  },
  club: {
    title: 'Join The Clubhouse',
    description:
      'Calibrate your Sandbagger Index, mint your TBagger Founders Roster card, and get notified when Batch 01 opens.',
  },
  about: {
    title: 'The Bagger Ethos',
    description:
      'Why we named it TBagger: heritage leathercraft, solid brass and self-aware clubhouse wit, made in numbered small batches.',
  },
  privacy: {
    title: 'Privacy',
    description: 'How TBagger Golf Co. handles your email address and anonymous site analytics.',
  },
  faq: {
    title: 'FAQ',
    description: 'Answers to common questions about TBagger Golf Co., Batch 01 and launch.',
  },
  shipping: {
    title: 'Shipping',
    description: 'How and where TBagger Golf Co. orders will ship once the store opens.',
  },
  returns: {
    title: 'Returns',
    description: 'The TBagger Golf Co. returns and exchanges policy.',
  },
  notFound: {
    title: 'Page not found',
    description: "That page doesn't exist on TBagger Golf Co. Head back to the home page.",
  },
}

// Alt text for the share image, and the tagline drawn into it by `npm run brand:images`.
export const share = {
  imageAlt: 'TBagger Golf Co.: Held in High Regard. Luxury golf hardware and leather goods.',
  imageTagline: 'Held in High Regard',
}

export const DRAFT_NOTE = 'Draft, pending approval'

// Policy pages: every section is a heading plus one or more paragraphs.
export const faq = {
  title: 'Frequently asked questions',
  sections: [
    {
      heading: 'When does TBagger Golf Co. launch?',
      body: [
        "We're putting the finishing touches on Batch 01. Tap \"Notify me\" on any product or in the footer and we'll email you the day it's ready to order.",
      ],
    },
    {
      heading: 'Can I order now?',
      body: ["Not yet. We aren't taking orders or payments until launch. Every product is marked \"Coming soon\"."],
    },
    {
      heading: 'How does The Clingy Caddie towel attach?',
      body: [
        'A strong magnet sits in a leather patch on the towel. It sticks to a metal cart frame or a club head, so the towel stays put between shots.',
      ],
    },
    {
      heading: 'How much will it cost?',
      body: ["We'll share final pricing with everyone on the launch list before the store opens."],
    },
    {
      heading: 'How do I contact you?',
      body: [`Email us at ${CONTACT_EMAIL} and we'll get back to you.`],
    },
  ],
}

export const shipping = {
  title: 'Shipping',
  sections: [
    {
      heading: 'Where we ship',
      body: ['At launch we plan to ship within the United States. We will update this page if that changes.'],
    },
    {
      heading: 'Processing time',
      body: ['Orders are expected to leave our warehouse within 1 to 2 business days.'],
    },
    {
      heading: 'Delivery time and cost',
      body: ['Delivery estimates and shipping rates will be shown at checkout once the store opens.'],
    },
    {
      heading: 'Tracking',
      body: ['You will get a tracking link by email as soon as your order ships.'],
    },
  ],
}

export const returns = {
  title: 'Returns',
  sections: [
    {
      heading: 'Our promise',
      body: ['If you are not happy with your order, you can return unused items within 30 days of delivery.'],
    },
    {
      heading: 'How to start a return',
      body: [`Email ${CONTACT_EMAIL} with your order number and we will send you return instructions.`],
    },
    {
      heading: 'Refunds',
      body: ['Refunds go back to your original payment method once we receive and check the return.'],
    },
    {
      heading: 'Damaged or wrong items',
      body: ['If something arrives damaged or is not what you ordered, contact us and we will make it right.'],
    },
  ],
}

export const privacy = {
  title: 'Privacy',
  placeholderNote: 'This page is a placeholder and will be updated before launch.',
  email:
    "If you sign up to be notified at launch, we store your email address only to tell you when TBagger Golf Co. products are available. We don't sell or share it.",
  club: 'On the Clubhouse page, only your email is sent to us. Your name, home club, drink and handicaps stay in your browser to draw the card preview.',
  analytics:
    'We use Vercel Web Analytics to count page views and see which pages are popular. It does not use cookies and does not collect personal information or track you across other sites.',
  removal: 'To have your email removed, contact us at',
}

// Welcome email sent after a new signup, only when WELCOME_EMAIL_ENABLED=true (off by default).
export const welcomeEmail = {
  subject: "You're on the TBagger Golf Co. launch list",
  preheader: "Thanks for signing up. We'll email you when Batch 01 is ready.",
  heading: "You're on the list",
  paragraphs: [
    'Thanks for signing up for TBagger Golf Co. launch updates.',
    "Batch 01 is small-batch brass hardware and leather goods for the golf bag. We'll email you as soon as it's ready to order.",
  ],
  cta: 'Browse the archive',
  signoff: 'See you on the first tee,',
  signature: 'The TBagger Golf Co. team',
  footer: "You're getting this email because you signed up at tbagstore.com.",
  contact: 'Questions or want off the list? Email',
}

export const signup = {
  heading: 'Get notified at launch',
  body: 'Be first to hear when Batch 01 is ready to order. No spam.',
  label: 'Email address',
  placeholder: 'you@example.com',
  button: 'Notify me',
  sending: 'Sending…',
  success: "You're on the list. We'll email you at launch.",
  invalid: 'Please enter a valid email address.',
  failure: 'Something went wrong. Please try again.',
}
