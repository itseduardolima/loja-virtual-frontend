'use client'

import { useMutation, useQueryClient } from '@tanstack/react-query'
import type { AxiosError } from 'axios'
import { api } from '@/lib/api'

/**
 * Cancelamento de pedido sem login.
 *
 * O checkout da vitrine é 100% convidado (nenhum pedido exige conta), então o
 * caminho autenticado (`PATCH /customers/orders/:id/cancel`, que filtra por
 * `user_id`) nunca encontra o pedido de quem comprou como visitante. Aqui a
 * posse é provada pelo par código do pedido + telefone usado na compra, contra
 * `POST /orders/public/:code/cancel-request` (rota pública, 5 req/min por IP).
 */

/** Pedido Pendente é cancelado na hora; Confirmado vira solicitação a aprovar. */
export type PublicCancelType = 'cancelled' | 'requested'

export interface PublicCancelOrderPayload {
  /** order_code do pedido (o mesmo usado no rastreio). */
  code: string
  /** Telefone informado na compra — com ou sem máscara. */
  customer_phone: string
  /** Motivo do cancelamento (opcional para a API, exigido pela nossa UI). */
  reason?: string
}

export interface PublicCancelOrderResponse {
  data: {
    order_code: string
    status: number
    cancellation_requested: number
  }
  message: string
  type: PublicCancelType
}

/** Status de pedido que ainda admitem cancelamento pelo cliente. */
export const CANCELABLE_ORDER_STATUSES = [1, 2] as const

/**
 * Traduz a falha da API para uma frase única em PT-BR.
 *
 * O backend já devolve mensagens prontas em PT-BR (telefone que não bate,
 * pedido enviado/entregue/cancelado, solicitação duplicada), então elas passam
 * direto. Os fallbacks cobrem 429, rede fora e erro sem corpo.
 */
export function mapPublicCancelError(error: unknown): string | null {
  if (!error) return null

  const axiosError = error as AxiosError<{ message?: string | string[] }>
  const status = axiosError.response?.status

  if (status === 429) {
    return 'Muitas tentativas seguidas. Aguarde um minuto e tente novamente.'
  }

  const raw = axiosError.response?.data?.message
  const apiMessage = Array.isArray(raw) ? raw[0] : raw
  if (typeof apiMessage === 'string' && apiMessage.trim()) return apiMessage

  if (status === 404) {
    return 'Pedido não encontrado. Confira o código do pedido e o telefone usado na compra.'
  }
  if (!axiosError.response) {
    return 'Não conseguimos falar com o servidor. Verifique sua conexão e tente novamente.'
  }
  return 'Não foi possível enviar sua solicitação agora. Tente novamente em alguns instantes.'
}

/**
 * O backend recusa a segunda solicitação do mesmo pedido com 400
 * ('Já existe uma solicitação de cancelamento pendente para este pedido.').
 * Isso não é um erro do ponto de vista do cliente: significa que a solicitação
 * dele está de pé, aguardando a loja — então a tela mostra o painel de espera
 * em vez de um erro seco. Se a mensagem mudar no backend, o fallback é
 * continuar exibindo o texto de erro normalmente.
 */
export function isAlreadyRequestedError(error: unknown): boolean {
  const axiosError = error as AxiosError<{ message?: string | string[] }>
  if (axiosError?.response?.status !== 400) return false

  const raw = axiosError.response?.data?.message
  const message = Array.isArray(raw) ? raw[0] : raw
  return typeof message === 'string' && message.toLowerCase().includes('cancelamento pendente')
}

export function usePublicCancelOrder() {
  const queryClient = useQueryClient()

  const mutation = useMutation<PublicCancelOrderResponse, unknown, PublicCancelOrderPayload>({
    mutationFn: async ({ code, customer_phone, reason }) => {
      const response = await api.post<PublicCancelOrderResponse>(
        `/orders/public/${encodeURIComponent(code)}/cancel-request`,
        { customer_phone, ...(reason ? { reason } : {}) },
      )
      return response.data
    },
    onSuccess: () => {
      // Pendente vira Cancelado no banco: o rastreio precisa refletir na hora.
      // Invalida por prefixo porque a chave do rastreio guarda o código exatamente
      // como o cliente digitou (o backend normaliza para maiúsculas).
      queryClient.invalidateQueries({ queryKey: ['track-order'] })
    },
  })

  return {
    ...mutation,
    errorMessage: mapPublicCancelError(mutation.error),
  }
}
