'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'

// Chave unica para a wishlist anonima. IDs de produto sao globalmente unicos
// (PRODUCT.id autoincrement), entao uma unica lista de ids funciona corretamente
// para isInWishlist(productId) mesmo entre lojas. Ao logar, esses ids sao mesclados
// no servidor (ver merge abaixo) para nao perder os favoritos do visitante (bug B8).
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

  // Merge local → servidor ao autenticar: sem isto, os favoritos marcados como
  // visitante eram silenciosamente descartados no login (a lista passava a vir só
  // do servidor). Roda uma única vez por transição para autenticado (bug B8).
  const mergedRef = useRef(false)
  useEffect(() => {
    if (!isAuthenticated) {
      mergedRef.current = false
      return
    }
    if (mergedRef.current) return
    const pending = getLocalWishlist()
    if (pending.length === 0) return
    mergedRef.current = true

    Promise.allSettled(
      pending.map((id) => api.post(`/customers/wishlist/${id}`)),
    ).finally(() => {
      setLocalWishlist([])
      setLocalIds([])
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist-items'] })
    })
  }, [isAuthenticated, queryClient])

  // Mutação: adicionar (logado)
  const addMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.post(`/customers/wishlist/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist-items'] })
    },
  })

  // Mutação: remover (logado)
  const removeMutation = useMutation({
    mutationFn: async (productId: number) => {
      await api.delete(`/customers/wishlist/${productId}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist'] })
      queryClient.invalidateQueries({ queryKey: ['customer-wishlist-items'] })
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
