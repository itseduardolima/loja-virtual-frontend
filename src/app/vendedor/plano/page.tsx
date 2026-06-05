'use client'

import { usePlanoPage } from './usePlanoPage'
import { LoadingSpinner } from '@/components'
import { ChangePlanModal, RefundModal } from '@/components/Subscription'
import { cn } from '@/lib/utils'
import { TopBanner } from './_components/TopBanner'
import { SubscriptionCard } from './_components/SubscriptionCard'
import { WelcomeCard } from './_components/WelcomeCard'
import { PlanCard } from './_components/PlanCard'
import { PaymentHistory } from './_components/PaymentHistory'
import { CancelModal } from './_components/CancelModal'

export default function PlanoPage() {
  const {
    subscription,
    plan,
    plans,
    billingCycle,
    cycle,
    setCycle,
    planPrice,
    isFreeAccess,
    pendingPayment,
    paymentsData,
    isLoading,
    isLoadingPlans,
    isCanceling,
    isCancelingScheduled,
    isLoadingPayments,
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
  } = usePlanoPage()

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-24">
        <LoadingSpinner size="lg" />
      </div>
    )
  }

  const status = subscription?.status ?? 'none'
  const isCancelScheduled = subscription?.cancel_at_period_end === 1 && status === 'active'

  const sortedPlans = [...plans].sort((a, b) => Number(a.price_monthly) - Number(b.price_monthly))
  const currentPlanIdx = sortedPlans.findIndex(p => p.id === subscription?.plan?.id)
  const featuredIdx = Math.floor(sortedPlans.length / 2)

  return (
    <div className="mx-auto max-w-[1380px] space-y-5 py-4 md:py-6 lg:py-8">

      <div>
        <h1 className="text-[22px] font-extrabold tracking-tight text-nxi1">Plano e cobrança</h1>
        <p className="mt-1 text-[13.5px] text-nxi2">Gerencie sua assinatura, forma de pagamento e histórico de cobranças.</p>
      </div>

      {subscription && (
        <TopBanner
          status={status}
          isCancelScheduled={isCancelScheduled}
          pendingPayment={pendingPayment}
          onReactivate={() => openChangePlan('renew')}
        />
      )}

      {subscription ? (
        <SubscriptionCard
          subscription={subscription}
          plan={plan}
          planPrice={planPrice}
          billingCycle={billingCycle}
          isCancelScheduled={isCancelScheduled}
          isFreeAccess={isFreeAccess}
          hasRefundRequested={hasRefundRequested}
          refundDaysRemaining={refundDaysRemaining}
          isCancelingScheduled={isCancelingScheduled}
          pendingPayment={pendingPayment}
          onUpgrade={() => openChangePlan('change')}
          onRenew={() => openChangePlan('renew')}
          onCancelScheduledChange={handleCancelScheduledChange}
          onCancel={() => setShowCancelModal(true)}
          onRefund={() => setShowRefundModal(true)}
        />
      ) : (
        <WelcomeCard />
      )}

      {/* Plan comparison */}
      <div>
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h2 className="text-[19px] font-bold tracking-tight text-nxi1">
              {subscription ? 'Mudar de plano' : 'Escolha seu plano'}
            </h2>
            <p className="mt-0.5 text-[13px] font-medium text-nxi2">
              Pague mensal ou anual — você pode trocar quando quiser, sem multa.
            </p>
          </div>
          <div className="inline-flex gap-0.5 rounded-full bg-nxbg p-1">
            {(['monthly', 'yearly'] as const).map(c => (
              <button
                key={c}
                onClick={() => setCycle(c)}
                className={cn(
                  'rounded-full px-4 py-2 text-[13px] font-bold transition',
                  cycle === c ? 'bg-nxi1 text-white shadow-sm' : 'text-nxi2 hover:text-nxi1',
                )}
              >
                {c === 'monthly' ? 'Mensal' : (
                  <span className="flex items-center gap-1.5">
                    Anual
                    <span className="rounded-full bg-green-100 px-1.5 py-0.5 text-[10px] font-black text-green-700">-17%</span>
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {isLoadingPlans ? (
          <div className="flex justify-center py-12">
            <LoadingSpinner size="md" />
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 md:grid-cols-3">
            {sortedPlans.map((p, idx) => (
              <PlanCard
                key={p.id}
                plan={p}
                cycle={cycle}
                isCurrent={p.id === subscription?.plan?.id}
                isUpgrade={currentPlanIdx >= 0 && idx > currentPlanIdx}
                isDowngrade={currentPlanIdx >= 0 && idx < currentPlanIdx}
                isFeatured={idx === featuredIdx}
                onUpgrade={() => openChangePlan('change')}
                onDowngrade={() => openChangePlan('change')}
              />
            ))}
          </div>
        )}
      </div>

      {subscription && paymentsData && (
        <PaymentHistory
          planName={plan?.name}
          billingCycle={billingCycle}
          payments={paymentsData.data}
          total={paymentsData.pagination.total}
          totalPages={paymentsData.pagination.totalPages}
          page={paymentsPage}
          isLoading={isLoadingPayments}
          onPageChange={setPaymentsPage}
        />
      )}

      <CancelModal
        open={showCancelModal}
        onOpenChange={setShowCancelModal}
        plan={plan}
        periodEnd={subscription?.current_period_end}
        reason={cancelReason}
        isCanceling={isCanceling}
        onReasonChange={setCancelReason}
        onConfirm={handleCancel}
      />

      <ChangePlanModal
        open={showChangePlanModal}
        onOpenChange={setShowChangePlanModal}
        mode={changePlanMode}
        currentPlanId={plan?.id ?? 0}
        currentBillingCycle={billingCycle}
        hasActiveCoupon={!!subscription?.applied_coupon_code}
        currentPrice={planPrice}
        currentPeriodEnd={subscription?.current_period_end}
      />

      {plan && (
        <RefundModal
          open={showRefundModal}
          onOpenChange={setShowRefundModal}
          planPrice={planPrice}
          daysRemaining={refundDaysRemaining}
        />
      )}
    </div>
  )
}
