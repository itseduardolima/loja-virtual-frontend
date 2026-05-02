'use client'

import { useState, useMemo, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button, LoadingSpinner } from '@/components'
import { Input, Label } from '@/components'
import { CheckCircle2, ArrowLeft, CreditCard, QrCode, FileText, Loader2, AlertTriangle } from 'lucide-react'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { useChangePlan } from '@/hooks/useChangePlan'
import { useRenewSubscription } from '@/hooks/useRenewSubscription'
import { usePreviewChangePlan } from '@/hooks/usePreviewChangePlan'
import { derivePlanFeaturesList, computeYearlySavings } from '@/lib/planUtils'
import { formatPrice, cn } from '@/lib/utils'
import type {
  BillingCycle,
  BillingType,
  ChangePlanRequest,
  SubscriptionPlan,
} from '@/types/subscription'

type Mode = 'change' | 'renew'

interface ChangePlanModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentPlanId: number
  currentBillingCycle: BillingCycle
  hasActiveCoupon: boolean
  /** Preço atual efetivo (com desconto) — usado para preview de proração */
  currentPrice?: number
  /** Fim do período atual — usado para preview de proração / data agendada */
  currentPeriodEnd?: string
  mode?: Mode
}

type Step = 'select' | 'confirm'

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
  const { mutate: submit, isPending } =
    mode === 'renew' ? renewMutation : changePlanMutation

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

  // Heurística local — usada apenas pra escolher copy (upgrade/downgrade/cycle/renew).
  // Os números reais (proração, datas) vêm do backend via previewMutation.data.
  const changeKind: 'upgrade' | 'downgrade' | 'cycle' | 'renew' = useMemo(() => {
    if (mode === 'renew') return 'renew'
    if (billingCycle !== currentBillingCycle) return 'cycle'
    if (currentPrice != null && newPrice > currentPrice) return 'upgrade'
    return 'downgrade'
  }, [mode, billingCycle, currentBillingCycle, currentPrice, newPrice])

  // Dispara preview ao entrar na etapa de confirmação (apenas para mode 'change')
  useEffect(() => {
    if (step === 'confirm' && selectedPlan && mode === 'change') {
      previewMutation.mutate({
        plan_slug: selectedPlan.slug,
        billing_cycle: billingCycle,
      })
    }
    // selectedPlan e billingCycle ficam estáveis após entrar em confirm
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [step, selectedPlan?.slug, billingCycle, mode])

  const previewData = previewMutation.data
  const isPreviewLoading = previewMutation.isPending

  const formatScheduledDate = (iso: string) =>
    new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: 'long',
      year: 'numeric',
      timeZone: 'UTC',
    })

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
    if ((billingType === 'PIX' || billingType === 'BOLETO') && !cpf && !cnpj) {
      return
    }
    const payload: ChangePlanRequest = {
      plan_slug: selectedPlan.slug,
      billing_cycle: billingCycle,
      billing_type: billingType,
      ...(cpf ? { cpf } : {}),
      ...(cnpj ? { cnpj } : {}),
    }

    submit(payload as any, {
      onSuccess: () => handleClose(false),
    })
  }

  const renderPlanCard = (plan: SubscriptionPlan) => {
    const isCurrent =
      mode === 'change' &&
      plan.id === currentPlanId &&
      billingCycle === currentBillingCycle
    const features = derivePlanFeaturesList(plan)
    const priceRaw = billingCycle === 'yearly' ? plan.price_yearly : plan.price_monthly
    const isAvailable = priceRaw != null
    const price = priceRaw ? parseFloat(priceRaw) : null
    const savings =
      billingCycle === 'yearly'
        ? computeYearlySavings(plan.price_monthly, plan.price_yearly)
        : 0

    return (
      <div
        key={plan.id}
        className={cn(
          'border-2 rounded-lg p-5 flex flex-col transition-all',
          isCurrent
            ? 'border-primary/40 bg-primary/5'
            : 'border-gray-200 hover:border-primary/60',
        )}
      >
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-lg font-bold text-gray-900">{plan.name}</h3>
          {isCurrent && (
            <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
              Atual
            </span>
          )}
        </div>

        {plan.description && (
          <p className="text-sm text-gray-600 mb-3 line-clamp-2">{plan.description}</p>
        )}

        <div className="mb-4">
          {isAvailable && price != null ? (
            <>
              <div className="flex items-baseline gap-1">
                <span className="text-2xl font-bold text-primary">
                  {formatPrice(price)}
                </span>
                <span className="text-sm text-gray-600">
                  /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                </span>
              </div>
              {billingCycle === 'yearly' && savings > 0 && (
                <span className="inline-block mt-1 text-xs font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  Economize {savings}%
                </span>
              )}
            </>
          ) : (
            <span className="text-sm text-gray-500 italic">Sem opção anual</span>
          )}
        </div>

        <ul className="space-y-1.5 mb-5 flex-1">
          {features.slice(0, 5).map((f, i) => (
            <li key={i} className="flex items-center gap-2 text-sm text-gray-700">
              <CheckCircle2 className="w-4 h-4 text-green-600 shrink-0" />
              <span>{f}</span>
            </li>
          ))}
        </ul>

        <Button
          className="w-full"
          variant={isCurrent ? 'outline' : 'default'}
          disabled={isCurrent || !isAvailable}
          onClick={() => handleSelectPlan(plan)}
        >
          {isCurrent ? 'Plano atual' : 'Trocar para este plano'}
        </Button>
      </div>
    )
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === 'renew'
              ? step === 'select'
                ? 'Renovar com outro plano'
                : 'Confirmar renovação'
              : step === 'select'
                ? 'Trocar de plano'
                : 'Confirmar troca de plano'}
          </DialogTitle>
          <DialogDescription>
            {step === 'select'
              ? 'Escolha o plano e o ciclo de cobrança que melhor se adequam à sua loja.'
              : mode === 'renew'
                ? 'Revise os detalhes da renovação antes de confirmar.'
                : 'Revise os detalhes da troca antes de confirmar.'}
          </DialogDescription>
        </DialogHeader>

        {step === 'select' && (
          <div className="space-y-6 py-2">
            {/* Toggle ciclo */}
            <div className="flex justify-center">
              <div className="inline-flex p-1 bg-gray-100 rounded-lg">
                <button
                  type="button"
                  onClick={() => setBillingCycle('monthly')}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                    billingCycle === 'monthly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                  )}
                >
                  Mensal
                </button>
                <button
                  type="button"
                  onClick={() => setBillingCycle('yearly')}
                  className={cn(
                    'px-4 py-1.5 rounded-md text-sm font-medium transition-all',
                    billingCycle === 'yearly'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600 hover:text-gray-900',
                  )}
                >
                  Anual
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="flex justify-center py-12">
                <LoadingSpinner size="lg" />
              </div>
            ) : sortedPlans.length === 0 ? (
              <p className="text-center text-gray-500 py-10">Nenhum plano disponível.</p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {sortedPlans.map(renderPlanCard)}
              </div>
            )}
          </div>
        )}

        {step === 'confirm' && selectedPlan && (
          <div className="space-y-5 py-2">
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600 mb-1">Novo plano</p>
              <p className="text-lg font-bold text-gray-900">
                {selectedPlan.name} —{' '}
                {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
              </p>
              <p className="text-2xl font-bold text-primary mt-1">
                {formatPrice(
                  parseFloat(
                    (billingCycle === 'yearly'
                      ? selectedPlan.price_yearly
                      : selectedPlan.price_monthly) ?? '0',
                  ),
                )}
                <span className="text-sm font-normal text-gray-600 ml-1">
                  /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                </span>
              </p>
            </div>

            {isPreviewLoading && (
              <div className="flex justify-center py-6">
                <LoadingSpinner size="md" />
              </div>
            )}

            {!isPreviewLoading && previewData?.kind === 'upgrade' && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-blue-900 space-y-2">
                    <p className="font-semibold">Upgrade com proração</p>
                    <p>
                      Será cobrada apenas a <strong>diferença proporcional</strong> pelos{' '}
                      <strong>
                        {previewData.days_remaining} dia
                        {previewData.days_remaining !== 1 ? 's' : ''}
                      </strong>{' '}
                      restantes do seu período atual:
                    </p>
                    <p className="text-2xl font-bold text-blue-900">
                      {formatPrice(previewData.proration_amount)}
                    </p>
                    <p className="text-xs text-blue-800">
                      O novo plano só será ativado após a confirmação do pagamento. A próxima
                      cobrança no valor cheio ({formatPrice(previewData.new_price)}) será em{' '}
                      {formatScheduledDate(previewData.next_full_charge_at)}.
                      {hasActiveCoupon && ' O cupom ativo será removido.'}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {!isPreviewLoading &&
              (previewData?.kind === 'downgrade' || previewData?.kind === 'cycle') && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-start gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                    <div className="text-sm text-amber-900 space-y-2">
                      <p className="font-semibold">
                        {previewData.kind === 'cycle'
                          ? 'Mudança de ciclo agendada'
                          : 'Downgrade agendado'}
                      </p>
                      <p>
                        A troca será aplicada apenas no <strong>fim do seu período atual</strong>:
                      </p>
                      <p className="text-base font-bold text-amber-900">
                        {formatScheduledDate(previewData.effective_at)}
                      </p>
                      <p className="text-xs text-amber-800">
                        Até lá você continua no plano atual. Não há cobrança nem reembolso agora —
                        o novo plano só começa a ser cobrado no rollover. Você pode cancelar o
                        agendamento a qualquer momento antes dessa data.
                      </p>
                    </div>
                  </div>
                </div>
              )}

            {changeKind === 'renew' && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <div className="flex items-start gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                  <div className="text-sm text-amber-900 space-y-1">
                    <p className="font-semibold">Atenção</p>
                    <ul className="list-disc list-inside space-y-1 text-amber-800">
                      <li>
                        <strong>Você precisará pagar a nova fatura para ativar o acesso.</strong>{' '}
                        Sua assinatura ficará pendente até a confirmação do pagamento.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {(mode === 'renew' || previewData?.kind === 'upgrade') && (
            <div className="space-y-3">
              <Label className="text-sm font-semibold">Método de pagamento</Label>
              <div className="grid grid-cols-3 gap-3">
                {([
                  { type: 'CREDIT_CARD' as BillingType, icon: CreditCard, label: 'Cartão' },
                  { type: 'PIX' as BillingType, icon: QrCode, label: 'PIX' },
                  { type: 'BOLETO' as BillingType, icon: FileText, label: 'Boleto' },
                ]).map(({ type, icon: Icon, label }) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setBillingType(type)}
                    className={cn(
                      'p-3 border-2 rounded-lg transition-all',
                      billingType === type
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300',
                    )}
                  >
                    <Icon
                      className={cn(
                        'w-5 h-5 mx-auto mb-1',
                        billingType === type ? 'text-primary' : 'text-gray-400',
                      )}
                    />
                    <p
                      className={cn(
                        'text-xs font-medium',
                        billingType === type ? 'text-primary' : 'text-gray-600',
                      )}
                    >
                      {label}
                    </p>
                  </button>
                ))}
              </div>
            </div>
            )}

            {(mode === 'renew' || previewData?.kind === 'upgrade') &&
              (billingType === 'PIX' || billingType === 'BOLETO') && (
              <div className="space-y-3 pt-2 border-t">
                <div>
                  <Label htmlFor="cp-cpf">CPF (opcional se informar CNPJ)</Label>
                  <Input
                    id="cp-cpf"
                    type="text"
                    placeholder="000.000.000-00"
                    value={cpf}
                    onChange={(e) => setCpf(e.target.value)}
                    disabled={isPending}
                    maxLength={14}
                  />
                </div>
                <div>
                  <Label htmlFor="cp-cnpj">CNPJ (opcional se informar CPF)</Label>
                  <Input
                    id="cp-cnpj"
                    type="text"
                    placeholder="00.000.000/0000-00"
                    value={cnpj}
                    onChange={(e) => setCnpj(e.target.value)}
                    disabled={isPending}
                    maxLength={18}
                  />
                </div>
                <p className="text-xs text-gray-500">
                  * Para {billingType === 'PIX' ? 'PIX' : 'Boleto'} é obrigatório
                  informar CPF ou CNPJ.
                </p>
              </div>
            )}

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => setStep('select')}
                disabled={isPending}
                className="flex-1"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
              <Button
                onClick={handleConfirm}
                disabled={
                  isPending ||
                  isPreviewLoading ||
                  ((billingType === 'PIX' || billingType === 'BOLETO') && !cpf && !cnpj)
                }
                className="flex-1"
              >
                {isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Processando...
                  </>
                ) : mode === 'renew' ? (
                  'Confirmar renovação'
                ) : previewData?.kind === 'upgrade' ? (
                  `Pagar ${formatPrice(previewData.proration_amount)}`
                ) : previewData?.kind === 'downgrade' || previewData?.kind === 'cycle' ? (
                  'Agendar troca'
                ) : (
                  'Confirmar troca'
                )}
              </Button>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}
