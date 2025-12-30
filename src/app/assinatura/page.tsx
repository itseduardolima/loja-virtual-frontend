"use client";

import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { LoadingPage, LoadingSpinner } from "@/components";
import { AlertCircle } from "lucide-react";
import { useAssinaturaPage } from "./useAssinaturaPage";
import {
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
    plan,
    mySubscription,
    subscriptionStatus,
    subscriptionPayments,
    isPaymentConfirmed,
    isLoadingAuth,
    isLoadingPlan,
    isLoadingSubscription,
    isCreatingSubscription,
    planError,
    subscriptionError,
    handleSelectMethod,
    handleSelectDocumentType,
    handleCreateSubscription,
    handleRedirectToPayment,
    handleCpfChange,
    handleCnpjChange,
    handleDocumentTypeReset,
    handleGoToLogin,
    refetchPlan,
    canContinue,
    needsDocument,
  } = useAssinaturaPage();

  if (isLoadingAuth || isLoadingPlan) {
    return <LoadingPage />;
  }

  if (planError || (!isLoadingPlan && !plan)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 flex items-center justify-center py-12 sm:py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl sm:rounded-2xl shadow-lg border border-gray-200 p-6 sm:p-8 max-w-md mx-4 text-center"
        >
          <div className="mb-6">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-600" />
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3">
              Plano não disponível
            </h2>
            <p className="text-gray-600 mb-6">
              {planError
                ? "Erro ao carregar o plano. Tente novamente."
                : "Não há planos disponíveis no momento."}
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
            <motion.button
              onClick={() => refetchPlan()}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-primary text-white px-6 py-3 rounded-xl hover:bg-black/80 transition-colors font-semibold shadow-lg hover:shadow-xl"
            >
              Tentar Novamente
            </motion.button>
            <motion.button
              onClick={() => router.push("/")}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-gray-200 text-gray-700 px-6 py-3 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
            >
              Voltar para Home
            </motion.button>
          </div>
          {planError && (
            <div className="mt-6 pt-6 border-t border-gray-200">
              <p className="text-xs text-gray-500 font-mono">
                {planError instanceof Error
                  ? planError.message
                  : "Erro desconhecido"}
              </p>
            </div>
          )}
        </motion.div>
      </div>
    );
  }

  if (!plan) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 py-12 sm:py-16 md:py-24">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12 sm:mb-16"
        >
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Assinar Plano
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto">
            Escolha o método de pagamento para começar sua jornada como vendedor
          </p>
        </motion.div>

        <AnimatePresence mode="wait">
          {step === "select" && (
            <SelectPaymentMethodStep
              selectedMethod={selectedMethod}
              documentType={documentType}
              cpf={cpf}
              cnpj={cnpj}
              needsDocument={Boolean(needsDocument)}
              canContinue={Boolean(canContinue)}
              isCreatingSubscription={isCreatingSubscription}
              onSelectMethod={handleSelectMethod}
              onSelectDocumentType={handleSelectDocumentType}
              onCpfChange={handleCpfChange}
              onCnpjChange={handleCnpjChange}
              onDocumentTypeReset={handleDocumentTypeReset}
              onCreateSubscription={handleCreateSubscription}
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
            <CompletedStep onGoToLogin={handleGoToLogin} />
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
