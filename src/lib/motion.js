/* ============================================================
   MOTION

   GSAP + ScrollTrigger + Lenis are ~90 KB gzipped and none of it is
   needed to render a readable page. So nothing here imports them at
   module scope — they are pulled in on demand, after first paint,
   and every entry point degrades to a no-op if they never arrive.

   The one exception is initReveals(), which uses IntersectionObserver
   only. Reveals must never wait on a network fetch: content that is
   hidden until a chunk downloads is content that can fail to appear.
   ============================================================ */

export const prefersReduced = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches

/* ---------------------- lazy dependency loading ---------------------- */

let libs = null
let pending = null

function loadLibs() {
  if (libs) return Promise.resolve(libs)
  if (!pending) {
    pending = Promise.all([
      import('gsap'),
      import('gsap/ScrollTrigger'),
      import('lenis'),
    ])
      .then(([g, st, l]) => {
        const gsap = g.gsap ?? g.default
        const ScrollTrigger = st.ScrollTrigger ?? st.default
        const Lenis = l.default ?? l.Lenis
        gsap.registerPlugin(ScrollTrigger)
        libs = { gsap, ScrollTrigger, Lenis }
        return libs
      })
      .catch(() => {
        // Chunk failed (offline, blocked, stale deploy). The site works
        // without motion; don't let a rejected promise surface as noise.
        libs = null
        return null
      })
  }
  return pending
}

/** Runs `fn` once the libs land. Returns a teardown that is safe to call
 *  before they do — it cancels the pending setup. */
function whenReady(fn) {
  let cancelled = false
  let teardown = () => {}
  loadLibs().then((l) => {
    if (cancelled || !l) return
    teardown = fn(l) || (() => {})
  })
  return () => {
    cancelled = true
    teardown()
  }
}

/* ============================================================
   SMOOTH SCROLL
   ============================================================ */

let lenis = null

export function initSmoothScroll() {
  if (prefersReduced()) return () => {}

  return whenReady(({ gsap, ScrollTrigger, Lenis }) => {
    if (lenis) return () => {}

    lenis = new Lenis({
      duration: 1.05,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      syncTouch: false, // native momentum beats emulated on touch
    })

    lenis.on('scroll', ScrollTrigger.update)
    const raf = (time) => lenis?.raf(time * 1000)
    gsap.ticker.add(raf)
    gsap.ticker.lagSmoothing(0)

    return () => {
      gsap.ticker.remove(raf)
      lenis?.destroy()
      lenis = null
    }
  })
}

export const scrollToTop = () => {
  if (lenis) lenis.scrollTo(0, { immediate: true })
  else window.scrollTo(0, 0)
}

export function refreshScroll() {
  libs?.ScrollTrigger.refresh()
}

/* ============================================================
   REVEAL — no dependencies, never deferred
   ============================================================ */

export function initReveals(root = document) {
  // Callers pass a ref that is legitimately null when the branch holding it
  // did not render (an empty wishlist, a zero-result grid). Never throw for
  // that — a missing container just means there is nothing to reveal.
  if (!root) return () => {}

  const nodes = [...root.querySelectorAll('.js-reveal:not(.is-in)')]
  if (!nodes.length) return () => {}

  if (prefersReduced() || !('IntersectionObserver' in window)) {
    nodes.forEach((n) => n.classList.add('is-in'))
    return () => {}
  }

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const el = entry.target
        const delay = Number(el.dataset.revealDelay || 0)
        window.setTimeout(() => el.classList.add('is-in'), delay)
        io.unobserve(el)
      })
    },
    { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
  )

  nodes.forEach((n) => io.observe(n))

  const failsafe = window.setTimeout(() => {
    nodes.forEach((n) => n.classList.add('is-in'))
  }, 1800)

  return () => {
    io.disconnect()
    window.clearTimeout(failsafe)
  }
}

/** Assign cascading delays to the children of a container. */
export function stagger(container, step = 60, max = 8) {
  if (!container) return
  ;[...container.children].forEach((child, i) => {
    const el = child.classList?.contains('js-reveal') ? child : child.querySelector?.('.js-reveal')
    if (el) el.dataset.revealDelay = String(Math.min(i, max) * step)
  })
}

/* ============================================================
   MAGNETIC PULL
   The cursor tugs the element toward it, then it snaps back — the
   same feel as a MagSafe puck finding its ring.
   ============================================================ */

export function magnetic(el, strength = 0.32) {
  if (!el || prefersReduced()) return () => {}
  if (!window.matchMedia('(pointer: fine)').matches) return () => {}

  return whenReady(({ gsap }) => {
    const qx = gsap.quickTo(el, 'x', { duration: 0.5, ease: 'expo.out' })
    const qy = gsap.quickTo(el, 'y', { duration: 0.5, ease: 'expo.out' })

    const onMove = (e) => {
      const r = el.getBoundingClientRect()
      qx((e.clientX - (r.left + r.width / 2)) * strength)
      qy((e.clientY - (r.top + r.height / 2)) * strength)
    }
    const onLeave = () => {
      gsap.to(el, { x: 0, y: 0, duration: 0.7, ease: 'elastic.out(1, 0.55)' })
    }

    el.addEventListener('pointermove', onMove)
    el.addEventListener('pointerleave', onLeave)
    return () => {
      el.removeEventListener('pointermove', onMove)
      el.removeEventListener('pointerleave', onLeave)
      gsap.killTweensOf(el)
    }
  })
}

/* ============================================================
   PARALLAX — transform only, never layout
   ============================================================ */

export function parallax(el, distance = 90) {
  if (!el || prefersReduced()) return () => {}

  return whenReady(({ gsap }) => {
    const tween = gsap.fromTo(
      el,
      { yPercent: -distance / 20 },
      {
        yPercent: distance / 20,
        ease: 'none',
        scrollTrigger: {
          trigger: el.parentElement || el,
          start: 'top bottom',
          end: 'bottom top',
          scrub: 0.6,
        },
      }
    )
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  })
}

/* ============================================================
   HERO CHOREOGRAPHY

   Everything animates *from* a visible resting state via gsap.from(),
   so if this never runs the hero is still fully laid out.

   Deferring GSAP introduces one hazard: if the chunk lands late the
   hero would already be on screen, then yank back and re-enter — a
   pop that looks like a bug. So the intro is skipped entirely past
   a short budget. A missed flourish beats a visible jolt.
   ============================================================ */

const HERO_INTRO_BUDGET_MS = 500

export function heroIntro(scope) {
  if (!scope || prefersReduced()) return () => {}
  const armed = performance.now()

  return whenReady(({ gsap }) => {
    if (performance.now() - armed > HERO_INTRO_BUDGET_MS) return () => {}

    const ctx = gsap.context(() => {
      const tl = gsap.timeline({ defaults: { ease: 'expo.out' } })
      tl.from('[data-hero="line"]', { yPercent: 118, duration: 1.15, stagger: 0.085 })
        .from('[data-hero="sub"]', { y: 18, opacity: 0, duration: 0.8 }, '-=0.72')
        .from('[data-hero="cta"]', { y: 16, opacity: 0, duration: 0.7, stagger: 0.08 }, '-=0.6')
        .from(
          '[data-hero="panel"]',
          { y: 34, opacity: 0, scale: 0.97, duration: 1, stagger: 0.09 },
          '-=0.8'
        )
    }, scope)

    return () => ctx.revert()
  })
}

/* ============================================================
   COUNT UP
   Used only on non-commercial figures. Prices and stock counts never
   animate — a number a customer is being asked to act on should not
   be in motion.
   ============================================================ */

export function countUp(el, to, duration = 1.4) {
  if (!el) return () => {}
  if (prefersReduced()) {
    el.textContent = String(to)
    return () => {}
  }

  return whenReady(({ gsap }) => {
    const obj = { v: 0 }
    const tween = gsap.to(obj, {
      v: to,
      duration,
      ease: 'expo.out',
      scrollTrigger: { trigger: el, start: 'top 88%', once: true },
      onUpdate: () => {
        el.textContent = String(Math.round(obj.v))
      },
    })
    return () => {
      tween.scrollTrigger?.kill()
      tween.kill()
    }
  })
}
