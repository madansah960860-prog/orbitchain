import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { site, addressLines, DISCLAIMER } from '../data/site'
import { money } from '../lib/format'
import { Tok } from '../components/Layout'

/* ============================================================
   POLICY PAGES

   Google Ads requires an advertiser's site to disclose, in plain
   language and reachable from every page: who you are, how to
   reach you, what you do with personal data, what the customer
   pays, how goods are delivered, and how money is returned.
   These seven documents cover that surface.

   Everything wrapped in {{ }} is a placeholder you must replace,
   and several clauses need a lawyer's eye for your state. See
   ADS-COMPLIANCE.md.
   ============================================================ */

const Address = () => {
  return (
    <address style={{ fontStyle: 'normal', lineHeight: 1.7 }}>
      <Tok value={site.legalName} />
      <br />
      {addressLines().map((line) => (
        <span key={line}>
          <Tok value={line} />
          <br />
        </span>
      ))}
      <Tok value={site.email} /> · <Tok value={site.phone} />
    </address>
  )
}

const POLICIES = {
  /* ------------------------------ PRIVACY ------------------------------ */
  privacy: {
    title: 'Privacy policy',
    intro:
      'What personal information we collect, why we collect it, who we share it with, and how you get it back or get it deleted.',
    body: (
      <>
        <h2 id="who">1. Who we are</h2>
        <p>
          <Tok value={site.legalName} />, trading as {site.name}, is the data controller for the
          information described here.
        </p>
        <Address />

        <h2 id="collect">2. What we collect</h2>
        <div className="table-scroll">
          <table>
          <thead>
            <tr>
              <th>Information</th>
              <th>Why we hold it</th>
              <th>How long</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Name, shipping address, email, phone</td>
              <td>To fulfil and deliver your order and to contact you about it</td>
              <td>7 years (tax record-keeping)</td>
            </tr>
            <tr>
              <td>Order history</td>
              <td>Returns, warranty claims, and your own reference</td>
              <td>7 years</td>
            </tr>
            <tr>
              <td>Payment card details</td>
              <td>
                <strong>We never receive these.</strong> They go directly to our payment processor
              </td>
              <td>Not held by us</td>
            </tr>
            <tr>
              <td>Cart and saved items</td>
              <td>To keep the site usable between visits</td>
              <td>In your browser only, until you clear it</td>
            </tr>
            <tr>
              <td>Analytics and advertising identifiers</td>
              <td>To measure which products people need — only with your consent</td>
              <td>Up to 26 months</td>
            </tr>
            <tr>
              <td>Support messages</td>
              <td>To answer you and to check we answered you well</td>
              <td>3 years</td>
            </tr>
          </tbody>
          </table>
        </div>

        <h2 id="payments">3. Payment information</h2>
        <p>
          Card details are handled by our payment processor,{' '}
          <Tok value="{{YOUR PAYMENT PROCESSOR, e.g. Stripe, Inc.}}" />, under PCI-DSS. We receive
          only the card brand, the last four digits, and the authorisation result. We never see or
          store the full card number, expiry, or security code.
        </p>

        <h2 id="share">4. Who we share it with</h2>
        <p>We share only what is needed, only with these categories, and never for their own marketing:</p>
        <ul>
          <li>
            <strong>Payment processing</strong> — <Tok value="{{YOUR PAYMENT PROCESSOR}}" />
          </li>
          <li>
            <strong>Shipping carriers</strong> — <Tok value="{{USPS / UPS / FEDEX}}" />, to deliver
            your parcel
          </li>
          <li>
            <strong>Email delivery</strong> — <Tok value="{{YOUR EMAIL PROVIDER}}" />, for order
            confirmations
          </li>
          <li>
            <strong>Analytics and advertising</strong> — <Tok value="{{e.g. Google Analytics 4, Google Ads}}" />
            , only after you consent
          </li>
          <li>
            <strong>Law enforcement</strong> — only where legally compelled
          </li>
        </ul>
        <p>
          <strong>We do not sell your personal information</strong> and we do not share it for
          cross-context behavioural advertising outside the consented advertising cookies described
          in our <Link to="/cookies">cookie policy</Link>.
        </p>

        <h2 id="rights">5. Your rights</h2>
        <p>
          Depending on where you live — including under the CCPA/CPRA in California and the GDPR if
          you contact us from the EU or UK — you can ask us to:
        </p>
        <ul>
          <li>Tell you what we hold about you, and give you a copy</li>
          <li>Correct anything that is wrong</li>
          <li>Delete it, where we are not required to keep it for tax or legal reasons</li>
          <li>Stop using it for marketing, at any time, with no reason given</li>
          <li>Opt out of the sale or sharing of personal information (we do neither)</li>
          <li>Receive equal service and pricing whether or not you exercise these rights</li>
        </ul>
        <p>
          Email <Tok value={site.email} /> and we will respond within 30 days. We may ask you to
          confirm your identity first — usually by replying from the address on the order.
        </p>

        <h2 id="children">6. Children</h2>
        <p>
          This store is not directed at children under 13 and we do not knowingly collect their
          information. If you believe a child has given us personal data, email us and we will
          delete it.
        </p>

        <h2 id="security">7. Security</h2>
        <p>
          The site is served over HTTPS. Access to order data is restricted to staff who need it.
          No system is perfectly secure; if a breach affects you we will notify you and the relevant
          authority as required by law.
        </p>

        <h2 id="changes">8. Changes</h2>
        <p>
          If we change this policy materially we will update the date at the top and, where the
          change affects how we use data you already gave us, email you.
        </p>
      </>
    ),
  },

  /* ------------------------------- TERMS ------------------------------- */
  terms: {
    title: 'Terms & conditions',
    intro: 'The agreement between you and us when you buy something from this store.',
    body: (
      <>
        <h2 id="parties">1. Who you are contracting with</h2>
        <Address />

        <h2 id="disclaimer">2. Trademarks and our independence</h2>
        <div className="notice notice--info" style={{ marginBlock: 'var(--s-4)' }}>
          <Icon name="info" size={18} />
          <div>{DISCLAIMER}</div>
        </div>

        <h2 id="orders">3. Orders</h2>
        <p>
          Adding an item to the cart is not a reservation and does not hold stock. A contract forms
          only when we send you a dispatch confirmation. Until then we may decline an order — for
          example if an item is mispriced, out of stock, or the order fails our fraud checks. If we
          decline after taking payment, we refund in full within 5 business days.
        </p>

        <h2 id="pricing">4. Pricing</h2>
        <ul>
          <li>All prices are in US dollars and exclude sales tax.</li>
          <li>Sales tax is calculated from your shipping address and shown before you pay.</li>
          <li>
            The price shown on the product page is the price charged. We add no handling fees,
            processing fees, or charges after checkout.
          </li>
          <li>
            Where a previous price is shown struck through, it is a price we genuinely charged in
            the previous 90 days.
          </li>
          <li>
            Obvious pricing errors are not binding. If one occurs we will contact you before
            shipping and you may cancel for a full refund.
          </li>
        </ul>

        <h2 id="payment">5. Payment</h2>
        <p>
          We accept the card types shown at checkout. Payment is taken once, at the time of order.
          There is no subscription, no recurring charge, and no stored card unless you explicitly
          save one for a future purchase.
        </p>

        <h2 id="delivery">6. Delivery</h2>
        <p>
          We ship within the United States only. Delivery estimates are estimates, not guarantees.
          Risk passes to you on delivery. Full detail is in the{' '}
          <Link to="/shipping">shipping policy</Link>.
        </p>

        <h2 id="returns">7. Returns and cancellation</h2>
        <p>
          You may return most items within {site.returnsWindowDays} days. The full procedure,
          exclusions and refund timings are in the <Link to="/returns">returns and refunds policy</Link>
          , which forms part of these terms.
        </p>

        <h2 id="warranty">8. Warranty</h2>
        <p>
          Products carry a {site.warrantyMonths}-month warranty against manufacturing defects, in
          addition to any manufacturer warranty and any rights you have under state law. See the{' '}
          <Link to="/warranty">warranty page</Link>.
        </p>

        <h2 id="liability">9. Limitation of liability</h2>
        <p>
          Nothing here limits liability for death or personal injury caused by our negligence, for
          fraud, or for anything else that cannot lawfully be limited. Subject to that, our total
          liability for any order is limited to the amount you paid for it. We are not liable for
          indirect or consequential loss, including data loss or damage to a device caused by
          misuse of an accessory.
        </p>

        <h2 id="acceptable">10. Using this site</h2>
        <p>
          Don&apos;t attempt to breach the site&apos;s security, scrape it at a rate that degrades
          it for others, or resell our product copy and photography. Content on this site is ours
          or licensed to us.
        </p>

        <h2 id="law">11. Governing law</h2>
        <p>
          These terms are governed by the laws of{' '}
          the State of California, and disputes will be heard in
          the courts of the City and County of San Francisco, California. This does not remove any
          protection you have under the consumer law of the state you live in.
        </p>

        <h2 id="contact-terms">12. Questions</h2>
        <p>
          Email <Tok value={site.email} /> or call <Tok value={site.phone} /> during {site.hours}.
        </p>
      </>
    ),
  },

  /* ------------------------------ RETURNS ------------------------------ */
  returns: {
    title: 'Returns & refunds',
    intro: `You have ${site.returnsWindowDays} days from delivery. Here is exactly how it works, what is excluded, and when the money lands.`,
    body: (
      <>
        <h2 id="window">1. The window</h2>
        <p>
          <strong>{site.returnsWindowDays} calendar days from the delivery date.</strong> Contact us
          within that window; you then have a further 14 days to post the item back.
        </p>

        <h2 id="condition">2. What condition it needs to be in</h2>
        <ul>
          <li>
            <strong>Unopened:</strong> full refund, no questions.
          </li>
          <li>
            <strong>Opened but unused and complete:</strong> full refund. You may open a package to
            check the item the way you would in a shop.
          </li>
          <li>
            <strong>Used or missing parts:</strong> partial refund reflecting the reduction in
            value, at our reasonable assessment. We will tell you the figure before we process it.
          </li>
          <li>
            <strong>Faulty or not as described:</strong> full refund or replacement, your choice,
            and we pay the return postage.
          </li>
        </ul>

        <h2 id="excluded">3. What cannot be returned</h2>
        <p>For hygiene reasons, these are excluded once the seal is broken, unless faulty:</p>
        <ul>
          <li>In-ear headphones and earbuds</li>
          <li>Replacement ear tips and foam tips</li>
          <li>Applied screen protectors</li>
        </ul>
        <p>
          Gift cards and clearly personalised items are also excluded. Everything else in the
          catalogue is returnable.
        </p>

        <h2 id="how">4. How to return something</h2>
        <ol>
          <li>
            Email <Tok value={site.email} /> with your order number and what you want to return.
          </li>
          <li>
            We reply with an <strong>RMA number</strong> — usually the same business day. Write it
            on the parcel. Unlabelled parcels take much longer to match to an order.
          </li>
          <li>
            Post it back to the returns address below. Keep your tracking receipt: until it reaches
            us, it is your proof of postage.
          </li>
          <li>We inspect within 2 business days of arrival and email you the outcome.</li>
        </ol>

        <h2 id="postage">5. Who pays the postage</h2>
        <div className="table-scroll">
          <table>
          <thead>
            <tr>
              <th>Situation</th>
              <th>Who pays return postage</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Faulty, damaged in transit, or we sent the wrong item</td>
              <td>We do — we email you a prepaid label</td>
            </tr>
            <tr>
              <td>Listed compatibility was wrong</td>
              <td>We do</td>
            </tr>
            <tr>
              <td>Changed your mind, or ordered the wrong model</td>
              <td>You do — typically {money(6)}–{money(12)} by tracked post</td>
            </tr>
          </tbody>
          </table>
        </div>

        <h2 id="refund">6. When you get your money</h2>
        <p>
          We issue the refund <strong>within 3 business days</strong> of the item passing
          inspection, to the original payment method. Your bank then takes its own time — usually
          3–5 business days for a card, sometimes up to 10 for a debit card.
        </p>
        <p>
          Original outbound shipping is refunded in full if the item was faulty or wrongly
          described. If you simply changed your mind, we refund the item price but not the original
          shipping.
        </p>

        <h2 id="exchange">7. Exchanges</h2>
        <p>
          Faster than a return-and-reorder: tell us the size or model you need and we will ship the
          replacement as soon as the original is in the post, so you are not waiting twice. Band
          sizing exchanges within {site.returnsWindowDays} days are free both ways.
        </p>

        <h2 id="damaged">8. Damaged on arrival</h2>
        <p>
          Photograph the parcel and the item before you do anything else and email the pictures with
          your order number. We ship a replacement immediately and deal with the carrier ourselves —
          you should not have to chase them.
        </p>

        <h2 id="returns-address">9. Returns address</h2>
        <Address />
        <p style={{ marginTop: 'var(--s-3)' }}>
          <strong>Do not post a return without an RMA number.</strong> We cannot always identify an
          unlabelled parcel, which delays your refund.
        </p>
      </>
    ),
  },

  /* ------------------------------ SHIPPING ----------------------------- */
  shipping: {
    title: 'Shipping & delivery',
    intro: 'Where we ship, what it costs, how long it takes, and what happens when it goes wrong.',
    body: (
      <>
        <h2 id="where">1. Where we ship</h2>
        <p>
          <strong>United States only</strong>, including Alaska, Hawaii, and APO/FPO addresses. We
          do not currently ship internationally. If you order from outside the US the order will be
          cancelled and refunded in full.
        </p>

        <h2 id="cost">2. Cost and speed</h2>
        <div className="table-scroll">
          <table>
          <thead>
            <tr>
              <th>Service</th>
              <th>Cost</th>
              <th>Transit time</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Standard, tracked</td>
              <td>
                {money(site.standardShipping)} — free on orders over {site.currencySymbol}
                {site.freeShippingThreshold}
              </td>
              <td>{site.standardTransit}</td>
            </tr>
            <tr>
              <td>Express, tracked, signature required</td>
              <td>{money(site.expressShipping)}</td>
              <td>{site.expressTransit}</td>
            </tr>
            <tr>
              <td>Alaska, Hawaii, APO/FPO</td>
              <td>Standard rate</td>
              <td>Add 3–5 business days</td>
            </tr>
          </tbody>
          </table>
        </div>
        <p>
          Transit time is counted from dispatch, not from when you order. Add the handling time
          below.
        </p>

        <h2 id="handling">3. Handling time</h2>
        <p>
          Orders placed before <strong>2:00pm ET on a business day</strong> are dispatched the same
          day. Anything later ships the next business day. We do not dispatch on weekends or
          federal holidays.
        </p>

        <h2 id="tracking">4. Tracking</h2>
        <p>
          Every order ships tracked. You get a tracking number by email at dispatch. Carriers
          usually take a few hours to show the first scan — a number that shows nothing yet is
          normal and not a sign of a problem.
        </p>

        <h2 id="late">5. If it is late</h2>
        <p>
          If tracking has not moved for <strong>5 business days</strong>, email us with your order
          number. We open a carrier trace. If the parcel cannot be found we replace or refund it in
          full — we do not ask you to wait out the carrier&apos;s investigation.
        </p>

        <h2 id="wrong-address">6. Wrong address</h2>
        <p>
          We ship to the address you enter. If it is wrong, email us immediately — before dispatch
          we can change it for free. After dispatch we cannot reroute, and a parcel returned to us
          as undeliverable is refunded minus the original shipping cost.
        </p>

        <h2 id="split">7. Split shipments</h2>
        <p>
          Occasionally an order ships in two parcels. You are never charged twice for shipping, and
          both tracking numbers are emailed to you.
        </p>

        <h2 id="risk">8. Risk and title</h2>
        <p>
          Goods remain our responsibility until they are delivered to the address you gave us. If a
          carrier marks a parcel delivered and you do not have it, tell us within 7 days and we will
          investigate and make it right.
        </p>
      </>
    ),
  },

  /* ------------------------------ WARRANTY ----------------------------- */
  warranty: {
    title: 'Warranty',
    intro: `Every product carries a ${site.warrantyMonths}-month warranty against manufacturing defects, on top of any manufacturer warranty and your rights under state law.`,
    body: (
      <>
        <h2 id="covered">1. What is covered</h2>
        <p>
          Manufacturing and material defects that appear in normal use within{' '}
          {site.warrantyMonths} months of delivery. Typically:
        </p>
        <ul>
          <li>A cable that stops carrying power or data without physical damage</li>
          <li>A charger that stops delivering its rated output</li>
          <li>Stitching, lugs, or clasps failing on a band</li>
          <li>A case whose magnet array stops holding</li>
          <li>Audio failure in one channel</li>
        </ul>

        <h2 id="not-covered">2. What is not covered</h2>
        <ul>
          <li>Accidental damage, drops, crushing, or liquid ingress beyond the stated rating</li>
          <li>Normal cosmetic wear — scuffs, leather patina, fading of woven material</li>
          <li>Damage from using the product outside its stated specification</li>
          <li>Consumables: foam ear tips, adhesive mounts</li>
          <li>Products modified or repaired by someone other than us or the manufacturer</li>
        </ul>

        <h2 id="claim">3. Making a claim</h2>
        <ol>
          <li>
            Email <Tok value={site.email} /> with your order number and a description. Photos or a
            short video of the fault speed this up considerably.
          </li>
          <li>We respond {site.responseTime} with an RMA number and a prepaid return label.</li>
          <li>
            We test the item on arrival. If the fault is confirmed we replace it, or refund you if
            the item is discontinued.
          </li>
        </ol>
        <p>
          <strong>You do not pay postage on a valid warranty claim.</strong> If we test an item and
          find no fault, we return it to you and cover that postage too.
        </p>

        <h2 id="genuine">4. Genuine Apple products</h2>
        <p>
          Items labelled <strong>Genuine Apple</strong> also carry Apple&apos;s own manufacturer
          warranty, which you may claim directly with Apple if you prefer. Our warranty runs
          alongside it and does not replace it. We are not an Apple Authorised Service Provider and
          cannot perform warranty service on Apple&apos;s behalf.
        </p>

        <h2 id="statutory">5. Your legal rights</h2>
        <p>
          Nothing here limits the rights you have under the consumer protection law of your state,
          including implied warranties of merchantability and fitness for purpose where those apply.
          This warranty is in addition to those rights.
        </p>
      </>
    ),
  },

  /* ------------------------------ COOKIES ------------------------------ */
  cookies: {
    title: 'Cookie policy',
    intro: 'What we store on your device, what each thing does, and how to change your mind.',
    body: (
      <>
        <h2 id="what">1. What we use</h2>
        <div className="table-scroll">
          <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Type</th>
              <th>Purpose</th>
              <th>Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="mono">orbit-store</td>
              <td>Essential (local storage)</td>
              <td>Keeps your cart, saved items and cookie choice between visits</td>
              <td>Until you clear your browser</td>
            </tr>
            <tr>
              <td className="mono">
                <Tok value="{{_ga, _ga_*}}" />
              </td>
              <td>Analytics — consent required</td>
              <td>Counts visits and which products get viewed</td>
              <td>Up to 24 months</td>
            </tr>
            <tr>
              <td className="mono">
                <Tok value="{{_gcl_au}}" />
              </td>
              <td>Advertising — consent required</td>
              <td>Measures whether an ad led to a purchase</td>
              <td>Up to 90 days</td>
            </tr>
          </tbody>
          </table>
        </div>

        <h2 id="essential">2. Essential storage</h2>
        <p>
          The cart and saved-items list live in your browser&apos;s local storage, not on our
          servers. They never leave your device until you check out. We cannot switch these off
          without breaking the store, so they are not covered by the consent banner.
        </p>

        <h2 id="optional">3. Optional cookies</h2>
        <p>
          Analytics and advertising cookies load <strong>only after you accept them</strong>. If you
          chose &ldquo;Essential only&rdquo;, none of them are set.
        </p>

        <h2 id="change">4. Changing your mind</h2>
        <p>
          Clear this site&apos;s data in your browser settings and the banner will appear again on
          your next visit. You can also block cookies entirely in your browser — the store will
          still work, though your cart will not survive a refresh.
        </p>

        <h2 id="ads">5. Advertising</h2>
        <p>
          If you consented to advertising cookies, we may use{' '}
          <Tok value="{{Google Ads conversion tracking}}" /> to see which campaigns lead to orders.
          You can opt out of personalised Google advertising at{' '}
          <a href="https://adssettings.google.com" target="_blank" rel="noopener noreferrer">
            adssettings.google.com <Icon name="external" size={13} style={{ display: 'inline' }} />
          </a>
          .
        </p>
      </>
    ),
  },

  /* --------------------------- ACCESSIBILITY --------------------------- */
  accessibility: {
    title: 'Accessibility',
    intro:
      'We aim to meet WCAG 2.2 Level AA. Where we fall short, we want to know — and we will fix it.',
    body: (
      <>
        <h2 id="standard">1. The standard we hold ourselves to</h2>
        <p>
          This site targets <strong>WCAG 2.2 Level AA</strong>. That is a working commitment, not a
          certification.
        </p>

        <h2 id="done">2. What is in place</h2>
        <ul>
          <li>Body text meets a 4.5:1 contrast ratio; large text meets 3:1</li>
          <li>The whole purchase path works by keyboard alone, with a visible focus indicator</li>
          <li>A skip link jumps past the navigation to the main content</li>
          <li>
            Every animation has a <span className="mono">prefers-reduced-motion</span> alternative,
            and no content is hidden behind an animation
          </li>
          <li>Product images carry descriptive alternative text</li>
          <li>Stock status and compatibility are never signalled by colour alone</li>
          <li>Form errors appear next to the field they belong to and move focus there</li>
          <li>Touch targets are at least 44 × 44 px</li>
          <li>The layout reflows to 320px without horizontal scrolling</li>
        </ul>

        <h2 id="known">3. Known gaps</h2>
        <ul>
          <li>
            Some product photography is supplier-provided and its alt text describes the product
            rather than the specific image composition.
          </li>
          <li>The specification tables scroll horizontally on very narrow screens.</li>
        </ul>

        <h2 id="feedback">4. Tell us what is broken</h2>
        <p>
          Email <Tok value={site.email} /> with the page and what went wrong. We aim to respond{' '}
          {site.responseTime} and to fix confirmed barriers within 30 days.
        </p>
        <p>
          If you cannot complete an order because of an accessibility barrier, call{' '}
          <Tok value={site.phone} /> during {site.hours} and we will place it for you.
        </p>
      </>
    ),
  },
}

export default function Policy({ which }) {
  const policy = POLICIES[which]

  useEffect(() => {
    if (policy) document.title = `${policy.title} — Orbit Chain Co.`
  }, [policy])

  if (!policy) return null

  return (
    <div className="wrap-prose policy">
      <div className="page-head">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{policy.title}</li>
          </ol>
        </nav>
        <h1>{policy.title}</h1>
        <p>{policy.intro}</p>
      </div>

      <p className="policy__meta">
        Last updated {site.policyUpdated} · Applies to {site.domain}
      </p>

      <div className="prose">{policy.body}</div>

      <div className="notice notice--info" style={{ marginTop: 'var(--s-7)' }}>
        <Icon name="info" size={18} />
        <div>
          Questions about this document? Email <Tok value={site.email} /> or call{' '}
          <Tok value={site.phone} />. See also{' '}
          <Link to="/terms">terms</Link>, <Link to="/privacy">privacy</Link>,{' '}
          <Link to="/returns">returns</Link>, <Link to="/shipping">shipping</Link> and{' '}
          <Link to="/warranty">warranty</Link>.
        </div>
      </div>
    </div>
  )
}
