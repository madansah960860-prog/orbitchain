/* ============================================================
   BUSINESS IDENTITY

   Values wrapped in {{ }} are placeholders you MUST replace
   before running Google Ads. They render with a loud amber
   highlight so they cannot ship unnoticed.

   See ADS-COMPLIANCE.md at the project root for the full checklist.
   ============================================================ */

export const TOKEN = /\{\{(.+?)\}\}/g

export const site = {
  name: 'Orbit Chain Co.',
  legalName: 'Orbit Chain Co.',
  houseBrand: 'Orbit', // brand printed on our own-label products
  tagline: 'Everything that orbits your device.',
  domain: 'www.shoporbitchain.us',
  url: 'https://www.shoporbitchain.us',
  currency: 'USD',
  currencySymbol: '$',
  founded: '2019',

  // --- contact (Google Ads requires all of these to be reachable) ---
  // The mailbox must exist and be monitored before you advertise.
  email: 'support@shoporbitchain.us',
  phone: '{{+1 (555) 000-0000}}',
  phoneHref: '{{+15550000000}}',
  hours: 'Mon–Fri, 9:00–18:00 PT',
  responseTime: 'within 1 business day',

  address: {
    line1: '3949 25th St',
    line2: '', // optional — suite/unit, omitted from output when empty
    city: 'San Francisco',
    state: 'CA',
    zip: '94114',
    country: 'United States',
  },

  registration: {
    label: 'State registration / EIN',
    value: '{{YOUR EIN OR CA ENTITY NUMBER}}',
  },

  // --- policy dates ---
  policyUpdated: 'July 31, 2026',

  // --- commercial terms surfaced across the site ---
  returnsWindowDays: 30,
  warrantyMonths: 12,
  freeShippingThreshold: 49,
  standardShipping: 5.95,
  expressShipping: 14.95,
  handlingDays: '1 business day',
  standardTransit: '3–5 business days',
  expressTransit: '1–2 business days',
  taxNote: 'Sales tax is calculated at checkout based on your shipping address.',

  social: {
    instagram: '{{https://instagram.com/yourhandle}}',
    x: '{{https://x.com/yourhandle}}',
  },
}

/** Address lines with empty entries dropped — line2 is optional. */
export const addressLines = () => {
  const a = site.address
  return [a.line1, a.line2, `${a.city}, ${a.state} ${a.zip}`, a.country].filter(Boolean)
}

/* The single most important sentence on this site for Apple's
   trademark policy and for Google Ads' misrepresentation policy. */
export const DISCLAIMER =
  'Orbit Chain Co. is an independent reseller. We are not affiliated with, authorized by, endorsed by, or sponsored by Apple Inc. Apple, iPhone, iPad, AirPods, Apple Watch, MagSafe and Mac are trademarks of Apple Inc., registered in the U.S. and other countries. All product names are used for compatibility identification only.'

export const DISCLAIMER_SHORT =
  'Independent reseller — not affiliated with or endorsed by Apple Inc.'
