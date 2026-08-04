# Orbit Chain Co.

A production-shaped storefront for an independent US reseller of Apple
accessories. React + Vite SPA, built to deploy onto Apache as static files.

**79 products** across four categories (Audio 18, Charging & Power 20, Cases &
Protection 18, Bands & Input 23), each with real specs, per-model
compatibility, SKUs and USD pricing, illustrated with 84 Unsplash photographs
(free for commercial use, no attribution required).

`npm run check` — also part of `prebuild` — fails the build if a product
references an image that is not on disk, and reports unused images.

**Before you advertise or take money, read [`ADS-COMPLIANCE.md`](./ADS-COMPLIANCE.md).**
It lists the placeholders you must replace and the payment gateway you must
connect.

---

## Run it

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # → dist/  (checks images, builds derivatives, writes sitemap)
npm run preview      # serve the production build locally
```

## Deploy

`npm run build` emits **`dist/index.html`** plus hashed assets. Upload the
**contents** of `dist/` to your web root — including the hidden `.htaccess`,
which most FTP clients hide by default.

```
dist/
├── index.html          ← the app shell
├── .htaccess           ← SPA fallback, redirects, caching, security headers
├── assets/             ← fingerprinted JS + CSS
├── images/r/           ← responsive AVIF/WebP/JPEG derivatives
├── fonts/              ← self-hosted woff2 (latin subset)
├── favicon.svg
├── robots.txt
└── sitemap.xml
```

Deploying into a subfolder? Set `base` in `vite.config.js` and follow the
header comment in `public/.htaccess`.

### Why the .htaccess matters

React Router owns `/shop`, `/product/:slug`, `/checkout` and the rest. Those
paths don't exist on disk, so without a rewrite rule a hard refresh or a
pasted deep link returns Apache's 404. Section 3 of `public/.htaccess` routes
anything that isn't a real file to `index.html`.

It deliberately does **not** rewrite `/assets/` and `/images/` — a genuinely
missing image should still 404 rather than silently return the HTML shell with
a 200, which would poison your search indexing.

Also included: HTTPS and `www` canonicalisation, trailing-slash normalisation,
301s for common legacy URL shapes (`/privacy-policy` → `/privacy`), Brotli and
gzip, a one-year immutable cache on fingerprinted assets with `no-store` on
`index.html`, HSTS, and a CSP.

---

## Layout

```
src/
├── data/
│   ├── catalog.js      79 products, 4 categories, per-model compatibility
│   └── site.js         business identity — ALL PLACEHOLDERS LIVE HERE
├── lib/
│   ├── motion.js       reveals + lazily-loaded GSAP/Lenis effects
│   ├── images.js       responsive widths + `sizes` map (shared with the build)
│   └── format.js       currency, business-day delivery windows, stock labels
├── store/useStore.js   cart, wishlist, recently viewed, consent (localStorage)
├── styles/
│   ├── tokens.css      OKLCH palette, type scale, spacing, motion, z-index
│   ├── base.css        reset, ambient light field, reveal machinery
│   ├── components.css  glass primitives, buttons, cards, forms, header/footer
│   └── pages.css       hero, bento, PDP, cart, checkout, policy layouts
├── components/         Layout, ProductCard, Img, Icon, ErrorBoundary
└── pages/              18 routes
```

## Design notes

**Scene:** a precision parts counter under cold morning light — anodized
aluminium, matte silicone, the click of a magnet seating.

- **Palette** is committed-cool: a true-neutral near-black surface, cobalt as
  the light source, and a signal amber on under 8% of the page (stock flags,
  cart count, sale badges). All in OKLCH.
- **Glass is treated as a material, not a filter.** Panels are lit from above
  with a bright 1px top bevel and a dark bottom edge, the way a chamfered
  aluminium lip catches light. It is only used where something is genuinely
  behind it — the ambient light field, product photography, scrolling content.
  On a flat backdrop, `.panel` (solid) is used instead, because glass over
  nothing is just a grey box.
- **Type** is Archivo (variable grotesque, narrowed for display) with Azeret
  Mono carrying SKUs, specs and prices — functional here, not costume.
- **Motion** is exponential ease-out throughout. Magnetic elements snap, woven
  ones settle. Every animation has a `prefers-reduced-motion` path, and
  reveals enhance already-visible content, so nothing is gated behind an
  animation that may never fire.
- **Prices and stock counts never animate.** Only non-commercial figures
  (catalogue size, years trading) use the count-up.

## Performance

Measured in-browser on `/shop/bands` (23 products), cold cache:

| | Before | After |
|---|---|---|
| **Total transfer** | 4,213 KB | **309 KB** |
| Images | 4,066 KB (24 files) | **101 KB** (20 files) |
| Fonts | 2 third-party requests | **60 KB**, self-hosted |
| JS | 136 KB | 138 KB (86 KB critical, 52 KB deferred) |
| Third-party requests | 2 | **0** |
| CLS | 0 | 0 |

Homepage cold: **333 KB across 14 requests**.

### What did it

**Responsive AVIF/WebP** (`scripts/optimize-images.mjs`). Originals were
~1400px and 60–700 KB each while cards render at 250–400 CSS px — roughly ten
times more pixels than anyone sees. Every source now produces AVIF and WebP at
320 / 640 / 960 / 1280 plus a JPEG fallback, served through `<picture>` with
`srcset` + `sizes`. A card that used to pull a 706 KB JPEG now pulls a 22 KB
AVIF. The 960 rung exists because bento tiles render near 695px and were
otherwise rounding up to 1280.

Originals live in `source-images/` — outside `public/`, so they are never
shipped. `public/images/r/` holds the derivatives and is regenerated by
`prebuild`.

**Deferred motion.** GSAP, ScrollTrigger and Lenis are ~52 KB gzipped and none
of it is needed to render a readable page. `src/lib/motion.js` imports them
dynamically after first paint, and every entry point no-ops if the chunk never
arrives. Reveals are the exception — they use IntersectionObserver only, so
content is never hidden behind a pending download.

The hero intro is skipped entirely if GSAP lands more than 500 ms late.
Replaying an entrance on already-visible content reads as a bug; a missed
flourish does not.

**Self-hosted fonts** (`npm run fonts`). Removes two third-party connections
and a render-blocking stylesheet, and let the CSP tighten to `font-src 'self'`.
Latin subset only. Archivo is requested without its `wdth` axis — carrying the
width axis cost 88 KB versus 34 KB for weight alone, to drive three
declarations.

**Dead dependency removed.** `motion` (framer-motion) was installed but never
imported.

### Deliberately not done

- **No static hero preload.** One `index.html` serves every route, so a preload
  would fetch the homepage hero on `/shop` and `/product` too — the pages ads
  land on. The hero `<img>` carries `fetchpriority="high"` instead.
- **`dist/` is ~25 MB on disk** because it holds every width and format. A
  visitor downloads one file per image; only your upload is larger.

## Accessibility

Targets WCAG 2.2 AA. Verified in-browser rather than assumed — all fifteen
sampled text styles pass, with the tightest at 4.79:1 against a 4.5 floor.

Also in place: full keyboard path through browse → product → cart → checkout,
a focus ring that survives on glass and photography, a skip link, zero
horizontal overflow at 320px across all 18 routes, 44px minimum touch targets,
form errors adjacent to their field with focus moved there, and stock status
communicated by shape and text rather than colour alone.

## Known limitations

- **Payments always decline.** By design for this build — see
  `src/pages/Checkout.jsx` and `ADS-COMPLIANCE.md` §1.2. Card fields are
  validated locally (Luhn, expiry, CVC) and never transmitted or stored.
- **The contact form does not send.** It validates and confirms; wire it to a
  handler.
- **The catalog is static sample data.** Stock counts, ratings and review
  counts are invented. Connect real inventory before advertising.
- **The three homepage reviews are samples.** Replace with real ones.
- **All product photography must be replaced before selling.** It is Unsplash
  stock: category-representative rather than SKU-accurate, and some frames
  depict other manufacturers' hardware. Three products were cut during the
  build because the only available imagery carried a competitor's logo
  (Soundcore, Anker, Bose). The rest was not audited image-by-image — treat
  the whole folder as placeholder. See `ADS-COMPLIANCE.md` §1.4.
