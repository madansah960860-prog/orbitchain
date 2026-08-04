import { useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import ProductCard from '../components/ProductCard'
import { useStore } from '../store/useStore'
import { byId } from '../data/catalog'
import { stagger, initReveals } from '../lib/motion'

export default function Wishlist() {
  const wishlist = useStore((s) => s.wishlist)
  const recent = useStore((s) => s.recent)
  const grid = useRef(null)

  useEffect(() => {
    document.title = 'Saved items — Orbit Chain Co.'
  }, [])

  useEffect(() => {
    stagger(grid.current, 50)
    const t = initReveals(grid.current)
    return () => t?.()
  }, [wishlist])

  const items = wishlist.map(byId).filter(Boolean)
  const recentItems = recent.map(byId).filter(Boolean).slice(0, 4)

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Saved items</h1>
        <p>
          Kept in this browser only — we don&apos;t need an account for this, and we don&apos;t
          send it anywhere.
        </p>
      </div>

      {items.length === 0 ? (
        <>
          <div className="glass empty">
            <span className="empty__icon">
              <Icon name="heart" size={22} />
            </span>
            <h2>No saved items yet</h2>
            <p>
              Tap the heart on any product to keep it here while you decide. Nothing is reserved —
              saving an item does not hold stock.
            </p>
            <Link to="/shop" className="btn btn--primary">
              Browse the catalog
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>

          {recentItems.length > 0 && (
            <section style={{ paddingBlock: 'var(--section)' }}>
              <header className="section-head">
                <h2>Recently viewed</h2>
              </header>
              <div className="grid-products">
                {recentItems.map((p) => (
                  <ProductCard key={p.id} product={p} />
                ))}
              </div>
            </section>
          )}
        </>
      ) : (
        <div style={{ paddingBottom: 'var(--section)' }}>
          <div className="grid-products" ref={grid}>
            {items.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
