'use client'

import { useState, useEffect, useCallback } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

const LOCAL_STORAGE_KEY = 'wishlist'

function getLocalWishlist(): number[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem(LOCAL_STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function setLocalWishlist(ids: number[]): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(ids))
}

interface WishlistApiResponse {
  data: Array<{ product_id: number }>
}

export function useWishlist() {
  const { isAuthenticated } = useAuth()
  const queryClient = useQueryClient()

  // Estado local para usuários não logados
  const [localIds, setLocalIds] = useState<number[]>([])

  useEffect(() => {
    setLocalIds(getLocalWishlist())
  }, [])

  // Query para usuário logado
  const { data: apiData } = useQuery<WishlistApiResponse>({
    queryKey: ['customer-wishlist'],
    queryFn: async () => {
      const response = await api.get<WishlistApiResponse>('/customers/wishlist')
      return response.data
    },
    enabled: isAuthenticated,
    staleTime: 60000,
  })

  // Mutação: adicionar (logado)
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.post(`/customers/wishlist/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist'] })
    },
  })

  // Mutação: remover (logado)
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/customers/wishlist/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist'] })
    },
  })

  // IDs da wishlist
  const wishlistIds: number[] = isAuthenticated
    ? (apiData?.data?.map((item) => item.product_id) ?? [])
    : localIds

  const isInWishlist = useCallback(
    (productId: number): boolean => wishlistIds.includes(productId),
    [wishlistIds]
  )

  const toggleWishlist = useCallback(
    (productId: number) => {
      if (isAuthenticated) {
        if (isInWishlist(productId)) {
          removeMutation.mutate(productId)
        } else {
          addMutation.mutate(productId)
        }
      } else {
        // Modo localStorage
        setLocalIds((prev) => {
          const next = prev.includes(productId)
            ? prev.filter((id) => id !== productId)
            : [...prev, productId]
          setLocalWishlist(next)
          return next
        })
      }
    },
    [isAuthenticated, isInWishlist, addMutation, removeMutation]
  )

  return {
    wishlistIds,
    isInWishlist,
    toggleWishlist,
    isLoading: addMutation.isPending || removeMutation.isPending,
  }
}
