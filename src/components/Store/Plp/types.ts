/* Tipos compartilhados da PLP (/loja/[slug]/produtos) */

/** Estado único dos filtros — fonte da verdade no useStorePage */
export interface PlpFilters {
  /** nicho ("Tipo") selecionado — single-select; null = todos */
  nicheId: number | null
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

/** Nicho da loja para o grupo "Tipo" (slug alimenta o ícone) */
export interface PlpNiche {
  id: number
  name: string
  slug: string
}

/** Handlers do painel de filtros (rail desktop + drawer mobile) */
export interface PlpFilterPanelProps {
  filters: PlpFilters
  /** grupo "Tipo" só renderiza com 2+ nichos (com 1, filtrar é inócuo) */
  niches: PlpNiche[]
  categories: PlpCategory[]
  colorFacet: string[]
  sizeFacet: string[]
  /** título dos grupos de variante — nome do campo do nicho (ex.: "Numeração") */
  colorLabel?: string
  sizeLabel?: string
  dynFacets: PlpFacet[]
  priceMax: number
  onToggleNiche: (id: number) => void
  onToggleCategory: (id: number) => void
  onToggleColor: (color: string) => void
  onToggleSize: (size: string) => void
  onToggleDyn: (facet: PlpFacet, value: string) => void
  onSetMaxPrice: (value: number) => void
  onSetMinRating: (rating: number) => void
  onTogglePromo: () => void
  onToggleFeatured: () => void
}
