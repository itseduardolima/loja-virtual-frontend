import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import { CartItem, CartResponse, AddToCartResponse } from '@/types/cart'

// Promessas de criação de sessão em andamento, por loja. Deduplica chamadas
// concorrentes de ensureSession: sem isto, dois "adicionar ao carrinho" disparados
// em paralelo (sem sessão ainda) criavam DUAS sessões e o item da primeira ficava
// órfão, sumindo da sacola (bug B3).
const sessionCreationPromises = new Map<number, Promise<string>>()

export function useCart(storeId?: number) {
  const { toast } = useToastContext()
  const queryClient = useQueryClient()

  // Recuperar sessão existente do localStorage (não cria nova aqui)
  const { data: sessionId, refetch: refetchSession } = useQuery({
    queryKey: ['cart-session', storeId],
    queryFn: async () => {
      if (!storeId) return null

      const storedSessionId = localStorage.getItem(`cart-session-${storeId}`)
      if (!storedSessionId) return null

      try {
        await api.get('/cart', {
          params: { session_id: storedSessionId, store_id: storeId }
        })
        return storedSessionId
      } catch {
        localStorage.removeItem(`cart-session-${storeId}`)
        return null
      }
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 30,
  })

  // Cria sessão no backend e salva no localStorage
  const ensureSession = async (finalStoreId: number): Promise<string> => {
    const stored = localStorage.getItem(`cart-session-${finalStoreId}`)
    if (stored) return stored

    // Se já há uma criação em andamento para esta loja, reaproveita a mesma
    // promessa em vez de criar outra sessão (dedupe da race — bug B3).
    const inFlight = sessionCreationPromises.get(finalStoreId)
    if (inFlight) return inFlight

    const promise = (async () => {
      const response = await api.post('/cart/session', {}, {
        params: { store_id: finalStoreId }
      })
      const newSessionId = response.data.data.session_id
      localStorage.setItem(`cart-session-${finalStoreId}`, newSessionId)
      return newSessionId
    })().finally(() => {
      sessionCreationPromises.delete(finalStoreId)
    })

    sessionCreationPromises.set(finalStoreId, promise)
    return promise
  }

  // Buscar itens do carrinho
  const { data: cartItems = [], isLoading: isLoadingCart } = useQuery({
    queryKey: ['cart-items', sessionId, storeId],
    queryFn: async (): Promise<CartItem[]> => {
      if (!sessionId || !storeId) return []
      
      const response = await api.get<CartResponse>('/cart', {
        params: { session_id: sessionId, store_id: storeId }
      })
      
      return response.data.data.items || []
    },
    enabled: !!sessionId && !!storeId,
    staleTime: 60000,
  })

  // Adicionar item ao carrinho
  const addToCartMutation = useMutation({
    mutationFn: async ({ 
      productId, 
      quantity, 
      size = '', 
      color = '', 
      notes = '',
      storeId: paramStoreId
    }: {
      productId: number
      quantity: number
      size?: string
      color?: string
      notes?: string
      storeId?: number
    }) => {
      const finalStoreId = paramStoreId || storeId
      if (!finalStoreId) throw new Error('ID da loja é obrigatório')

      const currentSessionId = await ensureSession(finalStoreId)

      const response = await api.post<AddToCartResponse>('/cart', {
        product_id: productId,
        quantity,
        size,
        color,
        notes
      }, {
        params: { session_id: currentSessionId, store_id: finalStoreId }
      })
      
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-session', storeId] })
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage =
        axiosError.response?.data?.message || error.message || 'Erro ao adicionar produto ao carrinho'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Remover item do carrinho
  const removeFromCartMutation = useMutation({
    mutationFn: async (itemId: number) => {
      if (!sessionId) throw new Error('Sessão do carrinho não disponível')
      if (!storeId) throw new Error('ID da loja é obrigatório')
      
      await api.delete(`/cart/item/${itemId}`, {
        params: { 
          session_id: sessionId,
          store_id: storeId
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage =
        axiosError.response?.data?.message || error.message || 'Erro ao remover produto do carrinho'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Atualizar item do carrinho
  const updateCartItemMutation = useMutation({
    mutationFn: async ({ 
      itemId, 
      quantity, 
      size, 
      color, 
      notes 
    }: { 
      itemId: number
      quantity?: number
      size?: string
      color?: string
      notes?: string
    }) => {
      if (!sessionId) throw new Error('Sessão do carrinho não disponível')
      if (!storeId) throw new Error('ID da loja é obrigatório')
      
      await api.patch(`/cart/item/${itemId}`, {
        quantity, size, color, notes
      }, {
        params: { 
          session_id: sessionId,
          store_id: storeId
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage =
        axiosError.response?.data?.message || error.message || 'Erro ao atualizar item do carrinho'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Limpar carrinho
  const clearCartMutation = useMutation({
    mutationFn: async () => {
      if (!sessionId) throw new Error('Sessão do carrinho não disponível')
      if (!storeId) throw new Error('ID da loja é obrigatório')
      
      await api.delete('/cart/clear', {
        params: { 
          session_id: sessionId,
          store_id: storeId
        }
      })
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
    },
    onError: (error: Error) => {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage =
        axiosError.response?.data?.message || error.message || 'Erro ao limpar carrinho'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Calcular totais
  const totalItems = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.quantity, 0)
  }, [cartItems])

  const totalPrice = useMemo(() => {
    return cartItems.reduce((sum, item) => sum + item.subtotal, 0)
  }, [cartItems])

  // Função para limpar sessão do localStorage
  const clearStoredSession = () => {
    if (storeId) {
      localStorage.removeItem(`cart-session-${storeId}`)
    }
  }

  return {
    cartItems,
    sessionId,
    totalItems,
    totalPrice,
    isLoadingCart,
    addToCart: addToCartMutation.mutate,
    removeFromCart: removeFromCartMutation.mutate,
    updateCartItem: updateCartItemMutation.mutate,
    clearCart: clearCartMutation.mutate,
    clearStoredSession,
    isAddingToCart: addToCartMutation.isPending,
    isRemovingFromCart: removeFromCartMutation.isPending,
    isUpdatingCartItem: updateCartItemMutation.isPending,
    isClearingCart: clearCartMutation.isPending
  }
}
