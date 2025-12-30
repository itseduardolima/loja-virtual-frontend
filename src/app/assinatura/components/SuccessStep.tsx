import { motion } from "framer-motion";
import { Check, Clock } from "lucide-react";
import { LoadingSpinner } from "@/components";

interface SuccessStepProps {
  isPaymentConfirmed: boolean;
}

export function SuccessStep({ isPaymentConfirmed }: SuccessStepProps) {
  return (
    <motion.div
      key="success"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-8 sm:p-12 max-w-2xl mx-auto shadow-lg">
        {isPaymentConfirmed ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Check className="w-12 h-12 text-green-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Pagamento Aprovado!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 mb-6"
            >
              Seu pagamento foi aprovado com sucesso!
            </motion.p>
          </>
        ) : (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: "spring",
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6"
            >
              <Clock className="w-12 h-12 text-blue-600" />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 mb-4"
            >
              Aguardando Confirmação
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-lg sm:text-xl text-gray-600 mb-6"
            >
              Estamos aguardando a confirmação do seu pagamento.
            </motion.p>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-blue-50 border border-blue-200 rounded-lg p-4 sm:p-6 mb-6"
        >
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            <strong>O que acontece agora?</strong>
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            Estamos verificando o status do seu pagamento. Em instantes,
            você será redirecionado automaticamente para criar sua
            primeira loja.
          </p>
        </motion.div>

        {isPaymentConfirmed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-gray-500"
            >
              <LoadingSpinner />
              <span className="text-sm sm:text-base">
                Verificando status do pagamento...
              </span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="text-xs sm:text-sm text-gray-500 mt-4"
            >
              Esta verificação acontece automaticamente a cada 5
              segundos
            </motion.p>
          </>
        )}
      </div>
    </motion.div>
  );
}

