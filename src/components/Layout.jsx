import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom'
import Icon from './Icon'
import { useStore, cartCount } from '../store/useStore'
import { site, addressLines, DISCLAIMER, DISCLAIMER_SHORT } from '../data/site'
import { categories } from '../data/catalog'
import { splitTokens } from '../lib/format'
import { magnetic } from '../lib/motion'

/* ---------------------------------------------------------------
   Renders {{PLACEHOLDER}} values with a loud highlight so they
   cannot be shipped to a live ad campaign unnoticed.
   --------------------------------------------------------------- */
export function Tok({ value }) {
  return splitTokens(value).map((part, i) =>
    part.token ? (
      <mark key={i} className="token" title="Replace before running ads">
        {part.text}
      </mark>
    ) : (
      <span key={i}>{part.text}</span>
    )
  )
}

/* --------------------------- ambient --------------------------- */
export function Ambient() {
  return (
    <div className="ambient" aria-hidden="true">
      <div className="ambient__orb ambient__orb--cobalt" />
      <div className="ambient__orb ambient__orb--deep" />
      <div className="ambient__orb ambient__orb--amber" />
      <div className="ambient__grain" />
    </div>
  )
}

/* ---------------------------- header --------------------------- */
function Header() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [searchOpen, setSearchOpen] = useState(false)
  const count = useStore(cartCount)
  const navigate = useNavigate()
  const location = useLocation()
  const cartRef = useRef(null)
  const searchRef = useRef(null)

  useEffect(() => setOpen(false), [location.pathname])
  useEffect(() => magnetic(cartRef.current, 0.22), [])

  useEffect(() => {
    if (!open) return
    const onKey = (e) => e.key === 'Escape' && setOpen(false)
    document.addEventListener('keydown', onKey)
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKey)
      document.body.style.overflow = ''
    }
  }, [open])

  useEffect(() => {
    if (searchOpen) searchRef.current?.focus()
  }, [searchOpen])

  const submitSearch = (e) => {
    e.preventDefault()
    const q = query.trim()
    if (!q) return
    navigate(`/search?q=${encodeURIComponent(q)}`)
    setSearchOpen(false)
    setQuery('')
  }

  return (
    <>
      <p className="disclosure-strip">
        <strong>Independent reseller.</strong> Not affiliated with or endorsed by Apple Inc. ·{' '}
        Free US shipping over {site.currencySymbol}
        {site.freeShippingThreshold}
      </p>

      <header className="header">
        <div className="glass glass--lit header__bar">
          <Link to="/" className="header__logo">
            <Icon name="orbit" size={22} />
            Orbit<span style={{ color: 'var(--muted-dim)', fontWeight: 500 }}>&nbsp;Chain</span>
          </Link>

          <nav className="header__nav" aria-label="Primary">
            <NavLink to="/shop" className="header__link">
              All products
            </NavLink>
            {categories.map((c) => (
              <NavLink key={c.id} to={`/shop/${c.id}`} className="header__link">
                {c.name}
              </NavLink>
            ))}
            <NavLink to="/about" className="header__link">
              About
            </NavLink>
          </nav>

          <div className="header__actions">
            {searchOpen ? (
              <form onSubmit={submitSearch} role="search" style={{ display: 'flex', gap: 4 }}>
                <label className="sr-only" htmlFor="site-search">
                  Search products
                </label>
                <input
                  id="site-search"
                  ref={searchRef}
                  className="input"
                  style={{ minWidth: 190, minHeight: 40 }}
                  placeholder="Cable, band, case…"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onBlur={() => !query && setSearchOpen(false)}
                />
                <button className="btn btn--glass btn--icon" type="submit" aria-label="Search">
                  <Icon name="search" />
                </button>
              </form>
            ) : (
              <button
                className="btn btn--glass btn--icon"
                onClick={() => setSearchOpen(true)}
                aria-label="Open search"
              >
                <Icon name="search" />
              </button>
            )}

            <Link
              to="/wishlist"
              className="btn btn--glass btn--icon"
              aria-label="Saved items"
              title="Saved items"
            >
              <Icon name="heart" />
            </Link>

            <Link
              to="/cart"
              ref={cartRef}
              className="btn btn--glass btn--icon cart-btn"
              aria-label={`Cart, ${count} item${count === 1 ? '' : 's'}`}
            >
              <Icon name="cart" />
              {count > 0 && <span className="cart-btn__count tnum">{count}</span>}
            </Link>

            <button
              className="btn btn--glass btn--icon header__burger"
              onClick={() => setOpen(true)}
              aria-label="Open menu"
              aria-expanded={open}
            >
              <Icon name="menu" />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="drawer" role="dialog" aria-modal="true" aria-label="Menu">
          <button className="drawer__scrim" aria-label="Close menu" onClick={() => setOpen(false)} />
          <div className="glass glass--lit drawer__panel">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: 'var(--s-4)',
              }}
            >
              <strong style={{ letterSpacing: '-0.02em' }}>Browse</strong>
              <button
                className="btn btn--glass btn--icon"
                onClick={() => setOpen(false)}
                aria-label="Close menu"
              >
                <Icon name="x" />
              </button>
            </div>
            <Link className="drawer__link" to="/shop">
              All products <Icon name="chevronRight" size={18} />
            </Link>
            {categories.map((c) => (
              <Link key={c.id} className="drawer__link" to={`/shop/${c.id}`}>
                {c.name} <Icon name="chevronRight" size={18} />
              </Link>
            ))}
            <Link className="drawer__link" to="/wishlist">
              Saved items <Icon name="chevronRight" size={18} />
            </Link>
            <Link className="drawer__link" to="/about">
              About us <Icon name="chevronRight" size={18} />
            </Link>
            <Link className="drawer__link" to="/contact">
              Contact <Icon name="chevronRight" size={18} />
            </Link>
          </div>
        </div>
      )}
    </>
  )
}

/* ---------------------------- footer --------------------------- */
function Footer() {
  const a = site.address
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer__top">
          <div className="footer__col">
            <Link to="/" className="header__logo" style={{ marginBottom: 'var(--s-3)' }}>
              <Icon name="orbit" size={22} />
              Orbit Chain
            </Link>
            <p style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)', maxWidth: '34ch' }}>
              {site.tagline} Cables, power, cases, bands and audio — checked against your exact
              model before it ships.
            </p>
            <address
              style={{
                fontStyle: 'normal',
                fontSize: 'var(--t-sm)',
                color: 'var(--muted)',
                marginTop: 'var(--s-4)',
                lineHeight: 1.7,
              }}
            >
              {addressLines().map((line) => (
                <span key={line}>
                  <Tok value={line} />
                  <br />
                </span>
              ))}
              <a href={`mailto:${site.email.replace(/[{}]/g, '')}`}>
                <Tok value={site.email} />
              </a>
              <br />
              <a href={`tel:${site.phoneHref.replace(/[{}]/g, '')}`}>
                <Tok value={site.phone} />
              </a>
            </address>
          </div>

          <div className="footer__col">
            <h3>Shop</h3>
            <ul>
              <li>
                <Link to="/shop">All products</Link>
              </li>
              {categories.map((c) => (
                <li key={c.id}>
                  <Link to={`/shop/${c.id}`}>{c.name}</Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="footer__col">
            <h3>Help</h3>
            <ul>
              <li>
                <Link to="/contact">Contact us</Link>
              </li>
              <li>
                <Link to="/shipping">Shipping</Link>
              </li>
              <li>
                <Link to="/returns">Returns &amp; refunds</Link>
              </li>
              <li>
                <Link to="/warranty">Warranty</Link>
              </li>
              <li>
                <Link to="/faq">FAQ</Link>
              </li>
            </ul>
          </div>

          <div className="footer__col">
            <h3>Company</h3>
            <ul>
              <li>
                <Link to="/about">About us</Link>
              </li>
              <li>
                <Link to="/privacy">Privacy policy</Link>
              </li>
              <li>
                <Link to="/terms">Terms &amp; conditions</Link>
              </li>
              <li>
                <Link to="/cookies">Cookie policy</Link>
              </li>
              <li>
                <Link to="/accessibility">Accessibility</Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="footer__bottom">
          <p className="footer__legal">{DISCLAIMER}</p>
          <p>
            {/* legalName may already end in "Co." — don't double the period. */}
            © {new Date().getFullYear()} <Tok value={site.legalName} />
            {site.legalName.trim().endsWith('.') ? ' ' : '. '}
            All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------ cookie consent ----------------------- */
function CookieConsent() {
  const consent = useStore((s) => s.consent)
  const setConsent = useStore((s) => s.setConsent)
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 900)
    return () => clearTimeout(t)
  }, [])

  if (consent || !mounted) return null

  return (
    <div
      className="glass glass--lit consent"
      role="dialog"
      aria-live="polite"
      aria-label="Cookie preferences"
    >
      <div>
        <strong style={{ display: 'block', marginBottom: 6 }}>We use cookies</strong>
        <p style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)', lineHeight: 1.55 }}>
          Essential cookies keep your cart and preferences working. Optional analytics and
          advertising cookies help us measure which products people actually need. You can change
          this at any time — details in our <Link to="/cookies">cookie policy</Link>.
        </p>
      </div>
      <div className="consent__actions">
        <button className="btn btn--primary" onClick={() => setConsent('all')}>
          Accept all
        </button>
        <button className="btn btn--glass" onClick={() => setConsent('essential')}>
          Essential only
        </button>
      </div>
    </div>
  )
}

/* ----------------------------- toasts -------------------------- */
function Toasts() {
  const toasts = useStore((s) => s.toasts)
  return (
    <div className="toast-region" role="status" aria-live="polite">
      {toasts.map((t) => (
        <div key={t.id} className="glass glass--lit toast">
          <Icon name="checkCircle" size={18} />
          {t.message}
        </div>
      ))}
    </div>
  )
}

/* ----------------------------- shell --------------------------- */
export default function Layout({ children }) {
  return (
    <>
      <a className="skip-link" href="#main">
        Skip to content
      </a>
      <Ambient />
      <Header />
      <main id="main" tabIndex={-1}>
        {children}
      </main>
      <Footer />
      <CookieConsent />
      <Toasts />
      <p className="sr-only">{DISCLAIMER_SHORT}</p>
    </>
  )
}
