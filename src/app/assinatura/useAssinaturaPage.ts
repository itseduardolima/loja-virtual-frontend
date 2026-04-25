'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { useMySubscription } from "@/hooks/useMySubscription";
import { BillingType, SubscriptionPlan } from "@/types/subscription";
import { formatCPF, formatCNPJ } from "@/lib/utils";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export type Step = "register" | "plan" | "select" | "processing" | "payment" | "success" | "completed";

export function useAssinaturaPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isLoadingAuth, login } = useAuth();

  const [step, setStep] = useState<Step>("select");
  const [registerMode, setRegisterMode] = useState<"register" | "login">("register");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);

  const [selectedMethod, setSelectedMethod] = useState<BillingType | null>("CREDIT_CARD");
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj" | null>(null);
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [paymentData, setPaymentData] = useState<{
    payment_url: string;
    qr_code: string | null;
  } | null>(null);

  const {
    data: plans,
    isLoading: isLoadingPlan,
    error: planError,
    refetch: refetchPlan,
  } = useSubscriptionPlans();

  const createSubscription = useCreateSubscription();

  const shouldPoll = step === "success" && isAuthenticated;
  const {
    data: mySubscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useMySubscription({
    enabled: isAuthenticated && step !== "completed",
    refetchInterval: shouldPoll ? 5000 : false,
  });
  const hasCompletedRef = useRef(false);

  // If not authenticated, show register step; if authenticated, show plan selection
  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      setStep("register");
    } else if (step === "select" && !selectedPlan) {
      setStep("plan");
    }
  }, [isLoadingAuth, isAuthenticated]); // eslint-disable-line react-hooks/exhaustive-deps

  const subscriptionStatus = mySubscription?.status;
  const subscriptionPayments = mySubscription?.payments;

  useEffect(() => {
    if (
      step === "completed" ||
      step === "register" ||
      step === "plan" ||
      !isAuthenticated ||
      isLoadingAuth ||
      isLoadingSubscription ||
      !mySubscription ||
      hasCompletedRef.current
    ) {
      return;
    }

    const isActive = subscriptionStatus === "active";
    const hasPaidPayment = subscriptionPayments?.some(
      (payment: any) => payment.status === "paid"
    );
    const isPending = subscriptionStatus === "pending";

    if (isActive || hasPaidPayment) {
      hasCompletedRef.current = true;
      setStep("completed");
    } else if (isPending && step === "select") {
      setStep("success");
    }
  }, [
    subscriptionStatus,
    subscriptionPayments,
    step,
    isAuthenticated,
    isLoadingAuth,
    isLoadingSubscription,
    mySubscription,
  ]);

  useEffect(() => {
    if (
      step !== "success" ||
      !isAuthenticated ||
      isLoadingAuth ||
      isLoadingSubscription ||
      hasCompletedRef.current
    ) {
      return;
    }

    if (!mySubscription) return;

    const isActive = subscriptionStatus === "active";
    const hasPaidPayment = subscriptionPayments?.some(
      (payment: any) => payment.status === "paid"
    );

    if (isActive || hasPaidPayment) {
      hasCompletedRef.current = true;
      setStep("completed");
    }
  }, [
    step,
    isAuthenticated,
    isLoadingAuth,
    isLoadingSubscription,
    subscriptionStatus,
    subscriptionPayments,
    mySubscription,
  ]);

  const handleRegisterAndContinue = async (
    name: string,
    email: string,
    password: string,
    whatsapp: string
  ) => {
    setIsSubmittingAuth(true);
    try {
      await api.post("/user/register", {
        name,
        email,
        password,
        ...(whatsapp && { whatsapp }),
      });
      await login({ login: email, password });
      setStep("plan");
    } catch (error: any) {
      const msg = error.response?.data?.message;
      toast.error(
        Array.isArray(msg) ? msg[0] : msg || "Erro ao criar conta. Tente novamente."
      );
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const handleInlineLogin = async (email: string, password: string) => {
    setIsSubmittingAuth(true);
    try {
      await login({ login: email, password });
      setStep("plan");
    } catch {
      toast.error("Email ou senha incorretos. Tente novamente.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const toggleRegisterMode = () => {
    setRegisterMode((prev) => (prev === "register" ? "login" : "register"));
  };

  const handleSelectPlan = (plan: SubscriptionPlan) => {
    setSelectedPlan(plan);
    setStep("select");
  };

  const handleSelectMethod = (method: BillingType) => {
    setSelectedMethod(method);
    if (method === "CREDIT_CARD") {
      setCpf("");
      setCnpj("");
      setDocumentType(null);
    } else {
      setDocumentType(null);
    }
  };

  const handleSelectDocumentType = (type: "cpf" | "cnpj") => {
    setDocumentType(type);
    if (type === "cpf") {
      setCnpj("");
    } else {
      setCpf("");
    }
  };

  const handleCreateSubscription = async () => {
    if (!selectedMethod) return;

    if (selectedMethod === "PIX" || selectedMethod === "BOLETO") {
      if (!documentType) {
        toast.error("Por favor, selecione CPF ou CNPJ para continuar.");
        return;
      }

      const cpfClean = cpf.replace(/\D/g, "");
      const cnpjClean = cnpj.replace(/\D/g, "");

      if (documentType === "cpf" && !cpfClean) {
        toast.error("Por favor, preencha o CPF para continuar.");
        return;
      }

      if (documentType === "cnpj" && !cnpjClean) {
        toast.error("Por favor, preencha o CNPJ para continuar.");
        return;
      }
    }

    setStep("processing");
    try {
      const payload: {
        billing_type: BillingType;
        cpf?: string;
        cnpj?: string;
        plan_slug?: string;
      } = { billing_type: selectedMethod, ...(selectedPlan && { plan_slug: selectedPlan.slug }) };

      if (selectedMethod === "PIX" || selectedMethod === "BOLETO") {
        const cpfClean = cpf.replace(/\D/g, "");
        const cnpjClean = cnpj.replace(/\D/g, "");
        if (cpfClean) payload.cpf = cpfClean;
        if (cnpjClean) payload.cnpj = cnpjClean;
      }

      const response = await createSubscription.mutateAsync(payload);

      setPaymentData({
        payment_url: response.payment_url,
        qr_code: response.qr_code,
      });

      if (selectedMethod === "PIX" && response.qr_code) {
        setStep("payment");
      } else {
        window.open(response.payment_url, "_blank");
        setStep("success");
      }
    } catch {
      setStep("select");
      toast.error("Erro ao processar assinatura. Tente novamente.");
    }
  };

  const handleRedirectToPayment = () => {
    if (paymentData?.payment_url) {
      window.open(paymentData.payment_url, "_blank");
      setStep("success");
    }
  };

  const handleCpfChange = (value: string) => setCpf(formatCPF(value));
  const handleCnpjChange = (value: string) => setCnpj(formatCNPJ(value));
  const handleDocumentTypeReset = () => setDocumentType(null);
  const handleGoToDashboard = () => router.push("/vendedor");

  const needsDocument = selectedMethod === "PIX" || selectedMethod === "BOLETO";
  const hasDocument =
    (documentType === "cpf" && cpf.replace(/\D/g, "")) ||
    (documentType === "cnpj" && cnpj.replace(/\D/g, ""));
  const canContinue =
    selectedMethod &&
    (!needsDocument || (documentType && hasDocument)) &&
    !createSubscription.isPending;

  const isPaymentConfirmed =
    subscriptionStatus === "active" ||
    subscriptionPayments?.some((payment: any) => payment.status === "paid");

  return {
    // State
    selectedMethod,
    step,
    documentType,
    cpf,
    cnpj,
    paymentData,
    plans,
    selectedPlan,
    plan: selectedPlan,
    mySubscription,
    subscriptionStatus,
    subscriptionPayments,
    isPaymentConfirmed,
    registerMode,
    isSubmittingAuth,

    // Loading states
    isLoadingAuth,
    isLoadingPlan,
    isLoadingSubscription,
    isCreatingSubscription: createSubscription.isPending,

    // Errors
    planError,
    subscriptionError,

    // Plan handlers
    handleSelectPlan,

    // Subscription handlers
    handleSelectMethod,
    handleSelectDocumentType,
    handleCreateSubscription,
    handleRedirectToPayment,
    handleCpfChange,
    handleCnpjChange,
    handleDocumentTypeReset,
    handleGoToDashboard,
    refetchPlan,

    // Auth handlers
    handleRegisterAndContinue,
    handleInlineLogin,
    toggleRegisterMode,

    // Computed
    canContinue,
    needsDocument,
  };
}
