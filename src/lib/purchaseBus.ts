// Simple event bus for purchase events
export type PurchasePayload = {
  id?: string
  icon?: string
  title?: string
  [key: string]: unknown
}

const purchaseBus: EventTarget =
  typeof window !== 'undefined' ? new EventTarget() : ({} as EventTarget)

export function emitPurchase(payload: PurchasePayload) {
  if (typeof window === 'undefined') return
  try {
    sessionStorage.setItem('last-purchase', JSON.stringify(payload))
  } catch {}
  purchaseBus.dispatchEvent(
    new CustomEvent('prop-purchase', { detail: payload })
  )
}

export function addPurchaseListener(handler: (ev: Event) => void) {
  if (typeof window === 'undefined') return () => {}
  purchaseBus.addEventListener('prop-purchase', handler as EventListener)
  return () =>
    purchaseBus.removeEventListener('prop-purchase', handler as EventListener)
}
