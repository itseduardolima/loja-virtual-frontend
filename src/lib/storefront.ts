import type { CSSProperties } from 'react'
import type { Product } from '@/types/product'
import type { StoreInfo } from '@/types/store'
import type { User } from '@/types/auth'
export { formatBRL } from '@/lib/utils'
import { formatBRL } from '@/lib/utils'

/** O usuário logado é o vendedor dono desta loja (visitando a própria vitrine)? */
export function isOwnStore(user: User | null | undefined, store?: StoreInfo | null): boolean {
  if (!user || !store?.user_id) return false
  return user.profile === 'Vendedor' && user.id === store.user_id
}

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
  if (store?.city && store?.state) chips.push(`${store.city} – ${store.state}`)
  return chips
}

/** Rótulo amigável de um método de pagamento (valores crus do backend:
 *  pix, credit_card, debit_card, boleto, cash, transfer). */
export function paymentMethodLabel(method: string): string {
  const m = method.toLowerCase()
  if (m.includes('pix')) return 'Pix'
  if (m.includes('credit') || m.includes('crédito') || m.includes('credito')) return 'Crédito'
  if (m.includes('debit') || m.includes('débito') || m.includes('debito')) return 'Débito'
  if (m.includes('boleto')) return 'Boleto'
  if (m.includes('cash') || m.includes('dinheiro')) return 'Dinheiro'
  if (m.includes('transfer')) return 'Transferência'
  return method
}

/** Itens do marquee de promessas — derivados; vazio se a loja tiver pouco configurado. */
export function marqueeItems(store?: StoreInfo | null): string[] {
  const items: string[] = []
  const shipping = freeShippingLabel(store)
  if (shipping) items.push(shipping)
  for (const method of store?.payment_methods ?? []) {
    items.push(`Pagamento via ${paymentMethodLabel(method)}`)
  }
  if (store?.city && store?.state) items.push(`${store.city} – ${store.state}`)
  if (store?.whatsapp) items.push('Atendimento pelo WhatsApp')
  return items.length >= 3 ? items : []
}

// ─── Accent por loja (multi-tenant) ─────────────────────────────────────────
// Converte a brand_color (hex) do lojista em triplas HSL para os tokens
// --store-accent / --store-accent-ink. Sem brand_color, a vitrine mantém o
// índigo Nexo (default definido em globals.css).

function hexToHslTriple(hex: string): { h: number; s: number; l: number } | null {
  const clean = hex.trim().replace('#', '')
  const full = clean.length === 3 ? clean.split('').map((c) => c + c).join('') : clean
  if (!/^[0-9a-fA-F]{6}$/.test(full)) return null
  const r = parseInt(full.slice(0, 2), 16) / 255
  const g = parseInt(full.slice(2, 4), 16) / 255
  const b = parseInt(full.slice(4, 6), 16) / 255
  const max = Math.max(r, g, b)
  const min = Math.min(r, g, b)
  const l = (max + min) / 2
  let h = 0
  let s = 0
  const d = max - min
  if (d !== 0) {
    s = d / (1 - Math.abs(2 * l - 1))
    switch (max) {
      case r: h = ((g - b) / d) % 6; break
      case g: h = (b - r) / d + 2; break
      default: h = (r - g) / d + 4
    }
    h *= 60
    if (h < 0) h += 360
  }
  return { h: Math.round(h), s: Math.round(s * 100), l: Math.round(l * 100) }
}

/**
 * Estilo inline com as CSS vars do accent do lojista, derivadas de brand_color.
 * Uso: <div style={storeAccentStyle(storeInfo)}>. Retorna {} quando não há cor
 * de marca — aí valem os defaults índigo do globals.css. (CSS var a partir de
 * dado dinâmico é o caso legítimo de style inline.)
 */
export function storeAccentStyle(store?: StoreInfo | null): CSSProperties {
  const hex = store?.brand_color?.trim()
  if (!hex) return {}
  const hsl = hexToHslTriple(hex)
  if (!hsl) return {}
  const inkL = Math.max(hsl.l - 8, 14)
  return {
    ['--store-accent' as string]: `${hsl.h} ${hsl.s}% ${hsl.l}%`,
    ['--store-accent-ink' as string]: `${hsl.h} ${hsl.s}% ${inkL}%`,
  } as CSSProperties
}

const NEW_PRODUCT_WINDOW_DAYS = 30

/** Produto é "novo" quando criado há menos de 30 dias. */
export function isNewProduct(createdAt?: string | null): boolean {
  if (!createdAt) return false
  const created = new Date(createdAt).getTime()
  if (Number.isNaN(created)) return false
  return Date.now() - created < NEW_PRODUCT_WINDOW_DAYS * 24 * 60 * 60 * 1000
}
