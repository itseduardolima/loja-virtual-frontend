import { motion } from 'framer-motion'
import { Check, Clock, Store } from 'lucide-react'

interface SuccessStepProps {
  isPaymentConfirmed: boolean
}

export function SuccessStep({ isPaymentConfirmed }: SuccessStepProps) {
  if (isPaymentConfirmed) {
    return (
      <motion.div
        key="success-confirmed"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: 20 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-nxs/[0.12] text-nxs">
            <Check className="h-[22px] w-[22px]" strokeWidth={3} />
          </span>
          <h2 className="text-[23px] font-extrabold tracking-tight text-nxi1">Pagamento aprovado!</h2>
        </div>
        <p className="mt-3 text-[14px] font-semibold text-nxi2">
          Seu pagamento foi confirmado. Redirecionando para criar sua primeira loja…
        </p>
        <div className="mt-4 flex items-center gap-2">
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
    >
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] bg-nxp/[0.08] text-nxp">
          <Clock className="h-[21px] w-[21px]" />
        </span>
        <div>
          <h2 className="text-[21px] font-extrabold tracking-tight text-nxi1">
            Aguardando confirmação
          </h2>
          <p className="mt-0.5 text-[13.5px] font-semibold text-nxi2">
            Assim que o pagamento for confirmado, ativamos sua conta automaticamente.
          </p>
        </div>
      </div>

      {/* Stepper */}
      <div className="mt-6 flex items-center">
        <StepperItem label="Pagamento iniciado" state="done" width={108} />
        <div
          className="h-[3px] flex-1 rounded-full"
          style={{ background: 'linear-gradient(90deg, #3F8A66 40%, #E3E4EC 40%)' }}
        />
        <StepperItem label="Pagamento recebido" state="active" width={108} />
        <div className="h-[3px] flex-1 rounded-full bg-nxborder" />
        <StepperItem
          label="Conta ativa"
          state="pending"
          icon={<Store className="h-3.5 w-3.5" />}
          width={108}
        />
      </div>

      <div className="mt-6 flex items-center gap-2 border-t border-nxborder pt-4">
        <span className="h-4 w-4 animate-spin rounded-full border-2 border-nxp border-t-transparent" />
        <span className="text-[12.5px] font-bold text-nxi3">
          Verificando status do pagamento a cada 5 segundos
        </span>
      </div>
    </motion.div>
  )
}

interface StepperItemProps {
  label: string
  state: 'done' | 'active' | 'pending'
  icon?: React.ReactNode
  width: number
}

function StepperItem({ label, state, icon, width }: StepperItemProps) {
  return (
    <div className="flex shrink-0 flex-col items-center" style={{ width }}>
      {state === 'done' && (
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full bg-nxs">
          <Check className="h-4 w-4 text-white" strokeWidth={3} />
        </span>
      )}
      {state === 'active' && (
        <span
          className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-nxp bg-white"
          style={{ boxShadow: '0 0 0 4px rgba(42,45,124,.10)' }}
        >
          <span className="h-2 w-2 animate-pulse rounded-full bg-nxp" />
        </span>
      )}
      {state === 'pending' && (
        <span className="flex h-[30px] w-[30px] items-center justify-center rounded-full border-2 border-nxborder bg-white text-nxi3/50">
          {icon ?? null}
        </span>
      )}
      <span
        className={`mt-2 text-center text-[11.5px] font-extrabold ${
          state === 'done' ? 'text-nxi1' : state === 'active' ? 'text-nxp' : 'text-nxi3'
        }`}
      >
        {label}
      </span>
    </div>
  )
}
