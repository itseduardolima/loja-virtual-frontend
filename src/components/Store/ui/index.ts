// Kit de UI da vitrine (storefront) — primitivos reutilizáveis em todas as
// páginas de /loja (home, PLP, produto, checkout, sucesso). Accent do lojista
// via tokens `store`/`store-ink`; voz tipográfica Integral (display) + mono (eyebrow).

export { StoreButton, storeButtonClass } from './StoreButton'
export type { StoreButtonVariant, StoreButtonSize } from './StoreButton'
export { StoreCard, storeCardClass } from './StoreCard'
export { StoreBadge } from './StoreBadge'
export type { StoreBadgeTone } from './StoreBadge'
export { StoreEyebrow } from './StoreEyebrow'
export type { StoreEyebrowTone } from './StoreEyebrow'
export { StorePill } from './StorePill'
export { StoreIconButton } from './StoreIconButton'
export type { StoreIconButtonVariant } from './StoreIconButton'
export { SearchField } from './SearchField'
// Cabeçalho de seção (eyebrow + título Integral) já vivia em Store/ — re-exportado aqui.
export { StoreSectionHeader } from '../StoreSectionHeader'
