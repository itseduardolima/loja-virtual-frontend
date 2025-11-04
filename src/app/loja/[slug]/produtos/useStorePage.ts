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
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('DESC')
  const [sortField, setSortField] = useState('created_at')
  const [filters, setFilters] = useState<StoreFilters>({})
  const [isManualSearch, setIsManualSearch] = useState(false)
  
  const debouncedSearch = useDebounce(search, 1000)

  useEffect(() => {
    if (!isManualSearch) {
      updateParams({ search: debouncedSearch || undefined, page: 1 })
    }
  }, [debouncedSearch, isManualSearch])

  useEffect(() => {
    if (isManualSearch) {
      const timer = setTimeout(() => {
        setIsManualSearch(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isManualSearch])

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

  const handleSearch = (searchTerm: string) => {
    setSearch(searchTerm)
    setIsManualSearch(false)
  }

  const handleSearchSubmit = (searchTerm: string) => {
    setSearch(searchTerm)
    setIsManualSearch(true)
    updateParams({ search: searchTerm || undefined, page: 1 })
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
    console.log('Adicionar aos favoritos:', product)
  }

  const handleViewDetails = (product: Product) => {
    window.location.href = `/loja/${slug}/produto/${product.id}`
  }

  return {
    search,
    sort,
    sortField,
    filters,
    products,
    loading,
    error,
    meta,
    categories,
    availableColors,
    availableSizes,
    handleSearch,
    handleSearchSubmit,
    handleSortChange,
    handleFilterChange,
    handleClearFilters,
    handlePageChange,
    handleItemsPerPageChange,
    handleAddToFavorites,
    handleViewDetails
  }
}
