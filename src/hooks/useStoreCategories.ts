import { useState, useEffect } from 'react'
import { api } from '@/lib/api'

interface StoreCategory {
  id: number
  name: string
  description: string
  _count: {
    products: number
  }
}

interface StoreCategoriesResponse {
  data: StoreCategory[]
}

interface UseStoreCategoriesReturn {
  categories: StoreCategory[]
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useStoreCategories(slug: string): UseStoreCategoriesReturn {
  const [categories, setCategories] = useState<StoreCategory[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchCategories = async () => {
    if (!slug) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.get<StoreCategoriesResponse>(
        `/catalog/store/${slug}/categories`
      )

      setCategories(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar categorias')
      setCategories([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchCategories()
  }, [slug])

  const refetch = () => {
    fetchCategories()
  }

  return {
    categories,
    loading,
    error,
    refetch
  }
}
