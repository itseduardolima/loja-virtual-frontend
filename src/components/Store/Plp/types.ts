/* Tipos compartilhados da PLP (/loja/[slug]/produtos) */

/** Estado único dos filtros — fonte da verdade no useStorePage */
export interface PlpFilters {
  categoryIds: number[]
  colors: string[]
  sizes: string[]
  /** chave = nome do campo dinâmico (vai verbatim como chave de dynamic_filters) */
  dyn: Record<string, string[]>
  /** Infinity (ou >= priceMax) → sem filtro de preço ativo; slider exibe min(maxPrice, priceMax) */
  maxPrice: number
  /** 0 = todas */
  minRating: number
  promo: boolean
  featured: boolean
}

/** Faceta dinâmica derivada dos campos do nicho da loja */
export interface PlpFacet {
  name: string
  /** radio → single-select (pills); select → multi-select (checkboxes) */
  type: 'radio' | 'select'
  options: string[]
}

export type PlpView = 'grid' | 'dense' | 'list'

/** Chip removível de filtro ativo — carrega a própria ação de remoção */
export interface PlpChip {
  key: string
  label: string
  remove: () => void
}

/** Categoria com contagem para o painel de filtros */
export interface PlpCategory {
  id: number
  name: string
  count: number
}

/** Handlers do painel de filtros (rail desktop + drawer mobile) */
export interface PlpFilterPanelProps {
  filters: PlpFilters
  categories: PlpCategory[]
  colorFacet: string[]
  sizeFacet: string[]
  dynFacets: PlpFacet[]
  priceMax: number
  onToggleCategory: (id: number) => void
  onToggleColor: (color: string) => void
  onToggleSize: (size: string) => void
  onToggleDyn: (facet: PlpFacet, value: string) => void
  onSetMaxPrice: (value: number) => void
  onSetMinRating: (rating: number) => void
  onTogglePromo: () => void
  onToggleFeatured: () => void
}
