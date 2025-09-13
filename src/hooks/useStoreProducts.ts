import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { Product, ProductsResponse } from '@/types/product'

interface StoreProductsParams {
  slug: string
  page?: number
  limit?: number
  sort?: 'ASC' | 'DESC'
  sort_field?: string
  featured?: boolean
  color?: string
  size?: string
  max_price?: number
  min_price?: number
  category_id?: number
  search?: string
}

interface UseStoreProductsReturn {
  products: Product[]
  loading: boolean
  error: string | null
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  } | null
  refetch: () => void
  updateParams: (newParams: Partial<StoreProductsParams>) => void
}

export function useStoreProducts(params: StoreProductsParams): UseStoreProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<UseStoreProductsReturn['meta']>(null)
  const [currentParams, setCurrentParams] = useState(params)

  const fetchProducts = async () => {
    if (!currentParams.slug) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (currentParams.page) queryParams.append('page', currentParams.page.toString())
      if (currentParams.limit) queryParams.append('limit', currentParams.limit.toString())
      if (currentParams.sort) queryParams.append('sort', currentParams.sort)
      if (currentParams.sort_field) queryParams.append('sort_field', currentParams.sort_field)
      if (currentParams.featured !== undefined) queryParams.append('featured', currentParams.featured.toString())
      if (currentParams.color) queryParams.append('color', currentParams.color)
      if (currentParams.size) queryParams.append('size', currentParams.size)
      if (currentParams.max_price) queryParams.append('max_price', currentParams.max_price.toString())
      if (currentParams.min_price) queryParams.append('min_price', currentParams.min_price.toString())
      if (currentParams.category_id) queryParams.append('category_id', currentParams.category_id.toString())
      if (currentParams.search) queryParams.append('search', currentParams.search)

      const response = await api.get<ProductsResponse>(
        `/catalog/store/${currentParams.slug}/products?${queryParams.toString()}`
      )

      setProducts(response.data.data)
      setMeta(response.data.meta)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar produtos')
      setProducts([])
      setMeta(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchProducts()
  }, [currentParams])

  const refetch = () => {
    fetchProducts()
  }

  const updateParams = (newParams: Partial<StoreProductsParams>) => {
    setCurrentParams(prev => ({ ...prev, ...newParams }))
  }

  return {
    products,
    loading,
    error,
    meta,
    refetch,
    updateParams
  }
}
