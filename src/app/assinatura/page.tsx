'use client'

import { Suspense } from 'react'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingPage } from '@/components'
import { AlertCircle, Check } from 'lucide-react'
import { useAssinaturaPage } from './useAssinaturaPage'
import { derivePlanFeaturesList } from '@/lib/planUtils'
import {
  RegisterStep,
  PlanSelectionStep,
  SelectPaymentMethodStep,
  ProcessingStep,
  PaymentStep,
  SuccessStep,
  CompletedStep,
} from './components'
import { NexoLeftPanel } from '@/components/Layout'
import type { Step } from './useAssinaturaPage'

const BULLETS_MARKETING = [
  'Loja própria em minutos',
  'Gestão de pedidos e catálogo',
  'Suporte e relatórios em tempo real',
]

const BULLETS_PLAN = [
  'Teste grátis disponível',
  'Cancele quando quiser',
  'Suporte em todos os planos',
]

const BULLETS_COMPLETED = [
  'Crie seu catálogo de produtos',
  'Receba pedidos online',
  'Acompanhe suas vendas',
]

function Bullets({ items }: { items: string[] }) {
  return (
    <div className="flex flex-col gap-3.5">
      {items.map((b) => (
        <div key={b} className="flex items-center gap-3">
          <div className="w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 bg-white/[12%]">
            <Check className="w-3 h-3 text-white" strokeWidth={2.5} />
          </div>
          <span className="text-sm text-white/75">{b}</span>
        </div>
      ))}
    </div>
  )
}

function PanelContent({ step }: { step: Step }) {
  if (step === 'completed') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white leading-snug mb-2">
          Bem-vindo à nexo!
        </h2>
        <p className="text-sm mb-8 text-white/50">
          Sua loja está pronta para começar.
        </p>
        <Bullets items={BULLETS_COMPLETED} />
      </div>
    )
  }

  if (step === 'plan' || step === 'select' || step === 'processing' || step === 'payment' || step === 'success') {
    return (
      <div>
        <h2 className="text-2xl font-bold text-white leading-snug mb-2">
          Escolha e comece<br />a vender.
        </h2>
        <p className="text-sm mb-8 text-white/50">
          Planos flexíveis para qualquer negócio.
        </p>
        <Bullets items={BULLETS_PLAN} />
      </div>
    )
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white leading-snug mb-2">
        Venda online.<br />Cresça de verdade.
      </h2>
      <p className="text-sm mb-8 text-white/50">
        Tudo que você precisa para vender mais.
      </p>
      <Bullets items={BULLETS_MARKETING} />
    </div>
  )
}

function AssinaturaContent() {
  const router = useRouter()
  const {
    selectedMethod,
    step,
    documentType,
    cpf,
    cnpj,
    paymentData,
    plans,
    plan,
    selectedCycle,
    couponInput,
    setCouponInput,
    appliedCoupon,
    isValidatingCoupon,
    handleApplyCoupon,
    handleRemoveCoupon,
    isPaymentConfirmed,
    completedReason,
    completedTrialDays,
    completedCouponCode,
    completedFreeAccessUntil,
    registerMode,
    isSubmittingAuth,
    isLoadingAuth,
    isLoadingPlan,
    isCreatingSubscription,
    planError,
    handleSelectPlan,
    handleStartTrial,
    handleBackToPlan,
    handleSelectMethod,
    handleSelectDocumentType,
    handleCreateSubscription,
    handleRedirectToPayment,
    handleCpfChange,
    handleCnpjChange,
    handleDocumentTypeReset,
    handleGoToDashboard,
    refetchPlan,
    handleRegisterAndContinue,
    handleInlineLogin,
    toggleRegisterMode,
    canContinue,
    needsDocument,
    isFreeCheckout,
  } = useAssinaturaPage()

  const planPriceRaw = plan
    ? selectedCycle === 'yearly'
      ? plan.price_yearly
      : plan.price_monthly
    : null
  const planPriceNum =
    planPriceRaw != null
      ? typeof planPriceRaw === 'string'
        ? parseFloat(planPriceRaw)
        : planPriceRaw
      : undefined

  const planFeatures: string[] = plan ? derivePlanFeaturesList(plan) : []

  const panelFooter = (
    <p className="text-xs text-white/35">
      +2.400 vendedores ativos na plataforma
    </p>
  )

  if (isLoadingAuth) return <LoadingPage />

  if (step !== 'register' && isLoadingPlan) return <LoadingPage />

  if (step !== 'register' && (planError || !plans?.length)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <NexoLeftPanel footer={panelFooter}>
          <PanelContent step={step} />
        </NexoLeftPanel>
        <div className="flex-1 flex items-center justify-center bg-white px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="max-w-sm w-full text-center"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 mb-2">
              Planos não disponíveis
            </h2>
            <p className="text-sm text-gray-500 mb-6">
              {planError
                ? 'Erro ao carregar os planos. Tente novamente.'
                : 'Não há planos disponíveis no momento.'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => refetchPlan()}
                className="h-11 rounded-xl bg-black text-white text-sm font-semibold hover:bg-gray-900 transition-colors"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => router.push('/')}
                className="h-11 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Voltar para Home
              </button>
            </div>
          </motion.div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen overflow-hidden">
      <NexoLeftPanel footer={panelFooter}>
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            <PanelContent step={step} />
          </motion.div>
        </AnimatePresence>
      </NexoLeftPanel>

      <div className="flex-1 flex flex-col overflow-hidden bg-white">
        <div className="flex-1 overflow-y-auto">
          <div className="min-h-full flex flex-col justify-center px-6 sm:px-10 lg:px-14 py-10">
            <AnimatePresence mode="wait">
              {step === 'register' && (
                <RegisterStep
                  key="register"
                  mode={registerMode}
                  isSubmitting={isSubmittingAuth}
                  planPrice={planPriceNum}
                  planName={plan?.name}
                  onSubmitRegister={handleRegisterAndContinue}
                  onSubmitLogin={handleInlineLogin}
                  onToggleMode={toggleRegisterMode}
                />
              )}

              {step === 'plan' && plans && (
                <PlanSelectionStep
                  key="plan"
                  plans={plans}
                  onSelectPlan={handleSelectPlan}
                  onStartTrial={handleStartTrial}
                />
              )}

              {step === 'select' && (
                <SelectPaymentMethodStep
                  key="select"
                  planPrice={planPriceNum}
                  planFeatures={planFeatures}
                  planName={plan?.name}
                  planMaxProducts={plan?.max_products}
                  planBillingCycle={selectedCycle}
                  couponInput={couponInput}
                  appliedCoupon={appliedCoupon}
                  isValidatingCoupon={isValidatingCoupon}
                  onCouponInputChange={setCouponInput}
                  onApplyCoupon={handleApplyCoupon}
                  onRemoveCoupon={handleRemoveCoupon}
                  selectedMethod={selectedMethod}
                  documentType={documentType}
                  cpf={cpf}
                  cnpj={cnpj}
                  needsDocument={Boolean(needsDocument)}
                  canContinue={Boolean(canContinue)}
                  isCreatingSubscription={isCreatingSubscription}
                  isFreeCheckout={isFreeCheckout}
                  onSelectMethod={handleSelectMethod}
                  onSelectDocumentType={handleSelectDocumentType}
                  onCpfChange={handleCpfChange}
                  onCnpjChange={handleCnpjChange}
                  onDocumentTypeReset={handleDocumentTypeReset}
                  onCreateSubscription={handleCreateSubscription}
                  onBack={handleBackToPlan}
                />
              )}

              {step === 'processing' && <ProcessingStep key="processing" />}

              {step === 'payment' && paymentData?.qr_code && (
                <PaymentStep
                  key="payment"
                  qrCode={paymentData.qr_code}
                  onRedirectToPayment={handleRedirectToPayment}
                />
              )}

              {step === 'success' && (
                <SuccessStep
                  key="success"
                  isPaymentConfirmed={Boolean(isPaymentConfirmed)}
                />
              )}

              {step === 'completed' && (
                <CompletedStep
                  key="completed"
                  onGoToDashboard={handleGoToDashboard}
                  reason={completedReason}
                  trialDays={completedTrialDays}
                  couponCode={completedCouponCode}
                  freeAccessUntil={completedFreeAccessUntil}
                />
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function AssinaturaPage() {
  return (
    <Suspense fallback={<LoadingPage />}>
      <AssinaturaContent />
    </Suspense>
  )
}
