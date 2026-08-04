import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Img from '../components/Img'
import { SIZES } from '../lib/images'
import { useStore, useCartLines } from '../store/useStore'
import { site } from '../data/site'
import { money, deliveryWindow } from '../lib/format'
import { OrderSummary } from './Cart'

/* ============================================================
   IMPORTANT — how payment works here

   No payment gateway is connected. Card details are validated in
   the browser and are never transmitted, logged, or persisted:
   the card state lives in component memory only and is dropped on
   unmount. The authorisation step always returns "declined" by
   design, which is what the build was specified to do.

   Before taking real money you must replace `attemptAuthorisation`
   with a call to a PCI-compliant provider (Stripe, Adyen, Braintree)
   and stop rendering raw PAN fields yourself — use their hosted
   fields or Elements so card data never touches your DOM.
   ============================================================ */

const STEPS = [
  { id: 'address', label: 'Address' },
  { id: 'delivery', label: 'Delivery' },
  { id: 'payment', label: 'Payment' },
  { id: 'review', label: 'Review' },
]

/* ---------------------------- validation ---------------------------- */

const luhn = (digits) => {
  let sum = 0
  let alt = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = Number(digits[i])
    if (alt) {
      n *= 2
      if (n > 9) n -= 9
    }
    sum += n
    alt = !alt
  }
  return digits.length >= 13 && sum % 10 === 0
}

const cardBrand = (digits) => {
  if (/^4/.test(digits)) return 'Visa'
  if (/^5[1-5]/.test(digits) || /^2[2-7]/.test(digits)) return 'Mastercard'
  if (/^3[47]/.test(digits)) return 'Amex'
  if (/^6(?:011|5)/.test(digits)) return 'Discover'
  return ''
}

const groupCard = (value) => {
  const d = value.replace(/\D/g, '').slice(0, 19)
  if (/^3[47]/.test(d)) return d.replace(/(\d{4})(\d{0,6})(\d{0,5})/, (_, a, b, c) => [a, b, c].filter(Boolean).join(' '))
  return d.replace(/(\d{4})(?=\d)/g, '$1 ').trim()
}

const validators = {
  email: (v) => (/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(v.trim()) ? '' : 'Enter a valid email address'),
  firstName: (v) => (v.trim().length >= 2 ? '' : 'Enter your first name'),
  lastName: (v) => (v.trim().length >= 2 ? '' : 'Enter your last name'),
  address1: (v) => (v.trim().length >= 4 ? '' : 'Enter your street address'),
  city: (v) => (v.trim().length >= 2 ? '' : 'Enter your city'),
  state: (v) => (v.trim().length >= 2 ? '' : 'Select your state'),
  zip: (v) => (/^\d{5}(-\d{4})?$/.test(v.trim()) ? '' : 'Enter a 5-digit ZIP code'),
  phone: (v) => (v.replace(/\D/g, '').length >= 10 ? '' : 'Enter a 10-digit phone number'),
}

const cardValidators = {
  cardName: (v) => (v.trim().length >= 3 ? '' : 'Enter the name printed on the card'),
  cardNumber: (v) => {
    const d = v.replace(/\D/g, '')
    if (d.length < 13) return 'Enter the full card number'
    if (!luhn(d)) return 'That card number is not valid — check for a typo'
    return ''
  },
  expiry: (v) => {
    const m = v.match(/^(\d{2})\s*\/\s*(\d{2})$/)
    if (!m) return 'Use MM/YY'
    const month = Number(m[1])
    const year = 2000 + Number(m[2])
    if (month < 1 || month > 12) return 'Month must be 01–12'
    const end = new Date(year, month, 1)
    if (end <= new Date()) return 'That card has expired'
    return ''
  },
  cvc: (v) => (/^\d{3,4}$/.test(v.trim()) ? '' : 'CVC is 3 digits (4 on Amex)'),
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC',
]

/* ------------------------------- field ------------------------------- */

function Field({ id, label, hint, error, children, span }) {
  return (
    <div className={`field ${span ? 'span-2' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
      </label>
      {children}
      {hint && !error && <p className="field__hint">{hint}</p>}
      {error && (
        <p className="field__error" id={`${id}-error`}>
          <Icon name="alert" size={14} />
          {error}
        </p>
      )}
    </div>
  )
}

/* ============================================================ */

export default function Checkout() {
  const lines = useCartLines()
  const setLastAttempt = useStore((s) => s.setLastAttempt)
  const navigate = useNavigate()
  const [step, setStep] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const headingRef = useRef(null)

  const [form, setForm] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    phone: '',
    marketing: false,
  })
  // Card state is intentionally separate and never persisted.
  const [card, setCard] = useState({ cardName: '', cardNumber: '', expiry: '', cvc: '' })
  const [delivery, setDelivery] = useState('standard')
  const [errors, setErrors] = useState({})

  useEffect(() => {
    document.title = 'Checkout — Orbit Chain Co.'
  }, [])

  useEffect(() => {
    headingRef.current?.focus()
  }, [step])

  const subtotal = lines.reduce((s, l) => s + l.product.price * l.qty, 0)
  const shipCost =
    delivery === 'express'
      ? site.expressShipping
      : subtotal >= site.freeShippingThreshold
        ? 0
        : site.standardShipping
  const tax = Math.round(subtotal * 0.0825 * 100) / 100
  const total = subtotal + shipCost + tax

  const brand = useMemo(() => cardBrand(card.cardNumber.replace(/\D/g, '')), [card.cardNumber])

  if (lines.length === 0 && !submitting) {
    return (
      <div className="wrap">
        <div className="page-head">
          <h1>Checkout</h1>
        </div>
        <div className="glass empty" style={{ marginBottom: 'var(--section)' }}>
          <span className="empty__icon">
            <Icon name="cart" size={22} />
          </span>
          <h2>There is nothing to check out</h2>
          <p>Add something to your cart first and we&apos;ll pick this back up.</p>
          <Link to="/shop" className="btn btn--primary">
            Browse the catalog
          </Link>
        </div>
      </div>
    )
  }

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }
  const setCardField = (k, v) => {
    setCard((c) => ({ ...c, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const validateStep = () => {
    const next = {}
    if (step === 0) {
      Object.entries(validators).forEach(([k, fn]) => {
        const msg = fn(form[k] ?? '')
        if (msg) next[k] = msg
      })
    }
    if (step === 2) {
      Object.entries(cardValidators).forEach(([k, fn]) => {
        const msg = fn(card[k] ?? '')
        if (msg) next[k] = msg
      })
    }
    setErrors(next)
    if (Object.keys(next).length) {
      // Move focus to the first invalid control — errors belong next to
      // the field, and the user needs to land on it.
      requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus())
      return false
    }
    return true
  }

  const advance = () => {
    if (!validateStep()) return
    setStep((s) => Math.min(STEPS.length - 1, s + 1))
  }

  /* The authorisation call. See the note at the top of this file. */
  const attemptAuthorisation = () =>
    new Promise((resolve) => {
      setTimeout(
        () =>
          resolve({
            approved: false,
            code: 'do_not_honor',
            message: 'The issuing bank declined this authorisation.',
          }),
        1900
      )
    })

  const placeOrder = async () => {
    setSubmitting(true)
    const result = await attemptAuthorisation()

    setLastAttempt({
      reference: `ORB-${Date.now().toString(36).toUpperCase().slice(-6)}`,
      total,
      email: form.email,
      // Last four only — enough to identify the card, never the full PAN.
      last4: card.cardNumber.replace(/\D/g, '').slice(-4),
      brand: brand || 'Card',
      code: result.code,
      message: result.message,
      itemCount: lines.reduce((n, l) => n + l.qty, 0),
    })

    // Clear card details from memory the moment we're done with them.
    setCard({ cardName: '', cardNumber: '', expiry: '', cvc: '' })
    navigate('/checkout/declined')
  }

  return (
    <div className="wrap">
      <div className="page-head" style={{ paddingBottom: 'var(--s-5)' }}>
        <h1 tabIndex={-1} ref={headingRef}>
          Checkout
        </h1>
        <ol className="steps">
          {STEPS.map((s, i) => (
            <li key={s.id} data-state={i < step ? 'done' : i === step ? 'current' : 'todo'}>
              <span className="step-num">{i < step ? <Icon name="check" size={11} /> : i + 1}</span>
              {s.label}
            </li>
          ))}
        </ol>
      </div>

      <div className="cart-layout">
        <div className="glass glass--lit checkout-panel">
          {/* ------------------------- 1. ADDRESS ------------------------- */}
          {step === 0 && (
            <>
              <h2>Where should this go?</h2>
              <div className="form-grid">
                <Field id="email" label="Email address" error={errors.email} span hint="Order confirmation and tracking go here.">
                  <input
                    id="email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    aria-invalid={Boolean(errors.email)}
                    onChange={(e) => set('email', e.target.value)}
                  />
                </Field>

                <Field id="firstName" label="First name" error={errors.firstName}>
                  <input
                    id="firstName"
                    className="input"
                    autoComplete="given-name"
                    value={form.firstName}
                    aria-invalid={Boolean(errors.firstName)}
                    onChange={(e) => set('firstName', e.target.value)}
                  />
                </Field>

                <Field id="lastName" label="Last name" error={errors.lastName}>
                  <input
                    id="lastName"
                    className="input"
                    autoComplete="family-name"
                    value={form.lastName}
                    aria-invalid={Boolean(errors.lastName)}
                    onChange={(e) => set('lastName', e.target.value)}
                  />
                </Field>

                <Field id="address1" label="Street address" error={errors.address1} span>
                  <input
                    id="address1"
                    className="input"
                    autoComplete="address-line1"
                    value={form.address1}
                    aria-invalid={Boolean(errors.address1)}
                    onChange={(e) => set('address1', e.target.value)}
                  />
                </Field>

                <Field id="address2" label="Apartment, suite (optional)" span>
                  <input
                    id="address2"
                    className="input"
                    autoComplete="address-line2"
                    value={form.address2}
                    onChange={(e) => set('address2', e.target.value)}
                  />
                </Field>

                <Field id="city" label="City" error={errors.city}>
                  <input
                    id="city"
                    className="input"
                    autoComplete="address-level2"
                    value={form.city}
                    aria-invalid={Boolean(errors.city)}
                    onChange={(e) => set('city', e.target.value)}
                  />
                </Field>

                <Field id="state" label="State" error={errors.state}>
                  <select
                    id="state"
                    className="select"
                    autoComplete="address-level1"
                    value={form.state}
                    aria-invalid={Boolean(errors.state)}
                    onChange={(e) => set('state', e.target.value)}
                  >
                    <option value="">Choose…</option>
                    {US_STATES.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </Field>

                <Field id="zip" label="ZIP code" error={errors.zip}>
                  <input
                    id="zip"
                    className="input"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    value={form.zip}
                    aria-invalid={Boolean(errors.zip)}
                    onChange={(e) => set('zip', e.target.value)}
                  />
                </Field>

                <Field id="phone" label="Phone" error={errors.phone} hint="Used by the carrier for delivery issues only.">
                  <input
                    id="phone"
                    className="input"
                    type="tel"
                    autoComplete="tel"
                    value={form.phone}
                    aria-invalid={Boolean(errors.phone)}
                    onChange={(e) => set('phone', e.target.value)}
                  />
                </Field>
              </div>

              <label className="checkbox-row">
                <input
                  type="checkbox"
                  checked={form.marketing}
                  onChange={(e) => set('marketing', e.target.checked)}
                />
                Email me occasionally about new stock and restocks. Unticked by default, and one
                click to leave at any time.
              </label>

              <button className="btn btn--primary btn--lg" onClick={advance}>
                Continue to delivery
                <Icon name="arrowRight" size={17} />
              </button>
            </>
          )}

          {/* ------------------------ 2. DELIVERY ------------------------- */}
          {step === 1 && (
            <>
              <h2>How fast do you need it?</h2>
              <div className="pay-methods">
                <label className="pay-method">
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === 'standard'}
                    onChange={() => setDelivery('standard')}
                  />
                  <Icon name="truck" size={20} />
                  <span className="pay-method__label">
                    <strong>Standard — {site.standardTransit}</strong>
                    <span>Arrives {deliveryWindow(3, 5)} · tracked</span>
                  </span>
                  <span className="price" style={{ marginInlineStart: 'auto' }}>
                    {subtotal >= site.freeShippingThreshold ? 'Free' : money(site.standardShipping)}
                  </span>
                </label>

                <label className="pay-method">
                  <input
                    type="radio"
                    name="delivery"
                    checked={delivery === 'express'}
                    onChange={() => setDelivery('express')}
                  />
                  <Icon name="zap" size={20} />
                  <span className="pay-method__label">
                    <strong>Express — {site.expressTransit}</strong>
                    <span>Arrives {deliveryWindow(1, 2)} · tracked, signature on delivery</span>
                  </span>
                  <span className="price" style={{ marginInlineStart: 'auto' }}>
                    {money(site.expressShipping)}
                  </span>
                </label>
              </div>

              <div className="notice notice--info">
                <Icon name="info" size={18} />
                <div>
                  Orders placed before 2pm ET ship the same business day. We ship within the United
                  States only — see <Link to="/shipping">shipping policy</Link>.
                </div>
              </div>

              <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                <button className="btn btn--glass" onClick={() => setStep(0)}>
                  <Icon name="arrowLeft" size={17} />
                  Back
                </button>
                <button className="btn btn--primary btn--lg" onClick={advance} style={{ flex: 1 }}>
                  Continue to payment
                  <Icon name="arrowRight" size={17} />
                </button>
              </div>
            </>
          )}

          {/* ------------------------- 3. PAYMENT ------------------------- */}
          {step === 2 && (
            <>
              <h2>Payment details</h2>

              <div className="notice notice--warn">
                <Icon name="alert" size={18} />
                <div>
                  <strong>Demonstration checkout — do not enter a real card.</strong> No payment
                  provider is connected to this build. What you type is validated in your browser,
                  is never transmitted or stored, and every authorisation attempt will decline. Use
                  a test number such as <span className="mono">4242 4242 4242 4242</span>.
                </div>
              </div>

              <div className="pay-methods">
                <label className="pay-method">
                  <input type="radio" name="pay" defaultChecked />
                  <Icon name="card" size={20} />
                  <span className="pay-method__label">
                    <strong>Credit or debit card</strong>
                    <span>Visa, Mastercard, American Express, Discover</span>
                  </span>
                  <span className="card-brands" aria-hidden="true">
                    <span className="card-brand">VISA</span>
                    <span className="card-brand">MC</span>
                    <span className="card-brand">AMEX</span>
                  </span>
                </label>
              </div>

              <div className="form-grid">
                <Field id="cardName" label="Name on card" error={errors.cardName} span>
                  <input
                    id="cardName"
                    className="input"
                    autoComplete="cc-name"
                    value={card.cardName}
                    aria-invalid={Boolean(errors.cardName)}
                    onChange={(e) => setCardField('cardName', e.target.value)}
                  />
                </Field>

                <Field
                  id="cardNumber"
                  label="Card number"
                  error={errors.cardNumber}
                  hint={brand ? `${brand} detected` : undefined}
                  span
                >
                  <input
                    id="cardNumber"
                    className="input mono"
                    inputMode="numeric"
                    autoComplete="cc-number"
                    placeholder="4242 4242 4242 4242"
                    value={card.cardNumber}
                    aria-invalid={Boolean(errors.cardNumber)}
                    onChange={(e) => setCardField('cardNumber', groupCard(e.target.value))}
                  />
                </Field>

                <Field id="expiry" label="Expiry (MM/YY)" error={errors.expiry}>
                  <input
                    id="expiry"
                    className="input mono"
                    inputMode="numeric"
                    autoComplete="cc-exp"
                    placeholder="12/28"
                    value={card.expiry}
                    aria-invalid={Boolean(errors.expiry)}
                    onChange={(e) => {
                      let v = e.target.value.replace(/\D/g, '').slice(0, 4)
                      if (v.length > 2) v = `${v.slice(0, 2)}/${v.slice(2)}`
                      setCardField('expiry', v)
                    }}
                  />
                </Field>

                <Field id="cvc" label="Security code" error={errors.cvc}>
                  <input
                    id="cvc"
                    className="input mono"
                    inputMode="numeric"
                    autoComplete="cc-csc"
                    placeholder="123"
                    value={card.cvc}
                    aria-invalid={Boolean(errors.cvc)}
                    onChange={(e) => setCardField('cvc', e.target.value.replace(/\D/g, '').slice(0, 4))}
                  />
                </Field>
              </div>

              <p className="assurance">
                <Icon name="lock" size={17} />
                <span>
                  Billing address is assumed to match the shipping address you entered. Change it on
                  the review step if it differs.
                </span>
              </p>

              <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                <button className="btn btn--glass" onClick={() => setStep(1)}>
                  <Icon name="arrowLeft" size={17} />
                  Back
                </button>
                <button className="btn btn--primary btn--lg" onClick={advance} style={{ flex: 1 }}>
                  Review order
                  <Icon name="arrowRight" size={17} />
                </button>
              </div>
            </>
          )}

          {/* -------------------------- 4. REVIEW ------------------------- */}
          {step === 3 && (
            <>
              <h2>Check this over</h2>

              <table className="spec-table">
                <tbody>
                  <tr>
                    <th scope="row">Contact</th>
                    <td>
                      {form.email}
                      <br />
                      {form.phone}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Ship to</th>
                    <td>
                      {form.firstName} {form.lastName}
                      <br />
                      {form.address1}
                      {form.address2 && (
                        <>
                          <br />
                          {form.address2}
                        </>
                      )}
                      <br />
                      {form.city}, {form.state} {form.zip}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Delivery</th>
                    <td>
                      {delivery === 'express'
                        ? `Express — arrives ${deliveryWindow(1, 2)}`
                        : `Standard — arrives ${deliveryWindow(3, 5)}`}
                    </td>
                  </tr>
                  <tr>
                    <th scope="row">Paying with</th>
                    <td className="mono">
                      {brand || 'Card'} ending {card.cardNumber.replace(/\D/g, '').slice(-4) || '••••'}
                    </td>
                  </tr>
                </tbody>
              </table>

              <div>
                <h3 style={{ fontSize: '0.95rem', marginBottom: 'var(--s-3)' }}>
                  {lines.reduce((n, l) => n + l.qty, 0)} items
                </h3>
                {lines.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      gap: 'var(--s-3)',
                      padding: '0.5rem 0',
                      fontSize: 'var(--t-sm)',
                      borderBottom: '1px solid var(--line-soft)',
                    }}
                  >
                    <span style={{ color: 'var(--muted)' }}>
                      {qty} × {product.name}
                    </span>
                    <span className="mono">{money(product.price * qty)}</span>
                  </div>
                ))}
              </div>

              <p style={{ fontSize: 'var(--t-xs)', color: 'var(--muted)', lineHeight: 1.6 }}>
                By placing this order you agree to our <Link to="/terms">terms and conditions</Link>{' '}
                and confirm you have read the <Link to="/returns">returns policy</Link> and{' '}
                <Link to="/privacy">privacy policy</Link>. You will be charged {money(total)} once —
                there is no subscription and no recurring charge.
              </p>

              <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
                <button className="btn btn--glass" onClick={() => setStep(2)} disabled={submitting}>
                  <Icon name="arrowLeft" size={17} />
                  Back
                </button>
                <button
                  className="btn btn--primary btn--lg"
                  onClick={placeOrder}
                  disabled={submitting}
                  style={{ flex: 1 }}
                  aria-busy={submitting}
                >
                  <Icon name="lock" size={17} />
                  {submitting ? 'Contacting your bank…' : `Pay ${money(total)}`}
                </button>
              </div>

              {submitting && (
                <p
                  role="status"
                  aria-live="polite"
                  style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)' }}
                >
                  Requesting authorisation. Do not close this window.
                </p>
              )}
            </>
          )}
        </div>

        <OrderSummary subtotal={subtotal} shipping={shipCost} tax={tax} total={total}>
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
              paddingTop: 'var(--s-4)',
              borderTop: '1px solid var(--line-soft)',
            }}
          >
            {lines.map(({ product, qty }) => (
              <div
                key={product.id}
                style={{
                  display: 'flex',
                  gap: '0.6rem',
                  alignItems: 'center',
                  fontSize: 'var(--t-xs)',
                  color: 'var(--muted)',
                }}
              >
                <Img
                  name={product.image}
                  alt=""
                  sizes={SIZES.miniThumb}
                  width={34}
                  height={34}
                  style={{ borderRadius: 6, objectFit: 'cover', flex: 'none' }}
                />
                <span style={{ flex: 1, lineHeight: 1.35 }}>
                  {qty} × {product.name}
                </span>
              </div>
            ))}
          </div>
          <Link to="/cart" className="btn btn--ghost" style={{ paddingInline: 0 }}>
            <Icon name="arrowLeft" size={15} />
            Edit cart
          </Link>
        </OrderSummary>
      </div>
    </div>
  )
}
