import { Product } from '@/types/product'

// Tipos para os filtros da loja
export interface StoreFilters {
  featured?: boolean
  color?: string
  size?: string
  minPrice?: number
  maxPrice?: number
  nicheId?: number
  categoryId?: number
  dynamicFilters?: Record<string, string>
  minRating?: number
}

// Tipos para as categorias da loja
export interface StoreCategory {
  id: number
  name: string
  description: string
  _count: {
    products: number
  }
}

// Tipos para os dados processados da loja
export interface ProcessedStoreData {
  categories: Array<{ id: number; name: string }>
  availableColors: string[]
  availableSizes: string[]
  availableDynamicFieldNames: string[]
}

// Tipos para os handlers da página
export interface StorePageHandlers {
  handleSearch: (searchTerm: string) => void
  handleSearchSubmit: (searchTerm: string) => void
  handleSortChange: (newSort: string, newSortField: string) => void
  handleFilterChange: (newFilters: StoreFilters) => void
  handleClearFilters: () => void
  handlePageChange: (page: number) => void
  handleItemsPerPageChange: (itemsPerPage: number) => void
  handleAddToFavorites: (product: Product) => void
  handleViewDetails: (product: Product) => void
}

// Tipos para o estado da página
export interface StorePageState {
  search: string
  sort: 'ASC' | 'DESC'
  sortField: string
  filters: StoreFilters
}

// Tipos para os dados da API
export interface StorePageApiData {
  products: Product[]
  loading: boolean
  isFetchingMore: boolean
  error: string | null
  loadMoreError: string | null
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  } | null
  nextCursor: number | null
  loadMore: () => void
  refetch: () => void
}

// Tipo principal do hook useStorePage
export interface UseStorePageReturn extends StorePageState, StorePageApiData, ProcessedStoreData, StorePageHandlers {}

// Tipos para as props dos componentes
export interface StoreFiltersProps {
  onSearch: (search: string) => void
  onSortChange: (sort: string, sortField: string) => void
  onFilterChange: (filters: StoreFilters) => void
  onClearFilters: () => void
  searchValue: string
  sortValue: string
  sortFieldValue: string
  activeFilters: StoreFilters
  categories: Array<{ id: number; name: string }>
  availableColors: string[]
  availableSizes: string[]
  availableDynamicFieldNames: string[]
}

export interface ProductCardProps {
  product: Product
  onAddToFavorites?: (product: Product) => void
  onViewDetails?: (product: Product) => void
}

export interface StorePaginationProps {
  currentPage: number
  totalPages: number
  totalItems: number
  onPageChange: (page: number) => void
  hasNextPage: boolean
  hasPrevPage: boolean
}

// Tipos para as opções de ordenação
export type SortField = 'created_at' | 'name' | 'price' | 'stock' | 'average_rating'
export type SortOrder = 'ASC' | 'DESC'

// Tipos para as opções de itens por página
export type ItemsPerPage = 10 | 20 | 50 | 100

// Tipos para os estados de loading
export interface LoadingStates {
  isLoading: boolean
  isSearching: boolean
  isFiltering: boolean
  isPaginating: boolean
}

// Tipos para as estatísticas da loja
export interface StoreStats {
  totalProducts: number
  featuredProducts: number
  availableProducts: number
  outOfStockProducts: number
  averagePrice: number
  categoriesCount: number
}

// Tipos para as configurações da página
export interface StorePageConfig {
  defaultItemsPerPage: number
  maxItemsPerPage: number
  defaultSortField: SortField
  defaultSortOrder: SortOrder
  enableInfiniteScroll: boolean
  enableVirtualization: boolean
}

// Tipos para os eventos da página
export interface StorePageEvents {
  onProductClick: (product: Product) => void
  onAddToCart: (product: Product) => void
  onAddToFavorites: (product: Product) => void
  onFilterChange: (filters: StoreFilters) => void
  onSearch: (query: string) => void
  onSortChange: (field: SortField, order: SortOrder) => void
  onPageChange: (page: number) => void
}
