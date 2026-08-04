/* Fails the build if any product references an image that is not on disk,
   or reports images sitting in public/images that nothing uses.

   With 80+ products a single typo'd filename would otherwise ship as a
   broken image on a live product page. Runs as part of `prebuild`. */

import { existsSync, readdirSync, readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const catalog = readFileSync(join(root, 'src/data/catalog.js'), 'utf8')

// Collect every image name referenced by `image:` and `images: [...]`.
const referenced = new Set()
for (const m of catalog.matchAll(/^\s*image:\s*'([^']+)'/gm)) referenced.add(m[1])
for (const m of catalog.matchAll(/^\s*images:\s*\[([^\]]*)\]/gm)) {
  for (const q of m[1].matchAll(/'([^']+)'/g)) referenced.add(q[1])
}

// Images used by page components (hero, lifestyle, og:image).
const extra = ['hero-primary', 'hero-secondary', 'lifestyle-desk', 'lifestyle-watch', 'lifestyle-wrist']
extra.forEach((n) => referenced.add(n))

const dir = join(root, 'source-images')
const onDisk = new Set(
  readdirSync(dir)
    .filter((f) => f.endsWith('.jpg'))
    .map((f) => f.replace(/\.jpg$/, ''))
)

const missing = [...referenced].filter((n) => !existsSync(join(dir, `${n}.jpg`))).sort()
const unused = [...onDisk].filter((n) => !referenced.has(n)).sort()

if (unused.length) {
  console.log(`check-images: ${unused.length} unused image(s): ${unused.join(', ')}`)
}

if (missing.length) {
  console.error(`\ncheck-images: FAILED — ${missing.length} referenced image(s) missing from public/images:`)
  missing.forEach((n) => console.error(`  • ${n}.jpg`))
  console.error('')
  process.exit(1)
}

const productCount = (catalog.match(/^\s*slug:\s*'/gm) || []).length
console.log(`check-images: OK — ${productCount} products, ${referenced.size} images all present`)
