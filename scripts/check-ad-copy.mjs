/* Validates display-ad copy against Google Ads field limits.
   Run: npm run check:ads
   Limits per Google Responsive Display Ads spec. */

import { readFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const md = readFileSync(join(root, 'ADS-CREATIVE.md'), 'utf8')

const LIMITS = {
  'Short headline': 30,
  'Long headline': 90,
  Description: 90,
  'Business name': 25,
}

// Rows look like:  | 1 | Fits Your Exact Model | 21 |
const rows = [...md.matchAll(/^\|\s*(Short headline|Long headline|Description|Business name)\s*\|\s*(.+?)\s*\|\s*(\d+)\s*\|/gm)]

let fails = 0
let checked = 0

for (const [, field, text, claimed] of rows) {
  const actual = text.length
  const limit = LIMITS[field]
  checked++
  if (actual !== Number(claimed)) {
    console.error(`MISCOUNT  ${field}: claimed ${claimed}, actual ${actual} — "${text}"`)
    fails++
  }
  if (actual > limit) {
    console.error(`TOO LONG  ${field}: ${actual}/${limit} — "${text}"`)
    fails++
  }
}

if (!checked) {
  console.error('check-ad-copy: no copy rows found — did the table format change?')
  process.exit(1)
}

if (fails) {
  console.error(`\ncheck-ad-copy: FAILED — ${fails} problem(s) across ${checked} fields`)
  process.exit(1)
}

console.log(`check-ad-copy: OK — ${checked} fields, all within Google Ads limits`)
