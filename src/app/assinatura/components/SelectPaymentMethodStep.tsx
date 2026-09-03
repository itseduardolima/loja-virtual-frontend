'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { PlanCouponValidation } from '@/types/subscription'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Loader2,
  ShieldCheck,
  Ticket,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface SelectPaymentMethodStepProps {
  planPrice?: number
  planFeatures?: string[]
  planName?: string
  planMaxProducts?: number | null
  planBillingCycle?: string
  planTrialDays?: number | null
  canContinue: boolean
  isCreatingSubscription: boolean
  isFreeCheckout?: boolean
  documentValue?: string
  onDocumentChange?: (value: string) => void
  couponInput?: string
  appliedCoupon?: PlanCouponValidation | null
  isValidatingCoupon?: boolean
  onCouponInputChange?: (v: string) => void
  onApplyCoupon?: () => void
  onRemoveCoupon?: () => void
  onCreateSubscription: () => void
  onStartTrial?: () => void
  onBack: () => void
}

function durationLabel(c: NonNullable<PlanCouponValidation['coupon']>): string {
  if (c.duration_type === 'forever') return 'em todas as renovações'
  if (c.duration_type === 'once') return 'apenas no primeiro pagamento'
  return `pelos próximos ${c.duration_months} meses`
}

export function SelectPaymentMethodStep({
  planPrice = 0,
  planFeatures = [],
  planName,
  planBillingCycle,
  planTrialDays,
  canContinue,
  isCreatingSubscription,
  isFreeCheckout = false,
  documentValue = '',
  onDocumentChange,
  couponInput = '',
  appliedCoupon = null,
  isValidatingCoupon = false,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onCreateSubscription,
  onStartTrial,
  onBack,
}: SelectPaymentMethodStepProps) {
  const [showCoupon, setShowCoupon] = useState<boolean>(!!appliedCoupon?.valid)
  const hasTrialOption = !isFreeCheckout && !!onStartTrial && (planTrialDays ?? 0) > 0

  useEffect(() => {
    if (!appliedCoupon?.valid) setShowCoupon(false)
  }, [appliedCoupon?.valid])

  const finalPrice =
    appliedCoupon?.valid && appliedCoupon.final_price != null
      ? appliedCoupon.final_price
      : planPrice
  const discountAmount = appliedCoupon?.valid ? (appliedCoupon.discount_amount ?? 0) : 0
  const priceStr = finalPrice.toFixed(2).replace('.', ',')
  const [priceInt, priceDec] = priceStr.split(',')

  const features =
    planFeatures.length > 0
      ? planFeatures
      : ['Vendas ilimitadas', 'Dashboard analítico', 'Suporte prioritário 24/7']

  return (
    <motion.div
      key="select"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-3xl"
    >
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <button
          type="button"
          onClick={onBack}
          className="mb-4 inline-flex items-center gap-1.5 text-[13px] font-bold text-nxi3 transition-colors hover:text-nxi1"
        >
          <ChevronLeft className="h-4 w-4" />
          Trocar plano
        </button>
        <h1 className="text-[26px] font-extrabold leading-tight tracking-[-0.02em] text-nxi1 sm:text-[30px]">
          Confirmar assinatura
        </h1>
        <p className="mt-1.5 text-[14px] font-semibold text-nxi2">
          {isFreeCheckout
            ? 'O cupom aplicado zerou o valor desta assinatura. Confirme para ativar.'
            : 'Revise os detalhes e continue para o pagamento seguro no Asaas.'}
        </p>
      </motion.div>

      <div className="mt-6 grid grid-cols-1 items-start gap-5 lg:grid-cols-[1fr_1.05fr]">
        {/* ── Left: plan summary ── */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-2xl border border-nxborder bg-nxbg p-5"
        >
          <div className="flex items-center gap-2">
            {planName && <span className="text-[14px] font-extrabold text-nxi1">{planName}</span>}
            <span className="flex h-[22px] items-center rounded-lg border border-nxborder bg-white px-2.5 text-[11px] font-extrabold text-nxi2">
              {planBillingCycle === 'yearly' ? 'Anual' : 'Mensal'}
            </span>
          </div>

          {/* Preço */}
          <div className="mt-3.5">
            {appliedCoupon?.valid && appliedCoupon.original_price != null && (
              <div className="mb-0.5 text-[13px] font-bold text-nxi3 line-through">
                De R$ {appliedCoupon.original_price.toFixed(2).replace('.', ',')}
              </div>
            )}
            <div className="flex items-start gap-0.5">
              <span className="mt-1.5 text-[15px] font-bold text-nxi3">R$</span>
              <span className="text-[40px] font-extrabold leading-none tracking-tight text-nxi1">
                {priceInt}
              </span>
              <div className="ml-0.5 mt-1">
                <div className="text-[18px] font-extrabold leading-none text-nxi1">,{priceDec}</div>
                <div className="mt-0.5 text-[11px] font-bold text-nxi3">
                  por {planBillingCycle === 'yearly' ? 'ano' : 'mês'}
                </div>
              </div>
            </div>
            {appliedCoupon?.valid && appliedCoupon.coupon && (
              <div className="mt-2.5 inline-flex items-center gap-1.5 rounded-full border border-nxs/25 bg-nxs/[0.08] px-2.5 py-1 text-[11.5px] font-bold text-nxs">
                <Ticket className="h-3 w-3" />
                Cupom {appliedCoupon.coupon.code}: -R${' '}
                {discountAmount.toFixed(2).replace('.', ',')} {durationLabel(appliedCoupon.coupon)}
              </div>
            )}
          </div>

          {/* Features */}
          <div className="mt-4 flex flex-col gap-2.5 border-t border-nxborder pt-4">
            {features.map((feat, i) => (
              <div key={i} className="flex items-center gap-2.5">
                <Check className="h-[15px] w-[15px] shrink-0 text-nxs" />
                <span className="text-[13px] font-semibold text-nxi2">{feat}</span>
              </div>
            ))}
          </div>
        </motion.div>

        {/* ── Right: checkout panel ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="rounded-2xl border border-nxborder bg-white p-5"
        >
          {/* Cupom */}
          {onApplyCoupon && (
            <div className="mb-4">
              {!showCoupon && !appliedCoupon?.valid ? (
                <button
                  type="button"
                  onClick={() => setShowCoupon(true)}
                  className="border-b border-nxi3 pb-px text-[13px] font-bold text-nxi2 transition-colors hover:text-nxp"
                >
                  Tenho um cupom de desconto
                </button>
              ) : appliedCoupon?.valid ? (
                <div className="flex items-center justify-between rounded-xl border border-nxs/25 bg-nxs/[0.06] p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Ticket className="h-4 w-4 shrink-0 text-nxs" />
                    <span className="truncate text-[13.5px] font-bold text-nxi1">
                      Cupom <span className="font-mono">{appliedCoupon.coupon?.code}</span> aplicado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveCoupon?.()
                      setShowCoupon(false)
                    }}
                    className="flex shrink-0 items-center gap-1 text-[12px] font-extrabold text-nxs transition-colors hover:text-nxi1"
                  >
                    <X className="h-3 w-3" />
                    Remover
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-nxborder bg-nxbg p-3">
                  <Label className="mb-2 block text-[12px] font-extrabold text-nxi2">
                    Código do cupom
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => onCouponInputChange?.(e.target.value.toUpperCase())}
                      placeholder="EX: BLACK50"
                      className="h-9 rounded-lg border-nxborder bg-white font-mono uppercase focus-visible:border-nxp focus-visible:ring-nxp/15"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault()
                          onApplyCoupon()
                        }
                      }}
                    />
                    <button
                      type="button"
                      onClick={onApplyCoupon}
                      disabled={!couponInput.trim() || isValidatingCoupon}
                      className="h-9 shrink-0 rounded-lg bg-nxp px-4 text-[13px] font-bold text-white transition-colors hover:bg-nxp/90 disabled:opacity-50"
                    >
                      {isValidatingCoupon ? '…' : 'Aplicar'}
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCoupon(false)}
                      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-nxi3 transition-colors hover:bg-nxbg hover:text-nxi1"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* CPF/CNPJ — exigido pelo Asaas para gerar a cobrança */}
          {!isFreeCheckout && (
            <div className="mb-4">
              <Label className="mb-1.5 block text-[12px] font-extrabold text-nxi2">
                CPF ou CNPJ do titular
              </Label>
              <Input
                type="text"
                inputMode="numeric"
                value={documentValue}
                onChange={(e) => onDocumentChange?.(e.target.value)}
                placeholder="000.000.000-00"
                maxLength={18}
                className="h-11 rounded-lg border-nxborder bg-white text-sm focus-visible:border-nxp focus-visible:ring-nxp/15"
              />
              <p className="mt-1.5 text-[11.5px] font-semibold text-nxi3">
                Necessário para emitir o pagamento. O método (cartão, PIX ou boleto) você escolhe no
                Asaas.
              </p>
            </div>
          )}

          {/* Free checkout note */}
          {isFreeCheckout && (
            <div className="mb-4 flex items-center gap-3 rounded-xl border border-nxs/25 bg-nxs/[0.06] p-3.5">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-nxs/15 text-nxs">
                <Check className="h-5 w-5" strokeWidth={3} />
              </div>
              <div className="min-w-0">
                <p className="text-[13px] font-extrabold text-nxi1">R$ 0,00 — sem cobrança</p>
                <p className="text-[11.5px] font-semibold text-nxi2">
                  Cupom ativo zerou o valor. Sem cartão necessário.
                </p>
              </div>
            </div>
          )}

          {/* CTA */}
          <button
            type="button"
            onClick={onCreateSubscription}
            disabled={!canContinue}
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-lg bg-nxp text-[14.5px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-50"
          >
            {isCreatingSubscription ? (
              <>
                <Loader2 size={17} className="animate-spin" /> Processando…
              </>
            ) : isFreeCheckout ? (
              <>
                Confirmar assinatura gratuita
                <Check className="h-4 w-4" strokeWidth={3} />
              </>
            ) : (
              <>
                Continuar para pagamento
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>

          {/* Alternativa: começar pelo trial em vez de pagar agora */}
          {hasTrialOption && (
            <button
              type="button"
              onClick={onStartTrial}
              disabled={isCreatingSubscription}
              className="mt-2.5 flex h-11 w-full items-center justify-center gap-1.5 rounded-lg border border-nxp/25 bg-nxp/[0.04] text-[13.5px] font-bold text-nxp transition-colors hover:bg-nxp/[0.08] disabled:opacity-50"
            >
              Prefiro testar grátis por {planTrialDays} dias primeiro
            </button>
          )}

          {/* Nota de redirecionamento */}
          {!isFreeCheckout && (
            <div className="mt-3 flex items-start gap-1.5">
              <ExternalLink className="mt-0.5 h-3 w-3 shrink-0 text-nxi3" />
              <span className="text-[11.5px] font-bold text-nxi3">
                Você será redirecionado ao Asaas para concluir o pagamento com segurança.
              </span>
            </div>
          )}

          {/* Badge + termos */}
          <div className="mt-4 flex items-center gap-1.5 border-t border-nxborder pt-4 text-nxi3">
            <ShieldCheck className="h-[15px] w-[15px] shrink-0" />
            <span className="text-[12px] font-semibold">Pagamento seguro via Asaas</span>
          </div>
          <p className="mt-2 text-[11.5px] font-semibold leading-relaxed text-nxi3">
            Ao continuar, você concorda com os{' '}
            <Link href="/termos" className="font-extrabold text-nxi2 hover:text-nxp">
              termos
            </Link>{' '}
            e a{' '}
            <Link href="/privacidade" className="font-extrabold text-nxi2 hover:text-nxp">
              privacidade
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
