import { srcSet, fallbackSrc } from '../lib/images'

/* ---------------------------------------------------------------
   Responsive image.

   Emits AVIF → WebP → JPEG in that preference order. The browser
   picks the first format it understands, then uses `sizes` to pick
   the narrowest file that still covers the rendered width.

   `width`/`height` are the INTRINSIC ratio, not the display size —
   they reserve the right box so the layout never jumps (CLS).

   Set `priority` on anything above the fold: it swaps lazy loading
   for an eager, high-priority fetch. Use it sparingly; marking
   everything priority is the same as marking nothing.
   --------------------------------------------------------------- */
export default function Img({
  name,
  alt,
  sizes,
  width = 800,
  height = 600,
  priority = false,
  className,
  style,
}) {
  return (
    <picture>
      <source type="image/avif" srcSet={srcSet(name, 'avif')} sizes={sizes} />
      <source type="image/webp" srcSet={srcSet(name, 'webp')} sizes={sizes} />
      <img
        src={fallbackSrc(name)}
        alt={alt}
        width={width}
        height={height}
        loading={priority ? 'eager' : 'lazy'}
        decoding={priority ? 'sync' : 'async'}
        {...(priority ? { fetchpriority: 'high' } : {})}
        className={className}
        style={style}
      />
    </picture>
  )
}
