import { motion, useReducedMotion } from 'framer-motion'
import { TicketCard, TicketDivider, TicketEyebrow } from './TicketUI'
import type { BillingCycle } from '@/types/subscription'

interface ProcessingStepProps {
  isRedirecting?: boolean
  planName?: string
  planPrice?: number
  billingCycle?: BillingCycle
}

export function ProcessingStep({
  isRedirecting = false,
  planName,
  planPrice,
  billingCycle,
}: ProcessingStepProps) {
  const prefersReducedMotion = useReducedMotion()
  const priceStr = planPrice != null ? planPrice.toFixed(2).replace('.', ',') : null

  return (
    <motion.div
      key="processing"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex flex-col items-center py-10 text-center"
    >
      {/* Boca da impressora — o comprovante "sai" dela */}
      <div className="h-2 w-36 rounded-full bg-nxi1" />

      <motion.div
        initial={prefersReducedMotion ? false : { clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: 0.9, ease: [0.65, 0, 0.35, 1] }}
        className="-mt-px w-full max-w-[300px]"
      >
        <TicketCard>
          <TicketEyebrow>Nexo · comprovante</TicketEyebrow>

          {planName && (
            <p className="mt-2 text-[15px] font-extrabold text-nxi1">
              {planName}
              {billingCycle && (
                <span className="ml-1.5 font-semibold text-nxi3">
                  · {billingCycle === 'yearly' ? 'Anual' : 'Mensal'}
                </span>
              )}
            </p>
          )}
          {priceStr && (
            <p className="mt-1 font-mono text-[13px] font-bold text-nxi2">R$ {priceStr}</p>
          )}

          <TicketDivider />

          <div className="flex items-center justify-center gap-2">
            <span className="h-2 w-2 animate-pulse rounded-full bg-nxp" />
            <p className="font-mono text-[11px] font-bold uppercase tracking-[0.12em] text-nxp">
              {isRedirecting ? 'gerando cobrança…' : 'ativando…'}
            </p>
          </div>
        </TicketCard>
      </motion.div>

      <h2 className="mt-6 text-[19px] font-extrabold tracking-tight text-nxi1">
        {isRedirecting ? 'Abrindo o Asaas em uma nova aba' : 'Ativando sua assinatura'}
      </h2>
      <p className="mt-1.5 max-w-[320px] text-[13.5px] font-semibold text-nxi2">
        {isRedirecting
          ? 'Conclua o pagamento na nova aba — esta página confirma automaticamente.'
          : 'Isso leva só alguns segundos. Não feche esta página.'}
      </p>
    </motion.div>
  )
}
