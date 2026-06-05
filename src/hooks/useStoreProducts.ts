import { useState, useEffect, useMemo, useRef, useCallback } from 'react'
import { api } from '@/lib/api'
import { Product } from '@/types/product'
import { StoreProductsParams, UseStoreProductsReturn } from '@/types/store'

export function useStoreProducts(params: StoreProductsParams): UseStoreProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [isFetchingMore, setIsFetchingMore] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loadMoreError, setLoadMoreError] = useState<string | null>(null)
  const [meta, setMeta] = useState<UseStoreProductsReturn['meta']>(null)
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [currentParams, setCurrentParams] = useState(params)
  const paramsRef = useRef(currentParams)

  useEffect(() => {
    paramsRef.current = currentParams
  }, [currentParams])

  // Sincroniza mudanças nos params vindos do componente (busca, categoria, ordenação)
  const incomingKey = useMemo(() => JSON.stringify(params), [params])
  useEffect(() => {
    setCurrentParams((prev) => (JSON.stringify(prev) === incomingKey ? prev : params))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingKey])

  const paramsKey = useMemo(() => JSON.stringify(currentParams), [currentParams])

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
    if (p.color) q.append('color', p.color)
    if (p.size) q.append('size', p.size)
    if (p.max_price) q.append('max_price', p.max_price.toString())
    if (p.min_price) q.append('min_price', p.min_price.toString())
    if (p.category_id) q.append('category_id', p.category_id.toString())
    if (p.niche_id) q.append('niche_id', p.niche_id.toString())
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

  const fetchProducts = async () => {
    const p = paramsRef.current
    if (!p.slug) return

    setLoading(true)
    setError(null)
    setNextCursor(null)

    try {
      const response = await api.get<{ data: Product[]; nextCursor?: number | null; meta?: UseStoreProductsReturn['meta'] }>(
        `/catalog/store/${p.slug}/products?${buildQuery(p).toString()}`,
      )
      const data = response.data
      setProducts(Array.isArray(data?.data) ? data.data : [])
      setMeta(data?.meta || null)
      setNextCursor(data?.nextCursor ?? null)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos')
      setProducts([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  const loadMore = useCallback(async () => {
    const p = paramsRef.current
    if (!p.slug || nextCursor === null || isFetchingMore) return

    setIsFetchingMore(true)
    setLoadMoreError(null)
    try {
      const response = await api.get<{ data: Product[]; nextCursor?: number | null }>(
        `/catalog/store/${p.slug}/products?${buildQuery(p, nextCursor).toString()}`,
      )
      const data = response.data
      setProducts((prev) => [...prev, ...(Array.isArray(data?.data) ? data.data : [])])
      setNextCursor(data?.nextCursor ?? null)
    } catch (err: any) {
      setLoadMoreError(err.response?.data?.message || 'Erro ao carregar mais produtos')
    } finally {
      setIsFetchingMore(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextCursor, isFetchingMore])

  useEffect(() => {
    fetchProducts()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  const updateParams = (newParams: Partial<StoreProductsParams>) => {
    setCurrentParams((prev) => ({ ...prev, ...newParams }))
  }

  return {
    products: Array.isArray(products) ? products : [],
    loading,
    isFetchingMore,
    error,
    loadMoreError,
    meta,
    nextCursor,
    refetch: fetchProducts,
    updateParams,
    loadMore,
  }
}
