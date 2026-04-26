"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BillingType, PlanCouponValidation } from "@/types/subscription";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  QrCode,
  FileText,
  Package,
  RefreshCw,
  ShieldCheck,
  Ticket,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const paymentMethods = [
  {
    id: "CREDIT_CARD" as BillingType,
    name: "Cartão de Crédito",
    description: "Aprovação imediata",
    icon: <CreditCard className="w-5 h-5" />,
  },
  {
    id: "PIX" as BillingType,
    name: "PIX",
    description: "Pagamento instantâneo",
    icon: <QrCode className="w-5 h-5" />,
  },
  {
    id: "BOLETO" as BillingType,
    name: "Boleto Bancário",
    description: "Vencimento em 3 dias úteis",
    icon: <FileText className="w-5 h-5" />,
  },
];

interface SelectPaymentMethodStepProps {
  planPrice?: number;
  planFeatures?: string[];
  planName?: string;
  planMaxProducts?: number | null;
  planBillingCycle?: string;
  selectedMethod: BillingType | null;
  documentType: "cpf" | "cnpj" | null;
  cpf: string;
  cnpj: string;
  needsDocument: boolean;
  canContinue: boolean;
  isCreatingSubscription: boolean;
  isFreeCheckout?: boolean;
  // Cupom
  couponInput?: string;
  appliedCoupon?: PlanCouponValidation | null;
  isValidatingCoupon?: boolean;
  onCouponInputChange?: (v: string) => void;
  onApplyCoupon?: () => void;
  onRemoveCoupon?: () => void;
  onSelectMethod: (method: BillingType) => void;
  onSelectDocumentType: (type: "cpf" | "cnpj") => void;
  onCpfChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
  onDocumentTypeReset: () => void;
  onCreateSubscription: () => void;
  onBack: () => void;
}

function durationLabel(c: NonNullable<PlanCouponValidation['coupon']>): string {
  if (c.duration_type === 'forever') return 'em todas as renovações';
  if (c.duration_type === 'once') return 'apenas no primeiro pagamento';
  return `pelos próximos ${c.duration_months} meses`;
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
  const [showCoupon, setShowCoupon] = useState<boolean>(!!appliedCoupon?.valid);

  // Quando cupom é removido, fecha o painel automaticamente
  useEffect(() => {
    if (!appliedCoupon?.valid) setShowCoupon(false);
  }, [appliedCoupon?.valid]);
  const finalPrice = appliedCoupon?.valid && appliedCoupon.final_price != null
    ? appliedCoupon.final_price
    : planPrice;
  const discountAmount = appliedCoupon?.valid ? (appliedCoupon.discount_amount ?? 0) : 0;
  const priceStr = finalPrice.toFixed(2).replace(".", ",");
  const [priceInt, priceDec] = priceStr.split(",");

  const features =
    planFeatures.length > 0
      ? planFeatures
      : [
          "Vendas ilimitadas",
          "Dashboard analítico",
          "Suporte prioritário 24/7",
          "Automação inteligente",
        ];

  return (
    <motion.div
      key="select"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_1.15fr] gap-8 lg:gap-12 items-start">
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
              className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors mb-5"
            >
              <ChevronLeft className="w-4 h-4" />
              Trocar plano
            </button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Assinar Plano
            </h1>
            <p className="text-gray-500 text-base max-w-xs leading-relaxed">
              Escolha o método de pagamento para começar sua jornada como
              vendedor
            </p>
          </motion.div>

          {/* Plan card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="bg-gray-900 rounded-2xl border border-gray-900 p-6 text-white"
          >
            {/* Plan name */}
            {planName && (
              <div className="inline-flex items-center gap-2 text-xs font-semibold mb-4 px-2.5 py-1 rounded-full bg-white/15 text-white">
                {planName}
              </div>
            )}

            {/* Price */}
            <div className="mb-6">
              {appliedCoupon?.valid && appliedCoupon.original_price != null && (
                <div className="text-sm text-gray-400 line-through mb-1">
                  De R$ {appliedCoupon.original_price.toFixed(2).replace('.', ',')}
                </div>
              )}
              <div className="flex items-start gap-1">
                <span className="text-gray-300 text-sm font-medium mt-2.5">
                  R$
                </span>
                <span className="text-6xl font-bold text-white leading-none tracking-tight">
                  {priceInt}
                </span>
                <div className="flex flex-col mt-1.5 ml-0.5">
                  <span className="text-xl font-bold text-white leading-none">
                    ,{priceDec}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">
                    por {planBillingCycle === 'yearly' ? 'ano' : 'mês'}
                  </span>
                </div>
              </div>
              {appliedCoupon?.valid && appliedCoupon.coupon && (
                <div className="mt-3 inline-flex items-center gap-2 bg-green-500/15 text-green-300 text-xs font-medium px-2.5 py-1 rounded-full">
                  <Ticket className="h-3 w-3" />
                  Cupom {appliedCoupon.coupon.code}: -R$ {discountAmount.toFixed(2).replace('.', ',')}{' '}
                  {durationLabel(appliedCoupon.coupon)}
                </div>
              )}
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-white/20 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-gray-100">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="border-t border-white/10 pt-5">
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <Package className="w-5 h-5" />
                  <span className="text-xs">
                    {planMaxProducts
                      ? `${planMaxProducts} produtos`
                      : "Produtos ilimitados"}
                  </span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <RefreshCw className="w-5 h-5" />
                  <span className="text-xs">
                    {planBillingCycle === "yearly" ? "Renovação anual" : "Renovação mensal"}
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
                  className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
                >
                  <Ticket className="h-3.5 w-3.5" />
                  Tenho um cupom de desconto
                </button>
              ) : appliedCoupon?.valid ? (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-xl">
                  <div className="flex items-center gap-2 min-w-0">
                    <Ticket className="h-4 w-4 text-green-600 shrink-0" />
                    <span className="text-sm font-medium text-green-900 truncate">
                      Cupom <span className="font-mono">{appliedCoupon.coupon?.code}</span> aplicado
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      onRemoveCoupon?.();
                      setShowCoupon(false);
                    }}
                    className="text-xs text-green-700 hover:text-green-900 font-medium inline-flex items-center gap-1"
                  >
                    <X className="h-3 w-3" />
                    Remover
                  </button>
                </div>
              ) : (
                <div className="p-3 border border-gray-200 rounded-xl bg-white">
                  <Label className="text-xs font-medium text-gray-700 mb-2 block">
                    Código do cupom
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      value={couponInput}
                      onChange={(e) => onCouponInputChange?.(e.target.value.toUpperCase())}
                      placeholder="EX: BLACK50"
                      className="font-mono uppercase h-9"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          onApplyCoupon();
                        }
                      }}
                    />
                    <Button
                      type="button"
                      onClick={onApplyCoupon}
                      disabled={!couponInput.trim() || isValidatingCoupon}
                      className="h-9"
                    >
                      {isValidatingCoupon ? '...' : 'Aplicar'}
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => setShowCoupon(false)}
                      className="h-9"
                    >
                      <X className="h-4 w-4" />
                    </Button>
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
            className="flex items-center gap-2 mt-4 text-gray-400"
          >
            <ShieldCheck className="w-4 h-4" />
            <span className="text-xs">Pagamento seguro via Asaas</span>
          </motion.div>
        </div>

        {/* ── Right: payment selector ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-2xl border border-gray-200 p-6"
        >
          <div className="mb-5">
            <h2 className="text-xl font-bold text-gray-900 mb-1">
              {isFreeCheckout ? "Sua assinatura será gratuita" : "Escolha o método de pagamento"}
            </h2>
            <p className="text-sm text-gray-400">
              {isFreeCheckout
                ? "Cupom aplicado zerou o valor desta assinatura. Confirme para ativar."
                : "Selecione a forma de pagamento mais conveniente para você"}
            </p>
          </div>

          {isFreeCheckout && (
            <div className="mb-5 p-4 bg-green-50 border border-green-200 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                  <Check className="h-5 w-5 text-green-600" strokeWidth={3} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-green-900">
                    R$ 0,00 — sem cobrança
                  </p>
                  <p className="text-xs text-green-700">
                    Você não será cobrado enquanto o cupom estiver ativo. Sem cartão necessário.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Payment method rows */}
          {!isFreeCheckout && (
          <div className="space-y-2 mb-5">
            {paymentMethods.map((method) => (
              <button
                key={method.id}
                type="button"
                onClick={() => onSelectMethod(method.id)}
                className={`flex items-center gap-4 w-full p-4 rounded-xl border transition-all text-left ${
                  selectedMethod === method.id
                    ? "border-gray-900 bg-gray-50"
                    : "border-gray-200 hover:border-gray-300 bg-white"
                }`}
              >
                <div
                  className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 transition-colors ${
                    selectedMethod === method.id
                      ? "bg-gray-900 text-white"
                      : "bg-gray-100 text-gray-500"
                  }`}
                >
                  {method.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-gray-900 text-sm">
                    {method.name}
                  </p>
                  <p className="text-xs text-gray-400">{method.description}</p>
                </div>
                <ChevronRight
                  className={`w-4 h-4 flex-shrink-0 transition-colors ${
                    selectedMethod === method.id
                      ? "text-gray-900"
                      : "text-gray-300"
                  }`}
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
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.25 }}
                className="mb-5 overflow-hidden"
              >
                <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                  <p className="text-sm font-medium text-gray-700 mb-3">
                    Documento para pagamento
                  </p>

                  {!documentType ? (
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => onSelectDocumentType("cpf")}
                        className="flex-1 h-9 rounded-lg border-2 border-gray-200 hover:border-gray-900 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white"
                      >
                        Usar CPF
                      </button>
                      <button
                        type="button"
                        onClick={() => onSelectDocumentType("cnpj")}
                        className="flex-1 h-9 rounded-lg border-2 border-gray-200 hover:border-gray-900 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors bg-white"
                      >
                        Usar CNPJ
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <div className="flex items-center justify-between">
                        <Label className="text-xs font-medium text-gray-600">
                          {documentType === "cpf" ? "CPF" : "CNPJ"}
                        </Label>
                        <button
                          type="button"
                          onClick={onDocumentTypeReset}
                          className="text-xs text-gray-400 hover:text-gray-700 transition-colors"
                        >
                          Trocar documento
                        </button>
                      </div>
                      <Input
                        type="text"
                        value={documentType === "cpf" ? cpf : cnpj}
                        onChange={(e) =>
                          documentType === "cpf"
                            ? onCpfChange(e.target.value)
                            : onCnpjChange(e.target.value)
                        }
                        placeholder={
                          documentType === "cpf"
                            ? "000.000.000-00"
                            : "00.000.000/0000-00"
                        }
                        maxLength={documentType === "cpf" ? 14 : 18}
                        className="h-9 text-sm border-gray-200"
                      />
                    </div>
                  )}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Continue button */}
          <Button
            onClick={onCreateSubscription}
            disabled={!canContinue}
            className="w-full h-12 text-base font-medium"
          >
            {isCreatingSubscription ? (
              "Processando..."
            ) : isFreeCheckout ? (
              <>
                Confirmar assinatura gratuita
                <Check className="ml-1 w-4 h-4" strokeWidth={3} />
              </>
            ) : (
              <>
                Continuar para pagamento
                <ChevronRight className="ml-1 w-4 h-4" />
              </>
            )}
          </Button>

          {/* Terms */}
          <p className="text-center text-xs text-gray-400 mt-4 leading-relaxed">
            Ao continuar, você concorda com nossos{" "}
            <a
              href="#"
              className="underline hover:text-gray-600 transition-colors"
            >
              termos de serviço
            </a>{" "}
            e{" "}
            <a
              href="#"
              className="underline hover:text-gray-600 transition-colors"
            >
              política de privacidade
            </a>
          </p>
        </motion.div>
      </div>
    </motion.div>
  );
}
