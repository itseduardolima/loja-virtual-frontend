import { motion } from 'framer-motion'
import { LoadingPage } from '@/components'

export function ProcessingStep() {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="py-12 text-center"
    >
      <LoadingPage />
      <p className="mt-4 text-[14px] text-nxi2">Processando sua assinatura…</p>
    </motion.div>
  )
}
