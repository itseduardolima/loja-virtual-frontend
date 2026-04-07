import { useState, useMemo, useEffect } from 'react'
import { useRouter } from 'next/navigation'
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
  initialCategoryId?: number
}

export function useStorePage({ slug, initialCategoryId }: UseStorePageProps): UseStorePageReturn {
  const router = useRouter()
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<SortOrder>('DESC')
  const [sortField, setSortField] = useState('created_at')
  const [filters, setFilters] = useState<StoreFilters>(() =>
    initialCategoryId ? { categoryId: initialCategoryId } : {}
  )
  const [isManualSearch, setIsManualSearch] = useState(false)
  
  const debouncedSearch = useDebounce(search, 1000)

  // Quando só o nicho está selecionado (sem categoria), busca todos os produtos
  // para filtrar client-side corretamente (o backend não filtra por niche_id)
  const isNicheOnlyFilter = !!(filters.nicheId && !filters.categoryId)

  const {
    products: productsData,
    loading,
    error,
    meta,
    updateParams
  } = useStoreProducts({
    slug,
    page: 1,
    limit: isNicheOnlyFilter ? 1000 : 20,
    sort,
    sort_field: sortField,
    featured: filters.featured,
    color: filters.color,
    size: filters.size,
    max_price: filters.maxPrice,
    min_price: filters.minPrice,
    niche_id: filters.nicheId,
    category_id: filters.categoryId,
    dynamic_filters: filters.dynamicFilters,
    search: debouncedSearch || undefined,
    min_rating: filters.minRating
  })

  // Garantir que products seja sempre um array
  const products = Array.isArray(productsData) ? productsData : []

  useEffect(() => {
    if (!isManualSearch) {
      updateParams({ search: debouncedSearch || undefined, page: 1 })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [debouncedSearch, isManualSearch])

  useEffect(() => {
    if (isManualSearch) {
      const timer = setTimeout(() => {
        setIsManualSearch(false)
      }, 1500)
      return () => clearTimeout(timer)
    }
  }, [isManualSearch])
  const categories = useMemo(() => {
    const uniqueCategories = new Map()
    if (!Array.isArray(products)) return []
    products.forEach(product => {
      if (product?.category) {
        uniqueCategories.set(product.category.id, product.category)
      }
    })
    return Array.from(uniqueCategories.values())
  }, [products])

  const availableColors = useMemo(() => {
    const colors = new Set<string>()
    if (!Array.isArray(products)) return []
    products.forEach(product => {
      // Primeiro tenta das propriedades diretas
      if (product.colors && Array.isArray(product.colors)) {
        product.colors.forEach(color => {
          if (typeof color === 'string') {
            // Se a cor contém vírgulas, separa
            color.split(',').forEach(c => colors.add(c.trim()))
          } else {
            colors.add(color)
          }
        })
      }
      // Depois tenta dos dynamic_fields
      if (product.dynamic_fields && Array.isArray(product.dynamic_fields)) {
        product.dynamic_fields.forEach(field => {
          const fieldName = field.field_name?.toLowerCase() || ''
          if (fieldName.includes('cor') || fieldName.includes('color')) {
            if (field.value) {
              field.value.split(',').forEach(c => {
                const trimmed = c.trim()
                if (trimmed) colors.add(trimmed)
              })
            }
          }
        })
      }
    })
    return Array.from(colors).filter(Boolean).sort()
  }, [products])

  const availableDynamicFieldNames = useMemo(() => {
    const names = new Set<string>()
    if (!Array.isArray(products)) return []
    products.forEach(product => {
      if (product.dynamic_fields && Array.isArray(product.dynamic_fields)) {
        product.dynamic_fields.forEach(field => {
          if (field.field_name) names.add(field.field_name)
        })
      }
    })
    return Array.from(names)
  }, [products])

  const availableSizes = useMemo(() => {
    const sizes = new Set<string>()
    if (!Array.isArray(products)) return []
    products.forEach(product => {
      // Primeiro tenta das propriedades diretas
      if (product.sizes && Array.isArray(product.sizes)) {
        product.sizes.forEach(size => {
          if (typeof size === 'string') {
            // Se o tamanho contém vírgulas, separa
            size.split(',').forEach(s => sizes.add(s.trim()))
          } else {
            sizes.add(size)
          }
        })
      }
      // Depois tenta dos dynamic_fields
      if (product.dynamic_fields && Array.isArray(product.dynamic_fields)) {
        product.dynamic_fields.forEach(field => {
          const fieldName = field.field_name?.toLowerCase() || ''
          if (fieldName.includes('tamanho') || fieldName.includes('size') || fieldName.includes('numeração')) {
            if (field.value) {
              field.value.split(',').forEach(s => {
                const trimmed = s.trim()
                if (trimmed) sizes.add(trimmed)
              })
            }
          }
        })
      }
    })
    return Array.from(sizes).filter(Boolean).sort()
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
      niche_id: newFilters.nicheId,
      category_id: newFilters.categoryId,
      dynamic_filters: newFilters.dynamicFilters,
      min_rating: newFilters.minRating,
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
      niche_id: undefined,
      category_id: undefined,
      dynamic_filters: undefined,
      min_rating: undefined,
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


  const handleAddToFavorites = (_product: Product) => {}

  const handleViewDetails = (product: Product) => {
    router.push(`/loja/${slug}/produto/${product.id}`)
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
    availableDynamicFieldNames,
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
