import { useState, useMemo, useEffect } from 'react'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { Product } from '@/types/product'
import { 
  UseStorePageReturn, 
  StoreFilters, 
  SortOrder
} from './types'

interface UseStorePageProps {
  slug: string
}

export function useStorePage({ slug }: UseStorePageProps): UseStorePageReturn {
  // Estado local
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('DESC')
  const [sortField, setSortField] = useState('created_at')
  const [filters, setFilters] = useState<StoreFilters>({})
  
  // Debounce para busca automática
  const debouncedSearch = useDebounce(search, 500)

  // Executa busca automática quando debouncedSearch muda
  useEffect(() => {
    updateParams({ search: debouncedSearch || undefined, page: 1 })
  }, [debouncedSearch])

  // Hook da API
  const {
    products,
    loading,
    error,
    meta,
    updateParams
  } = useStoreProducts({
    slug,
    page: 1,
    limit: 20,
    sort,
    sort_field: sortField,
    featured: filters.featured,
    color: filters.color,
    size: filters.size,
    max_price: filters.maxPrice,
    min_price: filters.minPrice,
    category_id: filters.categoryId,
    search: debouncedSearch || undefined
  })

  // Dados processados
  const categories = useMemo(() => {
    const uniqueCategories = new Map()
    products.forEach(product => {
      if (product.category) {
        uniqueCategories.set(product.category.id, product.category)
      }
    })
    return Array.from(uniqueCategories.values())
  }, [products])

  const availableColors = useMemo(() => {
    const colors = new Set<string>()
    products.forEach(product => {
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => colors.add(color))
      }
    })
    return Array.from(colors)
  }, [products])

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>()
    products.forEach(product => {
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => sizes.add(size))
      }
    })
    return Array.from(sizes)
  }, [products])

  // Handlers
  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    // A busca automática será executada via debounce
  }

  const handleSortChange = (newSort: string, newSortField: string) => {
    setSort(newSort as SortOrder)
    setSortField(newSortField)
    updateParams({ 
      sort: newSort as SortOrder, 
      sort_field: newSortField,
      page: 1 
    })
  }

  const handleFilterChange = (newFilters: StoreFilters) => {
    setFilters(newFilters)
    updateParams({
      featured: newFilters.featured,
      color: newFilters.color,
      size: newFilters.size,
      max_price: newFilters.maxPrice,
      min_price: newFilters.minPrice,
      category_id: newFilters.categoryId,
      page: 1
    })
  }

  const handleClearFilters = () => {
    setFilters({})
    setSearch('')
    updateParams({
      featured: undefined,
      color: undefined,
      size: undefined,
      max_price: undefined,
      min_price: undefined,
      category_id: undefined,
      search: undefined,
      page: 1
    })
  }

  const handlePageChange = (page: number) => {
    updateParams({ page })
  }

  const handleItemsPerPageChange = (itemsPerPage: number) => {
    updateParams({ limit: itemsPerPage, page: 1 })
  }


  const handleAddToFavorites = (product: Product) => {
    // TODO: Implementar lógica de adicionar aos favoritos
    console.log('Adicionar aos favoritos:', product)
  }

  const handleViewDetails = (product: Product) => {
    // Navegar para página de detalhes do produto
    window.location.href = `/loja/${slug}/produto/${product.id}`
  }

  return {
    // Estado
    search,
    sort,
    sortField,
    filters,
    
    // Dados da API
    products,
    loading,
    error,
    meta,
    
    // Dados processados
    categories,
    availableColors,
    availableSizes,
    
    // Handlers
    handleSearch,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleAddToFavorites,
    handleViewDetails
  }
}
