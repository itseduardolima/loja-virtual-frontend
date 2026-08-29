/* Tipos da PLP (/loja/[slug]/produtos) — shape de retorno do useStorePage */

import type { Product } from '@/types/product'
import type { StoreInfo, CollectionSort } from '@/types/store'
import type { PlpChip, PlpView, PlpFilterPanelProps } from '@/components/Store/Plp/types'

/** Nicho exibido no hero (1º nicho da loja) */
export interface PlpHeroNiche {
  name: string
  slug: string
}

/** Tudo que a page.tsx consome — useStorePage é a única fonte de verdade */
export interface UseStorePageReturn {
  // Loja
  storeInfo: StoreInfo | null
  storeLoading: boolean
  storeError: string | null

  // Busca
  search: string
  setSearch: (value: string) => void
  debouncedSearch: string

  // Ordenação / visualização
  sort: CollectionSort
  setSort: (sort: CollectionSort) => void
  view: PlpView
  setView: (view: PlpView) => void

  // UI (carrinho + drawer de filtros)
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  isDrawerOpen: boolean
  setIsDrawerOpen: (open: boolean) => void

  // Produtos
  products: Product[]
  productsLoading: boolean
  isFetchingMore: boolean
  loadMoreError: string | null
  nextCursor: number | null
  loadMore: () => void
  resultCount: number

  // Derivados de exibição
  pageTitle: string
  heroNiche: PlpHeroNiche | null
  chips: PlpChip[]
  activeCount: number

  // Painel de filtros (rail + drawer) já montado
  panelProps: PlpFilterPanelProps

  // Handlers
  clearAll: () => void
  openProduct: (product: Product) => void
  quickAdd: (product: Product) => void
  toggleWishlistProduct: (product: Product) => void
  isWished: (productId: number) => boolean
  showWishlist: boolean
  refetch: () => void
}
