'use client'

import { useState, useEffect } from 'react'
import { useMySubscription } from '@/hooks/useMySubscription'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { useCancelSubscription } from '@/hooks/useCancelSubscription'
import { useCancelScheduledChange } from '@/hooks/useCancelScheduledChange'
import { useSubscriptionPayments } from '@/hooks/useSubscriptionPayments'
import { derivePlanFeaturesList } from '@/lib/planUtils'

export function usePlanoPage() {
  const { data: subscription, isLoading, error } = useMySubscription()
  const { data: plans = [], isLoading: isLoadingPlans } = useSubscriptionPlans()
  const { mutate: cancelSubscription, isPending: isCanceling } = useCancelSubscription()
  const { mutate: cancelScheduledChange, isPending: isCancelingScheduled } = useCancelScheduledChange()

  const [cycle, setCycle] = useState<'monthly' | 'yearly'>('monthly')
  const [showCancelModal, setShowCancelModal] = useState(false)
  const [cancelReason, setCancelReason] = useState<string | null>(null)
  const [showRefundModal, setShowRefundModal] = useState(false)
  const [showChangePlanModal, setShowChangePlanModal] = useState(false)
  const [changePlanMode, setChangePlanMode] = useState<'change' | 'renew'>('change')
  const [paymentsPage, setPaymentsPage] = useState(1)

  useEffect(() => {
    if (subscription?.billing_cycle) {
      setCycle(subscription.billing_cycle)
    }
  }, [subscription?.billing_cycle])

  const { data: paymentsData, isLoading: isLoadingPayments } = useSubscriptionPayments({
    page: paymentsPage,
    limit: 5,
    enabled: !!subscription,
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

  const planPriceRaw = plan ? (billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly) : null
  const planFullPrice = planPriceRaw != null
    ? (typeof planPriceRaw === 'string' ? parseFloat(planPriceRaw) : planPriceRaw)
    : 0
  const planPrice = subscription?.current_price ?? planFullPrice
  const isFreeAccess = !!subscription?.free_access_until && new Date(subscription.free_access_until) > new Date()

  const pendingPayment = subscription?.payments?.find(p => p.status === 'pending' && !!p.payment_id) ?? null

  const openChangePlan = (mode: 'change' | 'renew' = 'change') => {
    setChangePlanMode(mode)
    setShowChangePlanModal(true)
  }

  const handleCancel = () => {
    cancelSubscription(undefined, {
      onSuccess: () => {
        setShowCancelModal(false)
        setCancelReason(null)
      },
    })
  }

  const handleCancelScheduledChange = () => {
    cancelScheduledChange()
  }

  return {
    subscription,
    plan,
    plans,
    billingCycle,
    cycle,
    setCycle,
    features,
    planPrice,
    planFullPrice,
    isFreeAccess,
    pendingPayment,
    paymentsData,
    isLoading,
    isLoadingPlans,
    error,
    isCanceling,
    isCancelingScheduled,
    isLoadingPayments,
    isCancelScheduled,
    refundDaysRemaining,
    hasRefundRequested,
    showCancelModal,
    setShowCancelModal,
    cancelReason,
    setCancelReason,
    showRefundModal,
    setShowRefundModal,
    showChangePlanModal,
    setShowChangePlanModal,
    changePlanMode,
    openChangePlan,
    paymentsPage,
    setPaymentsPage,
    handleCancel,
    handleCancelScheduledChange,
  }
}
