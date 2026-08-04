import { Component } from 'react'
import { Link } from 'react-router-dom'
import Icon from './Icon'
import { site } from '../data/site'
import { Tok } from './Layout'

/* A white screen loses the order. If a route throws, keep the shell,
   say what happened without jargon, and leave a route to a human. */
export default class ErrorBoundary extends Component {
  state = { error: null }

  static getDerivedStateFromError(error) {
    return { error }
  }

  componentDidCatch(error, info) {
    // Replace with your error reporter (Sentry, Rollbar) before launch.
    console.error('Route error:', error, info?.componentStack)
  }

  componentDidUpdate(prevProps) {
    // A new route is a fresh chance to render — clear the error so the
    // user is not stuck on this screen after navigating away.
    if (this.state.error && prevProps.routeKey !== this.props.routeKey) {
      this.setState({ error: null })
    }
  }

  render() {
    if (!this.state.error) return this.props.children

    return (
      <div className="wrap">
        <div className="page-head">
          <h1>Something broke on our end</h1>
        </div>
        <div className="glass empty" style={{ marginBottom: 'var(--section)' }}>
          <span className="empty__icon" style={{ color: 'var(--danger)' }}>
            <Icon name="alert" size={22} />
          </span>
          <h2>This page didn&apos;t load</h2>
          <p>
            That is a fault on our side, not anything you did. Your cart is untouched. Reloading
            usually clears it.
          </p>
          <div style={{ display: 'flex', gap: 'var(--s-3)', flexWrap: 'wrap' }}>
            <button className="btn btn--primary" onClick={() => window.location.reload()}>
              <Icon name="rotate" size={17} />
              Reload the page
            </button>
            <Link to="/" className="btn btn--glass">
              Back to home
            </Link>
          </div>
          <p style={{ fontSize: 'var(--t-sm)' }}>
            If it keeps happening, tell us what you were doing at <Tok value={site.email} /> and we
            will fix it.
          </p>
        </div>
      </div>
    )
  }
}
