import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useMemo } from 'react'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import { CartItem, CartResponse, AddToCartResponse } from '@/types/cart'

export function useCart(storeId?: number) {
  const { toast } = useToastContext()
  const queryClient = useQueryClient()

  // Buscar ou criar sessão do carrinho
  const { data: sessionId } = useQuery({
    queryKey: ['cart-session', storeId],
    queryFn: async () => {
      if (!storeId) throw new Error('ID da loja é obrigatório')
      
      const storedSessionId = localStorage.getItem(`cart-session-${storeId}`)
      
      if (storedSessionId) {
        try {
          await api.get('/cart', {
            params: { session_id: storedSessionId, store_id: storeId }
          })
          return storedSessionId
        } catch {
          localStorage.removeItem(`cart-session-${storeId}`)
        }
      }
      
      const response = await api.post('/cart/session', {}, {
        params: { store_id: storeId }
      })
      
      const newSessionId = response.data.data.session_id
      localStorage.setItem(`cart-session-${storeId}`, newSessionId)
      return newSessionId
    },
    enabled: !!storeId,
    staleTime: 1000 * 60 * 30,
  })

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

      const currentSessionId = localStorage.getItem(`cart-session-${finalStoreId}`) || sessionId
      if (!currentSessionId) throw new Error('Sessão do carrinho não encontrada')

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
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao adicionar produto ao carrinho'
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
    onError: () => {
      toast({
        title: 'Erro!',
        description: 'Erro ao remover produto do carrinho',
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
    onError: () => {
      toast({
        title: 'Erro!',
        description: 'Erro ao atualizar item do carrinho',
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
    onError: () => {
      toast({
        title: 'Erro!',
        description: 'Erro ao limpar carrinho',
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
