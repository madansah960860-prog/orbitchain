import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import Icon from '../components/Icon'
import Img from '../components/Img'
import { SIZES } from '../lib/images'
import { site, addressLines, DISCLAIMER } from '../data/site'
import { products } from '../data/catalog'
import { Tok } from '../components/Layout'

export default function About() {
  useEffect(() => {
    document.title = 'About us — Orbit Chain Co.'
  }, [])

  const a = site.address

  return (
    <div className="wrap">
      <div className="page-head">
        <h1>About Orbit Chain Co.</h1>
        <p>
          An independent accessory shop in the United States. We stock {products.length} products
          for Apple hardware and we tell you exactly which models each one fits.
        </p>
      </div>

      <div className="about-grid">
        <div className="about-media">
          <Img
            name="lifestyle-desk"
            alt="A desk with a laptop, keyboard and pointing device under low light"
            sizes={SIZES.aboutMedia}
            width={1400}
            height={875}
          />
        </div>
        <div className="prose" style={{ maxWidth: '60ch' }}>
          <p>
            We started in {site.founded} because the accessory aisle is where counterfeits
            concentrate. A cable that claims 240 W and delivers 60. A &ldquo;genuine&rdquo; band with
            a lug that wears through in a month. A case that blocks the magnet array it advertises.
          </p>
          <p>
            Our answer was narrow and boring: buy from authorised distribution, test the fitment
            ourselves, and write down exactly what we tested. If a model is not on a listing, we are
            not claiming it works.
          </p>
          <p>
            We would genuinely rather lose a sale than process a return, which is why the
            compatibility list sits above the price on every product page.
          </p>
        </div>
      </div>

      {/* Trademark position — stated in full, not buried. */}
      <section style={{ paddingBottom: 'var(--s-7)' }}>
        <div className="glass glass--lit" style={{ padding: 'clamp(1.25rem, 1rem + 1.5vw, 2rem)' }}>
          <h2 style={{ fontSize: '1.2rem', marginBottom: 'var(--s-3)' }}>
            <Icon name="info" size={18} style={{ display: 'inline', verticalAlign: '-3px' }} /> Our
            relationship with Apple
          </h2>
          <p style={{ color: 'var(--muted)', lineHeight: 1.7, maxWidth: '72ch' }}>{DISCLAIMER}</p>
          <p
            style={{
              color: 'var(--muted)',
              lineHeight: 1.7,
              maxWidth: '72ch',
              marginTop: 'var(--s-3)',
            }}
          >
            Products labelled <strong style={{ color: 'var(--ink)' }}>Genuine Apple</strong> are
            manufactured by Apple Inc. and resold by us. Products labelled{' '}
            <strong style={{ color: 'var(--ink)' }}>Third-party</strong> are made by other
            manufacturers, including our own Orbit line, and are compatible with — not made by —
            Apple.
          </p>
        </div>
      </section>

      <section style={{ paddingBottom: 'var(--section)' }}>
        <div className="detail-cols">
          <div>
            <h2 style={{ fontSize: '1.15rem', marginBottom: 'var(--s-4)' }}>How we operate</h2>
            <ul className="feature-list">
              <li>
                <Icon name="check" size={15} />
                Stock is bought through authorised distribution, never grey-market channels.
              </li>
              <li>
                <Icon name="check" size={15} />
                Every listing states the exact device models we have physically tested.
              </li>
              <li>
                <Icon name="check" size={15} />
                Prices include everything except sales tax, which is shown before you pay.
              </li>
              <li>
                <Icon name="check" size={15} />
                Reviews are published unedited, including the critical ones.
              </li>
              <li>
                <Icon name="check" size={15} />
                We do not run countdown timers, fake stock counters, or invented list prices.
              </li>
            </ul>
          </div>

          <div>
            <h2 style={{ fontSize: '1.15rem', marginBottom: 'var(--s-4)' }}>Business details</h2>
            <table className="spec-table">
              <tbody>
                <tr>
                  <th scope="row">Legal entity</th>
                  <td>
                    <Tok value={site.legalName} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">{site.registration.label}</th>
                  <td>
                    <Tok value={site.registration.value} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Registered address</th>
                  <td>
                    {addressLines().map((line, i, arr) => (
                      <span key={line}>
                        <Tok value={line} />
                        {i < arr.length - 1 && <br />}
                      </span>
                    ))}
                  </td>
                </tr>
                <tr>
                  <th scope="row">Email</th>
                  <td>
                    <Tok value={site.email} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Phone</th>
                  <td>
                    <Tok value={site.phone} />
                  </td>
                </tr>
                <tr>
                  <th scope="row">Support hours</th>
                  <td>{site.hours}</td>
                </tr>
                <tr>
                  <th scope="row">Ships to</th>
                  <td>United States only</td>
                </tr>
              </tbody>
            </table>

            <Link to="/contact" className="btn btn--primary" style={{ marginTop: 'var(--s-5)' }}>
              Contact us
              <Icon name="arrowRight" size={17} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}
