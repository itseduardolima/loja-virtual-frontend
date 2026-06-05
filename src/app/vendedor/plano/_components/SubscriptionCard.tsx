'use client'

import { ArrowUpRight, Check, RefreshCw, RotateCcw, Zap } from 'lucide-react'
import { cn, formatBRL, formatDateShort, daysUntil } from '@/lib/utils'
import { useGetPaymentLink } from '@/hooks/useSubscription'
import { Subscription, SubscriptionPlan, Payment } from '@/types/subscription'
import { StatusChip } from './StatusChip'

interface SubscriptionCardProps {
  subscription: Subscription
  plan: SubscriptionPlan | null
  planPrice: number
  billingCycle: 'monthly' | 'yearly'
  isCancelScheduled: boolean
  isFreeAccess: boolean
  hasRefundRequested: boolean
  refundDaysRemaining: number
  isCancelingScheduled: boolean
  pendingPayment: Payment | null
  onUpgrade: () => void
  onRenew: () => void
  onCancelScheduledChange: () => void
  onCancel: () => void
  onRefund: () => void
}

export function SubscriptionCard({
  subscription,
  plan,
  planPrice,
  billingCycle,
  isCancelScheduled,
  isFreeAccess,
  hasRefundRequested,
  refundDaysRemaining,
  isCancelingScheduled,
  pendingPayment,
  onUpgrade,
  onRenew,
  onCancelScheduledChange,
  onCancel,
  onRefund,
}: SubscriptionCardProps) {
  const status = subscription.status
  const daysLeft = subscription.current_period_end ? daysUntil(subscription.current_period_end) : 0

  return (
    <div className="overflow-hidden rounded-2xl border border-nxborder bg-white shadow-[0_1px_3px_hsl(0_0%_0%/0.05)]">
      {/* sub-main */}
      <div className={cn(
        'grid gap-8 border-b border-nxborder p-7',
        'grid-cols-1 md:grid-cols-[5fr_4fr_3fr]',
        (status === 'canceled' || status === 'expired') && 'opacity-80',
      )}>
        {/* Col 1 — plano */}
        <div>
          <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-widest text-nxi3">Plano atual</div>
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <h2 className="text-[24px] font-bold tracking-tight text-nxi1">{plan?.name ?? '—'}</h2>
            <StatusChip status={status} isCancelScheduled={isCancelScheduled} />
          </div>
          <div className="text-[13.5px] font-semibold text-nxi2">
            <span className="font-bold text-nxi1">{formatBRL(planPrice)}</span>
            {' '}/{billingCycle === 'yearly' ? 'ano' : 'mês'} · cobrado {billingCycle === 'yearly' ? 'anualmente' : 'mensalmente'}
          </div>
          {subscription.free_access_until && (
            <div className="mt-2 text-[12px] font-semibold text-amber-700">
              Acesso gratuito até {formatDateShort(subscription.free_access_until, { utc: true })}
            </div>
          )}
          {subscription.applied_coupon_code && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11px] font-bold text-green-700">
              Cupom {subscription.applied_coupon_code} ativo
              {subscription.discount_remaining_periods != null && subscription.discount_remaining_periods > 0
                ? ` · ${subscription.discount_remaining_periods} ciclo(s) restantes`
                : subscription.discount_remaining_periods == null ? ' · vitalício' : ''}
            </div>
          )}
          {subscription.created_at && (
            <div className="mt-2 text-[12px] text-nxi3">
              Membro desde {formatDateShort(subscription.created_at, { utc: true })}
            </div>
          )}
        </div>

        {/* Col 2 — próxima cobrança */}
        <div>
          <div className="mb-2.5 text-[10.5px] font-bold uppercase tracking-widest text-nxi3">
            {status === 'canceled' || status === 'expired' ? 'Acesso até' : 'Próxima cobrança'}
          </div>
          {subscription.current_period_end && (
            <>
              <div className="text-[28px] font-bold leading-tight tracking-tight text-nxi1">
                {formatDateShort(subscription.current_period_end, { utc: true })}
              </div>
              <div className={cn('mt-1 text-[13px] font-semibold', status === 'pending' ? 'text-amber-700' : 'text-nxi2')}>
                {daysLeft === 0 ? 'hoje' : `em ${daysLeft} dia${daysLeft !== 1 ? 's' : ''}`}
                {status === 'pending' && ' · pague antes para evitar suspensão'}
                {(status === 'canceled' || status === 'expired') && ' · depois disso a loja é desativada'}
              </div>
            </>
          )}
        </div>

        {/* Col 3 — ações */}
        <div className="flex flex-col gap-2.5">
          {status === 'active' && !isCancelScheduled && (
            <>
              {subscription.pending_upgrade_payment_id && subscription.scheduled_plan ? (
                <PendingUpgradeNotice
                  planName={subscription.scheduled_plan.name}
                  paymentId={subscription.pending_upgrade_payment_id}
                  onCancel={onCancelScheduledChange}
                />
              ) : (
                <>
                  {!isFreeAccess && !subscription.scheduled_plan_id && (
                    <button onClick={onUpgrade} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxa py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:opacity-90">
                      Fazer upgrade
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                    </button>
                  )}
                  {billingCycle === 'monthly' && (
                    <button onClick={onUpgrade} className="flex w-full items-center justify-center rounded-xl border border-nxborder bg-white py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3">
                      Mudar para anual
                      <span className="ml-1.5 text-[11px] font-bold text-green-700">· economize 2 meses</span>
                    </button>
                  )}
                  {!hasRefundRequested && refundDaysRemaining > 0 && !isFreeAccess && (
                    <button onClick={onRefund} className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-nxborder bg-white py-2.5 text-[12.5px] font-semibold text-nxi1 transition hover:border-nxi3">
                      <RotateCcw className="h-3.5 w-3.5" strokeWidth={2} />
                      Solicitar reembolso
                    </button>
                  )}
                  <button onClick={onCancel} className="mt-1 self-center border-0 bg-transparent text-[11.5px] text-nxi3 underline underline-offset-2 transition hover:text-red-600">
                    Cancelar assinatura
                  </button>
                </>
              )}
            </>
          )}

          {isCancelScheduled && (
            <>
              <button
                onClick={onCancelScheduledChange}
                disabled={isCancelingScheduled}
                className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxp py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:opacity-90 disabled:opacity-60"
              >
                <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
                {isCancelingScheduled ? 'Reativando…' : 'Manter assinatura'}
              </button>
              <button disabled className="w-full rounded-xl border border-nxborder bg-nxbg py-2.5 text-center text-[12.5px] font-semibold text-nxi3 opacity-70">
                Cancelamento agendado em{' '}
                {subscription.current_period_end
                  ? formatDateShort(subscription.current_period_end, { utc: true })
                  : '—'}
              </button>
            </>
          )}

          {(status === 'canceled' || status === 'expired') && (
            <button onClick={onRenew} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxa py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:opacity-90">
              <RefreshCw className="h-3.5 w-3.5" strokeWidth={2.5} />
              Reativar assinatura
            </button>
          )}

          {status === 'pending' && pendingPayment?.payment_id && (
            <PendingPayButton paymentId={pendingPayment.payment_id} />
          )}
        </div>
      </div>

      {/* usage-strip */}
      {plan && (
        <div className="grid grid-cols-1 divide-y divide-nxborder sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          <UsageCell label="Produtos">
            <div className="text-[20px] font-bold tracking-tight text-nxi1">
              {plan.max_products == null ? '∞' : plan.max_products.toLocaleString('pt-BR')}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-nxbg">
              <div className="h-full w-2/5 rounded-full bg-nxp transition-all" />
            </div>
            <div className="mt-2">
              <Chip success>
                <Check className="h-2.5 w-2.5" strokeWidth={3} />
                {plan.max_products == null ? 'Ilimitado no seu plano' : `Até ${plan.max_products} incluídos`}
              </Chip>
            </div>
          </UsageCell>

          <UsageCell label="Cupons">
            <div className="text-[20px] font-bold tracking-tight text-nxi1">
              {plan.feature_coupons ? 'Ilimitado' : 'Máx. 3'}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-nxbg">
              <div className={cn('h-full rounded-full', plan.feature_coupons ? 'w-full bg-green-500 opacity-20' : 'w-1/4 bg-nxi3')} />
            </div>
            <div className="mt-2">
              {plan.feature_coupons ? (
                <Chip success><Check className="h-2.5 w-2.5" strokeWidth={3} />Ilimitado no seu plano</Chip>
              ) : (
                <Chip>Limitado a 3 cupons</Chip>
              )}
            </div>
          </UsageCell>

          <UsageCell label="Integrações ativas">
            <div className="text-[20px] font-bold tracking-tight text-nxi1">
              {plan.feature_bling_integration ? 2 : 1}
            </div>
            <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-nxbg">
              <div className="h-full w-full rounded-full bg-nxp opacity-20" />
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {plan.feature_bling_integration && (
                <Chip success><span className="h-1.5 w-1.5 rounded-full bg-green-500" />Bling ERP</Chip>
              )}
              <Chip success><span className="h-1.5 w-1.5 rounded-full bg-green-500" />WhatsApp</Chip>
            </div>
          </UsageCell>
        </div>
      )}
    </div>
  )
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

function UsageCell({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="px-6 py-4">
      <div className="mb-2 text-[11px] font-bold uppercase tracking-widest text-nxi3">{label}</div>
      {children}
    </div>
  )
}

function Chip({ success, children }: { success?: boolean; children: React.ReactNode }) {
  return (
    <span className={cn(
      'inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[11px] font-bold',
      success ? 'bg-green-50 text-green-700' : 'bg-nxbg text-nxi3',
    )}>
      {children}
    </span>
  )
}

function PendingUpgradeNotice({ planName, paymentId, onCancel }: { planName: string; paymentId: string; onCancel: () => void }) {
  const { mutate: getLink, isPending } = useGetPaymentLink()
  return (
    <div className="rounded-xl border border-amber-200 bg-amber-50 p-3 text-[12px] text-amber-800">
      <p className="mb-1 font-bold text-amber-900">Upgrade pendente de pagamento</p>
      <p className="mb-2">Pague a proração para ativar {planName}.</p>
      <div className="flex gap-2">
        <button
          onClick={() => getLink(paymentId)}
          disabled={isPending}
          className="rounded-lg bg-amber-500 px-3 py-1.5 text-[11.5px] font-bold text-white disabled:opacity-60"
        >
          {isPending ? 'Carregando…' : 'Pagar agora'}
        </button>
        <button onClick={onCancel} className="rounded-lg border border-amber-300 px-3 py-1.5 text-[11.5px] font-semibold text-amber-800">
          Cancelar upgrade
        </button>
      </div>
    </div>
  )
}

function PendingPayButton({ paymentId }: { paymentId: string }) {
  const { mutate: getLink, isPending } = useGetPaymentLink()
  return (
    <button
      onClick={() => getLink(paymentId)}
      disabled={isPending}
      className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxa py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:opacity-90 disabled:opacity-60"
    >
      <Zap className="h-3.5 w-3.5" strokeWidth={2.5} />
      {isPending ? 'Carregando…' : 'Pagar agora'}
    </button>
  )
}
