// DRAFT COPY: every string in this file is placeholder marketing copy pending Joe's approval.
// Edit text here only; components read from this file.

export const CONTACT_EMAIL = 'hello@tbagstore.com' // PLACEHOLDER contact address

export const home = {
  eyebrow: 'Coming soon',
  headline: 'Your towel, stuck right where you need it.',
  pitch:
    'Our first drop is a magnetic golf towel with a built-in tee holder. It snaps onto your cart or clubs, so your towel and a spare tee are always one reach away.',
  cta: 'See the towel',
}

export const product = {
  name: 'Magnetic Golf Towel with Tee',
  tagline: 'Clean clubs, spare tee, zero digging through your bag.',
  features: [
    {
      title: 'Magnetic clip',
      body: 'A strong magnet sticks to your cart frame or club head and stays put between shots.',
    },
    {
      title: 'Built-in tee holder',
      body: 'A spare tee rides along on the towel, ready when you step up to the box.',
    },
    {
      title: 'Made for the course',
      body: 'Absorbent fabric that cleans grooves and wipes grips without leaving lint behind.',
    },
  ],
  status: 'Coming soon',
}

// Per-page <title>, meta description and share text (Open Graph / Twitter). Titles other than
// home get " | tbagstore" appended.
export const meta = {
  home: {
    title: 'tbagstore | Golf accessories, coming soon',
    description:
      'tbagstore is launching soon with a magnetic golf towel that has a built-in tee holder. Get notified at launch.',
  },
  product: {
    title: 'Magnetic Golf Towel with Tee',
    description:
      'A magnetic golf towel with a built-in tee holder. Snaps onto your cart or clubs. Coming soon from tbagstore.',
  },
  privacy: {
    title: 'Privacy',
    description: 'How tbagstore handles your email address and anonymous site analytics.',
  },
  faq: {
    title: 'FAQ',
    description: 'Answers to common questions about tbagstore and the magnetic golf towel.',
  },
  shipping: {
    title: 'Shipping',
    description: 'How and where tbagstore orders will ship once the store opens.',
  },
  returns: {
    title: 'Returns',
    description: 'The tbagstore returns and exchanges policy.',
  },
  notFound: {
    title: 'Page not found',
    description: "That page doesn't exist on tbagstore. Head back to the home page.",
  },
}

// Alt text for the share image, and the tagline drawn into it by `npm run brand:images`.
export const share = {
  imageAlt: 'tbagstore: golf accessories, coming soon',
  imageTagline: 'Golf accessories. Coming soon.',
}

export const DRAFT_NOTE = 'Draft, pending approval'

// Policy pages: every section is a heading plus one or more paragraphs.
export const faq = {
  title: 'Frequently asked questions',
  sections: [
    {
      heading: 'When does tbagstore launch?',
      body: [
        "We're putting the finishing touches on our first product. Sign up on the home page and we'll email you the day it's ready to order.",
      ],
    },
    {
      heading: 'How does the magnetic towel attach?',
      body: [
        'A strong magnet is sewn into the towel. It sticks to a metal cart frame or a club head, so the towel stays put between shots.',
      ],
    },
    {
      heading: 'Where does the tee go?',
      body: ['A built-in holder keeps a spare tee on the towel, so you are not digging through your bag at the box.'],
    },
    {
      heading: 'How much will it cost?',
      body: ["Pricing isn't set yet. We'll share it with everyone on the launch list first."],
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
    "If you sign up to be notified at launch, we store your email address only to tell you when tbagstore products are available. We don't sell or share it.",
  analytics:
    'We use Vercel Web Analytics to count page views and see which pages are popular. It does not use cookies and does not collect personal information or track you across other sites.',
  removal: 'To have your email removed, contact us at',
}

// Welcome email sent after a new signup, only when WELCOME_EMAIL_ENABLED=true (off by default).
export const welcomeEmail = {
  subject: "You're on the tbagstore launch list",
  preheader: "Thanks for signing up. We'll email you when the magnetic golf towel is ready.",
  heading: "You're on the list",
  paragraphs: [
    'Thanks for signing up for tbagstore launch updates.',
    "Our first drop is a magnetic golf towel with a built-in tee holder. We'll email you as soon as it's ready to order.",
  ],
  cta: 'See the towel',
  signoff: 'See you on the course,',
  signature: 'The tbagstore team',
  footer: "You're getting this email because you signed up at tbagstore.com.",
  contact: 'Questions or want off the list? Email',
}

export const signup = {
  heading: 'Get notified at launch',
  body: 'Be first to hear when the magnetic golf towel is ready to order. No spam.',
  button: 'Notify me',
  success: "You're on the list. We'll email you at launch.",
  invalid: 'Please enter a valid email address.',
  failure: 'Something went wrong. Please try again.',
}
