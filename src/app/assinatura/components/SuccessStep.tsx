import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { TicketCard, TicketDivider, TicketEyebrow, TicketStamp } from './TicketUI'
import type { BillingCycle } from '@/types/subscription'

interface SuccessStepProps {
  isPaymentConfirmed: boolean
  planName?: string
  planPrice?: number
  billingCycle?: BillingCycle
}

export function SuccessStep({
  isPaymentConfirmed,
  planName,
  planPrice,
  billingCycle,
}: SuccessStepProps) {
  const priceStr = planPrice != null ? planPrice.toFixed(2).replace('.', ',') : null

  if (isPaymentConfirmed) {
    return (
      <motion.div
        key="success-confirmed"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
        className="mx-auto w-full max-w-[340px]"
      >
        <TicketCard>
          <TicketEyebrow>Nexo · comprovante</TicketEyebrow>
          {planName && <p className="mt-2 text-[15px] font-extrabold text-nxi1">{planName}</p>}
          {priceStr && (
            <p className="mt-1 font-mono text-[13px] font-bold text-nxi2">
              R$ {priceStr}
              {billingCycle && (
                <span className="ml-1 font-semibold text-nxi3">
                  /{billingCycle === 'yearly' ? 'ano' : 'mês'}
                </span>
              )}
            </p>
          )}
          <TicketDivider />
          <motion.div
            initial={{ scale: 1.6, rotate: 6, opacity: 0 }}
            animate={{ scale: 1, rotate: -2, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 340, damping: 16, delay: 0.1 }}
          >
            <TicketStamp label="Pago" tone="confirmed" />
          </motion.div>
        </TicketCard>

        <h2 className="mt-6 text-center text-[20px] font-extrabold tracking-tight text-nxi1">
          Pagamento aprovado!
        </h2>
        <p className="mt-1.5 text-center text-[13.5px] font-semibold text-nxi2">
          Redirecionando para criar sua primeira loja…
        </p>
        <div className="mt-3 flex items-center justify-center gap-2">
          <span className="h-[15px] w-[15px] animate-spin rounded-full border-2 border-nxp border-t-transparent" />
          <span className="text-[12.5px] font-bold text-nxi3">Redirecionando…</span>
        </div>
      </motion.div>
    )
  }

  /* ── Aguardando confirmação do pagamento (após voltar do Asaas) ── */
  return (
    <motion.div
      key="success-waiting"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-[380px]"
    >
      <TicketCard>
        <TicketEyebrow>Nexo · comprovante</TicketEyebrow>
        {planName && <p className="mt-2 text-[15px] font-extrabold text-nxi1">{planName}</p>}
        {priceStr && (
          <p className="mt-1 font-mono text-[13px] font-bold text-nxi2">
            R$ {priceStr}
            {billingCycle && (
              <span className="ml-1 font-semibold text-nxi3">
                /{billingCycle === 'yearly' ? 'ano' : 'mês'}
              </span>
            )}
          </p>
        )}

        <TicketDivider />

        <TicketStamp label="Pendente" tone="pending" />

        {/* Trajeto do comprovante — 3 estações, como um rastreamento */}
        <div className="mt-5 flex items-start justify-center">
          <RouteStop label="Pagamento" state="done" />
          <RouteLine done />
          <RouteStop label="Confirmação" state="active" />
          <RouteLine />
          <RouteStop label="Conta ativa" state="pending" />
        </div>
      </TicketCard>

      <p className="mt-4 text-center text-[13.5px] font-semibold text-nxi2">
        Assim que o pagamento for confirmado, ativamos sua conta automaticamente.
      </p>
      <div className="mt-3 flex items-center justify-center gap-2">
        <span className="h-2 w-2 animate-pulse rounded-full bg-nxp" />
        <span className="font-mono text-[11px] font-bold uppercase tracking-[0.1em] text-nxi3">
          Verificando a cada 5s
        </span>
      </div>
    </motion.div>
  )
}

function RouteLine({ done = false }: { done?: boolean }) {
  return (
    <div
      className={cn(
        'mt-[11px] h-0 w-8 shrink-0 border-t-2 sm:w-12',
        done ? 'border-nxs' : 'border-dashed border-nxborder',
      )}
    />
  )
}

interface RouteStopProps {
  label: string
  state: 'done' | 'active' | 'pending'
}

function RouteStop({ label, state }: RouteStopProps) {
  return (
    <div className="flex w-16 shrink-0 flex-col items-center gap-2 sm:w-20">
      <span
        className={cn(
          'flex h-6 w-6 items-center justify-center rounded-[6px] border-2 text-[11px] font-black leading-none',
          state === 'done' && 'border-nxs bg-nxs text-white',
          state === 'active' && 'border-nxp bg-white text-nxp',
          state === 'pending' && 'border-dashed border-nxborder bg-white text-nxi3/40',
        )}
      >
        {state === 'done' && '✓'}
        {state === 'active' && <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-nxp" />}
      </span>
      <span
        className={cn(
          'text-center font-mono text-[9px] font-bold uppercase leading-tight tracking-[0.06em]',
          state === 'pending' ? 'text-nxi3/60' : 'text-nxi2',
        )}
      >
        {label}
      </span>
    </div>
  )
}
