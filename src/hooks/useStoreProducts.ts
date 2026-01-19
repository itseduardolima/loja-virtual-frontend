import { useState, useEffect, useMemo, useRef } from 'react'
import { api } from '@/lib/api'
import { Product, ProductsResponse } from '@/types/product'
import { StoreProductsParams, UseStoreProductsReturn } from '@/types/store'

export function useStoreProducts(params: StoreProductsParams): UseStoreProductsReturn {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true) // Iniciar como true para mostrar loader na primeira renderização
  const [error, setError] = useState<string | null>(null)
  const [meta, setMeta] = useState<UseStoreProductsReturn['meta']>(null)
  const [currentParams, setCurrentParams] = useState(params)
  const paramsRef = useRef(currentParams)

  // Atualiza a ref quando os params mudam
  useEffect(() => {
    paramsRef.current = currentParams
  }, [currentParams])

  // Serializa os params para comparação
  const paramsKey = useMemo(() => {
    return JSON.stringify(currentParams)
  }, [currentParams])

  const fetchProducts = async () => {
    const params = paramsRef.current
    if (!params.slug) return

    setLoading(true)
    setError(null)

    try {
      const queryParams = new URLSearchParams()
      
      if (params.page) queryParams.append('page', params.page.toString())
      if (params.limit) queryParams.append('limit', params.limit.toString())
      if (params.sort) queryParams.append('sort', params.sort)
      if (params.sort_field) queryParams.append('sort_field', params.sort_field)
      if (params.featured !== undefined && params.featured) {
        queryParams.append('featured', 'true')
      }
      if (params.color) queryParams.append('color', params.color)
      if (params.size) queryParams.append('size', params.size)
      if (params.max_price) queryParams.append('max_price', params.max_price.toString())
      if (params.min_price) queryParams.append('min_price', params.min_price.toString())
      if (params.category_id) queryParams.append('category_id', params.category_id.toString())
      if (params.search) queryParams.append('search', params.search)
      if (params.dynamic_filters) {
        // Enviar dynamic_filters como string JSON na query string
        const filtersString = typeof params.dynamic_filters === 'string' 
          ? params.dynamic_filters 
          : JSON.stringify(params.dynamic_filters)
        queryParams.append('dynamic_filters', filtersString)
      }

      const response = await api.get<ProductsResponse>(
        `/catalog/store/${params.slug}/products?${queryParams.toString()}`
      )

      setProducts(Array.isArray(response.data?.data) ? response.data.data : [])
      setMeta(response.data?.meta || null)
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [paramsKey])

  const refetch = () => {
    fetchProducts()
  }

  const updateParams = (newParams: Partial<StoreProductsParams>) => {
    setCurrentParams(prev => ({ ...prev, ...newParams }))
  }

  return {
    products: Array.isArray(products) ? products : [],
    loading,
    error,
    meta,
    refetch,
    updateParams
  }
}
