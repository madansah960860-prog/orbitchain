/* ============================================================
   Responsive image pipeline.

   Source photographs land in public/images/*.jpg at ~1400px wide
   and 60–700 KB each. Cards render them at 250–400 CSS px, so the
   originals were roughly ten times larger than needed — 96% of the
   page weight for pixels nobody sees.

   This generates, per source image:
     • AVIF at 320 / 640 / 1280   (best compression, ~93% support)
     • WebP at 320 / 640 / 1280   (fallback, ~97% support)
     • one JPEG at 640            (last-resort fallback)

   Output goes to public/images/r/. The originals stay put as the
   pipeline's input and are NOT shipped — vite.config.js excludes
   them from the build.

   Run: npm run images     (also runs as part of prebuild)
   Skips work that is already done, so re-runs are cheap.
   ============================================================ */

import sharp from 'sharp'
import { IMAGE_WIDTHS, FALLBACK_WIDTH } from '../src/lib/images.js'
import { readdirSync, mkdirSync, existsSync, statSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const SRC = join(root, 'source-images')      // originals — never shipped
const OUT = join(root, 'public/images/r')    // derivatives — the only images in dist

const WIDTHS = IMAGE_WIDTHS

const force = process.argv.includes('--force')
if (force && existsSync(OUT)) rmSync(OUT, { recursive: true, force: true })
mkdirSync(OUT, { recursive: true })

const sources = readdirSync(SRC).filter((f) => f.endsWith('.jpg'))

let made = 0
let skipped = 0
let srcBytes = 0
let outBytes = 0

const fresh = (out, src) =>
  existsSync(out) && statSync(out).mtimeMs >= statSync(src).mtimeMs && statSync(out).size > 0

for (const file of sources) {
  const name = file.replace(/\.jpg$/, '')
  const src = join(SRC, file)
  srcBytes += statSync(src).size

  const meta = await sharp(src).metadata()

  for (const w of WIDTHS) {
    // Never upscale — a 900px source has no business becoming 1280.
    const width = Math.min(w, meta.width || w)

    for (const [ext, opts] of [
      ['avif', { quality: 52, effort: 5 }],
      ['webp', { quality: 74, effort: 5 }],
    ]) {
      const out = join(OUT, `${name}-${w}.${ext}`)
      if (fresh(out, src)) {
        skipped++
        outBytes += statSync(out).size
        continue
      }
      await sharp(src)
        .resize({ width, withoutEnlargement: true })
        [ext](opts)
        .toFile(out)
      made++
      outBytes += statSync(out).size
    }
  }

  // JPEG fallbacks: 640 for browsers with neither modern format, 1280
  // because og:image / twitter:image want at least 1200px wide.
  for (const w of [FALLBACK_WIDTH, 1280]) {
    const jpgOut = join(OUT, `${name}-${w}.jpg`)
    if (fresh(jpgOut, src)) {
      skipped++
      outBytes += statSync(jpgOut).size
      continue
    }
    await sharp(src)
      .resize({ width: Math.min(w, meta.width || w), withoutEnlargement: true })
      .jpeg({ quality: 78, mozjpeg: true, progressive: true })
      .toFile(jpgOut)
    made++
    outBytes += statSync(jpgOut).size
  }
}

const mb = (b) => (b / 1048576).toFixed(1)
console.log(
  `optimize-images: ${sources.length} sources → ${made} generated, ${skipped} cached\n` +
    `                 originals ${mb(srcBytes)} MB → derivatives ${mb(outBytes)} MB ` +
    `(all widths and formats combined)`
)
