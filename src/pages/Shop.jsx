import { useEffect, useMemo, useRef, useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import {
  products,
  categories,
  categoryName,
  deviceFamilies,
  fitsFamily,
  priceBands,
} from '../data/catalog'
import { stagger, initReveals } from '../lib/motion'

const SORTS = [
  { id: 'featured', label: 'Featured' },
  { id: 'price-asc', label: 'Price: low to high' },
  { id: 'price-desc', label: 'Price: high to low' },
  { id: 'rating', label: 'Best rated' },
  { id: 'name', label: 'Name A–Z' },
]

export default function Shop() {
  const { category } = useParams()
  const [params, setParams] = useSearchParams()
  const [collapsed, setCollapsed] = useState(true)
  const grid = useRef(null)

  const device = params.get('device') || ''
  const band = params.get('price') || ''
  const sort = params.get('sort') || 'featured'
  const genuineOnly = params.get('genuine') === '1'
  const inStockOnly = params.get('instock') === '1'

  const cat = categories.find((c) => c.id === category)

  useEffect(() => {
    document.title = cat
      ? `${cat.name} — Orbit Chain Co.`
      : 'All products — Orbit Chain Co.'
  }, [cat])

  const results = useMemo(() => {
    let list = category ? products.filter((p) => p.category === category) : [...products]
    if (device) list = list.filter((p) => fitsFamily(p, device))
    if (band) {
      const rule = priceBands.find((b) => b.id === band)
      if (rule) list = list.filter(rule.test)
    }
    if (genuineOnly) list = list.filter((p) => p.genuine)
    if (inStockOnly) list = list.filter((p) => p.stock !== 'out')

    const sorters = {
      'price-asc': (a, b) => a.price - b.price,
      'price-desc': (a, b) => b.price - a.price,
      rating: (a, b) => b.rating - a.rating || b.reviews - a.reviews,
      name: (a, b) => a.name.localeCompare(b.name),
      featured: (a, b) => Number(Boolean(b.featured)) - Number(Boolean(a.featured)),
    }
    return list.sort(sorters[sort] ?? sorters.featured)
  }, [category, device, band, sort, genuineOnly, inStockOnly])

  useEffect(() => {
    stagger(grid.current, 45)
    const t = initReveals(grid.current)
    return () => t?.()
  }, [results])

  const setParam = (key, value) => {
    const next = new URLSearchParams(params)
    if (!value) next.delete(key)
    else next.set(key, value)
    setParams(next, { replace: true })
  }

  const activeCount = [device, band, genuineOnly, inStockOnly].filter(Boolean).length

  return (
    <div className="wrap">
      <div className="page-head">
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            {cat && (
              <>
                <li aria-hidden="true">/</li>
                <li aria-current="page">{cat.name}</li>
              </>
            )}
          </ol>
        </nav>
        <h1>{cat ? cat.name : 'All products'}</h1>
        <p>
          {cat
            ? cat.blurb
            : 'Everything we stock, across audio, power, protection, bands and input. Each listing states the exact models we have tested.'}
        </p>
      </div>

      <div className="shop">
        <aside>
          <button
            className="btn btn--glass filters-toggle"
            onClick={() => setCollapsed((c) => !c)}
            aria-expanded={!collapsed}
            style={{ marginBottom: 'var(--s-4)' }}
          >
            <Icon name="sliders" size={17} />
            Filters
            {activeCount > 0 && <span className="badge badge--accent">{activeCount}</span>}
          </button>

          <div className="glass filters" data-collapsed={collapsed}>
            <div className="filters__group">
              <h3>Category</h3>
              <ul className="filters__list">
                <li>
                  <Link
                    to="/shop"
                    style={{
                      fontSize: 'var(--t-sm)',
                      color: !category ? 'var(--ink)' : 'var(--muted)',
                      textDecoration: 'none',
                      fontWeight: !category ? 600 : 400,
                    }}
                  >
                    All products
                  </Link>
                </li>
                {categories.map((c) => (
                  <li key={c.id}>
                    <Link
                      to={`/shop/${c.id}`}
                      style={{
                        fontSize: 'var(--t-sm)',
                        color: category === c.id ? 'var(--ink)' : 'var(--muted)',
                        textDecoration: 'none',
                        fontWeight: category === c.id ? 600 : 400,
                      }}
                    >
                      {c.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            <div className="filters__group">
              <h3>Fits device</h3>
              <div className="finder__chips">
                {deviceFamilies.map((d) => (
                  <button
                    key={d}
                    className={`chip ${device === d ? 'chip--on' : ''}`}
                    aria-pressed={device === d}
                    onClick={() => setParam('device', device === d ? '' : d)}
                  >
                    {d}
                  </button>
                ))}
              </div>
            </div>

            <div className="filters__group">
              <h3>Price</h3>
              <ul className="filters__list">
                {priceBands.map((b) => (
                  <li key={b.id}>
                    <label className="checkbox-row">
                      <input
                        type="radio"
                        name="price"
                        checked={band === b.id}
                        onChange={() => setParam('price', b.id)}
                      />
                      {b.label}
                    </label>
                  </li>
                ))}
              </ul>
              {band && (
                <button
                  className="btn btn--ghost"
                  style={{ marginTop: 'var(--s-2)', fontSize: 'var(--t-xs)' }}
                  onClick={() => setParam('price', '')}
                >
                  Clear price
                </button>
              )}
            </div>

            <div className="filters__group">
              <h3>Other</h3>
              <ul className="filters__list">
                <li>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={genuineOnly}
                      onChange={(e) => setParam('genuine', e.target.checked ? '1' : '')}
                    />
                    Genuine Apple only
                  </label>
                </li>
                <li>
                  <label className="checkbox-row">
                    <input
                      type="checkbox"
                      checked={inStockOnly}
                      onChange={(e) => setParam('instock', e.target.checked ? '1' : '')}
                    />
                    In stock only
                  </label>
                </li>
              </ul>
            </div>

            {activeCount > 0 && (
              <button className="btn btn--glass" onClick={() => setParams({}, { replace: true })}>
                Clear all filters
              </button>
            )}
          </div>
        </aside>

        <div>
          <div className="shop__bar">
            <p className="shop__count">
              <strong>{results.length}</strong> {results.length === 1 ? 'product' : 'products'}
              {device && ` compatible with ${device}`}
            </p>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <span style={{ fontSize: 'var(--t-sm)', color: 'var(--muted)' }}>Sort</span>
              <select
                className="select"
                style={{ width: 'auto', minHeight: 42 }}
                value={sort}
                onChange={(e) => setParam('sort', e.target.value)}
              >
                {SORTS.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {results.length === 0 ? (
            <div className="glass empty">
              <span className="empty__icon">
                <Icon name="search" size={22} />
              </span>
              <h2>Nothing matches those filters</h2>
              <p>
                That combination has no results right now. Try widening the price band, or clear the
                device filter — some products fit more than one family.
              </p>
              <button className="btn btn--primary" onClick={() => setParams({}, { replace: true })}>
                Clear filters
              </button>
            </div>
          ) : (
            <div className="grid-products" ref={grid}>
              {results.map((prod, i) => (
                <ProductCard key={prod.id} product={prod} eager={i < 4} />
              ))}
            </div>
          )}

          {!category && (
            <p
              style={{
                marginTop: 'var(--s-7)',
                fontSize: 'var(--t-sm)',
                color: 'var(--muted-dim)',
                maxWidth: '70ch',
                lineHeight: 1.6,
              }}
            >
              Products labelled <strong style={{ color: 'var(--muted)' }}>Genuine Apple</strong> are
              manufactured by Apple Inc. and sold here as an independent reseller. All other items
              are third-party products that we have tested against the models listed.{' '}
              {categoryName(category) && ''}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}
