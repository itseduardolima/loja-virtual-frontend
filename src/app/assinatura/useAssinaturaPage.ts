'use client'

import { useState, useEffect, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { useMySubscription } from "@/hooks/useMySubscription";
import { useValidatePlanCoupon } from "@/hooks/useValidatePlanCoupon";
import { BillingType, BillingCycle, SubscriptionPlan, PlanCouponValidation } from "@/types/subscription";
import { formatCPF, formatCNPJ } from "@/lib/utils";
import { api } from "@/lib/api";
import toast from "react-hot-toast";

export type Step = "register" | "plan" | "select" | "processing" | "payment" | "success" | "completed";

const CYCLE_STORAGE_KEY = "subscription-cycle-pref";

function readPersistedCycle(): BillingCycle | null {
  if (typeof window === "undefined") return null;
  const v = window.localStorage.getItem(CYCLE_STORAGE_KEY);
  return v === "yearly" || v === "monthly" ? (v as BillingCycle) : null;
}

function persistCycle(cycle: BillingCycle): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(CYCLE_STORAGE_KEY, cycle);
}

function clearPersistedCycle(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(CYCLE_STORAGE_KEY);
}

export function useAssinaturaPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const planoParam = searchParams.get("plano");
  const trialParam = searchParams.get("trial") === "true";
  const queryClient = useQueryClient();
  const trialAutoTriggeredRef = useRef(false);
  const { isAuthenticated, isLoading: isLoadingAuth, login, refreshToken } = useAuth();

  const [step, setStep] = useState<Step>("select");
  const [registerMode, setRegisterMode] = useState<"register" | "login">("register");
  const [isSubmittingAuth, setIsSubmittingAuth] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<SubscriptionPlan | null>(null);
  // Prioridade: query param > localStorage (sobrevive a OAuth redirect) > default 'monthly'
  const initialCycle: BillingCycle = (() => {
    const fromUrl = searchParams.get("cycle");
    if (fromUrl === "yearly" || fromUrl === "monthly") return fromUrl;
    return readPersistedCycle() ?? "monthly";
  })();
  const [selectedCycle, setSelectedCycle] = useState<BillingCycle>(initialCycle);

  const [selectedMethod, setSelectedMethod] = useState<BillingType | null>("CREDIT_CARD");
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj" | null>(null);
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [paymentData, setPaymentData] = useState<{
    payment_url: string;
    qr_code: string | null;
  } | null>(null);

  // Cupom de desconto de plano
  const [couponInput, setCouponInput] = useState<string>("");
  const [appliedCoupon, setAppliedCoupon] = useState<PlanCouponValidation | null>(null);
  const validateCoupon = useValidatePlanCoupon();

  // Trial

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

  // If not authenticated, show register step; if authenticated, resolve plan from param or show selection
  useEffect(() => {
    if (isLoadingAuth) return;
    if (!isAuthenticated) {
      setStep("register");
      return;
    }
    if (step !== "select" || selectedPlan) return;

    // Wait for subscription to load before deciding
    if (isLoadingSubscription) return;

    // Already has active subscription — send to dashboard
    if (mySubscription?.status === "active") {
      router.replace("/vendedor");
      return;
    }

    // If there's a plano param, wait for plans to load before deciding
    if (planoParam && isLoadingPlan) return;

    if (planoParam && plans?.length) {
      const matched = plans.find((p) => p.slug === planoParam);
      if (matched) {
        // Auto-trial via ?trial=true (vindo da landing).
        // 'active' já foi tratado pelo redirect acima, então só falta checar 'pending'.
        const hasOngoingSubscription = mySubscription?.status === 'pending';
        if (
          trialParam &&
          matched.trial_days != null &&
          matched.trial_days > 0 &&
          !hasOngoingSubscription &&
          !trialAutoTriggeredRef.current
        ) {
          trialAutoTriggeredRef.current = true;
          // Cycle da URL > localStorage > 'monthly'
          const cycleFromUrl = searchParams.get("cycle");
          const trialCycle: BillingCycle =
            cycleFromUrl === "yearly" || cycleFromUrl === "monthly"
              ? cycleFromUrl
              : selectedCycle;
          handleStartTrial(matched, trialCycle);
          return;
        }
        setSelectedPlan(matched);
        return; // keep step "select"
      }
    }
    setStep("plan");
  }, [isLoadingAuth, isAuthenticated, plans, isLoadingPlan, isLoadingSubscription, mySubscription, trialParam]); // eslint-disable-line react-hooks/exhaustive-deps

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
      clearPersistedCycle();
      queryClient.removeQueries({ queryKey: ["validate-token"] });
      refreshToken()
        .catch(() => { console.warn("Token refresh failed after subscription confirmation") })
        .finally(() => setStep("completed"));
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
      clearPersistedCycle();
      queryClient.removeQueries({ queryKey: ["validate-token"] });
      refreshToken()
        .catch(() => { console.warn("Token refresh failed after subscription confirmation") })
        .finally(() => setStep("completed"));
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

  const resolveStepAfterAuth = () => {
    if (planoParam && plans?.length) {
      const matched = plans.find((p) => p.slug === planoParam);
      if (matched) {
        // Se veio com ?trial=true e o plano oferece trial, dispara fluxo gratuito
        if (
          trialParam &&
          matched.trial_days != null &&
          matched.trial_days > 0 &&
          !trialAutoTriggeredRef.current
        ) {
          trialAutoTriggeredRef.current = true;
          const cycleFromUrl = searchParams.get("cycle");
          const trialCycle: BillingCycle =
            cycleFromUrl === "yearly" || cycleFromUrl === "monthly"
              ? cycleFromUrl
              : selectedCycle;
          handleStartTrial(matched, trialCycle);
          return;
        }
        setSelectedPlan(matched);
        setStep("select");
        return;
      }
    }
    setStep("plan");
  };

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
      resolveStepAfterAuth();
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
      resolveStepAfterAuth();
    } catch {
      toast.error("Email ou senha incorretos. Tente novamente.");
    } finally {
      setIsSubmittingAuth(false);
    }
  };

  const toggleRegisterMode = () => {
    setRegisterMode((prev) => (prev === "register" ? "login" : "register"));
  };

  const handleSelectPlan = (plan: SubscriptionPlan, cycle: BillingCycle = "monthly") => {
    setSelectedPlan(plan);
    setSelectedCycle(cycle);
    persistCycle(cycle);
    setAppliedCoupon(null);
    setCouponInput("");
    setStep("select");
  };

  const handleStartTrial = (plan: SubscriptionPlan, cycle?: BillingCycle) => {
    if (plan.trial_days == null || plan.trial_days <= 0) {
      toast.error("Este plano não oferece período de trial.");
      return;
    }
    const targetCycle = cycle ?? selectedCycle;
    setSelectedPlan(plan);
    setSelectedCycle(targetCycle);
    setAppliedCoupon(null);
    setCouponInput("");
    // Trial não passa por seleção de método — vai direto criar
    void handleCreateTrialSubscription(plan, targetCycle);
  };

  const handleCreateTrialSubscription = async (plan: SubscriptionPlan, cycle: BillingCycle) => {
    setStep("processing");
    try {
      await createSubscription.mutateAsync({
        plan_slug: plan.slug,
        billing_cycle: cycle,
        start_trial: true,
      } as any);
      // Backend já promoveu o user a vendedor — atualiza o JWT/cache pra refletir
      hasCompletedRef.current = true;
      queryClient.removeQueries({ queryKey: ["validate-token"] });
      queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
      await refreshToken().catch(() => {
        console.warn("Token refresh failed after trial activation");
      });
      clearPersistedCycle();
      setStep("completed");
    } catch (err: any) {
      const msg = err?.response?.data?.message;
      toast.error(Array.isArray(msg) ? msg[0] : msg || "Erro ao iniciar trial");
      setStep("plan");
    }
  };

  const handleApplyCoupon = async () => {
    if (!selectedPlan || !couponInput.trim()) return;
    try {
      const result = await validateCoupon.mutateAsync({
        code: couponInput.trim().toUpperCase(),
        plan_slug: selectedPlan.slug,
        billing_cycle: selectedCycle,
      });
      if (!result.valid) {
        toast.error(result.message || "Cupom inválido");
        setAppliedCoupon(null);
        return;
      }
      setAppliedCoupon(result);
      toast.success(`Cupom aplicado! Desconto de R$ ${(result.discount_amount ?? 0).toFixed(2)}`);
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Erro ao validar cupom");
    }
  };

  const handleRemoveCoupon = () => {
    setAppliedCoupon(null);
    setCouponInput("");
  };

  const handleBackToPlan = () => {
    setSelectedPlan(null);
    setStep("plan");
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
    const isFree = appliedCoupon?.valid && (appliedCoupon.final_price ?? 0) <= 0;
    if (!isFree && !selectedMethod) return;

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
        billing_type?: BillingType;
        cpf?: string;
        cnpj?: string;
        plan_slug?: string;
        billing_cycle?: BillingCycle;
        coupon_code?: string;
      } = {
        billing_cycle: selectedCycle,
        ...(selectedMethod && { billing_type: selectedMethod }),
        ...(selectedPlan && { plan_slug: selectedPlan.slug }),
        ...(appliedCoupon?.coupon && { coupon_code: appliedCoupon.coupon.code }),
      };

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

      // Free path: backend não criou cobrança no Asaas (cupom 100% off)
      if (!response.payment_url && !response.qr_code) {
        // Backend promoveu o user a vendedor — atualiza JWT/cache
        hasCompletedRef.current = true;
        queryClient.removeQueries({ queryKey: ["validate-token"] });
        queryClient.invalidateQueries({ queryKey: ["my-subscription"] });
        await refreshToken().catch(() => {
          console.warn("Token refresh failed after free checkout");
        });
        clearPersistedCycle();
        setStep("completed");
        return;
      }

      if (selectedMethod === "PIX" && response.qr_code) {
        setStep("payment");
      } else if (response.payment_url) {
        window.open(response.payment_url, "_blank");
        setStep("success");
      } else {
        // fallback de segurança
        setStep("completed");
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
  const handleGoToDashboard = () => router.push("/vendedor/criar-loja");

  const isFreeCheckout = !!appliedCoupon?.valid && (appliedCoupon?.final_price ?? 0) <= 0;
  const needsDocument = !isFreeCheckout && (selectedMethod === "PIX" || selectedMethod === "BOLETO");
  const hasDocument =
    (documentType === "cpf" && cpf.replace(/\D/g, "")) ||
    (documentType === "cnpj" && cnpj.replace(/\D/g, ""));
  const canContinue =
    !createSubscription.isPending &&
    (isFreeCheckout || (selectedMethod && (!needsDocument || (documentType && hasDocument))));

  const isPaymentConfirmed =
    subscriptionStatus === "active" ||
    subscriptionPayments?.some((payment: any) => payment.status === "paid");

  // Tipo do completed: 'trial', 'coupon' (free) ou 'paid'
  const completedReason: "paid" | "trial" | "coupon" =
    mySubscription?.free_access_reason === "trial"
      ? "trial"
      : mySubscription?.free_access_reason === "coupon"
        ? "coupon"
        : "paid";

  const completedTrialDays =
    completedReason === "trial" ? selectedPlan?.trial_days ?? null : null;
  const completedCouponCode =
    completedReason === "coupon" ? mySubscription?.applied_coupon_code ?? null : null;
  const completedFreeAccessUntil = mySubscription?.free_access_until ?? null;

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
    selectedCycle,
    plan: selectedPlan,

    // Cupom
    couponInput,
    setCouponInput,
    appliedCoupon,
    isValidatingCoupon: validateCoupon.isPending,
    handleApplyCoupon,
    handleRemoveCoupon,
    mySubscription,
    subscriptionStatus,
    subscriptionPayments,
    isPaymentConfirmed,
    completedReason,
    completedTrialDays,
    completedCouponCode,
    completedFreeAccessUntil,
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
    handleStartTrial,
    handleBackToPlan,

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
    isFreeCheckout,
  };
}
