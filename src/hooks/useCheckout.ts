import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import { useAuth } from '@/contexts/AuthContext'
import { useRouter } from 'next/navigation'

interface CheckoutRequest {
  customer_name: string
  customer_email: string
  customer_phone?: string
  customer_document?: string
  notes?: string
  coupon_code?: string
  delivery_address?: string
}

interface CheckoutResponse {
  data: {
    order: {
      id: number
      code?: string
      order_code?: string
      customer_name: string
      customer_phone: string
      customer_email: string
      notes: string
      coupon_code?: string
      coupon_discount?: string
      created_at: string
    }
    items: Array<{
      id: number
      quantity: number
      price: string
      size: string
      color: string
      notes: string
      created_at: string
      order_id: number
      product_id: number
    }>
    whatsapp_link: string
  }
  message: string
}

export function useCheckout() {
  const { toast } = useToastContext()
  const { isAuthenticated } = useAuth()
  const router = useRouter()
  const queryClient = useQueryClient()

  const checkoutMutation = useMutation({
    mutationFn: async ({
      sessionId,
      storeId,
      checkoutData,
    }: {
      sessionId: string
      storeId: number
      checkoutData: CheckoutRequest
      storeSlug?: string
    }) => {
      const response = await api.post<CheckoutResponse>('/cart/checkout', checkoutData, {
        params: {
          session_id: sessionId,
          store_id: storeId,
        },
      })
      return response.data
    },
    onSuccess: (data, variables) => {
      const storeSlug = variables.storeSlug
      const orderCode = data.data?.order?.order_code ?? data.data?.order?.code ?? ''

      toast({
        title: 'Pedido criado com sucesso!',
        description: data.message,
        variant: 'success',
      })

      // Abre WhatsApp em nova aba
      if (data.data?.whatsapp_link) {
        window.open(data.data.whatsapp_link, '_blank')
      }

      // Limpa sessão do carrinho antes de redirecionar para que a página de sucesso não encontre sessão antiga
      localStorage.removeItem(`cart-session-${variables.storeId}`)
      queryClient.invalidateQueries({ queryKey: ['cart-items'] })
      queryClient.invalidateQueries({ queryKey: ['cart-session', variables.storeId] })

      // Redireciona para a página de pedido realizado com sucesso
      if (storeSlug) {
        const params = new URLSearchParams()
        if (orderCode) params.set('codigo', orderCode)
        router.push(`/loja/${storeSlug}/pedido-sucesso?${params.toString()}`)
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao finalizar pedido'
      toast({
        title: 'Erro!',
        description: errorMessage,
        variant: 'destructive'
      })
    }
  })

  // Guest checkout: não exige login — qualquer pessoa pode finalizar pedido com nome/email/telefone
  const handleCheckout = async (sessionId: string, storeId: number, checkoutData: CheckoutRequest, storeSlug?: string) => {
    await checkoutMutation.mutateAsync({ sessionId, storeId, checkoutData, storeSlug })
  }

  const getCheckoutData = () => {
    const stored = localStorage.getItem('checkout-data')
    if (stored) {
      try {
        return JSON.parse(stored)
      } catch {
        return null
      }
    }
    return null
  }

  const clearCheckoutData = () => {
    localStorage.removeItem('checkout-data')
  }

  return {
    checkout: handleCheckout,
    isCheckoutLoading: checkoutMutation.isPending,
    getCheckoutData,
    clearCheckoutData,
    isAuthenticated
  }
}
