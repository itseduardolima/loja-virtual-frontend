import { motion } from 'framer-motion'
import { Check, Clock } from 'lucide-react'
import { LoadingSpinner } from '@/components'

interface SuccessStepProps {
  isPaymentConfirmed: boolean
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
      <div className="mx-auto max-w-2xl rounded-2xl border border-nxborder bg-white p-8 shadow-sm sm:p-12">
        {isPaymentConfirmed ? (
          <>
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-nxs/10 text-nxs"
            >
              <Check size={32} strokeWidth={3} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-3 text-[24px] font-extrabold tracking-tight text-nxi1 sm:text-[28px]"
            >
              Pagamento aprovado!
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-[15px] text-nxi2"
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
                type: 'spring',
                stiffness: 200,
                damping: 15,
                delay: 0.2,
              }}
              className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-nxp/[0.08] text-nxp"
            >
              <Clock size={32} />
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="mb-3 text-[24px] font-extrabold tracking-tight text-nxi1 sm:text-[28px]"
            >
              Aguardando confirmação
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="mb-6 text-[15px] text-nxi2"
            >
              Estamos aguardando a confirmação do seu pagamento.
            </motion.p>
          </>
        )}

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-xl border border-nxp/15 bg-nxp/[0.04] p-4 text-left sm:p-5"
        >
          <p className="mb-1 text-[13.5px] font-bold text-nxi1">O que acontece agora?</p>
          <p className="text-[13.5px] leading-relaxed text-nxi2">
            Estamos verificando o status do seu pagamento. Em instantes, você será redirecionado
            automaticamente para criar sua primeira loja.
          </p>
        </motion.div>

        {isPaymentConfirmed && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="flex items-center justify-center gap-2 text-nxi2"
            >
              <LoadingSpinner />
              <span className="text-[13.5px]">Verificando status do pagamento…</span>
            </motion.div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7 }}
              className="mt-4 text-[12px] text-nxi3"
            >
              Esta verificação acontece automaticamente a cada 5 segundos
            </motion.p>
          </>
        )}
      </div>
    </motion.div>
  )
}
