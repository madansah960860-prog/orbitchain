# Google Ads readiness checklist

This site was built to satisfy Google Ads' policies for retail advertisers.
Most of the structural work is done. **The items in Section 1 are blockers —
the account will be suspended if you run ads before finishing them.**

Placeholders render on-page with a bright amber highlight, so anything you
have missed is impossible to overlook while clicking through the site.

---

## 1. Blockers — must be done before your first ad runs

### 1.1 Replace every placeholder

All of them live in one file: **`src/data/site.js`**.

| Field | What Google expects |
|---|---|
| `legalName` | The registered entity that takes the money. Must match your payment processor and your bank. |
| `address` | A real, verifiable business address. PO boxes are frequently rejected. |
| `phone` / `phoneHref` | A number that a human answers during the hours you publish. |
| `email` | A monitored inbox on **your own domain**. A gmail.com address weakens verification. |
| `registration` | EIN or state business registration number. |
| `domain` / `url` | Your live domain. |
| `policyUpdated` | The date you actually publish. |

Also replace the processor and carrier names inside `src/pages/Policy.jsx`
(search for `{{`) and the `ORIGIN` in `scripts/sitemap.mjs`.

Verify nothing is left:

```bash
grep -rn "{{" src/ scripts/ public/
```

### 1.2 Connect a real payment processor

**The checkout currently declines every payment by design, and it renders raw
card fields in your own DOM.** Both must change.

- Google Ads requires a functioning checkout. A permanently failing one reads
  as a non-functional site and will fail review.
- Rendering raw PAN fields puts you in PCI-DSS SAQ D scope. Don't.

Replace `attemptAuthorisation` in `src/pages/Checkout.jsx` with Stripe
Elements, Adyen Drop-in, or Braintree Hosted Fields, and delete the local
card state and its validators. Then add the provider's domains to
`script-src`, `frame-src` and `connect-src` in the CSP in `public/.htaccess`.

Keep `/checkout/declined` — a genuine decline still needs that screen, and it
is already wired to whatever the provider returns.

### 1.3 Make the contact form actually send

`src/pages/Contact.jsx` validates and then stops. Point it at a form handler
or transactional email provider. Google checks that a stated contact route
works.

### 1.4 Replace ALL product photography

**Every image in `public/images/` is Unsplash stock and must be replaced with
photographs of the stock you actually ship.** This is a blocker, not a polish
item, for three separate reasons:

1. **Some stock photos show other manufacturers' products, logos included.**
   During this build, images carrying visible Soundcore, Anker and Bose
   branding were found on listings for our own house brand. Three products
   were removed outright because no honest image was available for them. The
   remaining images were not audited one by one — **assume the problem exists
   elsewhere in the catalog and check all 79 before launch.**
2. **Photos are category-representative, not SKU-accurate.** A cable listing
   may show a cable that is not the cable you will ship. Google Ads treats an
   image that misrepresents the item as a misrepresentation violation, and it
   drives returns regardless.
3. **Third-party logos in your own product imagery** invite a trademark
   complaint from that manufacturer.

How to check quickly: open each product page, and for anything branded
`Orbit` confirm the photo shows no other company's logo and plausibly depicts
the item described.

### 1.5 Serve over HTTPS with a valid certificate

`.htaccess` already forces HTTPS. You still need the certificate.

---

## 2. What is already handled

### Required pages — all reachable from every page's footer

| Page | Route |
|---|---|
| Privacy policy | `/privacy` |
| Terms & conditions | `/terms` |
| Returns & refunds | `/returns` |
| Shipping & delivery | `/shipping` |
| Warranty | `/warranty` |
| Cookie policy | `/cookies` |
| Accessibility | `/accessibility` |
| About us (with business details) | `/about` |
| Contact us | `/contact` |
| FAQ | `/faq` |

### Misrepresentation policy

- Full business identity and address in the footer of every page.
- No fake countdown timers, no invented scarcity, no fabricated "was" prices.
  The three `wasPrice` values in the catalog are described in the terms as
  prices genuinely charged in the preceding 90 days — **make that true for
  your own pricing, or remove the field.**
- Prices display tax-exclusive with tax stated before payment. No fees are
  introduced after checkout begins.
- Reviews are presented as collected post-delivery and unedited. **Replace the
  three sample reviews in `src/pages/Home.jsx` with real ones** — fabricated
  testimonials are a policy violation in their own right.

### Apple trademark handling

This is the highest-risk area for a reseller, and it is addressed in four places:

1. A persistent strip above the header on every page.
2. The full disclaimer in the footer of every page.
3. A dedicated section on `/about`.
4. Clause 2 of the terms.

Every product is labelled **Genuine Apple** or **Third-party**, and the shop
page explains the distinction. Do not remove any of this. Also:

- Don't bid on or use Apple trademarks in ad headlines in a way that implies
  authorisation. "Accessories compatible with iPhone" is fine; "Official Apple
  Store" is not.
- Don't use Apple's logo, product photography, or the Apple font.

### Personalised advertising / data

- Cookie consent gates analytics and advertising cookies; essential storage is
  cart state only, held in the browser.
- Privacy policy covers CCPA/CPRA and GDPR rights, retention periods, and the
  categories of recipient.
- Nothing is sold or shared for cross-context behavioural advertising.

### Technical

- `dist/index.html` is emitted by the build. Upload the **contents** of
  `dist/`, including the hidden `.htaccess`.
- `.htaccess` handles the SPA fallback, so ad landing pages like
  `/product/braided-usb-c-240w` resolve on a cold hit rather than 404ing.
  **This is the single most common cause of a disapproved destination URL for
  React sites.**
- `robots.txt` keeps `/shop` and `/product` crawlable; only stateful routes
  are disallowed.
- `sitemap.xml` regenerates from the catalog on every build.
- Security headers, HSTS, and a CSP are set.

---

## 3. Before you launch — verification

```bash
npm run build
```

Then upload `dist/` and check each of these on the live domain:

- [ ] `https://www.yourdomain.com/product/airpods-pro-2-usb-c` loads on a
      **hard refresh** in a private window (proves the SPA fallback works)
- [ ] `http://yourdomain.com` 301s to `https://www.yourdomain.com`
- [ ] A made-up URL renders the styled 404, not Apache's
- [ ] Footer policy links all resolve
- [ ] No amber placeholder highlights anywhere: `grep -rn "{{" dist/assets/`
- [ ] Phone number connects; support email receives a test message
- [ ] A test order completes end to end with the real gateway
- [ ] Landing page URL in your ad matches the final URL after redirects

---

## 4. Things Google Ads checks that only you can supply

- **Business verification** — Google will ask for documents matching
  `legalName` and `address`. Have them ready.
- **Sales tax registration** in the states where you have nexus.
- **Consistency** between what your ad promises and what the landing page
  shows. A "30% off cables" ad must land on discounted cables.
- **Stock accuracy.** The catalog in `src/data/catalog.js` is static sample
  data with invented stock counts and ratings. Advertising an item you cannot
  ship is a misrepresentation violation — wire this to real inventory.
- **Product photography** — see §1.4. Nothing in `public/images/` depicts your
  actual stock.
