import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import { categories } from '../data/catalog'

export default function NotFound() {
  useEffect(() => {
    document.title = 'Page not found — Orbit Chain Co.'
  }, [])

  return (
    <div className="wrap notfound">
      <div>
        <p className="notfound__code mono">404</p>
        <h1>That page isn&apos;t here</h1>
        <p>
          The link may be out of date, or a product may have been discontinued. Everything we
          currently stock is one click away.
        </p>

        <div className="notfound__links">
          <Link to="/" className="btn btn--primary">
            Back to home
          </Link>
          <Link to="/shop" className="btn btn--glass">
            Browse all products
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>

        <div
          style={{
            display: 'flex',
            gap: 'var(--s-3)',
            flexWrap: 'wrap',
            justifyContent: 'center',
            marginTop: 'var(--s-6)',
          }}
        >
          {categories.map((c) => (
            <Link key={c.id} to={`/shop/${c.id}`} className="chip">
              {c.name}
            </Link>
          ))}
        </div>

        <p style={{ marginTop: 'var(--s-6)', fontSize: 'var(--t-sm)' }}>
          Still stuck? <Link to="/contact">Contact us</Link> and we will find the part for you.
        </p>
      </div>
    </div>
  )
}
