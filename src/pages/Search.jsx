import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import { searchProducts, categories } from '../data/catalog'
import { stagger, initReveals } from '../lib/motion'

export default function Search() {
  const [params, setParams] = useSearchParams()
  const q = params.get('q') || ''
  const [draft, setDraft] = useState(q)
  const grid = useRef(null)

  useEffect(() => setDraft(q), [q])

  useEffect(() => {
    document.title = q ? `“${q}” — Orbit Chain Co.` : 'Search — Orbit Chain Co.'
  }, [q])

  const results = useMemo(() => searchProducts(q), [q])

  useEffect(() => {
    stagger(grid.current, 45)
    const t = initReveals(grid.current)
    return () => t?.()
  }, [results])

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Search</h1>
        <form
          role="search"
          onSubmit={(e) => {
            e.preventDefault()
            setParams(draft.trim() ? { q: draft.trim() } : {})
          }}
          style={{ display: 'flex', gap: 'var(--s-2)', maxWidth: '34rem', marginTop: 'var(--s-4)' }}
        >
          <label className="sr-only" htmlFor="q">
            Search products
          </label>
          <input
            id="q"
            className="input"
            placeholder="Try “braided cable”, “45 mm band”, “MagSafe”"
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            autoFocus
          />
          <button className="btn btn--primary" type="submit">
            <Icon name="search" size={17} />
            Search
          </button>
        </form>
      </div>

      <div style={{ paddingBottom: 'var(--section)' }}>
        {!q ? (
          <div className="glass empty">
            <span className="empty__icon">
              <Icon name="search" size={22} />
            </span>
            <h2>What are you looking for?</h2>
            <p>
              Search by product name, device model, or SKU. Searching a device — “iPhone 16 Pro”,
              “45 mm” — returns everything confirmed to fit it.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s-2)', flexWrap: 'wrap' }}>
              {categories.map((c) => (
                <Link key={c.id} to={`/shop/${c.id}`} className="chip">
                  {c.name}
                </Link>
              ))}
            </div>
          </div>
        ) : results.length === 0 ? (
          <div className="glass empty">
            <span className="empty__icon">
              <Icon name="search" size={22} />
            </span>
            <h2>No results for “{q}”</h2>
            <p>
              We may not stock it, or it may be listed under a different name. Tell us the device
              model and what you need — if we can source it, we will.
            </p>
            <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
              <Link to="/contact" className="btn btn--primary">
                Ask us to source it
              </Link>
              <Link to="/shop" className="btn btn--glass">
                Browse everything
              </Link>
            </div>
          </div>
        ) : (
          <>
            <p className="shop__count" style={{ marginBottom: 'var(--s-5)' }}>
              <strong>{results.length}</strong> {results.length === 1 ? 'result' : 'results'} for “
              {q}”
            </p>
            <div className="grid-products" ref={grid}>
              {results.map((p, i) => (
                <ProductCard key={p.id} product={p} eager={i < 4} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  )
}
