import { useState, useMemo, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreCategories } from '@/hooks/useStoreCategories'
import { useNiches, useStoreFields } from '@/hooks/useNiches'
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

  // Loja, categorias e nichos compostos aqui para que page.tsx não importe hooks de dado diretamente
  const { storeInfo } = useStoreInfo(slug)
  const { categories: storeCategories } = useStoreCategories(slug)
  const { data: nichesData } = useNiches(storeInfo?.id ?? null)
  const { data: allStoreFieldsData } = useStoreFields(storeInfo?.id ?? null)

  // Quando só o nicho está selecionado (sem categoria), busca todos os produtos
  // para filtrar client-side corretamente (o backend não filtra por niche_id)
  const isNicheOnlyFilter = !!(filters.nicheId && !filters.categoryId)

  const {
    products: productsData,
    loading,
    isFetchingMore,
    error,
    loadMoreError,
    meta,
    nextCursor,
    updateParams,
    loadMore,
    refetch,
  } = useStoreProducts({
    slug,
    cursor: undefined,
    limit: isNicheOnlyFilter ? 1000 : 12,
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

  // Sidebar: mapa categoria → nicho, acumulativo para não perder dados ao aplicar filtros
  const allStoreFields = allStoreFieldsData ?? []
  const categoryNicheMapRef = useRef<Record<number, number>>({})
  const categoryNicheMap = useMemo(() => {
    if (!allStoreFields.length || !products.length) return categoryNicheMapRef.current

    const fieldNicheMap: Record<string, number> = {}
    allStoreFields.forEach(field => {
      fieldNicheMap[field.name] = field.niche_id
    })

    products.forEach(product => {
      if (product.category?.id && product.dynamic_fields?.length > 0) {
        if (categoryNicheMapRef.current[product.category.id] !== undefined) return
        for (const df of product.dynamic_fields) {
          const nicheId = fieldNicheMap[df.field_name]
          if (nicheId) {
            categoryNicheMapRef.current[product.category.id] = nicheId
            break
          }
        }
      }
    })

    return { ...categoryNicheMapRef.current }
  }, [allStoreFields, products])

  // Filtro client-side por nicho
  const displayProducts = useMemo(() => {
    if (filters.nicheId && !filters.categoryId && Object.keys(categoryNicheMap).length > 0) {
      return products.filter(p => p.category?.id && categoryNicheMap[p.category.id] === filters.nicheId)
    }
    return products
  }, [products, filters.nicheId, filters.categoryId, categoryNicheMap])

  const niches = nichesData?.data ?? []

  const getPageTitle = () => {
    if (filters.nicheId && !filters.categoryId && niches.length > 0) {
      const niche = niches.find(n => n.id === filters.nicheId)
      if (niche) return niche.name
    }
    if (filters.categoryId && categories.length > 0) {
      const selectedCategory = categories.find(cat => cat.id === filters.categoryId)
      return selectedCategory ? selectedCategory.name : 'Todos os produtos'
    }
    return 'Todos os produtos'
  }

  return {
    search,
    sort,
    sortField,
    filters,
    products,
    loading,
    isFetchingMore,
    error,
    loadMoreError,
    meta,
    nextCursor,
    loadMore,
    refetch,
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
    handleViewDetails,
    // Sidebar data (compostos de useStoreInfo, useStoreCategories, useNiches, useStoreFields)
    storeInfo: storeInfo ?? null,
    storeCategories: storeCategories ?? [],
    niches,
    allStoreFields,
    categoryNicheMap,
    displayProducts,
    getPageTitle,
  }
}
