import { motion } from 'framer-motion'

interface ProcessingStepProps {
  isRedirecting?: boolean
}

export function ProcessingStep({ isRedirecting = false }: ProcessingStepProps) {
  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-16 text-center"
    >
      <span className="inline-block h-10 w-10 animate-spin rounded-full border-[3px] border-nxp border-t-transparent" />

      <h2 className="mt-6 text-[20px] font-extrabold tracking-tight text-nxi1">
        {isRedirecting ? 'Abrindo o Asaas em uma nova aba…' : 'Ativando sua assinatura…'}
      </h2>
      <p className="mt-1.5 text-[13.5px] font-semibold text-nxi2">
        {isRedirecting
          ? 'Conclua o pagamento na nova aba. Esta página confirma automaticamente.'
          : 'Isso leva só alguns segundos. Não feche esta página.'}
      </p>

      {!isRedirecting && (
        <div className="relative mt-6 h-[5px] w-64 overflow-hidden rounded-full bg-nxbg">
          <span className="nx-indet" />
        </div>
      )}
    </motion.div>
  )
}
