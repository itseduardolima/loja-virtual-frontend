'use client'

import { useState } from 'react'
import { useMySubscription } from '@/hooks/useMySubscription'
import { useCancelSubscription } from '@/hooks/useCancelSubscription'
import { useCancelScheduledChange } from '@/hooks/useCancelScheduledChange'
import { useSubscriptionPayments } from '@/hooks/useSubscriptionPayments'
import { derivePlanFeaturesList } from '@/lib/planUtils'

export function usePlanoPage() {
  const { data: subscription, isLoading, error } = useMySubscription()
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()
  const { mutate: cancelScheduledChange, isPending: isCancelingScheduled } =
    useCancelScheduledChange()

  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [showRenewModal, setShowRenewModal] = useState(false)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showChangePlanModal, setShowChangePlanModal] = useState(false)
  const [showRenewWithPlanModal, setShowRenewWithPlanModal] = useState(false)
  const [showPaymentsModal, setShowPaymentsModal] = useState(false)
  const [paymentsPage, setPaymentsPage] = useState(1)

  const { data: paymentsData, isLoading: isLoadingPayments } = useSubscriptionPayments({
    page: paymentsPage,
    enabled: showPaymentsModal,
  })

  const isCancelScheduled = subscription?.cancel_at_period_end === 1 && subscription?.status === 'active'

  const refundDaysRemaining = (() => {
    if (!subscription?.current_period_start) return 0
    const periodStart = new Date(subscription.current_period_start)
    const now = new Date()
    const diffDays = (now.getTime() - periodStart.getTime()) / (1000 * 60 * 60 * 24)
    return Math.max(0, Math.ceil(7 - diffDays))
  })()

  const hasRefundRequested = subscription?.payments?.some(p => p.status === 'refund_requested') ?? false

  const plan = subscription?.plan ?? null
  const billingCycle = subscription?.billing_cycle ?? 'monthly'
  const features: string[] = plan ? derivePlanFeaturesList(plan) : []
  // Preço efetivo (com desconto / free) — vem calculado do backend; cai pro preço cheio se ausente
  const planPriceRaw = plan ? (billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly) : null
  const planFullPrice = planPriceRaw != null
    ? (typeof planPriceRaw === 'string' ? parseFloat(planPriceRaw) : planPriceRaw)
    : 0
  const planPrice = subscription?.current_price ?? planFullPrice
  const isFreeAccess = !!subscription?.free_access_until && new Date(subscription.free_access_until) > new Date()

  const handleCancel = () => {
    cancelSubscription(undefined, {
      onSuccess: () => setShowCancelConfirm(false),
    })
  }

  const handleCancelScheduledChange = () => {
    cancelScheduledChange()
  }

  const openPaymentsModal = () => {
    setPaymentsPage(1)
    setShowPaymentsModal(true)
  }

  return {
    // Data
    subscription,
    plan,
    billingCycle,
    features,
    planPrice,
    planFullPrice,
    isFreeAccess,
    paymentsData,

    // Loading / error
    isLoading,
    error,
    isCanceling,
    isCancelingScheduled,
    isLoadingPayments,

    // Computed
    isCancelScheduled,
    refundDaysRemaining,
    hasRefundRequested,

    // Modal state
    showCancelConfirm,
    setShowCancelConfirm,
    showRenewModal,
    setShowRenewModal,
    showRefundModal,
    setShowRefundModal,
    showChangePlanModal,
    setShowChangePlanModal,
    showRenewWithPlanModal,
    setShowRenewWithPlanModal,
    showPaymentsModal,
    setShowPaymentsModal,
    paymentsPage,
    setPaymentsPage,

    // Handlers
    handleCancel,
    handleCancelScheduledChange,
    openPaymentsModal,
  }
}
