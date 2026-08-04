import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { site } from '../data/site'
import { money } from '../lib/format'
import { Tok } from '../components/Layout'

const FAQS = [
  {
    q: 'Are these genuine Apple products?',
    a: (
      <>
        <p>
          Some are, some aren&apos;t, and every listing says which. Items tagged{' '}
          <strong>Genuine Apple</strong> are manufactured by Apple Inc. and bought by us through
          authorised distribution. Items tagged <strong>Third-party</strong> are made by other
          manufacturers, including our own Orbit line, and are compatible with Apple devices rather
          than made by Apple.
        </p>
        <p>
          We are an independent reseller. We are not affiliated with, authorised by, or endorsed by
          Apple Inc.
        </p>
      </>
    ),
  },
  {
    q: 'How do I know something will fit my device?',
    a: (
      <p>
        Every product page has a <strong>Confirmed compatible with</strong> block listing the exact
        models we have physically tested. That list is complete — if your model is not on it, we are
        not claiming it fits. When you are unsure, <Link to="/contact">email us your model</Link> and
        we will check the part number before you spend anything.
      </p>
    ),
  },
  {
    q: 'What does shipping cost and how long does it take?',
    a: (
      <p>
        Standard tracked shipping is {money(site.standardShipping)}, and free on orders over{' '}
        {site.currencySymbol}
        {site.freeShippingThreshold}. It takes {site.standardTransit} after dispatch. Express is{' '}
        {money(site.expressShipping)} and takes {site.expressTransit}. Orders placed before 2pm ET
        on a business day ship the same day. Full detail on the{' '}
        <Link to="/shipping">shipping page</Link>.
      </p>
    ),
  },
  {
    q: 'Do you ship outside the United States?',
    a: (
      <p>
        Not currently. We ship within the US only, including Alaska, Hawaii and APO/FPO addresses.
        An order placed from outside the US will be cancelled and refunded in full.
      </p>
    ),
  },
  {
    q: 'Can I return something if I ordered the wrong one?',
    a: (
      <p>
        Yes — {site.returnsWindowDays} days from delivery. Unopened or unused gets a full refund;
        you cover the return postage on a change of mind. If the compatibility we listed was wrong,
        or the item is faulty, we pay the postage both ways. Band sizing exchanges are free either
        way. See the <Link to="/returns">returns policy</Link>.
      </p>
    ),
  },
  {
    q: 'Which items cannot be returned?',
    a: (
      <p>
        Once the seal is broken: in-ear headphones and earbuds, replacement ear tips, and applied
        screen protectors — all for hygiene reasons, and none of it applies if the item is faulty.
        Everything else in the catalogue is returnable.
      </p>
    ),
  },
  {
    q: 'When does my refund actually arrive?',
    a: (
      <p>
        We issue it within 3 business days of the return passing inspection. Your bank then takes
        3–5 business days for a credit card, sometimes up to 10 for a debit card. That second part
        is out of our hands, but the reference we email you will let your bank locate it.
      </p>
    ),
  },
  {
    q: 'My payment was declined. What now?',
    a: (
      <p>
        Nothing was charged and no order was created — your cart is untouched. The usual cause is a
        bank fraud check on a first order to a new merchant, or a billing address that does not
        match what your bank holds. Try again, or quote the reference from the declined screen to{' '}
        <Tok value={site.email} /> and we will send you a secure payment link.
      </p>
    ),
  },
  {
    q: 'Do you store my card details?',
    a: (
      <p>
        No. Card data goes directly to our payment processor under PCI-DSS. We receive only the card
        brand, the last four digits, and whether the authorisation succeeded. See the{' '}
        <Link to="/privacy">privacy policy</Link>.
      </p>
    ),
  },
  {
    q: 'What warranty comes with these?',
    a: (
      <p>
        {site.warrantyMonths} months against manufacturing defects, on top of any manufacturer
        warranty and your state-law rights. You never pay postage on a valid claim. Details on the{' '}
        <Link to="/warranty">warranty page</Link>.
      </p>
    ),
  },
  {
    q: 'Do I need an account to order?',
    a: (
      <p>
        No. Checkout is guest-only by design — we ask for the minimum needed to ship and to contact
        you about the order. Your cart and saved items live in your own browser, not on our servers.
      </p>
    ),
  },
  {
    q: 'An item is out of stock. Can I backorder it?',
    a: (
      <p>
        We don&apos;t take backorders unless we can give you an honest date, and often we can&apos;t.{' '}
        <Link to="/contact">Email us</Link> the item you want and we will tell you the moment it
        lands — no deposit, no obligation.
      </p>
    ),
  },
]

function Item({ faq, index, open, onToggle }) {
  return (
    <div
      style={{
        borderBottom: '1px solid var(--line-soft)',
      }}
    >
      <h3 style={{ margin: 0 }}>
        <button
          onClick={onToggle}
          aria-expanded={open}
          aria-controls={`faq-${index}`}
          style={{
            width: '100%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 'var(--s-4)',
            padding: '1.15rem 0',
            textAlign: 'left',
            font: 'inherit',
            fontSize: '1.02rem',
            fontWeight: 600,
            letterSpacing: '-0.015em',
            color: 'var(--ink)',
            lineHeight: 1.4,
          }}
        >
          {faq.q}
          <Icon
            name="chevronDown"
            size={19}
            style={{
              flex: 'none',
              color: 'var(--muted)',
              transform: open ? 'rotate(180deg)' : 'none',
              transition: 'transform var(--d-base) var(--e-out)',
            }}
          />
        </button>
      </h3>
      {open && (
        <div
          id={`faq-${index}`}
          className="prose"
          style={{ paddingBottom: 'var(--s-5)', fontSize: 'var(--t-sm)' }}
        >
          {faq.a}
        </div>
      )}
    </div>
  )
}

export default function Faq() {
  const [open, setOpen] = useState(0)

  useEffect(() => {
    document.title = 'FAQ — Orbit Chain Co.'
  }, [])

  return (
    <div className="wrap-prose policy">
      <div className="page-head">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">FAQ</li>
          </ol>
        </nav>
        <h1>Frequently asked questions</h1>
        <p>
          The twelve things people actually email us about. If yours isn&apos;t here,{' '}
          <Link to="/contact">ask us directly</Link>.
        </p>
      </div>

      <div>
        {FAQS.map((faq, i) => (
          <Item
            key={faq.q}
            faq={faq}
            index={i}
            open={open === i}
            onToggle={() => setOpen(open === i ? -1 : i)}
          />
        ))}
      </div>

      <div className="glass" style={{ padding: 'var(--s-5)', marginTop: 'var(--s-7)' }}>
        <h2 style={{ fontSize: '1.1rem', marginBottom: 'var(--s-3)' }}>Still stuck?</h2>
        <p style={{ color: 'var(--muted)', fontSize: 'var(--t-sm)', lineHeight: 1.65 }}>
          Email <Tok value={site.email} /> or call <Tok value={site.phone} /> during {site.hours}. We
          answer {site.responseTime}.
        </p>
        <Link to="/contact" className="btn btn--primary" style={{ marginTop: 'var(--s-4)' }}>
          Contact us
          <Icon name="arrowRight" size={17} />
        </Link>
      </div>
    </div>
  )
}
