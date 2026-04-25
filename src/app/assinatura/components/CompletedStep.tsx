import { motion } from "framer-motion";
import { Check } from "lucide-react";

interface CompletedStepProps {
  onGoToDashboard: () => void;
}

export function CompletedStep({ onGoToDashboard }: CompletedStepProps) {
  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="bg-white rounded-xl sm:rounded-2xl border-2 border-gray-200 p-8 sm:p-12 max-w-2xl mx-auto shadow-lg">
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
          Assinatura Confirmada!
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-lg sm:text-xl text-gray-600 mb-6"
        >
          Seu pagamento foi confirmado com sucesso e sua assinatura está ativa!
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-green-50 border border-green-200 rounded-lg p-4 sm:p-6 mb-6"
        >
          <p className="text-sm sm:text-base text-gray-700 mb-2">
            <strong>Próximos passos:</strong>
          </p>
          <p className="text-sm sm:text-base text-gray-600">
            Sua conta foi atualizada para o perfil de vendedor. Crie sua loja e
            comece a vender agora mesmo!
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <motion.button
            onClick={onGoToDashboard}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-primary text-white px-8 py-4 rounded-xl font-semibold text-lg hover:bg-black/80 shadow-lg hover:shadow-xl transition-all"
          >
            Criar minha loja
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
