'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTrackOrder, type TrackOrderStatusHistory } from '@/hooks/useTrackOrder'
import {
  usePublicCancelOrder,
  isAlreadyRequestedError,
  CANCELABLE_ORDER_STATUSES,
  type PublicCancelType,
} from './usePublicCancelOrder'

/**
 * Motivo pelo qual o pedido não pode ser cancelado por aqui — usado para
 * explicar ao cliente em vez de simplesmente esconder o botão.
 */
const BLOCKED_CANCEL_REASON: Record<number, string> = {
  3: 'Este pedido já foi enviado, então o cancelamento não pode mais ser feito por aqui. Fale com a loja para combinar a devolução.',
  4: 'Este pedido já foi entregue. Para trocas ou devoluções, fale direto com a loja.',
  5: 'Este pedido já está cancelado.',
}

export function useRastrearPage() {
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code')

  const [inputCode, setInputCode] = useState(codeFromUrl ?? '')
  const [searchCode, setSearchCode] = useState<string | null>(codeFromUrl ?? null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelResult, setCancelResult] = useState<PublicCancelType | null>(null)

  const { data, isLoading, error } = useTrackOrder(searchCode)
  const {
    mutate: cancelOrderMutate,
    isPending: isCancelling,
    errorMessage: cancelError,
    reset: resetCancelMutation,
  } = usePublicCancelOrder()

  const order = data?.data ?? null

  useEffect(() => {
    if (codeFromUrl) {
      setInputCode(codeFromUrl)
      setSearchCode(codeFromUrl)
    }
  }, [codeFromUrl])

  function handleSearch(e: React.FormEvent) {
    e.preventDefault()
    const trimmed = inputCode.trim().replace(/^#+/, '')
    if (trimmed) {
      setSearchCode(trimmed)
      setCancelResult(null)
      resetCancelMutation()
    }
  }

  function handleOpenCancelDialog() {
    resetCancelMutation()
    setShowCancelDialog(true)
  }

  function handleCloseCancelDialog() {
    setShowCancelDialog(false)
    resetCancelMutation()
  }

  /**
   * Envia o cancelamento pela rota pública: o telefone da compra é a prova de
   * posse do pedido, então não exige login (o checkout é de convidado).
   */
  function handleConfirmCancel({ phone, reason }: { phone: string; reason: string }) {
    const code = order?.order_code ?? searchCode
    if (!code || !phone.trim()) return

    function resolveWith(result: PublicCancelType) {
      setShowCancelDialog(false)
      setCancelResult(result)
      // O painel explicativo fica no topo do resultado; no mobile o cliente
      // acabou de rolar até o botão e não veria a confirmação sem isto.
      if (typeof window !== 'undefined') {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    }

    cancelOrderMutate(
      {
        code: code.trim().replace(/^#+/, ''),
        customer_phone: phone.trim(),
        reason: reason.trim() || undefined,
      },
      {
        onSuccess: (res) => {
          resolveWith(res.type === 'cancelled' ? 'cancelled' : 'requested')
        },
        onError: (err) => {
          // Solicitação duplicada não é erro para o cliente: já existe um pedido
          // de cancelamento aguardando a loja, que é o estado que ele quer ver.
          if (isAlreadyRequestedError(err)) {
            resetCancelMutation()
            resolveWith('requested')
          }
        },
      },
    )
  }

  /**
   * O GET /catalog/track/:code devolve a linha do tempo em `status_history`,
   * mas o tipo do hook declara `history`. Aceitar os dois nomes evita que o
   * histórico — justamente onde o cancelamento aparece — não renderize.
   */
  const history: TrackOrderStatusHistory[] = order
    ? (order.history ??
      (order as unknown as { status_history?: TrackOrderStatusHistory[] }).status_history ??
      [])
    : []

  const status = order?.status ?? null
  const isCancelable =
    status !== null && (CANCELABLE_ORDER_STATUSES as readonly number[]).includes(status)

  // Já resolvido nesta sessão: não oferecer o botão de novo.
  const canCancel = isCancelable && cancelResult === null
  // Pendente cai fora na hora; Confirmado depende do aval do lojista.
  const cancelNeedsApproval = status === 2
  const blockedCancelReason =
    cancelResult === null && status !== null ? (BLOCKED_CANCEL_REASON[status] ?? null) : null

  return {
    // busca
    inputCode,
    setInputCode,
    handleSearch,
    // estado da query
    order,
    history,
    isLoading,
    error,
    hasSearched: searchCode !== null,
    // cancelamento
    showCancelDialog,
    isCancelling,
    cancelError,
    cancelResult,
    canCancel,
    cancelNeedsApproval,
    blockedCancelReason,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
  }
}
