'use client'

import { useState, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useStoreInfo } from '@/hooks/useStoreInfo'
import { useStoreCategories } from '@/hooks/useStoreCategories'
import { useStoreProducts } from '@/hooks/useStoreProducts'
import { useWishlist } from '@/hooks/useWishlist'
import { useCart } from '@/hooks/useCart'
import { useDebounce } from '@/hooks/useDebounce'
import { Product } from '@/types/product'
import type { StoreCategory, StoreInfo, CollectionSort, CollectionView } from '@/types/store'

const MAX_CATEGORIES = 5

const SORT_TO_PARAMS: Record<CollectionSort, { sort: 'ASC' | 'DESC'; sort_field: string }> = {
  relevancia: { sort: 'DESC', sort_field: 'created_at' },
  menor: { sort: 'ASC', sort_field: 'price' },
  maior: { sort: 'DESC', sort_field: 'price' },
  avaliados: { sort: 'DESC', sort_field: 'average_rating' },
}

export interface UseStoreHomePageReturn {
  slug: string
  storeInfo: StoreInfo | null
  storeError: string | null
  categoriesToShow: StoreCategory[]
  products: Product[]
  featuredProducts: Product[]
  newProducts: Product[]
  promoProducts: Product[]
  showcaseProduct: Product | null
  loading: boolean
  productsLoading: boolean
  search: string
  setSearch: (value: string) => void
  sort: CollectionSort
  setSort: (sort: CollectionSort) => void
  view: CollectionView
  setView: (view: CollectionView) => void
  activeCategory: string
  setActiveCategory: (cat: string) => void
  isCartOpen: boolean
  setIsCartOpen: (open: boolean) => void
  openProduct: (product: Product) => void
  quickAdd: (product: Product) => void
  toggleWishlist: (product: Product) => void
  isWished: (productId: number) => boolean
  handleSearchSubmit: (value: string) => void
}

export function useStoreHomePage(slug: string): UseStoreHomePageReturn {
  const router = useRouter()
  const [isCartOpen, setIsCartOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [sort, setSort] = useState<CollectionSort>('relevancia')
  const [view, setView] = useState<CollectionView>('grid')
  const [activeCategory, setActiveCategory] = useState('Todos')
  const debouncedSearch = useDebounce(search, 500)

  const { storeInfo, loading: storeLoading, error: storeError } = useStoreInfo(slug)
  const { categories: allCategories, loading: categoriesLoading } = useStoreCategories(slug)
  const { isInWishlist, toggleWishlist: toggleWishlistId } = useWishlist()
  const { addToCart } = useCart(storeInfo?.id)

  const sortParams = SORT_TO_PARAMS[sort]
  const categoryId = useMemo(() => {
    if (activeCategory === 'Todos') return undefined
    return (allCategories ?? []).find((c: StoreCategory) => c.name === activeCategory)?.id
  }, [activeCategory, allCategories])

  // Coleção principal (busca, categoria e ordenação reais no backend)
  const { products, loading: productsLoading } = useStoreProducts({
    slug,
    page: 1,
    limit: 24,
    sort: sortParams.sort,
    sort_field: sortParams.sort_field,
    search: debouncedSearch || undefined,
    category_id: categoryId,
  })

  // Destaques (1º vira o showcase do hero)
  const { products: featuredRaw } = useStoreProducts({
    slug,
    page: 1,
    limit: 8,
    featured: true,
    sort: 'DESC',
    sort_field: 'created_at',
  })

  // Novidades — mais recentes
  const { products: newRaw } = useStoreProducts({
    slug,
    page: 1,
    limit: 8,
    sort: 'DESC',
    sort_field: 'created_at',
  })

  // Ofertas — promoção ativa
  const { products: promoRaw } = useStoreProducts({
    slug,
    page: 1,
    limit: 8,
    promo: true,
    sort: 'DESC',
    sort_field: 'created_at',
  })

  const categoriesToShow = useMemo(() => {
    const list = allCategories || []
    const hasCount = list.some((c: StoreCategory) => c._count != null)
    const withProducts = hasCount
      ? list.filter((c: StoreCategory) => (c._count?.products ?? 0) >= 1)
      : list
    return withProducts.slice(0, MAX_CATEGORIES)
  }, [allCategories])

  const featuredProducts = featuredRaw ?? []
  const newProducts = newRaw ?? []
  const promoProducts = promoRaw ?? []
  const showcaseProduct = featuredProducts[0] ?? newProducts[0] ?? null

  const openProduct = (product: Product) => {
    router.push(`/loja/${slug}/produto/${product.id}`)
  }

  // Quick-add: apenas produtos sem variação (validado no card)
  const quickAdd = (product: Product) => {
    addToCart({
      productId: product.id,
      quantity: 1,
      size: '',
      color: '',
      notes: '',
      storeId: product.store_id ?? storeInfo?.id,
    })
    setIsCartOpen(true)
  }

  const toggleWishlist = (product: Product) => toggleWishlistId(product.id)

  const handleSearchSubmit = (value: string) => {
    setSearch(value)
  }

  return {
    slug,
    storeInfo,
    storeError: storeError ?? null,
    categoriesToShow,
    products,
    featuredProducts,
    newProducts,
    promoProducts,
    showcaseProduct,
    loading: storeLoading || categoriesLoading,
    productsLoading,
    search,
    setSearch,
    sort,
    setSort,
    view,
    setView,
    activeCategory,
    setActiveCategory,
    isCartOpen,
    setIsCartOpen,
    openProduct,
    quickAdd,
    toggleWishlist,
    isWished: isInWishlist,
    handleSearchSubmit,
  }
}
