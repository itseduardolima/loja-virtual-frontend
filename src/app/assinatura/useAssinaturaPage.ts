import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useSubscriptionPlan } from "@/hooks/useSubscriptionPlan";
import { useCreateSubscription } from "@/hooks/useCreateSubscription";
import { useMySubscription } from "@/hooks/useMySubscription";
import { useSyncSubscription } from "@/hooks/useSyncSubscription";
import { BillingType } from "@/types/subscription";
import { formatCPF, formatCNPJ } from "@/lib/utils";

export type Step = "select" | "processing" | "payment" | "success" | "completed";

export function useAssinaturaPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading: isLoadingAuth } = useAuth();
  const [selectedMethod, setSelectedMethod] = useState<BillingType | null>(
    "CREDIT_CARD"
  );
  const [step, setStep] = useState<Step>("select");
  const [documentType, setDocumentType] = useState<"cpf" | "cnpj" | null>(null);
  const [cpf, setCpf] = useState("");
  const [cnpj, setCnpj] = useState("");
  const [paymentData, setPaymentData] = useState<{
    payment_url: string;
    qr_code: string | null;
  } | null>(null);

  const {
    data: plan,
    isLoading: isLoadingPlan,
    error: planError,
    refetch: refetchPlan,
  } = useSubscriptionPlan();
  const createSubscription = useCreateSubscription();
  
  // Usa polling quando estiver na tela de sucesso (não quando completed)
  const shouldPoll = step === "success" && isAuthenticated;
  const {
    data: mySubscription,
    refetch: refetchSubscription,
    isLoading: isLoadingSubscription,
    error: subscriptionError,
  } = useMySubscription({
    enabled: isAuthenticated && step !== "completed",
    refetchInterval: shouldPoll ? 5000 : false, // Polling a cada 5 segundos quando na tela de sucesso
  });
  const syncSubscription = useSyncSubscription();
  const hasCompletedRef = useRef(false);

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!isLoadingAuth && !isAuthenticated) {
      const currentPath = window.location.pathname;
      router.push(`/login?redirect=${encodeURIComponent(currentPath)}`);
    }
  }, [isAuthenticated, isLoadingAuth, router]);

  // Se a assinatura já está ativa ao carregar a página, mostra tela de sucesso final
  const subscriptionStatus = mySubscription?.status;
  const subscriptionPayments = mySubscription?.payments;

  useEffect(() => {
    // Não executa se já está em completed, ou se não está autenticado
    if (
      step === "completed" ||
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

    // Se estiver ativo ou tiver pagamento pago, mostra tela de sucesso final
    if (isActive || hasPaidPayment) {
      hasCompletedRef.current = true;
      setStep("completed");
    } 
    // Se estiver pending e ainda não estiver na tela de success, muda para success
    else if (isPending && step === "select") {
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

  // Verifica o status da assinatura quando estiver na tela de sucesso
  useEffect(() => {
    // Só executa se estiver na tela de sucesso (não quando completed)
    if (
      step !== "success" ||
      !isAuthenticated ||
      isLoadingAuth ||
      isLoadingSubscription ||
      hasCompletedRef.current
    ) {
      return;
    }

    // Se não tem subscription ainda, aguarda
    if (!mySubscription) {
      return;
    }

    const isActive = subscriptionStatus === "active";
    const hasPaidPayment = subscriptionPayments?.some(
      (payment: any) => payment.status === "paid"
    );

    // Se o status mudou para active, mostra tela de sucesso final
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

  const handleSelectMethod = (method: BillingType) => {
    setSelectedMethod(method);
    // Limpa os campos quando muda o método
    if (method === "CREDIT_CARD") {
      setCpf("");
      setCnpj("");
      setDocumentType(null);
    } else {
      // Se mudar para PIX ou BOLETO, reseta o tipo de documento
      setDocumentType(null);
    }
  };

  const handleSelectDocumentType = (type: "cpf" | "cnpj") => {
    setDocumentType(type);
    // Limpa o campo oposto quando troca o tipo
    if (type === "cpf") {
      setCnpj("");
    } else {
      setCpf("");
    }
  };

  const handleCreateSubscription = async () => {
    if (!selectedMethod) return;

    // Validação para PIX e BOLETO
    if (selectedMethod === "PIX" || selectedMethod === "BOLETO") {
      if (!documentType) {
        alert("Por favor, selecione CPF ou CNPJ para continuar.");
        return;
      }

      const cpfClean = cpf.replace(/\D/g, "");
      const cnpjClean = cnpj.replace(/\D/g, "");

      if (documentType === "cpf" && !cpfClean) {
        alert("Por favor, preencha o CPF para continuar.");
        return;
      }

      if (documentType === "cnpj" && !cnpjClean) {
        alert("Por favor, preencha o CNPJ para continuar.");
        return;
      }
    }

    setStep("processing");
    try {
      const payload: {
        billing_type: BillingType;
        cpf?: string;
        cnpj?: string;
      } = {
        billing_type: selectedMethod,
      };

      // Adiciona CPF ou CNPJ apenas para PIX e BOLETO
      if (selectedMethod === "PIX" || selectedMethod === "BOLETO") {
        const cpfClean = cpf.replace(/\D/g, "");
        const cnpjClean = cnpj.replace(/\D/g, "");

        if (cpfClean) {
          payload.cpf = cpfClean;
        }
        if (cnpjClean) {
          payload.cnpj = cnpjClean;
        }
      }

      const response = await createSubscription.mutateAsync(payload);

      setPaymentData({
        payment_url: response.payment_url,
        qr_code: response.qr_code,
      });

      // Se for PIX, mostra o QR code
      if (selectedMethod === "PIX" && response.qr_code) {
        setStep("payment");
      } else {
        // Para outros métodos, abre payment_url em nova aba
        window.open(response.payment_url, "_blank");
        // Muda para a tela de sucesso após abrir o link
        setStep("success");
      }
    } catch (error) {
      setStep("select");
      alert("Erro ao processar assinatura. Tente novamente.");
    }
  };

  const handleRedirectToPayment = () => {
    if (paymentData?.payment_url) {
      window.open(paymentData.payment_url, "_blank");
      // Muda para a tela de sucesso após abrir o link
      setStep("success");
    }
  };

  const handleCpfChange = (value: string) => {
    setCpf(formatCPF(value));
  };

  const handleCnpjChange = (value: string) => {
    setCnpj(formatCNPJ(value));
  };

  const handleDocumentTypeReset = () => {
    setDocumentType(null);
  };

  const handleGoToLogin = () => {
    router.push("/login");
  };

  // Validação para botão de continuar
  const needsDocument = selectedMethod === "PIX" || selectedMethod === "BOLETO";
  const hasDocument =
    (documentType === "cpf" && cpf.replace(/\D/g, "")) ||
    (documentType === "cnpj" && cnpj.replace(/\D/g, ""));
  const canContinue =
    selectedMethod &&
    (!needsDocument || (documentType && hasDocument)) &&
    !createSubscription.isPending;

  // Status do pagamento
  const isPaymentConfirmed =
    subscriptionStatus === "active" ||
    subscriptionPayments?.some((payment: any) => payment.status === "paid");

  return {
    // Estado
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

    // Loading states
    isLoadingAuth,
    isLoadingPlan,
    isLoadingSubscription,
    isCreatingSubscription: createSubscription.isPending,

    // Errors
    planError,
    subscriptionError,

    // Handlers
    handleSelectMethod,
    handleSelectDocumentType,
    handleCreateSubscription,
    handleRedirectToPayment,
    handleCpfChange,
    handleCnpjChange,
    handleDocumentTypeReset,
    handleGoToLogin,
    refetchPlan,

    // Computed values
    canContinue,
    needsDocument,
  };
}

