'use client'

import { useState, useMemo, useEffect } from 'react'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { LoadingSpinner } from '@/components'
import { Input, Label } from '@/components'
import { Check, ArrowLeft, CreditCard, QrCode, FileText, Loader2, ArrowRight } from 'lucide-react'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { useChangePlan } from '@/hooks/useChangePlan'
import { useRenewSubscription } from '@/hooks/useRenewSubscription'
import { usePreviewChangePlan } from '@/hooks/usePreviewChangePlan'
import { derivePlanFeaturesComparison, computeYearlySavings } from '@/lib/planUtils'
import { formatPrice, formatDateShort, formatDateLong, cn } from '@/lib/utils'
import type { BillingCycle, BillingType, ChangePlanRequest, SubscriptionPlan } from '@/types/subscription'

type Mode = 'change' | 'renew'
type Step = 'select' | 'confirm'

interface ChangePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: number
  currentBillingCycle: BillingCycle
  hasActiveCoupon: boolean
  currentPrice?: number
  currentPeriodEnd?: string
  mode?: Mode
}

export function ChangePlanModal({
  open,
  onOpenChange,
  currentPlanId,
  currentBillingCycle,
  hasActiveCoupon,
  currentPrice,
  currentPeriodEnd,
  mode = 'change',
}: ChangePlanModalProps) {
  const { data: plans, isLoading } = useSubscriptionPlans()
  const changePlanMutation = useChangePlan()
  const renewMutation = useRenewSubscription()
  const previewMutation = usePreviewChangePlan()
  const { mutate: submit, isPending } = mode === 'renew' ? renewMutation : changePlanMutation

  const [step, setStep] = useState<Step>('select')
  const [billingCycle, setBillingCycle] = useState<BillingCycle>(currentBillingCycle)
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null)
  const [billingType, setBillingType] = useState<BillingType>('CREDIT_CARD')
  const [cpf, setCpf] = useState('')
  const [cnpj, setCnpj] = useState('')

  const sortedPlans = useMemo(
    () => (plans ?? []).slice().sort((a, b) => a.sort_order - b.sort_order),
    [plans],
  )

  const newPrice = useMemo(() => {
    if (!selectedPlan) return 0
    const raw = billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly
    return raw ? parseFloat(raw) : 0
  }, [selectedPlan, billingCycle])

  const changeKind: 'upgrade' | 'downgrade' | 'cycle' | 'renew' = useMemo(() => {
    if (mode === 'renew') return 'renew'
    if (billingCycle !== currentBillingCycle) return 'cycle'
    if (currentPrice != null && newPrice > currentPrice) return 'upgrade'
    return 'downgrade'
  }, [mode, billingCycle, currentBillingCycle, currentPrice, newPrice])

  useEffect(() => {
    if (step === 'confirm' && selectedPlan && mode === 'change') {
      previewMutation.mutate({ plan_slug: selectedPlan.slug, billing_cycle: billingCycle })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedPlan?.slug, billingCycle, mode])

  const previewData = previewMutation.data
  const isPreviewLoading = previewMutation.isPending

  const handleClose = (next: boolean) => {
    if (isPending) return
    if (!next) {
      setStep('select')
      setSelectedPlan(null)
      setBillingType('CREDIT_CARD')
      setCpf('')
      setCnpj('')
    }
    onOpenChange(next)
  }

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan)
    setStep('confirm')
  }

  const handleConfirm = () => {
    if (!selectedPlan) return
    if ((billingType === 'PIX' || billingType === 'BOLETO') && !cpf && !cnpj) return
    const payload: ChangePlanRequest = {
      plan_slug: selectedPlan.slug,
      billing_cycle: billingCycle,
      billing_type: billingType,
      ...(cpf ? { cpf } : {}),
      ...(cnpj ? { cnpj } : {}),
    }
    submit(payload as any, { onSuccess: () => handleClose(false) })
  }

  const needsPayment = mode === 'renew' || previewData?.kind === 'upgrade'
  const needsDocument = needsPayment && (billingType === 'PIX' || billingType === 'BOLETO')
  const confirmDisabled = isPending || isPreviewLoading || (needsDocument && !cpf && !cnpj)

  const titles = {
    select: mode === 'renew' ? 'Escolher plano' : 'Mudar de plano',
    confirm: mode === 'renew' ? 'Confirmar renovação' : 'Confirmar troca',
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className={cn('gap-0 overflow-hidden p-0', step === 'select' ? 'max-w-3xl' : 'max-w-md')}>

        {/* Header */}
        <div className="flex items-center gap-4 px-6 pb-4 pt-6">
          {step === 'confirm' && (
            <button
              onClick={() => setStep('select')}
              disabled={isPending}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl border border-nxborder text-nxi2 transition hover:bg-nxbg disabled:opacity-40"
            >
              <ArrowLeft className="h-3.5 w-3.5" strokeWidth={2} />
            </button>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-bold uppercase tracking-widest text-nxi3">
              {mode === 'renew' ? 'Renovação' : 'Assinatura'}
            </p>
            <h2 className="text-[17px] font-extrabold tracking-tight text-nxi1">{titles[step]}</h2>
          </div>
          {/* Cycle toggle — only in select step */}
          {step === 'select' && (
            <div className="inline-flex shrink-0 gap-0.5 rounded-full bg-nxbg p-1">
              {(['monthly', 'yearly'] as const).map(c => (
                <button
                  key={c}
                  onClick={() => setBillingCycle(c)}
                  className={cn(
                    'rounded-full px-3.5 py-1.5 text-[12.5px] font-bold transition',
                    billingCycle === c ? 'bg-nxi1 text-white shadow-sm' : 'text-nxi2 hover:text-nxi1',
                  )}
                >
                  {c === 'monthly' ? 'Mensal' : (
                    <span className="flex items-center gap-1.5">
                      Anual
                      <span className="rounded-full bg-green-100 px-1.5 text-[9.5px] font-black text-green-700">-17%</span>
                    </span>
                  )}
                </button>
              ))}
            </div>
          )}
        </div>

        <div className="border-t border-nxborder" />

        {/* ── Step: select ─────────────────────────────────────────────────── */}
        {step === 'select' && (
          <>
            <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: '70vh' }}>
              {isLoading ? (
                <div className="flex justify-center py-16">
                  <LoadingSpinner size="md" />
                </div>
              ) : sortedPlans.length === 0 ? (
                <p className="py-12 text-center text-[13px] text-nxi3">Nenhum plano disponível.</p>
              ) : (
                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  {sortedPlans.map(plan => {
                    const isCurrent = mode === 'change' && plan.id === currentPlanId && billingCycle === currentBillingCycle
                    const priceRaw = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly
                    const price = priceRaw ? parseFloat(priceRaw) : null
                    const savings = computeYearlySavings(plan.price_monthly, plan.price_yearly)
                    const features = derivePlanFeaturesComparison(plan)

                    return (
                      <article
                        key={plan.id}
                        className={cn(
                          'relative flex flex-col rounded-xl border p-5 transition',
                          isCurrent
                            ? 'border-nxborder bg-nxbg'
                            : 'border-nxborder bg-white hover:border-nxp/40 hover:shadow-[0_2px_12px_hsl(var(--nxp)/0.08)] cursor-pointer',
                        )}
                        onClick={() => !isCurrent && price != null && handleSelectPlan(plan)}
                      >
                        {isCurrent && (
                          <span className="absolute right-3 top-3 rounded-full bg-nxp/10 px-2 py-0.5 text-[10.5px] font-bold text-nxp">
                            Atual
                          </span>
                        )}

                        <h3 className="text-[14px] font-extrabold text-nxi1">{plan.name}</h3>
                        {plan.description && (
                          <p className="mt-1 text-[12px] leading-snug text-nxi3">{plan.description}</p>
                        )}

                        <div className="mt-4">
                          {price != null ? (
                            <>
                              <div className="flex items-baseline gap-1">
                                <span className="text-[24px] font-bold tracking-tight text-nxi1">
                                  {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
                                </span>
                                <span className="text-[12px] text-nxi3">/{billingCycle === 'yearly' ? 'ano' : 'mês'}</span>
                              </div>
                              {billingCycle === 'yearly' && savings > 0 && (
                                <p className="mt-0.5 text-[11.5px] font-semibold text-green-700">
                                  {formatPrice(price / 12)}/mês · {savings}% off
                                </p>
                              )}
                            </>
                          ) : (
                            <p className="text-[12px] italic text-nxi3">Sem opção anual</p>
                          )}
                        </div>

                        <div className="my-4 border-t border-nxborder" />

                        <ul className="flex-1 space-y-2">
                          {features.map((f, i) => (
                            <li key={i} className={cn('flex items-start gap-2 text-[12px]', f.included ? 'text-nxi1' : 'text-nxi3')}>
                              <span className={cn('mt-px flex h-3.5 w-3.5 shrink-0 items-center justify-center rounded-full', f.included ? 'bg-green-50 text-green-700' : 'bg-nxbg text-nxi3')}>
                                <Check className="h-2 w-2" strokeWidth={3} />
                              </span>
                              {f.label}
                            </li>
                          ))}
                        </ul>

                        {!isCurrent && price != null && (
                          <button
                            onClick={e => { e.stopPropagation(); handleSelectPlan(plan) }}
                            className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxp py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90"
                          >
                            Selecionar
                            <ArrowRight className="h-3.5 w-3.5" strokeWidth={2.5} />
                          </button>
                        )}
                        {isCurrent && (
                          <div className="mt-4 flex w-full items-center justify-center gap-1.5 rounded-xl border border-nxborder py-2.5 text-[12.5px] font-bold text-nxi3">
                            <Check className="h-4 w-4" strokeWidth={2.5} />
                            Plano atual
                          </div>
                        )}
                      </article>
                    )
                  })}
                </div>
              )}
            </div>
          </>
        )}

        {/* ── Step: confirm ────────────────────────────────────────────────── */}
        {step === 'confirm' && selectedPlan && (
          <>
            <div className="overflow-y-auto px-6 py-5" style={{ maxHeight: '70vh' }}>
              <div className="space-y-4">

                {/* Resumo do novo plano */}
                <div className="flex items-center justify-between rounded-xl border border-nxborder bg-nxbg px-4 py-3.5">
                  <div>
                    <p className="text-[11.5px] font-semibold text-nxi3">Novo plano</p>
                    <p className="mt-0.5 text-[15px] font-extrabold tracking-tight text-nxi1">
                      {selectedPlan.name} · {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                    </p>
                  </div>
                  <p className="text-[20px] font-extrabold tracking-tight text-nxi1">
                    {formatPrice(parseFloat(
                      (billingCycle === 'yearly' ? selectedPlan.price_yearly : selectedPlan.price_monthly) ?? '0',
                    ))}
                    <span className="text-[12px] font-normal text-nxi3">/{billingCycle === 'yearly' ? 'ano' : 'mês'}</span>
                  </p>
                </div>

                {/* Preview de cobrança */}
                {isPreviewLoading && (
                  <div className="flex justify-center py-6">
                    <LoadingSpinner size="sm" />
                  </div>
                )}

                {!isPreviewLoading && previewData?.kind === 'upgrade' && (
                  <div className="overflow-hidden rounded-xl border border-nxborder">
                    <div className="border-b border-nxborder bg-nxbg px-4 py-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-nxi3">Cobrança imediata</p>
                    </div>
                    <div className="divide-y divide-nxborder">
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-[12.5px] text-nxi2">
                          Diferença proporcional ({previewData.days_remaining} dia{previewData.days_remaining !== 1 ? 's' : ''} restantes)
                        </p>
                        <p className="text-[14px] font-bold text-nxi1">{formatPrice(previewData.proration_amount)}</p>
                      </div>
                      <div className="flex items-center justify-between px-4 py-3">
                        <p className="text-[12.5px] text-nxi2">
                          Próxima cobrança em{' '}
                          <span className="font-semibold text-nxi1">
                            {formatDateShort(previewData.next_full_charge_at, { utc: true })}
                          </span>
                        </p>
                        <p className="text-[14px] font-bold text-nxi1">{formatPrice(previewData.new_price)}</p>
                      </div>
                    </div>
                    {hasActiveCoupon && (
                      <div className="border-t border-amber-100 bg-amber-50 px-4 py-2.5 text-[12px] font-medium text-amber-800">
                        ⚠ O cupom ativo será removido com o upgrade.
                      </div>
                    )}
                  </div>
                )}

                {!isPreviewLoading && (previewData?.kind === 'downgrade' || previewData?.kind === 'cycle') && (
                  <div className="overflow-hidden rounded-xl border border-nxborder">
                    <div className="border-b border-nxborder bg-nxbg px-4 py-2.5">
                      <p className="text-[11px] font-bold uppercase tracking-widest text-nxi3">Troca agendada</p>
                    </div>
                    <div className="px-4 py-3.5">
                      <p className="text-[12.5px] text-nxi2">Você continua no plano atual até</p>
                      <p className="mt-0.5 text-[16px] font-extrabold tracking-tight text-nxi1">
                        {formatDateLong(previewData.effective_at)}
                      </p>
                      <p className="mt-2 text-[12px] text-nxi3">
                        Nenhuma cobrança agora. O novo plano começa a ser cobrado no próximo ciclo. Você pode cancelar o agendamento antes dessa data.
                      </p>
                    </div>
                  </div>
                )}

                {changeKind === 'renew' && (
                  <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3.5">
                    <p className="text-[12.5px] font-semibold text-amber-900">
                      Sua assinatura ficará pendente até a confirmação do pagamento.
                    </p>
                  </div>
                )}

                {/* Método de pagamento */}
                {needsPayment && (
                  <div>
                    <p className="mb-2.5 text-[11.5px] font-bold uppercase tracking-widest text-nxi3">Forma de pagamento</p>
                    <div className="grid grid-cols-3 gap-2.5">
                      {([
                        { type: 'CREDIT_CARD' as BillingType, Icon: CreditCard, label: 'Cartão' },
                        { type: 'PIX' as BillingType, Icon: QrCode, label: 'PIX' },
                        { type: 'BOLETO' as BillingType, Icon: FileText, label: 'Boleto' },
                      ]).map(({ type, Icon, label }) => (
                        <button
                          key={type}
                          onClick={() => setBillingType(type)}
                          className={cn(
                            'flex flex-col items-center gap-2 rounded-xl border py-3.5 text-[12.5px] font-bold transition',
                            billingType === type
                              ? 'border-nxp bg-nxp/[0.06] text-nxp'
                              : 'border-nxborder bg-white text-nxi2 hover:border-nxi3',
                          )}
                        >
                          <Icon className="h-5 w-5" strokeWidth={1.75} />
                          {label}
                        </button>
                      ))}
                    </div>
                  </div>
                )}

                {/* Documento */}
                {needsDocument && (
                  <div className="space-y-3 rounded-xl border border-nxborder px-4 py-4">
                    <p className="text-[11.5px] font-bold uppercase tracking-widest text-nxi3">
                      Documento (obrigatório para {billingType === 'PIX' ? 'PIX' : 'Boleto'})
                    </p>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="mb-1 text-[12px]">CPF</Label>
                        <Input placeholder="000.000.000-00" value={cpf} onChange={e => setCpf(e.target.value)} disabled={isPending} maxLength={14} />
                      </div>
                      <div>
                        <Label className="mb-1 text-[12px]">CNPJ</Label>
                        <Input placeholder="00.000.000/0000-00" value={cnpj} onChange={e => setCnpj(e.target.value)} disabled={isPending} maxLength={18} />
                      </div>
                    </div>
                    <p className="text-[11.5px] text-nxi3">Informe CPF ou CNPJ — apenas um é necessário.</p>
                  </div>
                )}

              </div>
            </div>

            {/* Footer */}
            <div className="flex items-center justify-end gap-2.5 border-t border-nxborder bg-nxbg px-6 py-4">
              <button
                onClick={() => setStep('select')}
                disabled={isPending}
                className="rounded-xl border border-nxborder bg-white px-5 py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3 disabled:opacity-40"
              >
                Voltar
              </button>
              <button
                onClick={handleConfirm}
                disabled={confirmDisabled}
                className="inline-flex items-center gap-1.5 rounded-xl bg-nxp px-5 py-2.5 text-[13px] font-bold text-white transition hover:bg-nxp/90 disabled:opacity-60"
              >
                {isPending ? (
                  <><Loader2 className="h-4 w-4 animate-spin" />Processando…</>
                ) : mode === 'renew' ? 'Confirmar renovação'
                  : previewData?.kind === 'upgrade' ? `Pagar ${formatPrice(previewData.proration_amount)}`
                  : previewData?.kind === 'downgrade' || previewData?.kind === 'cycle' ? 'Agendar troca'
                  : 'Confirmar troca'}
              </button>
            </div>
          </>
        )}

      </DialogContent>
    </Dialog>
  )
}

