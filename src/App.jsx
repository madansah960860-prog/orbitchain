import { Suspense, lazy, useEffect } from 'react'
import { Routes, Route, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import ErrorBoundary from './components/ErrorBoundary'
import Home from './pages/Home'
import Shop from './pages/Shop'
import Product from './pages/Product'
import Cart from './pages/Cart'
// Statically imported: Product renders it directly for unknown slugs, so
// splitting it out would only duplicate the module.
import NotFound from './pages/NotFound'
import { initSmoothScroll, initReveals, prefersReduced, scrollToTop, refreshScroll } from './lib/motion'

const Checkout = lazy(() => import('./pages/Checkout'))
const Declined = lazy(() => import('./pages/Declined'))
const Wishlist = lazy(() => import('./pages/Wishlist'))
const Search = lazy(() => import('./pages/Search'))
const About = lazy(() => import('./pages/About'))
const Contact = lazy(() => import('./pages/Contact'))
const Policy = lazy(() => import('./pages/Policy'))
const Faq = lazy(() => import('./pages/Faq'))

function Fallback() {
  return (
    <div className="wrap section" style={{ minHeight: '60vh' }}>
      <p style={{ color: 'var(--muted)' }}>Loading…</p>
    </div>
  )
}

/* Route change: reset scroll, move focus to the main landmark for
   screen-reader users, and wire up reveals for the new subtree. */
function RouteEffects() {
  const { pathname, search } = useLocation()

  useEffect(() => {
    scrollToTop()
    const main = document.getElementById('main')
    if (main) main.focus({ preventScroll: true })

    // Let the new route paint before observing.
    const raf = requestAnimationFrame(() => {
      initReveals()
      refreshScroll()
    })
    return () => cancelAnimationFrame(raf)
  }, [pathname, search])

  return null
}

function Shell() {
  const { pathname } = useLocation()

  useEffect(() => {
    // Only opt into the hidden-then-revealed state once JS is alive and
    // motion is welcome. Without this class every .js-reveal stays visible.
    if (!prefersReduced()) document.documentElement.classList.add('motion-ready')
    const teardownScroll = initSmoothScroll()
    const teardownReveals = initReveals()
    return () => {
      teardownScroll?.()
      teardownReveals?.()
    }
  }, [])

  return (
    <Layout>
      <RouteEffects />
      <ErrorBoundary routeKey={pathname}>
        <Suspense fallback={<Fallback />}>
          <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/shop/:category" element={<Shop />} />
          <Route path="/product/:slug" element={<Product />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/checkout/declined" element={<Declined />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/search" element={<Search />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<Faq />} />

          {/* Google Ads requires each of these to be reachable from every page. */}
          <Route path="/privacy" element={<Policy which="privacy" />} />
          <Route path="/terms" element={<Policy which="terms" />} />
          <Route path="/returns" element={<Policy which="returns" />} />
          <Route path="/shipping" element={<Policy which="shipping" />} />
          <Route path="/warranty" element={<Policy which="warranty" />} />
          <Route path="/cookies" element={<Policy which="cookies" />} />
          <Route path="/accessibility" element={<Policy which="accessibility" />} />

            <Route path="*" element={<NotFound />} />
          </Routes>
        </Suspense>
      </ErrorBoundary>
    </Layout>
  )
}

export default function App() {
  return <Shell />
}
