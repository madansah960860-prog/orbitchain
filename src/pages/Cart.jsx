import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Img from '../components/Img'
import { SIZES } from '../lib/images'
import { useStore, useCartLines, cartSubtotal } from '../store/useStore'
import { site } from '../data/site'
import { money, deliveryWindow } from '../lib/format'

export function OrderSummary({ subtotal, shipping, tax, total, children }) {
  return (
    <aside className="glass glass--lit summary">
      <h2>Order summary</h2>
      <div className="summary__rows">
        <p className="summary__row">
          <span>Subtotal</span>
          <span>{money(subtotal)}</span>
        </p>
        <p className="summary__row">
          <span>Shipping</span>
          <span>{shipping === 0 ? 'Free' : money(shipping)}</span>
        </p>
        <p className="summary__row">
          <span>Estimated sales tax</span>
          <span>{money(tax)}</span>
        </p>
      </div>
      <p className="summary__total">
        <span>Total</span>
        <span>{money(total)}</span>
      </p>
      {children}
    </aside>
  )
}

/** Shared money maths so cart and checkout can never disagree. */
export function useTotals() {
  const subtotal = useStore(cartSubtotal)
  const shipping =
    subtotal === 0 || subtotal >= site.freeShippingThreshold ? 0 : site.standardShipping
  const tax = Math.round(subtotal * 0.0825 * 100) / 100
  return { subtotal, shipping, tax, total: subtotal + shipping + tax }
}

export default function Cart() {
  const lines = useCartLines()
  const setQty = useStore((s) => s.setQty)
  const removeFromCart = useStore((s) => s.removeFromCart)
  const toggleWish = useStore((s) => s.toggleWish)
  const { subtotal, shipping, tax, total } = useTotals()
  const navigate = useNavigate()

  useEffect(() => {
    document.title = 'Your cart — Orbit Chain Co.'
  }, [])

  const toFreeShipping = site.freeShippingThreshold - subtotal
  const pct = Math.min(100, (subtotal / site.freeShippingThreshold) * 100)

  if (lines.length === 0) {
    return (
      <div className="wrap">
        <div className="page-head">
          <h1>Your cart</h1>
        </div>
        <div className="glass empty" style={{ marginBottom: 'var(--section)' }}>
          <span className="empty__icon">
            <Icon name="cart" size={22} />
          </span>
          <h2>Nothing in the cart yet</h2>
          <p>
            Once you add something it stays here, even if you close the tab. If you saved items
            earlier, they are on your saved list.
          </p>
          <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn btn--primary">
              Browse the catalog
              <Icon name="arrowRight" size={17} />
            </Link>
            <Link to="/wishlist" className="btn btn--glass">
              View saved items
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>Your cart</h1>
        <p>
          {lines.length} {lines.length === 1 ? 'product' : 'products'} · estimated delivery{' '}
          {deliveryWindow(3, 5)}
        </p>
      </div>

      <div className="cart-layout">
        <div>
          {lines.map(({ product, qty }) => (
            <div className="line" key={product.id}>
              <Link to={`/product/${product.slug}`} className="line__media">
                <Img
                  name={product.image}
                  alt={product.name}
                  sizes={SIZES.cartLine}
                  width={200}
                  height={200}
                />
              </Link>

              <div>
                <h2 className="line__title">
                  <Link to={`/product/${product.slug}`}>{product.name}</Link>
                </h2>
                <p className="line__meta">
                  {product.brand} · {product.sku}
                </p>

                <div className="line__controls">
                  <div className="qty">
                    <button
                      onClick={() => setQty(product.id, qty - 1)}
                      aria-label={`Decrease quantity of ${product.name}`}
                    >
                      <Icon name="minus" size={15} />
                    </button>
                    <span>{qty}</span>
                    <button
                      onClick={() => setQty(product.id, qty + 1)}
                      disabled={qty >= Math.min(10, product.stockCount)}
                      aria-label={`Increase quantity of ${product.name}`}
                    >
                      <Icon name="plus" size={15} />
                    </button>
                  </div>

                  <button
                    className="btn btn--ghost"
                    style={{ fontSize: 'var(--t-xs)' }}
                    onClick={() => {
                      toggleWish(product.id)
                      removeFromCart(product.id)
                    }}
                  >
                    <Icon name="heart" size={15} />
                    Save for later
                  </button>

                  <button
                    className="btn btn--ghost"
                    style={{ fontSize: 'var(--t-xs)' }}
                    onClick={() => removeFromCart(product.id)}
                  >
                    <Icon name="trash" size={15} />
                    Remove
                  </button>
                </div>
              </div>

              <div className="line__right">
                <span className="price">{money(product.price * qty)}</span>
                {qty > 1 && <span className="line__each">{money(product.price)} each</span>}
              </div>
            </div>
          ))}

          <Link
            to="/shop"
            className="btn btn--ghost"
            style={{ marginTop: 'var(--s-5)', paddingInline: 0 }}
          >
            <Icon name="arrowLeft" size={17} />
            Continue shopping
          </Link>
        </div>

        <OrderSummary subtotal={subtotal} shipping={shipping} tax={tax} total={total}>
          {shipping > 0 && (
            <div className="progress-ship">
              Add {money(toFreeShipping)} for free shipping.
              <div className="progress-ship__track">
                <div className="progress-ship__fill" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}

          <button className="btn btn--primary btn--lg btn--block" onClick={() => navigate('/checkout')}>
            <Icon name="lock" size={17} />
            Checkout
          </button>

          <p style={{ fontSize: 'var(--t-xs)', color: 'var(--muted)', lineHeight: 1.55 }}>
            Tax shown is an estimate at 8.25% and is recalculated from your shipping address at
            checkout. No other charges are added.
          </p>

          <div
            style={{
              display: 'flex',
              gap: '0.9rem',
              paddingTop: 'var(--s-4)',
              borderTop: '1px solid var(--line-soft)',
              fontSize: 'var(--t-xs)',
              color: 'var(--muted-dim)',
            }}
          >
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <Icon name="rotate" size={14} /> {site.returnsWindowDays}-day returns
            </span>
            <span style={{ display: 'inline-flex', gap: 4, alignItems: 'center' }}>
              <Icon name="shield" size={14} /> {site.warrantyMonths}-mo warranty
            </span>
          </div>
        </OrderSummary>
      </div>
    </div>
  )
}
