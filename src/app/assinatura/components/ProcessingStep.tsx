import { motion } from "framer-motion";
import { LoadingPage } from "@/components";

export function ProcessingStep() {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="text-center py-12"
    >
      <LoadingPage />
      <p className="mt-4 text-gray-600">Processando sua assinatura...</p>
    </motion.div>
  );
}

