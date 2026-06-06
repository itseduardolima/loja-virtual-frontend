'use client'

import { Suspense } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import { LoadingPage } from '@/components'
import { AlertCircle } from 'lucide-react'
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
import { AuthLeftPanel, type AuthPanelContent } from '@/components/Auth'
import type { Step } from './useAssinaturaPage'

const PANEL_FOOTER = '+2.400 vendedores ativos na plataforma'

const PANEL_REGISTER: AuthPanelContent = {
  panelTitle: 'Venda online.\nCresça de verdade.',
  panelSub: 'Tudo que você precisa para vender mais, num só lugar.',
  bullets: [
    'Loja própria no ar em minutos',
    'Gestão de pedidos e catálogo',
    'Relatórios e suporte em tempo real',
  ],
  footer: PANEL_FOOTER,
}

const PANEL_PLAN: AuthPanelContent = {
  panelTitle: 'Escolha e comece\na vender.',
  panelSub: 'Planos flexíveis para qualquer negócio.',
  bullets: ['Teste grátis disponível', 'Cancele quando quiser', 'Suporte em todos os planos'],
  footer: PANEL_FOOTER,
}

const PANEL_COMPLETED: AuthPanelContent = {
  panelTitle: 'Bem-vindo\nà Nexo!',
  panelSub: 'Sua loja está pronta para começar.',
  bullets: ['Crie seu catálogo de produtos', 'Receba pedidos online', 'Acompanhe suas vendas'],
  footer: PANEL_FOOTER,
}

function panelContentForStep(step: Step): AuthPanelContent {
  if (step === 'completed') return PANEL_COMPLETED
  if (step === 'register') return PANEL_REGISTER
  return PANEL_PLAN
}

function MobileBrandBar() {
  return (
    <div className="flex shrink-0 items-center px-6 pt-6 sm:px-10 lg:hidden">
      <Link href="/" className="flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-nxp text-[13px] font-extrabold text-white">
          N
        </span>
        <span className="font-integral text-[15px] tracking-[0.04em] text-nxi1">NEXO</span>
      </Link>
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

  if (isLoadingAuth) return <LoadingPage />

  if (step !== 'register' && isLoadingPlan) return <LoadingPage />

  if (step !== 'register' && (planError || !plans?.length)) {
    return (
      <div className="flex h-screen overflow-hidden">
        <AuthLeftPanel content={panelContentForStep(step)} />
        <div className="flex flex-1 items-center justify-center bg-white px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-sm text-center"
          >
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-nxd/10 text-nxd">
              <AlertCircle size={30} />
            </div>
            <h2 className="mb-2 text-[20px] font-extrabold tracking-tight text-nxi1">
              Planos não disponíveis
            </h2>
            <p className="mb-6 text-[14px] text-nxi2">
              {planError
                ? 'Erro ao carregar os planos. Tente novamente.'
                : 'Não há planos disponíveis no momento.'}
            </p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => refetchPlan()}
                className="h-11 rounded-xl bg-nxp text-[14px] font-bold text-white transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99]"
              >
                Tentar novamente
              </button>
              <button
                onClick={() => router.push('/')}
                className="h-11 rounded-xl border border-nxborder bg-white text-[14px] font-semibold text-nxi2 transition-colors hover:border-nxi3 hover:bg-nxbg"
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
      <AuthLeftPanel
        key={panelContentForStep(step).panelTitle}
        content={panelContentForStep(step)}
      />

      <div className="flex flex-1 flex-col overflow-hidden bg-white">
        <MobileBrandBar />
        <div className="flex-1 overflow-y-auto">
          <div className="flex min-h-full flex-col justify-center px-6 py-10 sm:px-10 lg:px-14">
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
                <SuccessStep key="success" isPaymentConfirmed={Boolean(isPaymentConfirmed)} />
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
