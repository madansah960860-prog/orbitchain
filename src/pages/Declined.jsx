import { useEffect } from 'react'
import { Link, Navigate } from 'react-router-dom'
import Icon from '../components/Icon'
import { useStore } from '../store/useStore'
import { site } from '../data/site'
import { money } from '../lib/format'
import { Tok } from '../components/Layout'

/* A failed payment is a UX surface, not an error page. Three things
   have to be true: say plainly what happened, do not blame the
   customer, and keep the cart intact so retrying costs nothing. */

export default function Declined() {
  const attempt = useStore((s) => s.lastAttempt)

  useEffect(() => {
    document.title = 'Payment declined — Orbit Chain Co.'
  }, [])

  // Reached directly, with no attempt in memory.
  if (!attempt) return <Navigate to="/cart" replace />

  return (
    <div className="wrap">
      <div className="declined">
        <span className="declined__mark">
          <Icon name="xCircle" size={30} />
        </span>

        <div>
          <h1>Your payment didn&apos;t go through</h1>
          <p className="declined__lead">
            Your bank declined the authorisation for {money(attempt.total)}, so{' '}
            <strong style={{ color: 'var(--ink)' }}>you have not been charged</strong> and no order
            was created. Your cart is exactly as you left it.
          </p>
        </div>

        <div className="glass glass--lit" style={{ padding: 'var(--s-5)' }}>
          <table className="spec-table">
            <tbody>
              <tr>
                <th scope="row">Reference</th>
                <td className="mono">{attempt.reference}</td>
              </tr>
              <tr>
                <th scope="row">Card</th>
                <td className="mono">
                  {attempt.brand} ending {attempt.last4 || '••••'}
                </td>
              </tr>
              <tr>
                <th scope="row">Amount attempted</th>
                <td className="mono">{money(attempt.total)}</td>
              </tr>
              <tr>
                <th scope="row">Bank response</th>
                <td>
                  <span className="mono">{attempt.code}</span> — {attempt.message}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div>
          <h2 style={{ fontSize: '1.15rem', marginBottom: 'var(--s-4)' }}>
            Why this usually happens
          </h2>
          <ul className="reason-list">
            <li>
              <Icon name="info" size={16} />
              <span>
                <strong style={{ color: 'var(--ink)' }}>Fraud screening.</strong> A first order to a
                new merchant is the most common trigger. A call to the number on the back of your
                card clears it in about a minute.
              </span>
            </li>
            <li>
              <Icon name="info" size={16} />
              <span>
                <strong style={{ color: 'var(--ink)' }}>Address mismatch.</strong> The billing
                address has to match what your bank holds on file, not necessarily where you want
                the parcel sent.
              </span>
            </li>
            <li>
              <Icon name="info" size={16} />
              <span>
                <strong style={{ color: 'var(--ink)' }}>Available balance or limit.</strong> Some
                debit cards hold a little more than the order total during authorisation.
              </span>
            </li>
            <li>
              <Icon name="info" size={16} />
              <span>
                <strong style={{ color: 'var(--ink)' }}>A typo.</strong> An expiry or CVC that is
                one digit out is declined rather than flagged as invalid.
              </span>
            </li>
          </ul>
        </div>

        <div className="notice notice--warn">
          <Icon name="alert" size={18} />
          <div>
            <strong>Note for this build:</strong> no payment provider is connected, so every
            authorisation here declines by design. Wire up a PCI-compliant gateway before taking
            real orders — see <span className="mono">ADS-COMPLIANCE.md</span> in the project root.
          </div>
        </div>

        <div className="declined__actions">
          <Link to="/checkout" className="btn btn--primary btn--lg">
            <Icon name="rotate" size={17} />
            Try a different card
          </Link>
          <Link to="/cart" className="btn btn--glass btn--lg">
            Back to cart
          </Link>
        </div>

        <div
          className="glass"
          style={{ padding: 'var(--s-5)', display: 'flex', flexDirection: 'column', gap: 'var(--s-3)' }}
        >
          <h2 style={{ fontSize: '1rem' }}>Would you rather we just took it from here?</h2>
          <p style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)', lineHeight: 1.6 }}>
            Quote reference <span className="mono">{attempt.reference}</span> and we&apos;ll pick up
            the same basket over the phone or send you a secure payment link. We answer{' '}
            {site.responseTime}.
          </p>
          <div style={{ display: 'flex', gap: 'var(--s-4)', flexWrap: 'wrap' }}>
            <span className="contact-item">
              <Icon name="mail" size={16} />
              <span>
                <Tok value={site.email} />
              </span>
            </span>
            <span className="contact-item">
              <Icon name="phone" size={16} />
              <span>
                <Tok value={site.phone} /> · {site.hours}
              </span>
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
