/* Generates public/sitemap.xml from the live catalog so product URLs
   never drift out of sync with what the router actually serves.
   Runs automatically via the `prebuild` npm script.

   Change ORIGIN to your real domain before going live. */

import { writeFileSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const ORIGIN = process.env.SITE_ORIGIN || 'https://www.shoporbitchain.us'
const root = join(dirname(fileURLToPath(import.meta.url)), '..')

// Parse slugs and category ids straight out of the catalog source so
// this stays correct without importing JSX-adjacent modules.
const catalog = readFileSync(join(root, 'src/data/catalog.js'), 'utf8')
const slugs = [...catalog.matchAll(/^\s*slug:\s*'([^']+)'/gm)].map((m) => m[1])
const cats = [...catalog.matchAll(/^\s*id:\s*'(audio|power|cases|bands)'/gm)].map((m) => m[1])

const today = new Date().toISOString().slice(0, 10)

const urls = [
  { loc: '/', priority: '1.0', freq: 'daily' },
  { loc: '/shop', priority: '0.9', freq: 'daily' },
  ...[...new Set(cats)].map((c) => ({ loc: `/shop/${c}`, priority: '0.8', freq: 'daily' })),
  ...slugs.map((s) => ({ loc: `/product/${s}`, priority: '0.7', freq: 'weekly' })),
  { loc: '/about', priority: '0.5', freq: 'monthly' },
  { loc: '/contact', priority: '0.5', freq: 'monthly' },
  { loc: '/faq', priority: '0.5', freq: 'monthly' },
  { loc: '/shipping', priority: '0.4', freq: 'monthly' },
  { loc: '/returns', priority: '0.4', freq: 'monthly' },
  { loc: '/warranty', priority: '0.4', freq: 'monthly' },
  { loc: '/privacy', priority: '0.3', freq: 'yearly' },
  { loc: '/terms', priority: '0.3', freq: 'yearly' },
  { loc: '/cookies', priority: '0.3', freq: 'yearly' },
  { loc: '/accessibility', priority: '0.3', freq: 'yearly' },
]

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (u) => `  <url>
    <loc>${ORIGIN}${u.loc}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>${u.freq}</changefreq>
    <priority>${u.priority}</priority>
  </url>`
  )
  .join('\n')}
</urlset>
`

writeFileSync(join(root, 'public/sitemap.xml'), xml)
console.log(`sitemap.xml — ${urls.length} URLs (${slugs.length} products)`)
