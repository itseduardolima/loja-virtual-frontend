import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import toast from 'react-hot-toast'
import type {
  Subscription,
  Payment,
  CreateSubscriptionRequest,
  CreateSubscriptionResponse,
  ChangePlanRequest,
  ChangePlanResponse,
  BillingCycle,
} from '@/types/subscription'

// ---------------------------------------------------------------------------
// Shared interfaces
// ---------------------------------------------------------------------------

interface MySubscriptionResponse {
  data: Subscription
}

interface SubscriptionPaymentsResponse {
  data: Payment[]
  pagination: {
    page: number
    limit: number
    total: number
    totalPages: number
  }
}

interface CancelSubscriptionResponse {
  message: string
}

interface RefundSubscriptionResponse {
  message: string
}

interface PaymentLinkResponse {
  invoice_url: string | null
  bank_slip_url: string | null
  qr_code: string | null
  billing_type: string | null
  due_date: string | null
}

export type PreviewChangePlanResponse =
  | {
      kind: 'upgrade'
      proration_amount: number
      days_remaining: number
      total_days: number
      old_plan: string
      new_plan: string
      current_price: number
      new_price: number
      next_full_charge_at: string
    }
  | {
      kind: 'downgrade' | 'cycle'
      effective_at: string
      new_plan: string
      new_cycle: BillingCycle
      new_price: number
    }

// ---------------------------------------------------------------------------
// Queries
// ---------------------------------------------------------------------------

interface UseMySubscriptionOptions {
  enabled?: boolean
  refetchInterval?: number | false
}

export function useMySubscription(options: UseMySubscriptionOptions = {}) {
  const { enabled = true, refetchInterval = false } = options

  return useQuery<Subscription>({
    queryKey: ['subscription', 'me'],
    queryFn: async () => {
      const response = await api.get('/subscriptions/me')

      // Se a resposta já é a Subscription diretamente (tem id e status)
      if (response.data && 'id' in response.data && 'status' in response.data) {
        return response.data as Subscription
      }

      // Se a resposta tem wrapper data
      if (response.data && 'data' in response.data && response.data.data) {
        return response.data.data as Subscription
      }

      // Fallback: tenta usar a resposta diretamente
      return response.data as Subscription
    },
    retry: 1,
    staleTime: 0, // Sempre considera stale para permitir refetch
    enabled,
    refetchInterval, // Polling automático
  })
}

export function useSubscriptionPayments({
  page,
  limit = 10,
  enabled = true,
}: {
  page: number
  limit?: number
  enabled?: boolean
}) {
  return useQuery<SubscriptionPaymentsResponse>({
    queryKey: ['subscription', 'payments', page, limit],
    queryFn: async () => {
      const response = await api.get('/subscriptions/payments', {
        params: { page, limit },
      })
      return response.data
    },
    enabled,
    staleTime: 30 * 1000,
  })
}

// ---------------------------------------------------------------------------
// Mutations
// ---------------------------------------------------------------------------

export function useCancelSubscription() {
  const queryClient = useQueryClient()

  return useMutation<CancelSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.delete<CancelSubscriptionResponse>('/subscriptions')
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Assinatura cancelada com sucesso')
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao cancelar assinatura'
      toast.error(errorMessage)
    },
  })
}

export function useRenewSubscription() {
  const queryClient = useQueryClient()

  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CreateSubscriptionResponse>('/subscriptions/renew', data)
      return response.data
    },
    onSuccess: (data) => {
      toast.success('Assinatura renovada com sucesso!')
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })

      // Se há URL de pagamento, abrir em nova aba
      if (data.payment_url) {
        window.open(data.payment_url, '_blank')
        toast.success('Redirecionando para pagamento...', { duration: 3000 })
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao renovar assinatura'
      toast.error(errorMessage)
    },
  })
}

export function useRefundSubscription() {
  const queryClient = useQueryClient()

  return useMutation<RefundSubscriptionResponse, Error>({
    mutationFn: async () => {
      const response = await api.post<RefundSubscriptionResponse>('/subscriptions/refund')
      return response.data
    },
    onSuccess: (data) => {
      toast.success(data.message || 'Reembolso solicitado com sucesso')
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao solicitar reembolso'
      toast.error(errorMessage)
    },
  })
}

export function useChangePlan() {
  const queryClient = useQueryClient()

  return useMutation<ChangePlanResponse, Error, ChangePlanRequest>({
    mutationFn: async (data) => {
      const response = await api.post<ChangePlanResponse>('/subscriptions/change-plan', data)
      return response.data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })

      if ('scheduled' in data && data.scheduled) {
        toast.success(data.message || 'Troca de plano agendada!')
        return
      }

      // Upgrade com proração: o plano novo só fica ativo após pagamento confirmado.
      // Não dizer "alterado com sucesso" — ainda está pendente.
      if ('payment_url' in data && data.payment_url) {
        toast.success(
          'Cobrança da diferença gerada. Pague para ativar o novo plano — abrindo link de pagamento...',
          { duration: 5000 },
        )
        window.open(data.payment_url, '_blank')
      } else {
        toast.success('Solicitação enviada.')
      }
    },
    onError: (error: any) => {
      const errorMessage = error.response?.data?.message || 'Erro ao trocar de plano'
      toast.error(errorMessage)
    },
  })
}

export function useCancelScheduledChange() {
  const queryClient = useQueryClient()

  return useMutation<{ message: string }, Error, void>({
    mutationFn: async () => {
      const response = await api.delete<{ message: string }>('/subscriptions/scheduled-change')
      return response.data
    },
    onSuccess: () => {
      toast.success('Troca agendada cancelada.')
      queryClient.invalidateQueries({ queryKey: ['subscription', 'me'] })
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao cancelar troca agendada')
    },
  })
}

export function useCreateSubscription() {
  return useMutation<CreateSubscriptionResponse, Error, CreateSubscriptionRequest>({
    mutationFn: async (data) => {
      const response = await api.post<CreateSubscriptionResponse>('/subscriptions', data)
      return response.data
    },
  })
}

export function usePreviewChangePlan() {
  return useMutation<PreviewChangePlanResponse, Error, ChangePlanRequest>({
    mutationFn: async (data) => {
      const response = await api.post<PreviewChangePlanResponse>(
        '/subscriptions/preview-change-plan',
        data,
      )
      return response.data
    },
    onError: (error) => {
      const axiosError = error as AxiosError<{ message?: string }>
      const errorMessage =
        axiosError.response?.data?.message || error.message || 'Erro ao pré-visualizar troca de plano'
      toast.error(errorMessage)
    },
  })
}

export function useGetPaymentLink() {
  return useMutation<PaymentLinkResponse, Error, string>({
    mutationFn: async (paymentId) => {
      const response = await api.get<PaymentLinkResponse>(
        `/subscriptions/payments/${paymentId}/link`,
      )
      return response.data
    },
    onSuccess: (data) => {
      const url = data.invoice_url || data.bank_slip_url
      if (url) {
        window.open(url, '_blank')
      } else {
        toast.error('Link de pagamento indisponível.')
      }
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erro ao buscar link de pagamento')
    },
  })
}
