"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingPage } from "@/components";
import { AlertCircle } from "lucide-react";
import { useAssinaturaPage } from "./useAssinaturaPage";
import { derivePlanFeaturesList } from "@/lib/planUtils";
import {
  RegisterStep,
  PlanSelectionStep,
  SelectPaymentMethodStep,
  ProcessingStep,
  PaymentStep,
  SuccessStep,
  CompletedStep,
} from "./components";

export default function AssinaturaPage() {
  const router = useRouter();
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
  } = useAssinaturaPage();

  if (isLoadingAuth) return <LoadingPage />;

  if (step !== "register") {
    if (isLoadingPlan) return <LoadingPage />;

    if (planError || !plans?.length) {
      return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-2xl shadow-sm border border-gray-200 p-8 max-w-md w-full text-center"
          >
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-7 h-7 text-red-600" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Planos não disponíveis
            </h2>
            <p className="text-gray-500 mb-6 text-sm">
              {planError
                ? "Erro ao carregar os planos. Tente novamente."
                : "Não há planos disponíveis no momento."}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => refetchPlan()}
                className="px-6 py-2.5 rounded-xl bg-gray-900 text-white text-sm font-medium hover:bg-gray-800 transition-colors"
              >
                Tentar Novamente
              </button>
              <button
                onClick={() => router.push("/")}
                className="px-6 py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Voltar para Home
              </button>
            </div>
          </motion.div>
        </div>
      );
    }
  }

  const planPriceRaw = plan
    ? selectedCycle === "yearly"
      ? plan.price_yearly
      : plan.price_monthly
    : null;
  const planPriceNum = planPriceRaw != null
    ? typeof planPriceRaw === "string"
      ? parseFloat(planPriceRaw)
      : planPriceRaw
    : undefined;

  const planFeatures: string[] = plan ? derivePlanFeaturesList(plan) : [];

  // These steps have their own title/header built in
  // Completed também não usa o header padrão — o card já comunica o estado
  const showHeader = step !== "select" && step !== "plan" && step !== "completed";

  const pageTitle =
    step === "register" ? "Comece a vender online" : "Assinar Plano";
  const pageSubtitle =
    step === "register"
      ? "Crie sua conta gratuita e assine o plano para ter sua loja virtual"
      : "Escolha o método de pagamento para começar sua jornada como vendedor";

  return (
    <div className="min-h-screen bg-gray-50 py-12 sm:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {showHeader && (
          <motion.div
            key={step}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12 sm:mb-16"
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              {pageTitle}
            </h1>
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto">
              {pageSubtitle}
            </p>
          </motion.div>
        )}

        <AnimatePresence mode="wait">
          {step === "register" && (
            <RegisterStep
              mode={registerMode}
              isSubmitting={isSubmittingAuth}
              planPrice={planPriceNum}
              planName={plan?.name}
              onSubmitRegister={handleRegisterAndContinue}
              onSubmitLogin={handleInlineLogin}
              onToggleMode={toggleRegisterMode}
            />
          )}

          {step === "plan" && plans && (
            <PlanSelectionStep
              plans={plans}
              onSelectPlan={handleSelectPlan}
              onStartTrial={handleStartTrial}
            />
          )}

          {step === "select" && (
            <SelectPaymentMethodStep
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

          {step === "processing" && <ProcessingStep />}

          {step === "payment" && paymentData?.qr_code && (
            <PaymentStep
              qrCode={paymentData.qr_code}
              onRedirectToPayment={handleRedirectToPayment}
            />
          )}

          {step === "success" && (
            <SuccessStep isPaymentConfirmed={Boolean(isPaymentConfirmed)} />
          )}

          {step === "completed" && (
            <CompletedStep
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
  );
}
