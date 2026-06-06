'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { BillingType, PlanCouponValidation } from '@/types/subscription'
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Loader2,
  QrCode,
  FileText,
  Package,
  RefreshCw,
  ShieldCheck,
  Ticket,
  X,
} from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { cn } from '@/lib/utils'

const paymentMethods = [
  {
    id: 'CREDIT_CARD' as BillingType,
    name: 'Cartão de Crédito',
    description: 'Aprovação imediata',
    icon: <CreditCard className="h-5 w-5" />,
  },
  {
    id: 'PIX' as BillingType,
    name: 'PIX',
    description: 'Pagamento instantâneo',
    icon: <QrCode className="h-5 w-5" />,
  },
  {
    id: 'BOLETO' as BillingType,
    name: 'Boleto Bancário',
    description: 'Vencimento em 3 dias úteis',
    icon: <FileText className="h-5 w-5" />,
  },
]

interface SelectPaymentMethodStepProps {
  planPrice?: number
  planFeatures?: string[]
  planName?: string
  planMaxProducts?: number | null
  planBillingCycle?: string
  selectedMethod: BillingType | null
  documentType: 'cpf' | 'cnpj' | null
  cpf: string
  cnpj: string
  needsDocument: boolean
  canContinue: boolean
  isCreatingSubscription: boolean
  isFreeCheckout?: boolean
  // Cupom
  couponInput?: string
  appliedCoupon?: PlanCouponValidation | null
  isValidatingCoupon?: boolean
  onCouponInputChange?: (v: string) => void
  onApplyCoupon?: () => void
  onRemoveCoupon?: () => void
  onSelectMethod: (method: BillingType) => void
  onSelectDocumentType: (type: 'cpf' | 'cnpj') => void
  onCpfChange: (value: string) => void
  onCnpjChange: (value: string) => void
  onDocumentTypeReset: () => void
  onCreateSubscription: () => void
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
  planMaxProducts,
  planBillingCycle,
  selectedMethod,
  documentType,
  cpf,
  cnpj,
  needsDocument,
  canContinue,
  isCreatingSubscription,
  isFreeCheckout = false,
  couponInput = '',
  appliedCoupon = null,
  isValidatingCoupon = false,
  onCouponInputChange,
  onApplyCoupon,
  onRemoveCoupon,
  onSelectMethod,
  onSelectDocumentType,
  onCpfChange,
  onCnpjChange,
  onDocumentTypeReset,
  onCreateSubscription,
  onBack,
}: SelectPaymentMethodStepProps) {
  const [showCoupon, setShowCoupon] = useState<boolean>(!!appliedCoupon?.valid)

  // Quando cupom é removido, fecha o painel automaticamente
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
      : [
          'Vendas ilimitadas',
          'Dashboard analítico',
          'Suporte prioritário 24/7',
          'Automação inteligente',
        ]

  return (
    <motion.div
      key="select"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-[1fr_1.15fr] lg:gap-12">
        {/* ── Left: plan info ── */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
          >
            <button
              type="button"
              onClick={onBack}
              className="mb-5 inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-nxi3 transition-colors hover:text-nxi1"
            >
              <ChevronLeft className="h-4 w-4" />
              Trocar plano
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="mb-3 text-[32px] font-extrabold leading-tight tracking-[-0.02em] text-nxi1 lg:text-[38px]">
              Assinar plano
            </h1>
            <p className="max-w-xs text-[15px] leading-relaxed text-nxi2">
              Escolha o método de pagamento para começar sua jornada como vendedor
            </p>
          </motion.div>

          {/* Plan card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="relative overflow-hidden rounded-2xl bg-coal p-6 text-white"
          >
            <div
              aria-hidden
              className="hero-glow pointer-events-none absolute -right-16 -top-16 h-48 w-48 rounded-full opacity-30 blur-3xl"
            />
            {/* Plan name */}
            {planName && (
              <div className="relative mb-4 inline-flex items-center gap-2 rounded-full bg-white/15 px-2.5 py-1 text-[11.5px] font-semibold text-white">
                {planName}
              </div>
            )}

            {/* Price */}
            <div className="relative mb-6">
              {appliedCoupon?.valid && appliedCoupon.original_price != null && (
                <div className="mb-1 text-[13.5px] text-white/45 line-through">
                  De R$ {appliedCoupon.original_price.toFixed(2).replace('.', ',')}
                </div>
              )}
              <div className="flex items-start gap-1">
                <span className="mt-2.5 text-[13.5px] font-medium text-white/70">R$</span>
                <span className="text-6xl font-extrabold leading-none tracking-tight text-white">
                  {priceInt}
                </span>
                <div className="ml-0.5 mt-1.5 flex flex-col">
                  <span className="text-xl font-extrabold leading-none text-white">
                    ,{priceDec}
                  </span>
                  <span className="mt-1 text-[11.5px] text-white/55">
                    por {planBillingCycle === 'yearly' ? 'ano' : 'mês'}
                  </span>
                </div>
              </div>
              {appliedCoupon?.valid && appliedCoupon.coupon && (
                <div className="mt-3 inline-flex items-center gap-2 rounded-full bg-nxs/25 px-2.5 py-1 text-[11.5px] font-medium text-[#9fdebb]">
                  <Ticket className="h-3 w-3" />
                  Cupom {appliedCoupon.coupon.code}: -R${' '}
                  {discountAmount.toFixed(2).replace('.', ',')}{' '}
                  {durationLabel(appliedCoupon.coupon)}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="relative mb-6 space-y-3">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-white/[0.12] ring-1 ring-inset ring-white/15">
                    <Check className="h-3 w-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-[13.5px] font-medium text-white/85">{feature}</span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="relative border-t border-white/10 pt-5">
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center gap-1.5 text-white/55">
                  <Package className="h-5 w-5" />
                  <span className="text-[11.5px]">
                    {planMaxProducts ? `${planMaxProducts} produtos` : 'Produtos ilimitados'}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-white/55">
                  <RefreshCw className="h-5 w-5" />
                  <span className="text-[11.5px]">
                    {planBillingCycle === 'yearly' ? 'Renovação anual' : 'Renovação mensal'}
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Cupom de desconto */}
          {onApplyCoupon && (
            <div className="mt-4">
              {!showCoupon && !appliedCoupon?.valid ? (
                <button
                  type="button"
                  onClick={() => setShowCoupon(true)}
                  className="inline-flex items-center gap-1.5 text-[13.5px] font-semibold text-nxi2 transition-colors hover:text-nxp"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  Tenho um cupom de desconto
                </button>
              ) : appliedCoupon?.valid ? (
                <div className="flex items-center justify-between rounded-xl border border-nxs/25 bg-nxs/[0.06] p-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <Ticket className="h-4 w-4 shrink-0 text-nxs" />
                    <span className="truncate text-[13.5px] font-medium text-nxi1">
                      Cupom{' '}
                      <span className="font-mono font-bold">{appliedCoupon.coupon?.code}</span>{' '}
                      aplicado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveCoupon?.()
                      setShowCoupon(false)
                    }}
                    className="inline-flex items-center gap-1 text-[12px] font-semibold text-nxs transition-colors hover:text-nxi1"
                  >
                    <X className="h-3 w-3" />
                    Remover
                  </button>
                </div>
              ) : (
                <div className="rounded-xl border border-nxborder bg-white p-3">
                  <Label className="mb-2 block text-[12px] font-bold text-nxi2">
                    Código do cupom
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => onCouponInputChange?.(e.target.value.toUpperCase())}
                      placeholder="EX: BLACK50"
                      className="h-9 rounded-lg border-nxborder font-mono uppercase focus-visible:border-nxp focus-visible:ring-nxp/15"
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

          {/* Security badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            className="mt-4 flex items-center gap-2 text-nxi3"
          >
            <ShieldCheck className="h-4 w-4" />
            <span className="text-[12px]">Pagamento seguro via Asaas</span>
          </motion.div>
        </div>

        {/* ── Right: payment selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-2xl border border-nxborder bg-white p-6"
        >
          <div className="mb-5">
            <h2 className="mb-1 text-[19px] font-extrabold tracking-tight text-nxi1">
              {isFreeCheckout ? 'Sua assinatura será gratuita' : 'Escolha o método de pagamento'}
            </h2>
            <p className="text-[13.5px] text-nxi3">
              {isFreeCheckout
                ? 'Cupom aplicado zerou o valor desta assinatura. Confirme para ativar.'
                : 'Selecione a forma de pagamento mais conveniente para você'}
            </p>
          </div>

          {isFreeCheckout && (
            <div className="mb-5 rounded-xl border border-nxs/25 bg-nxs/[0.06] p-4">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-nxs/15 text-nxs">
                  <Check className="h-5 w-5" strokeWidth={3} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-[13.5px] font-bold text-nxi1">R$ 0,00 — sem cobrança</p>
                  <p className="text-[12px] text-nxi2">
                    Você não será cobrado enquanto o cupom estiver ativo. Sem cartão necessário.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment method rows */}
          {!isFreeCheckout && (
            <div className="mb-5 space-y-2">
              {paymentMethods.map((method) => (
                <button
                  key={method.id}
                  type="button"
                  onClick={() => onSelectMethod(method.id)}
                  className={cn(
                    'flex w-full items-center gap-4 rounded-xl border p-4 text-left transition-all',
                    selectedMethod === method.id
                      ? 'border-nxp bg-nxp/[0.04]'
                      : 'border-nxborder bg-white hover:border-nxi3',
                  )}
                >
                  <div
                    className={cn(
                      'flex h-10 w-10 shrink-0 items-center justify-center rounded-lg transition-colors',
                      selectedMethod === method.id ? 'bg-nxp text-white' : 'bg-nxbg text-nxi3',
                    )}
                  >
                    {method.icon}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[13.5px] font-bold text-nxi1">{method.name}</p>
                    <p className="text-[12px] text-nxi3">{method.description}</p>
                  </div>
                  <ChevronRight
                    className={cn(
                      'h-4 w-4 shrink-0 transition-colors',
                      selectedMethod === method.id ? 'text-nxp' : 'text-nxi3/50',
                    )}
                  />
                </button>
              ))}
            </div>
          )}

          {/* Document input for PIX / BOLETO */}
          <AnimatePresence>
            {needsDocument && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-5 overflow-hidden"
              >
                <div className="rounded-xl border border-nxborder bg-nxbg p-4">
                  <p className="mb-3 text-[13px] font-bold text-nxi2">Documento para pagamento</p>

                  {!documentType ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectDocumentType('cpf')}
                        className="h-9 flex-1 rounded-lg border border-nxborder bg-white text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxp hover:text-nxp"
                      >
                        Usar CPF
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectDocumentType('cnpj')}
                        className="h-9 flex-1 rounded-lg border border-nxborder bg-white text-[13px] font-semibold text-nxi2 transition-colors hover:border-nxp hover:text-nxp"
                      >
                        Usar CNPJ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-[12px] font-bold text-nxi2">
                          {documentType === 'cpf' ? 'CPF' : 'CNPJ'}
                        </Label>
                        <button
                          type="button"
                          onClick={onDocumentTypeReset}
                          className="text-[12px] text-nxi3 transition-colors hover:text-nxi1"
                        >
                          Trocar documento
                        </button>
                      </div>
                      <Input
                        type="text"
                        value={documentType === 'cpf' ? cpf : cnpj}
                        onChange={(e) =>
                          documentType === 'cpf'
                            ? onCpfChange(e.target.value)
                            : onCnpjChange(e.target.value)
                        }
                        placeholder={
                          documentType === 'cpf' ? '000.000.000-00' : '00.000.000/0000-00'
                        }
                        maxLength={documentType === 'cpf' ? 14 : 18}
                        className="h-9 rounded-lg border-nxborder bg-white text-sm focus-visible:border-nxp focus-visible:ring-nxp/15"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue button */}
          <button
            type="button"
            onClick={onCreateSubscription}
            disabled={!canContinue}
            className="flex h-12 w-full items-center justify-center gap-1.5 rounded-xl bg-nxp text-[14.5px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99] disabled:opacity-50"
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

          {/* Terms */}
          <p className="mt-4 text-center text-[12px] leading-relaxed text-nxi3">
            Ao continuar, você concorda com nossos{' '}
            <span className="font-semibold text-nxi2">termos de serviço</span> e{' '}
            <span className="font-semibold text-nxi2">política de privacidade</span>
          </p>
        </motion.div>
      </div>
    </motion.div>
  )
}
