'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { useTrackOrder } from '@/hooks/useTrackOrder'
import { useCancelOrder } from '@/hooks/useCancelOrder'
import { useAuth } from '@/contexts/AuthContext'

export function useRastrearPage() {
  const searchParams = useSearchParams()
  const codeFromUrl = searchParams.get('code')

  const [inputCode, setInputCode] = useState(codeFromUrl ?? '')
  const [searchCode, setSearchCode] = useState<string | null>(codeFromUrl ?? null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [cancelReason, setCancelReason] = useState('')
  const [cancelResult, setCancelResult] = useState<'cancelled' | 'requested' | null>(null)

  const { isAuthenticated } = useAuth()
  const { data, isLoading, error } = useTrackOrder(searchCode)
  const { mutate: cancelOrderMutate, isPending: isCancelling } = useCancelOrder()

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
    }
  }

  function handleOpenCancelDialog() {
    setCancelReason('')
    setShowCancelDialog(true)
  }

  function handleCloseCancelDialog() {
    setShowCancelDialog(false)
    setCancelReason('')
  }

  function handleConfirmCancel(reason: string) {
    if (!order?.id || !reason.trim()) return
    cancelOrderMutate(
      { orderId: order.id, data: { reason: reason.trim() } },
      {
        onSuccess: (res) => {
          setShowCancelDialog(false)
          setCancelReason('')
          // The API may return a `type` field not reflected in CancelOrderResponse typings yet.
          const resAny = res as unknown as Record<string, unknown>
          setCancelResult(resAny?.type === 'cancelled' ? 'cancelled' : 'requested')
        },
      }
    )
  }

  const canCancel = isAuthenticated && (order?.status === 1 || order?.status === 2)

  return {
    // search input
    inputCode,
    setInputCode,
    handleSearch,
    // query state
    order,
    isLoading,
    error,
    hasSearched: searchCode !== null,
    // cancel dialog
    showCancelDialog,
    cancelReason,
    setCancelReason,
    isCancelling,
    cancelResult,
    canCancel,
    handleOpenCancelDialog,
    handleCloseCancelDialog,
    handleConfirmCancel,
  }
}
