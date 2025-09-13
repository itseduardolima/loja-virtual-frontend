import { useState, useEffect } from 'react'
import { api } from '@/lib/api'
import { StoreInfo, StoreInfoResponse, UseStoreInfoReturn } from '@/types/store'

export function useStoreInfo(slug: string): UseStoreInfoReturn {
  const [storeInfo, setStoreInfo] = useState<StoreInfo | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchStoreInfo = async () => {
    if (!slug) return

    setLoading(true)
    setError(null)

    try {
      const response = await api.get<StoreInfoResponse>(
        `/catalog/store/${slug}`
      )

      setStoreInfo(response.data.data)
    } catch (err: any) {
      setError(err.response?.data?.message || 'Erro ao carregar informações da loja')
      setStoreInfo(null)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStoreInfo()
  }, [slug])

  const refetch = () => {
    fetchStoreInfo()
  }

  return {
    storeInfo,
    loading,
    error,
    refetch
  }
}
