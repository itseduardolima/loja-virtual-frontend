import { useState, useEffect, useMemo, useCallback } from 'react'
import { useInfiniteQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Product } from '@/types/product'
import { StoreProductsParams, UseStoreProductsReturn } from '@/types/store'

interface PageResult {
  data: Product[]
  nextCursor?: number | null
  meta?: UseStoreProductsReturn['meta']
}

const buildQuery = (p: StoreProductsParams, cursorOverride?: number): URLSearchParams => {
  const q = new URLSearchParams()
  if (cursorOverride !== undefined) {
    q.append('cursor', cursorOverride.toString())
  } else if (p.cursor !== undefined) {
    q.append('cursor', p.cursor.toString())
  } else if (p.page) {
    q.append('page', p.page.toString())
  }
  if (p.limit) q.append('limit', p.limit.toString())
  if (p.sort) q.append('sort', p.sort)
  if (p.sort_field) q.append('sort_field', p.sort_field)
  if (p.featured) q.append('featured', 'true')
  if (p.promo) q.append('promo', 'true')
  if (p.max_price) q.append('max_price', p.max_price.toString())
  if (p.min_price) q.append('min_price', p.min_price.toString())
  if (p.category_id) q.append('category_id', p.category_id.toString())
  if (p.category_ids && p.category_ids.length > 0)
    q.append('category_ids', p.category_ids.join(','))
  if (p.search) q.append('search', p.search)
  if (p.min_rating) q.append('min_rating', p.min_rating.toString())
  if (p.dynamic_filters) {
    q.append(
      'dynamic_filters',
      typeof p.dynamic_filters === 'string' ? p.dynamic_filters : JSON.stringify(p.dynamic_filters),
    )
  }
  return q
}

export function useStoreProducts(params: StoreProductsParams): UseStoreProductsReturn {
  const [currentParams, setCurrentParams] = useState<StoreProductsParams>(params)

  // Sincroniza mudanças nos params vindos do componente (busca, categoria, ordenação)
  const incomingKey = useMemo(() => JSON.stringify(params), [params])
  useEffect(() => {
    setCurrentParams((prev) => (JSON.stringify(prev) === incomingKey ? prev : params))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingKey])

  const { slug } = currentParams

  const paramsKey = useMemo(() => {
    const { slug: _ignored, ...rest } = currentParams
    return JSON.stringify(rest)
  }, [currentParams])

  const {
    data,
    isLoading,
    isFetchingNextPage,
    isFetchNextPageError,
    error,
    fetchNextPage,
    hasNextPage,
    refetch,
  } = useInfiniteQuery<PageResult, Error>({
    queryKey: ['store-products', slug, paramsKey],
    queryFn: async ({ pageParam }) => {
      const cursorOverride = pageParam as number | undefined
      const response = await api.get<PageResult>(
        `/catalog/store/${slug}/products?${buildQuery(currentParams, cursorOverride).toString()}`,
      )
      const d = response.data
      return {
        data: Array.isArray(d?.data) ? d.data : [],
        nextCursor: d?.nextCursor ?? null,
        meta: d?.meta ?? null,
      }
    },
    initialPageParam: undefined as number | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? null,
    enabled: !!slug,
    staleTime: 60 * 1000,
    // retry herdado do QueryProvider (3x, sem retry em 401)
  })

  const pages = useMemo(() => data?.pages ?? [], [data?.pages])
  const products = useMemo(() => pages.flatMap((p) => p.data), [pages])
  const meta = pages[0]?.meta ?? null
  const lastPage = pages[pages.length - 1]
  const nextCursor = lastPage?.nextCursor ?? null

  const errorMessage =
    !isFetchNextPageError && error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Erro ao carregar produtos'
      : null

  const loadMoreErrorMessage =
    isFetchNextPageError && error
      ? (error as { response?: { data?: { message?: string } } }).response?.data?.message ||
        'Erro ao carregar mais produtos'
      : null

  const loadMore = useCallback(() => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage()
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage])

  const updateParams = useCallback((newParams: Partial<StoreProductsParams>) => {
    setCurrentParams((prev) => ({ ...prev, ...newParams }))
  }, [])

  return {
    products,
    loading: isLoading,
    isFetchingMore: isFetchingNextPage,
    error: errorMessage,
    loadMoreError: loadMoreErrorMessage,
    meta,
    nextCursor,
    refetch: () => {
      refetch()
    },
    updateParams,
    loadMore,
  }
}
