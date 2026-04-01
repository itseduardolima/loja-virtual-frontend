'use client'

import { useState, useMemo } from 'react'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreCategories } from '@/hooks/useStoreCategories'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useTopRatedProducts } from '@/hooks/useTopRatedProducts'
import { useDebounce } from '@/hooks/useDebounce'
import { Product } from '@/types/product'
import type { StoreCategory, StoreInfo } from '@/types/store'

const MAX_CATEGORIES = 5

export interface UseStoreHomePageReturn {
  slug: string
  storeInfo: StoreInfo | null
  storeError: string | null
  categoriesToShow: StoreCategory[]
  products: Product[]
  featuredProducts: Product[]
  topRatedProducts: Product[]
  loading: boolean
  productsLoading: boolean
  hasCategorySections: boolean
  search: string
  setSearch: (value: string) => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  handleViewDetails: (product: Product) => void
  handleAddToFavorites: (product: Product) => void
  handleSearchSubmit: (value: string) => void
}

export function useStoreHomePage(slug: string): UseStoreHomePageReturn {
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const debouncedSearch = useDebounce(search, 500)

  const { storeInfo, loading: storeLoading, error: storeError } = useStoreInfo(slug)
  const { categories: allCategories, loading: categoriesLoading } = useStoreCategories(slug)
  const { products, loading: productsLoading, updateParams } = useStoreProducts({
    slug,
    page: 1,
    limit: 24,
    sort: 'DESC',
    sort_field: 'created_at',
    search: debouncedSearch || undefined,
  })

  const { products: featuredRaw } = useStoreProducts({
    slug,
    page: 1,
    limit: 8,
    featured: true,
    sort: 'DESC',
    sort_field: 'created_at',
  })

  const { data: topRatedData } = useTopRatedProducts(slug, 8)

  const categoriesToShow = useMemo(() => {
    const list = allCategories || []
    const hasCount = list.some((c: StoreCategory) => c._count != null)
    const withProducts = hasCount
      ? list.filter((c: StoreCategory) => (c._count?.products ?? 0) >= 1)
      : list
    return withProducts.slice(0, MAX_CATEGORIES)
  }, [allCategories])

  const featuredProducts = featuredRaw ?? []
  const topRatedProducts = topRatedData?.data ?? []

  const loading = storeLoading || categoriesLoading
  const hasCategorySections = categoriesToShow.length > 0

  const handleViewDetails = (product: Product) => {
    window.location.href = `/loja/${slug}/produto/${product.id}`
  }

  const handleAddToFavorites = () => {}

  const handleSearchSubmit = (value: string) => {
    setSearch(value)
    updateParams({ search: value || undefined, page: 1 })
  }

  return {
    slug,
    storeInfo,
    storeError: storeError ?? null,
    categoriesToShow,
    products,
    featuredProducts,
    topRatedProducts,
    loading,
    productsLoading,
    hasCategorySections,
    search,
    setSearch,
    isCartOpen,
    setIsCartOpen,
    handleViewDetails,
    handleAddToFavorites,
    handleSearchSubmit,
  }
}
