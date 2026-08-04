import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { site, addressLines } from '../data/site'
import { Tok } from '../components/Layout'

const TOPICS = [
  'Will this fit my device?',
  'Where is my order?',
  'Return or refund',
  'Warranty claim',
  'Something else',
]

export default function Contact() {
  const [sent, setSent] = useState(false)
  const [errors, setErrors] = useState({})
  const [form, setForm] = useState({ name: '', email: '', topic: TOPICS[0], order: '', message: '' })

  useEffect(() => {
    document.title = 'Contact us — Orbit Chain Co.'
  }, [])

  const set = (k, v) => {
    setForm((f) => ({ ...f, [k]: v }))
    if (errors[k]) setErrors((e) => ({ ...e, [k]: '' }))
  }

  const submit = (e) => {
    e.preventDefault()
    const next = {}
    if (form.name.trim().length < 2) next.name = 'Enter your name'
    if (!/^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i.test(form.email.trim()))
      next.email = 'Enter a valid email address'
    if (form.message.trim().length < 10)
      next.message = 'Tell us a little more so we can actually help'
    setErrors(next)
    if (Object.keys(next).length) {
      requestAnimationFrame(() => document.getElementById(Object.keys(next)[0])?.focus())
      return
    }
    setSent(true)
  }

  const a = site.address

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Contact us</h1>
        <p>
          A real person reads these. We answer {site.responseTime} during {site.hours}. If
          you&apos;re asking about fitment, include your exact device model and we&apos;ll check the
          part number for you.
        </p>
      </div>

      <div className="contact-layout">
        <div className="glass glass--lit checkout-panel">
          {sent ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--s-4)' }}>
              <span className="empty__icon" style={{ color: 'var(--success)' }}>
                <Icon name="checkCircle" size={24} />
              </span>
              <h2>Message ready to send</h2>
              <p style={{ color: 'var(--muted)', lineHeight: 1.65 }}>
                This build has no mail backend wired up yet, so nothing was actually transmitted.
                Send the same details to <Tok value={site.email} /> and we&apos;ll pick it up from
                there.
              </p>
              <div className="notice notice--info">
                <Icon name="info" size={18} />
                <div>
                  <strong>To make this form live,</strong> point it at your form handler or
                  transactional email provider. See <span className="mono">ADS-COMPLIANCE.md</span>{' '}
                  — Google Ads expects a working contact route.
                </div>
              </div>
              <button className="btn btn--glass" onClick={() => setSent(false)}>
                Write another message
              </button>
            </div>
          ) : (
            <form onSubmit={submit} noValidate style={{ display: 'contents' }}>
              <h2>Send us a message</h2>

              <div className="form-grid">
                <div className="field">
                  <label className="field__label" htmlFor="name">
                    Your name
                  </label>
                  <input
                    id="name"
                    className="input"
                    autoComplete="name"
                    value={form.name}
                    aria-invalid={Boolean(errors.name)}
                    onChange={(e) => set('name', e.target.value)}
                  />
                  {errors.name && (
                    <p className="field__error">
                      <Icon name="alert" size={14} />
                      {errors.name}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="email">
                    Email address
                  </label>
                  <input
                    id="email"
                    className="input"
                    type="email"
                    autoComplete="email"
                    value={form.email}
                    aria-invalid={Boolean(errors.email)}
                    onChange={(e) => set('email', e.target.value)}
                  />
                  {errors.email && (
                    <p className="field__error">
                      <Icon name="alert" size={14} />
                      {errors.email}
                    </p>
                  )}
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="topic">
                    What is this about?
                  </label>
                  <select
                    id="topic"
                    className="select"
                    value={form.topic}
                    onChange={(e) => set('topic', e.target.value)}
                  >
                    {TOPICS.map((t) => (
                      <option key={t}>{t}</option>
                    ))}
                  </select>
                </div>

                <div className="field">
                  <label className="field__label" htmlFor="order">
                    Order number (optional)
                  </label>
                  <input
                    id="order"
                    className="input mono"
                    placeholder="ORB-XXXXXX"
                    value={form.order}
                    onChange={(e) => set('order', e.target.value)}
                  />
                </div>

                <div className="field span-2">
                  <label className="field__label" htmlFor="message">
                    Message
                  </label>
                  <textarea
                    id="message"
                    className="textarea"
                    value={form.message}
                    aria-invalid={Boolean(errors.message)}
                    onChange={(e) => set('message', e.target.value)}
                    placeholder="Including your device model helps us answer in one reply rather than three."
                  />
                  {errors.message && (
                    <p className="field__error">
                      <Icon name="alert" size={14} />
                      {errors.message}
                    </p>
                  )}
                </div>
              </div>

              <p style={{ fontSize: 'var(--t-xs)', color: 'var(--muted)', lineHeight: 1.6 }}>
                We use what you send here only to answer you. See our{' '}
                <Link to="/privacy">privacy policy</Link>.
              </p>

              <button className="btn btn--primary btn--lg" type="submit">
                <Icon name="mail" size={17} />
                Send message
              </button>
            </form>
          )}
        </div>

        <div className="glass contact-card">
          <h2 style={{ fontSize: '1.05rem' }}>Other ways to reach us</h2>

          <p className="contact-item">
            <Icon name="mail" size={18} />
            <span>
              <strong>Email</strong>
              <Tok value={site.email} />
            </span>
          </p>

          <p className="contact-item">
            <Icon name="phone" size={18} />
            <span>
              <strong>Phone</strong>
              <Tok value={site.phone} />
              <br />
              {site.hours}
            </span>
          </p>

          <p className="contact-item">
            <Icon name="pin" size={18} />
            <span>
              <strong>Returns &amp; registered address</strong>
              <address>
                {addressLines().map((line, i, arr) => (
                  <span key={line}>
                    <Tok value={line} />
                    {i < arr.length - 1 && <br />}
                  </span>
                ))}
              </address>
            </span>
          </p>

          <p className="contact-item">
            <Icon name="package" size={18} />
            <span>
              <strong>Before you post a return</strong>
              Request an RMA number first — see the{' '}
              <Link to="/returns">returns policy</Link>. Unlabelled parcels take longer to match to
              an order.
            </span>
          </p>

          <div
            style={{
              paddingTop: 'var(--s-4)',
              borderTop: '1px solid var(--line-soft)',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.5rem',
            }}
          >
            <Link to="/faq" style={{ fontSize: 'var(--t-sm)' }}>
              Frequently asked questions
            </Link>
            <Link to="/shipping" style={{ fontSize: 'var(--t-sm)' }}>
              Shipping &amp; delivery times
            </Link>
            <Link to="/warranty" style={{ fontSize: 'var(--t-sm)' }}>
              Warranty terms
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
