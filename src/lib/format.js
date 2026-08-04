const usd = new Intl.NumberFormat('en-US', {
  style: 'currency',
  currency: 'USD',
  minimumFractionDigits: 2,
})

export const money = (n) => usd.format(n)

/** Business-day aware delivery estimate, skipping weekends. */
export function deliveryWindow(minDays, maxDays, from = new Date()) {
  const add = (days) => {
    const d = new Date(from)
    let left = days
    while (left > 0) {
      d.setDate(d.getDate() + 1)
      if (d.getDay() !== 0 && d.getDay() !== 6) left -= 1
    }
    return d
  }
  const fmt = new Intl.DateTimeFormat('en-US', { weekday: 'short', month: 'short', day: 'numeric' })
  return `${fmt.format(add(minDays))} – ${fmt.format(add(maxDays))}`
}

export const stockLabel = (product) => {
  if (product.stock === 'out') return { text: 'Out of stock', cls: 'badge--out', dot: 'dot--out' }
  if (product.stock === 'low')
    return { text: `Only ${product.stockCount} left`, cls: 'badge--low', dot: 'dot--low' }
  return { text: 'In stock', cls: 'badge--in', dot: '' }
}

/** Splits "{{TOKEN}}" placeholders so they can be rendered highlighted. */
export function splitTokens(value) {
  if (typeof value !== 'string') return [{ text: String(value ?? ''), token: false }]
  return value
    .split(/(\{\{.+?\}\})/g)
    .filter(Boolean)
    .map((part) =>
      part.startsWith('{{') && part.endsWith('}}')
        ? { text: part.slice(2, -2), token: true }
        : { text: part, token: false }
    )
}
