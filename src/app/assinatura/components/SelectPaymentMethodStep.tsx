import { motion } from "framer-motion";
import { BillingType } from "@/types/subscription";
import { CheckIcon } from "@/components/Landing/CheckIcon";
import { CreditCard, Smartphone, FileText } from "lucide-react";

const paymentMethods = [
  {
    id: "CREDIT_CARD" as BillingType,
    name: "Cartão de Crédito",
    description: "Pagamento rápido e seguro com cartão de crédito",
    icon: <CreditCard className="w-6 h-6" />,
  },
  {
    id: "PIX" as BillingType,
    name: "PIX",
    description: "Pagamento instantâneo via PIX",
    icon: <Smartphone className="w-6 h-6" />,
  },
  {
    id: "BOLETO" as BillingType,
    name: "Boleto Bancário",
    description: "Pagamento via boleto bancário",
    icon: <FileText className="w-6 h-6" />,
  },
];

interface SelectPaymentMethodStepProps {
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
  return (
    <motion.div
      key="select"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Payment Methods */}
      <div className="mb-8 sm:mb-12">
        <motion.h3
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-2xl sm:text-3xl font-bold text-gray-900 mb-3 sm:mb-4 text-center"
        >
          Escolha o método de pagamento
        </motion.h3>
        <p className="text-gray-600 mb-6 sm:mb-8 text-center">
          Selecione a forma de pagamento mais conveniente para você
        </p>
        <div className="grid gap-4 sm:gap-6 sm:grid-cols-3">
          {paymentMethods.map((method, index) => (
            <motion.button
              key={method.id}
              onClick={() => onSelectMethod(method.id)}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -8, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className={`bg-white p-6 sm:p-8 rounded-xl sm:rounded-2xl border-2 transition-all text-left ${
                selectedMethod === method.id
                  ? "border-primary shadow-xl bg-blue-50"
                  : "border-gray-200 hover:border-gray-300 hover:shadow-lg"
              }`}
            >
              <motion.div
                whileHover={{ rotate: 5, scale: 1.1 }}
                transition={{ type: "spring", stiffness: 300 }}
                className={`w-14 h-14 ${
                  selectedMethod === method.id
                    ? "bg-primary text-white"
                    : "bg-gray-100 text-gray-600"
                } rounded-xl flex items-center justify-center mb-4 sm:mb-6`}
              >
                {method.icon}
              </motion.div>
              <h4 className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 mb-2 sm:mb-3">
                {method.name}
              </h4>
              <p className="text-sm sm:text-base text-gray-600 leading-relaxed">
                {method.description}
              </p>
              {selectedMethod === method.id && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="mt-4 flex items-center gap-2 text-primary font-semibold"
                >
                  <CheckIcon className="w-5 h-5" />
                  <span className="text-sm">Selecionado</span>
                </motion.div>
              )}
            </motion.button>
          ))}
        </div>
      </div>

      {/* CPF/CNPJ Fields - Aparece apenas para PIX e BOLETO */}
      {needsDocument && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8 sm:mb-12"
        >
          <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-6 sm:p-8 max-w-2xl mx-auto">
            <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 text-center">
              Informações para Pagamento
            </h3>
            <p className="text-sm text-gray-600 mb-6 text-center">
              Selecione o tipo de documento
            </p>

            {/* Botões para selecionar tipo de documento */}
            {!documentType && (
              <div className="flex gap-4 justify-center mb-6">
                <motion.button
                  onClick={() => onSelectDocumentType("cpf")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-primary bg-white text-gray-700 hover:text-primary font-semibold transition-colors"
                >
                  Usar CPF
                </motion.button>
                <motion.button
                  onClick={() => onSelectDocumentType("cnpj")}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 rounded-lg border-2 border-gray-200 hover:border-primary bg-white text-gray-700 hover:text-primary font-semibold transition-colors"
                >
                  Usar CNPJ
                </motion.button>
              </div>
            )}

            {/* Input de CPF */}
            {documentType === "cpf" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <label
                    htmlFor="cpf"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CPF
                  </label>
                  <button
                    onClick={onDocumentTypeReset}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Trocar para CNPJ
                  </button>
                </div>
                <input
                  type="text"
                  id="cpf"
                  value={cpf}
                  onChange={(e) => onCpfChange(e.target.value)}
                  placeholder="000.000.000-00"
                  maxLength={14}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </motion.div>
            )}

            {/* Input de CNPJ */}
            {documentType === "cnpj" && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <label
                    htmlFor="cnpj"
                    className="block text-sm font-medium text-gray-700"
                  >
                    CNPJ
                  </label>
                  <button
                    onClick={onDocumentTypeReset}
                    className="text-sm text-gray-500 hover:text-gray-700"
                  >
                    Trocar para CPF
                  </button>
                </div>
                <input
                  type="text"
                  id="cnpj"
                  value={cnpj}
                  onChange={(e) => onCnpjChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className="w-full px-4 py-3 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none transition-colors"
                />
              </motion.div>
            )}
          </div>
        </motion.div>
      )}

      {/* Continue Button */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
        className="flex justify-center"
      >
        <motion.button
          onClick={onCreateSubscription}
          disabled={!canContinue}
          whileHover={canContinue ? { scale: 1.05 } : {}}
          whileTap={canContinue ? { scale: 0.95 } : {}}
          className={`px-8 py-4 rounded-xl font-semibold text-lg transition-all ${
            canContinue
              ? "bg-primary text-white hover:bg-primary/80 shadow-lg hover:shadow-xl"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          {isCreatingSubscription
            ? "Processando..."
            : "Continuar com Pagamento"}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}

