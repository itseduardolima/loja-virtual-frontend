"use client";

import { motion, AnimatePresence } from "framer-motion";
import { BillingType } from "@/types/subscription";
import {
  Check,
  ChevronRight,
  CreditCard,
  QrCode,
  FileText,
  TrendingUp,
  Users,
  BarChart3,
  ShieldCheck,
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
  selectedMethod: BillingType | null;
  documentType: "cpf" | "cnpj" | null;
  cpf: string;
  cnpj: string;
  needsDocument: boolean;
  canContinue: boolean;
  isCreatingSubscription: boolean;
  onSelectMethod: (method: BillingType) => void;
  onSelectDocumentType: (type: "cpf" | "cnpj") => void;
  onCpfChange: (value: string) => void;
  onCnpjChange: (value: string) => void;
  onDocumentTypeReset: () => void;
  onCreateSubscription: () => void;
}

export function SelectPaymentMethodStep({
  planPrice = 0,
  planFeatures = [],
  planName,
  selectedMethod,
  documentType,
  cpf,
  cnpj,
  needsDocument,
  canContinue,
  isCreatingSubscription,
  onSelectMethod,
  onSelectDocumentType,
  onCpfChange,
  onCnpjChange,
  onDocumentTypeReset,
  onCreateSubscription,
}: SelectPaymentMethodStepProps) {
  const priceStr = planPrice.toFixed(2).replace(".", ",");
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
            <div className="inline-flex items-center gap-2 bg-gray-100 rounded-full px-3 py-1.5 text-sm font-medium text-gray-700 mb-5">
              <span className="w-1.5 h-1.5 bg-gray-700 rounded-full" />
              Oferta exclusiva
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="mb-6"
          >
            <h1 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight mb-3">
              Assinar
              <br />
              Plano
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
            className="bg-white rounded-2xl border border-gray-200 p-6"
          >
            {/* Price */}
            <div className="mb-6">
              <div className="flex items-start gap-1">
                <span className="text-gray-500 text-sm font-medium mt-2.5">
                  R$
                </span>
                <span className="text-6xl font-bold text-gray-900 leading-none tracking-tight">
                  {priceInt}
                </span>
                <div className="flex flex-col mt-1.5 ml-0.5">
                  <span className="text-xl font-bold text-gray-900 leading-none">
                    ,{priceDec}
                  </span>
                  <span className="text-xs text-gray-400 mt-1">por mês</span>
                </div>
              </div>
            </div>

            {/* Features */}
            <div className="space-y-3 mb-6">
              {features.map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 bg-gray-900 rounded-full flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {feature}
                  </span>
                </div>
              ))}
            </div>

            {/* Stats row */}
            <div className="border-t border-gray-100 pt-5">
              <div className="flex items-center justify-around">
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <TrendingUp className="w-5 h-5" />
                  <span className="text-xs">Crescimento</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <Users className="w-5 h-5" />
                  <span className="text-xs">Multi-usuário</span>
                </div>
                <div className="flex flex-col items-center gap-1.5 text-gray-400">
                  <BarChart3 className="w-5 h-5" />
                  <span className="text-xs">Relatórios</span>
                </div>
              </div>
            </div>
          </motion.div>

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
              Escolha o método de pagamento
            </h2>
            <p className="text-sm text-gray-400">
              Selecione a forma de pagamento mais conveniente para você
            </p>
          </div>

          {/* Payment method rows */}
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
