import { useEffect, useRef, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import Icon from '../components/Icon'
import Img from '../components/Img'
import { SIZES } from '../lib/images'
import ProductCard from '../components/ProductCard'
import NotFound from './NotFound'
import { bySlug, byCategory, categoryName } from '../data/catalog'
import { site } from '../data/site'
import { money, stockLabel, deliveryWindow } from '../lib/format'
import { useStore } from '../store/useStore'
import { magnetic, stagger, initReveals } from '../lib/motion'

export default function Product() {
  const { slug } = useParams()
  const product = bySlug(slug)
  const [qty, setQty] = useState(1)
  const [active, setActive] = useState(0)
  const addToCart = useStore((s) => s.addToCart)
  const toggleWish = useStore((s) => s.toggleWish)
  const wishlist = useStore((s) => s.wishlist)
  const markViewed = useStore((s) => s.markViewed)
  const buyRef = useRef(null)
  const relatedRef = useRef(null)

  useEffect(() => {
    if (!product) return
    document.title = `${product.name} — Orbit Chain Co.`
    markViewed(product.id)
    setQty(1)
    setActive(0)
  }, [product, markViewed])

  useEffect(() => magnetic(buyRef.current, 0.2), [product])

  useEffect(() => {
    stagger(relatedRef.current, 60)
    const t = initReveals(relatedRef.current)
    return () => t?.()
  }, [product])

  if (!product) return <NotFound />

  const stock = stockLabel(product)
  const saved = wishlist.includes(product.id)
  const soldOut = product.stock === 'out'
  const related = byCategory(product.category)
    .filter((x) => x.id !== product.id)
    .slice(0, 4)
  const ceiling = Math.min(10, product.stockCount || 10)

  return (
    <div className="wrap">
      <div className="page-head" style={{ paddingBottom: 'var(--s-4)' }}>
        <nav aria-label="Breadcrumb">
          <ol className="crumbs">
            <li>
              <Link to="/">Home</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to="/shop">Shop</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li>
              <Link to={`/shop/${product.category}`}>{categoryName(product.category)}</Link>
            </li>
            <li aria-hidden="true">/</li>
            <li aria-current="page">{product.name}</li>
          </ol>
        </nav>
      </div>

      <div className="pdp">
        {/* ---------------------------- gallery ---------------------------- */}
        <div className="gallery">
          <div className="gallery__main">
            <Img
              name={product.images[active]}
              alt={`${product.name} — view ${active + 1} of ${product.images.length}`}
              sizes={SIZES.pdpMain}
              width={1000}
              height={750}
              priority
            />
          </div>
          {product.images.length > 1 && (
            <div className="gallery__thumbs" role="group" aria-label="Product images">
              {product.images.map((img, i) => (
                <button
                  key={img}
                  className="thumb"
                  aria-current={i === active}
                  aria-label={`Show image ${i + 1}`}
                  onClick={() => setActive(i)}
                >
                  <Img name={img} alt="" sizes={SIZES.thumb} width={152} height={120} />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* ------------------------------ buy ------------------------------ */}
        <div className="pdp__buy">
          <div>
            <p className="pdp__brand">
              {product.brand}
              <span aria-hidden="true">·</span>
              <span>{product.sku}</span>
            </p>
            <h1 className="pdp__title">{product.name}</h1>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <span className="rating">
              <Icon name="star" size={14} filled />
              {product.rating.toFixed(1)}
              <span style={{ color: 'var(--muted-dim)' }}>
                ({product.reviews} reviews)
              </span>
            </span>
            <span className={`badge ${stock.cls}`}>
              <span className={`dot ${stock.dot}`} />
              {stock.text}
            </span>
            {product.genuine ? (
              <span className="badge">Genuine Apple product</span>
            ) : (
              <span className="badge">Third-party</span>
            )}
          </div>

          <div>
            <div className="pdp__price-row">
              <span className="pdp__price">{money(product.price)}</span>
              {product.wasPrice && (
                <span className="price--was" style={{ fontSize: 'var(--t-sm)' }}>
                  was {money(product.wasPrice)}
                </span>
              )}
            </div>
            <p
              style={{
                fontSize: 'var(--t-xs)',
                color: 'var(--muted)',
                marginTop: '0.35rem',
              }}
            >
              {site.taxNote}
            </p>
          </div>

          <p className="pdp__blurb">{product.blurb}</p>

          {/* Compatibility — the primary content of this page. */}
          <div className="fitment">
            <h2>
              <Icon name="checkCircle" size={18} />
              Confirmed compatible with
            </h2>
            <ul>
              {product.fit.map((f) => (
                <li key={f}>
                  <Icon name="check" size={15} />
                  {f}
                </li>
              ))}
            </ul>
            <p className="fitment__note">
              This is the complete tested list. If your model is not shown, we are not claiming it
              fits — <Link to="/contact">ask us</Link> and we will check the part number before you
              order.
            </p>
          </div>

          <div className="buy-row">
            <div className="qty">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                disabled={qty <= 1 || soldOut}
                aria-label="Decrease quantity"
              >
                <Icon name="minus" size={16} />
              </button>
              <span aria-live="polite" aria-label={`Quantity ${qty}`}>
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => Math.min(ceiling, q + 1))}
                disabled={qty >= ceiling || soldOut}
                aria-label="Increase quantity"
              >
                <Icon name="plus" size={16} />
              </button>
            </div>

            <button
              ref={buyRef}
              className="btn btn--primary btn--lg"
              disabled={soldOut}
              onClick={() => addToCart(product.id, qty)}
            >
              <Icon name="cart" size={18} />
              {soldOut ? 'Out of stock' : `Add to cart — ${money(product.price * qty)}`}
            </button>

            <button
              className="btn btn--glass btn--icon"
              style={{ minHeight: 52, minWidth: 52 }}
              aria-pressed={saved}
              aria-label={saved ? 'Remove from saved items' : 'Save for later'}
              onClick={() => toggleWish(product.id)}
            >
              <Icon name="heart" size={19} filled={saved} />
            </button>
          </div>

          {soldOut && (
            <div className="notice notice--warn">
              <Icon name="alert" size={18} />
              <div>
                <strong>Between shipments.</strong> We are not taking backorders on this item
                because we cannot give you an honest date yet.{' '}
                <Link to="/contact">Email us</Link> and we will tell you the moment it lands.
              </div>
            </div>
          )}

          <div className="pdp__assurances">
            <p className="assurance">
              <Icon name="truck" size={17} />
              <span>
                <strong>Delivery {deliveryWindow(3, 5)}</strong> with standard shipping. Free over{' '}
                {site.currencySymbol}
                {site.freeShippingThreshold}, otherwise {money(site.standardShipping)}. Dispatched
                in {site.handlingDays}.
              </span>
            </p>
            <p className="assurance">
              <Icon name="rotate" size={17} />
              <span>
                <strong>{site.returnsWindowDays}-day returns.</strong> Unopened or faulty, full
                refund to the original payment method. <Link to="/returns">Read the policy</Link>.
              </span>
            </p>
            <p className="assurance">
              <Icon name="shield" size={17} />
              <span>
                <strong>{site.warrantyMonths}-month warranty</strong> against manufacturing defects.{' '}
                <Link to="/warranty">Warranty terms</Link>.
              </span>
            </p>
            <p className="assurance">
              <Icon name="info" size={17} />
              <span>
                Orbit Chain Co. is an independent reseller and is not affiliated with or endorsed
                by Apple Inc.
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* ---------------------------- details ---------------------------- */}
      <section className="pdp__details">
        <div className="detail-cols">
          <div>
            <h2>Specifications</h2>
            <table className="spec-table">
              <tbody>
                {Object.entries(product.specs).map(([k, v]) => (
                  <tr key={k}>
                    <th scope="row">{k}</th>
                    <td>{v}</td>
                  </tr>
                ))}
                <tr>
                  <th scope="row">SKU</th>
                  <td className="mono">{product.sku}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div>
            <h2>Worth knowing</h2>
            {product.features.length > 0 ? (
              <ul className="feature-list">
                {product.features.map((f) => (
                  <li key={f}>
                    <Icon name="chevronRight" size={15} />
                    {f}
                  </li>
                ))}
              </ul>
            ) : (
              <p style={{ color: 'var(--muted)', fontSize: 'var(--t-sm)', lineHeight: 1.65 }}>
                Nothing unusual to flag on this one — it does what the specification says, and the
                compatibility list above is complete.
              </p>
            )}

            <div className="notice notice--info" style={{ marginTop: 'var(--s-5)' }}>
              <Icon name="info" size={18} />
              <div>
                <strong>Not sure this is the right part?</strong> Send us your device model and we
                will confirm before you buy. We would rather lose the sale than process a return.{' '}
                <Link to="/contact">Contact us</Link>.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------------------- related ---------------------------- */}
      {related.length > 0 && (
        <section style={{ paddingBottom: 'var(--section)' }}>
          <header className="section-head">
            <h2>Also in {categoryName(product.category)}</h2>
          </header>
          <div className="grid-products" ref={relatedRef}>
            {related.map((r) => (
              <ProductCard key={r.id} product={r} />
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
