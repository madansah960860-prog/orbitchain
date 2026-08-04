import { Link } from 'react-router-dom'
import Icon from './Icon'
import Img from './Img'
import { SIZES } from '../lib/images'
import { useStore } from '../store/useStore'
import { money, stockLabel } from '../lib/format'

export default function ProductCard({ product, eager = false }) {
  const wishlist = useStore((s) => s.wishlist)
  const toggleWish = useStore((s) => s.toggleWish)
  const saved = wishlist.includes(product.id)
  const stock = stockLabel(product)

  return (
    <article className="card js-reveal">
      <div className="card__media">
        <Img
          name={product.image}
          alt={`${product.name} — ${product.blurb.split('.')[0]}`}
          sizes={SIZES.card}
          width={800}
          height={600}
          priority={eager}
        />
        <div className="card__flags">
          {product.badge && <span className="badge badge--accent">{product.badge}</span>}
          {product.genuine && <span className="badge">Genuine Apple</span>}
        </div>
        <button
          className="card__wish"
          aria-pressed={saved}
          aria-label={saved ? `Remove ${product.name} from saved items` : `Save ${product.name}`}
          onClick={() => toggleWish(product.id)}
        >
          <Icon name="heart" size={17} filled={saved} />
        </button>
      </div>

      <div className="card__body">
        <span className="card__brand">{product.brand}</span>
        <h3 className="card__title">
          <Link to={`/product/${product.slug}`}>{product.name}</Link>
        </h3>
        <p className="card__fit">
          <span style={{ color: 'var(--muted-dim)' }}>Fits</span> {product.fit.slice(0, 2).join(' · ')}
          {product.fit.length > 2 && ` +${product.fit.length - 2} more`}
        </p>

        <div className="card__foot">
          <div>
            <span className="price">{money(product.price)}</span>
            {product.wasPrice && <span className="price--was">{money(product.wasPrice)}</span>}
          </div>
          <span className="rating">
            <Icon name="star" size={13} filled />
            {product.rating.toFixed(1)}
            <span style={{ color: 'var(--muted-dim)' }}>({product.reviews})</span>
          </span>
        </div>

        <span className={`badge ${stock.cls}`} style={{ alignSelf: 'flex-start' }}>
          <span className={`dot ${stock.dot}`} />
          {stock.text}
        </span>
      </div>
    </article>
  )
}
