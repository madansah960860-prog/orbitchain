import { useMemo } from 'react'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { byId } from '../data/catalog'

const MAX_QTY = 10

export const useStore = create(
  persist(
    (set, get) => ({
      /* ---------------------------- cart ---------------------------- */
      cart: [], // [{ id, qty }]

      addToCart: (id, qty = 1) => {
        const product = byId(id)
        if (!product || product.stock === 'out') return false
        const cart = [...get().cart]
        const idx = cart.findIndex((l) => l.id === id)
        const ceiling = Math.min(MAX_QTY, product.stockCount || MAX_QTY)
        if (idx >= 0) {
          cart[idx] = { ...cart[idx], qty: Math.min(ceiling, cart[idx].qty + qty) }
        } else {
          cart.push({ id, qty: Math.min(ceiling, qty) })
        }
        set({ cart })
        get().pushToast(`${product.name} added to cart`)
        return true
      },

      setQty: (id, qty) => {
        const product = byId(id)
        const ceiling = Math.min(MAX_QTY, product?.stockCount || MAX_QTY)
        const next = Math.max(0, Math.min(ceiling, qty))
        set({
          cart: next === 0 ? get().cart.filter((l) => l.id !== id) : get().cart.map((l) => (l.id === id ? { ...l, qty: next } : l)),
        })
      },

      removeFromCart: (id) => set({ cart: get().cart.filter((l) => l.id !== id) }),
      clearCart: () => set({ cart: [] }),

      /* -------------------------- wishlist -------------------------- */
      wishlist: [],
      toggleWish: (id) => {
        const has = get().wishlist.includes(id)
        set({ wishlist: has ? get().wishlist.filter((x) => x !== id) : [...get().wishlist, id] })
        get().pushToast(has ? 'Removed from saved items' : 'Saved for later')
      },

      /* ----------------------- recently viewed ---------------------- */
      recent: [],
      markViewed: (id) =>
        set({ recent: [id, ...get().recent.filter((x) => x !== id)].slice(0, 8) }),

      /* --------------------------- toasts --------------------------- */
      toasts: [],
      pushToast: (message) => {
        const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
        set({ toasts: [...get().toasts, { id, message }] })
        setTimeout(() => set({ toasts: get().toasts.filter((t) => t.id !== id) }), 3200)
      },

      /* -------------------------- consent --------------------------- */
      consent: null, // null | 'all' | 'essential'
      setConsent: (value) => set({ consent: value }),

      /* ------------------------- last order ------------------------- */
      // Held only so the declined-payment screen can show what was attempted.
      lastAttempt: null,
      setLastAttempt: (payload) => set({ lastAttempt: payload }),
    }),
    {
      name: 'orbit-store',
      // Deliberately NOT persisted: toasts, lastAttempt (contains order detail).
      partialize: (s) => ({
        cart: s.cart,
        wishlist: s.wishlist,
        recent: s.recent,
        consent: s.consent,
      }),
    }
  )
)

/* ---------------------------- selectors ----------------------------
   Selectors that return a PRIMITIVE are safe to pass straight to
   useStore — zustand compares them by value.

   Selectors that return an OBJECT or ARRAY are not: a fresh array
   every call fails the snapshot equality check and React re-renders
   forever ("The result of getSnapshot should be cached"). So the
   derived cart lines are exposed as a hook that subscribes to the
   raw `cart` array (a stable reference) and memoises the join.
   -------------------------------------------------------------------- */

export const cartCount = (state) => state.cart.reduce((n, l) => n + l.qty, 0)

export const cartSubtotal = (state) =>
  state.cart.reduce((sum, l) => {
    const product = byId(l.id)
    return product ? sum + product.price * l.qty : sum
  }, 0)

/** Cart entries joined to their product record. Memoised — see above. */
export function useCartLines() {
  const cart = useStore((s) => s.cart)
  return useMemo(
    () =>
      cart
        .map((line) => ({ ...line, product: byId(line.id) }))
        .filter((line) => Boolean(line.product)),
    [cart]
  )
}
