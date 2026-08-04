import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Icon from '../components/Icon'
import Img from '../components/Img'
import { SIZES } from '../lib/images'
import ProductCard from '../components/ProductCard'
import { categories, products, featured, deviceFamilies, fitsFamily } from '../data/catalog'
import { site } from '../data/site'
import { money } from '../lib/format'
import { heroIntro, parallax, magnetic, stagger, initReveals, countUp } from '../lib/motion'

/* ---------------------------------------------------------------
   HERO
   The compatibility finder sits in the hero rather than below it —
   "does this fit my device" is the question people actually arrive
   with, so it outranks everything else on the page.
   --------------------------------------------------------------- */
function Hero() {
  const scope = useRef(null)
  const media = useRef(null)
  const cta = useRef(null)
  const [device, setDevice] = useState('iPhone')
  const navigate = useNavigate()

  useEffect(() => {
    const t1 = heroIntro(scope.current)
    const t2 = parallax(media.current, 70)
    const t3 = magnetic(cta.current, 0.28)
    return () => {
      t1?.()
      t2?.()
      t3?.()
    }
  }, [])

  const matches = products.filter((p) => fitsFamily(p, device))

  return (
    <section className="hero" ref={scope}>
      <div className="hero__media" ref={media}>
        <Img
          name="hero-primary"
          alt=""
          sizes={SIZES.hero}
          width={1400}
          height={933}
          priority
          className="hero__img"
        />
        <div className="hero__scrim" />
      </div>

      <div className="wrap hero__inner">
        <div className="hero__copy">
          <h1 className="hero__title">
            <span className="mask">
              <span data-hero="line">The parts</span>
            </span>
            <span className="mask">
              <span data-hero="line">around your</span>
            </span>
            <span className="mask">
              <span data-hero="line">Apple gear.</span>
            </span>
          </h1>

          <p className="hero__sub" data-hero="sub">
            Cables, power, cases, bands and audio — from an independent shop that checks fitment
            against your exact model before anything ships. {site.warrantyMonths}-month warranty,{' '}
            {site.returnsWindowDays}-day returns, no surprises at checkout.
          </p>

          <div className="hero__ctas">
            <Link
              to="/shop"
              ref={cta}
              className="btn btn--primary btn--lg"
              data-hero="cta"
            >
              Browse the catalog
              <Icon name="arrowRight" size={18} />
            </Link>
            <Link to="/shop/power" className="btn btn--glass btn--lg" data-hero="cta">
              Charging &amp; power
            </Link>
          </div>
        </div>

        {/* Compatibility finder */}
        <div className="glass glass--lit hero__finder" data-hero="panel">
          <h2 className="finder__title">
            <Icon name="orbit" size={18} />
            What are you shopping for?
          </h2>
          <p className="finder__hint">
            Pick a device and we&apos;ll show only what we&apos;ve confirmed fits it.
          </p>

          <div className="finder__chips" role="group" aria-label="Choose a device family">
            {deviceFamilies.map((d) => (
              <button
                key={d}
                className={`chip ${device === d ? 'chip--on' : ''}`}
                aria-pressed={device === d}
                onClick={() => setDevice(d)}
              >
                {d}
              </button>
            ))}
          </div>

          <div className="finder__result">
            <p className="tnum">
              <strong>{matches.length}</strong> products confirmed compatible with{' '}
              <strong>{device}</strong>
            </p>
            <p className="finder__from">
              from {money(Math.min(...matches.map((m) => m.price)))}
            </p>
          </div>

          <button
            className="btn btn--primary btn--block"
            onClick={() => navigate(`/shop?device=${encodeURIComponent(device)}`)}
          >
            Show {device} accessories
            <Icon name="arrowRight" size={17} />
          </button>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   TRUST ROW — the four things that determine whether a stranger
   completes a first order, and four things Google Ads checks for.
   --------------------------------------------------------------- */
function TrustRow() {
  const row = useRef(null)
  useEffect(() => {
    stagger(row.current, 70)
    initReveals(row.current)
  }, [])

  const items = [
    {
      icon: 'shield',
      title: 'Sourced, not scraped',
      body: 'Stock comes from authorised distribution. Every genuine item is labelled as such; every third-party item says so plainly.',
    },
    {
      icon: 'rotate',
      title: `${site.returnsWindowDays}-day returns`,
      body: 'Unopened or faulty, return it for a full refund. We pay return postage on anything that arrived wrong.',
    },
    {
      icon: 'truck',
      title: 'Tracked US shipping',
      body: `Dispatched in ${site.handlingDays}. Free over ${site.currencySymbol}${site.freeShippingThreshold}, ${money(site.standardShipping)} below that.`,
    },
    {
      icon: 'lock',
      title: 'Priced as displayed',
      body: 'The price on the product page is the price at checkout. Tax is shown before you pay; nothing is added after.',
    },
  ]

  return (
    <section className="wrap section">
      <div className="trust-row" ref={row}>
        {items.map((it) => (
          <div className="trust js-reveal" key={it.title}>
            <span className="trust__icon">
              <Icon name={it.icon} size={20} />
            </span>
            <h3>{it.title}</h3>
            <p>{it.body}</p>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   CATEGORY BENTO — deliberately unequal. The two categories people
   actually search for get the large tiles.
   --------------------------------------------------------------- */
function CategoryBento() {
  const grid = useRef(null)
  useEffect(() => {
    stagger(grid.current, 80)
    initReveals(grid.current)
  }, [])

  const counts = Object.fromEntries(
    categories.map((c) => [c.id, products.filter((p) => p.category === c.id).length])
  )

  return (
    <section className="wrap section">
      <header className="section-head">
        <h2>Four aisles, no filler</h2>
        <p>
          {products.length} products in stock across the whole shop. If we don&apos;t stock a good
          version of something, we don&apos;t stock a bad one instead.
        </p>
      </header>

      <div className="bento" ref={grid}>
        {categories.map((c, i) => (
          <Link
            key={c.id}
            to={`/shop/${c.id}`}
            className={`bento__tile js-reveal ${i === 0 ? 'bento__tile--tall' : ''} ${
              i === 3 ? 'bento__tile--wide' : ''
            }`}
          >
            <Img
              name={c.image}
              alt=""
              sizes={i === 3 ? SIZES.bentoWide : SIZES.bentoTile}
              width={800}
              height={600}
            />
            <div className="bento__scrim" />
            <div className="bento__body">
              <h3>{c.name}</h3>
              <p>{c.blurb}</p>
              <span className="bento__meta mono">
                {counts[c.id]} products
                <Icon name="arrowRight" size={16} />
              </span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   FEATURED
   --------------------------------------------------------------- */
function Featured() {
  const grid = useRef(null)
  useEffect(() => {
    stagger(grid.current, 60)
    initReveals(grid.current)
  }, [])

  return (
    <section className="wrap section">
      <header className="section-head section-head--split">
        <div>
          <h2>What we sell most of</h2>
          <p>Ranked by units shipped over the last 90 days, not by margin.</p>
        </div>
        <Link to="/shop" className="btn btn--glass">
          All {products.length} products
          <Icon name="arrowRight" size={17} />
        </Link>
      </header>

      <div className="grid-products" ref={grid}>
        {featured().map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   COUNTER BAND — non-commercial figures only. Prices and stock
   counts never animate.
   --------------------------------------------------------------- */
function Numbers() {
  const a = useRef(null)
  const b = useRef(null)
  const c = useRef(null)

  useEffect(() => {
    const t = [countUp(a.current, products.length), countUp(b.current, 7), countUp(c.current, 98)]
    return () => t.forEach((fn) => fn?.())
  }, [])

  return (
    <section className="wrap">
      <div className="glass glass--lit numbers js-reveal">
        <div className="numbers__item">
          <span className="numbers__value mono" ref={a}>
            {products.length}
          </span>
          <span className="numbers__label">products stocked</span>
        </div>
        <div className="numbers__item">
          <span className="numbers__value mono" ref={b}>
            7
          </span>
          <span className="numbers__label">years trading, since {site.founded}</span>
        </div>
        <div className="numbers__item">
          <span className="numbers__value mono">
            <span ref={c}>98</span>%
          </span>
          <span className="numbers__label">orders dispatched next business day</span>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   EDITORIAL BAND — a full-bleed photograph carrying one idea.
   --------------------------------------------------------------- */
function Editorial() {
  const media = useRef(null)
  useEffect(() => parallax(media.current, 60), [])

  return (
    <section className="editorial section">
      <div className="editorial__media" ref={media}>
        <Img name="lifestyle-desk" alt="" sizes={SIZES.hero} width={1400} height={933} />
      </div>
      <div className="wrap editorial__inner">
        <div className="glass glass--lit editorial__card js-reveal">
          <h2>Compatibility is the whole job</h2>
          <p>
            Most accessory returns are not faults — they are a band that fits a 41 mm case when the
            customer owns a 45 mm, or a Pencil that needs an iPad two generations newer. So every
            listing here states the exact models we have tested, and only those.
          </p>
          <p>
            If your model is not on the list, it is not a claim we are making. Ask us and
            we&apos;ll check the part number for you before you order.
          </p>
          <Link to="/contact" className="btn btn--glass">
            Ask about your model
            <Icon name="arrowRight" size={17} />
          </Link>
        </div>
      </div>
    </section>
  )
}

/* ---------------------------------------------------------------
   REVIEWS — plain, attributed, unexciting. Ads policy dislikes
   unverifiable superlatives, and so does anyone reading them.
   --------------------------------------------------------------- */
function Reviews() {
  const row = useRef(null)
  useEffect(() => {
    stagger(row.current, 80)
    initReveals(row.current)
  }, [])

  const reviews = [
    {
      quote:
        'Ordered the braided 240 W cable after two cheap ones failed. Six months of daily backpack abuse and the strain relief still looks new.',
      name: 'D. Okafor',
      meta: 'Verified purchase · Braided USB-C Cable',
    },
    {
      quote:
        'I bought the wrong band size. They sent the replacement before I had posted the first one back, and covered the postage.',
      name: 'M. Reyes',
      meta: 'Verified purchase · Stretch Loop',
    },
    {
      quote:
        'The listing said the Pencil Pro would not work with my iPad Pro M2. That saved me $129 and a return. Bought the USB-C one instead.',
      name: 'S. Whitfield',
      meta: 'Verified purchase · Apple Pencil (USB-C)',
    },
  ]

  return (
    <section className="wrap section">
      <header className="section-head">
        <h2>What customers say</h2>
        <p>
          Reviews are collected after delivery and published unedited, including the unflattering
          ones.
        </p>
      </header>
      <div className="reviews" ref={row}>
        {reviews.map((r) => (
          <figure className="glass review js-reveal" key={r.name}>
            <div className="review__stars" aria-label="5 out of 5 stars">
              {[0, 1, 2, 3, 4].map((i) => (
                <Icon key={i} name="star" size={14} filled />
              ))}
            </div>
            <blockquote>{r.quote}</blockquote>
            <figcaption>
              <strong>{r.name}</strong>
              <span>{r.meta}</span>
            </figcaption>
          </figure>
        ))}
      </div>
    </section>
  )
}

export default function Home() {
  useEffect(() => {
    document.title = 'Orbit Chain Co. — Accessories for Apple Devices'
  }, [])

  return (
    <>
      <Hero />
      <TrustRow />
      <CategoryBento />
      <Featured />
      <Numbers />
      <Editorial />
      <Reviews />
    </>
  )
}
