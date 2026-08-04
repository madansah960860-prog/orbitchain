/* Single source of truth for the responsive image pipeline.
   scripts/optimize-images.mjs imports WIDTHS from here, so the files
   on disk and the srcset in the markup can never drift apart. */

export const IMAGE_WIDTHS = [320, 640, 960, 1280]
export const FALLBACK_WIDTH = 640

const dir = '/images/r'

export const srcSet = (name, ext) =>
  IMAGE_WIDTHS.map((w) => `${dir}/${name}-${w}.${ext} ${w}w`).join(', ')

export const fallbackSrc = (name) => `${dir}/${name}-${FALLBACK_WIDTH}.jpg`

/* `sizes` tells the browser how wide the image will RENDER before CSS
   has loaded, so it can pick the right file on the first try. Getting
   these wrong is the usual reason srcset saves nothing. */
export const SIZES = {
  card: '(max-width: 560px) 92vw, (max-width: 900px) 45vw, (max-width: 1400px) 30vw, 300px',
  hero: '100vw',
  bentoWide: '(max-width: 860px) 92vw, 92vw',
  bentoTile: '(max-width: 860px) 92vw, 46vw',
  pdpMain: '(max-width: 900px) 92vw, 46vw',
  thumb: '76px',
  cartLine: '104px',
  miniThumb: '34px',
  aboutMedia: '(max-width: 700px) 92vw, 45vw',
}
