import type { Product } from '@/types/product'
import type { StoreInfo } from '@/types/store'
export { formatBRL } from '@/lib/utils'
import { formatBRL } from '@/lib/utils'

// ─── Conteúdo da vitrine: defaults derivados dos dados reais da loja ─────────
// Os campos hero_*/announcement_text/campaign_* do STORE, quando preenchidos
// pelo vendedor, sobrescrevem esses padrões.

function toNumber(value: string | number | null | undefined): number | null {
  if (value == null || value === '') return null
  const num = Number(value)
  return Number.isFinite(num) && num > 0 ? num : null
}

/** Monograma da loja: 1ª letra do nome em maiúsculo (fallback 'N'). */
export function getStoreMonogram(name?: string | null): string {
  return (name?.[0] ?? 'N').toUpperCase()
}

/** Preço final do produto (promo_price quando ativo, senão price). */
export function getProductPrice(product: Product): number {
  return product.final_price ?? parseFloat(product.price)
}

/** "Frete grátis acima de R$ X" derivado de free_delivery_min (ou null). */
export function freeShippingLabel(store?: StoreInfo | null): string | null {
  const min = toNumber(store?.free_delivery_min)
  return min ? `Frete grátis acima de ${formatBRL(min)}` : null
}

/** Texto da announcement bar: override do vendedor ?? frete grátis derivado. */
export function announcementText(store?: StoreInfo | null): string | null {
  return store?.announcement_text?.trim() || freeShippingLabel(store)
}

export interface HeroContent {
  eyebrow: string
  title: string
  subtitle: string | null
}

/** Conteúdo do hero: overrides do vendedor com fallback nos dados da loja. */
export function heroContent(store?: StoreInfo | null): HeroContent {
  const sinceYear = store?.created_at ? new Date(store.created_at).getFullYear() : null
  return {
    eyebrow: store?.hero_eyebrow?.trim() || (sinceYear ? `Desde ${sinceYear}` : 'Loja oficial'),
    title: store?.hero_title?.trim() || store?.name || '',
    subtitle: store?.hero_subtitle?.trim() || store?.description?.trim() || null,
  }
}

/** Chips de confiança do hero — apenas dados reais configurados. */
export function heroChips(store?: StoreInfo | null): string[] {
  const chips: string[] = []
  const shipping = freeShippingLabel(store)
  if (shipping) chips.push(shipping)
  if (store?.delivery_time) chips.push(`Entrega em ${store.delivery_time}`)
  if (store?.city && store?.state) chips.push(`${store.city} – ${store.state}`)
  return chips
}

/** Itens do marquee de promessas — derivados; vazio se a loja tiver pouco configurado. */
export function marqueeItems(store?: StoreInfo | null): string[] {
  const items: string[] = []
  const shipping = freeShippingLabel(store)
  if (shipping) items.push(shipping)
  if (store?.delivery_time) items.push(`Entrega em ${store.delivery_time}`)
  for (const method of store?.payment_methods ?? []) {
    items.push(`Pagamento via ${method}`)
  }
  if (store?.city && store?.state) items.push(`${store.city} – ${store.state}`)
  if (store?.whatsapp) items.push('Atendimento pelo WhatsApp')
  return items.length >= 3 ? items : []
}

const NEW_PRODUCT_WINDOW_DAYS = 30

/** Produto é "novo" quando criado há menos de 30 dias. */
export function isNewProduct(createdAt?: string | null): boolean {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000
}
