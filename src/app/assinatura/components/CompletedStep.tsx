import { motion } from 'framer-motion'
import { Check, Sparkles, Ticket, type LucideIcon } from 'lucide-react'
import { formatDateLong } from '@/lib/utils'

export type CompletedReason = 'paid' | 'trial' | 'coupon'

interface CompletedStepProps {
  onGoToDashboard: () => void
  reason?: CompletedReason
  trialDays?: number | null
  couponCode?: string | null
  freeAccessUntil?: string | null
}

interface StepCopy {
  icon: LucideIcon
  iconClass: string
  title: string
  subtitle: string
  nextSteps: string
  buttonLabel: string
}

function getCopy(props: CompletedStepProps): StepCopy {
  const { reason, trialDays, couponCode, freeAccessUntil } = props

  if (reason === 'trial') {
    const days = trialDays ?? null
    return {
      icon: Sparkles,
      iconClass: 'bg-nxp/[0.08] text-nxp',
      title: 'Trial ativado!',
      subtitle: days
        ? `Você tem ${days} dias de acesso completo, sem cartão de crédito.`
        : 'Seu acesso gratuito está liberado.',
      nextSteps: freeAccessUntil
        ? `Aproveite até ${formatDateLong(freeAccessUntil)}. Para continuar depois desse prazo, você poderá assinar um plano em "Meu Plano".`
        : 'Crie sua loja agora e comece a vender. Quando o trial acabar, você escolhe um plano em "Meu Plano".',
      buttonLabel: 'Criar minha loja',
    }
  }

  if (reason === 'coupon') {
    return {
      icon: Ticket,
      iconClass: 'bg-nxs/10 text-nxs',
      title: 'Acesso liberado!',
      subtitle: couponCode
        ? `Cupom ${couponCode} aplicado — você tem acesso gratuito durante o período do desconto.`
        : 'Seu cupom foi aplicado e você tem acesso gratuito durante o período do desconto.',
      nextSteps: freeAccessUntil
        ? `Sua conta é vendedor até ${formatDateLong(freeAccessUntil)}. Depois, será necessário assinar para continuar.`
        : 'Sua conta foi atualizada para o perfil de vendedor. Crie sua loja e comece a vender agora.',
      buttonLabel: 'Criar minha loja',
    }
  }

  // default: paid
  return {
    icon: Check,
    iconClass: 'bg-nxs/10 text-nxs',
    title: 'Assinatura confirmada!',
    subtitle: 'Seu pagamento foi confirmado com sucesso e sua assinatura está ativa!',
    nextSteps:
      'Sua conta foi atualizada para o perfil de vendedor. Crie sua loja e comece a vender agora mesmo!',
    buttonLabel: 'Criar minha loja',
  }
}

export function CompletedStep(props: CompletedStepProps) {
  const copy = getCopy(props)
  const Icon = copy.icon

  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.5 }}
      className="text-center"
    >
      <div className="mx-auto max-w-2xl rounded-2xl border border-nxborder bg-white p-8 shadow-sm sm:p-12">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{
            type: 'spring',
            stiffness: 200,
            damping: 15,
            delay: 0.2,
          }}
          className={`mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl ${copy.iconClass}`}
        >
          <Icon size={32} />
        </motion.div>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mb-3 text-[24px] font-extrabold tracking-tight text-nxi1 sm:text-[28px]"
        >
          {copy.title}
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-6 text-[15px] leading-relaxed text-nxi2"
        >
          {copy.subtitle}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-6 rounded-xl border border-nxp/15 bg-nxp/[0.04] p-4 text-left sm:p-5"
        >
          <p className="mb-1 text-[13.5px] font-bold text-nxi1">Próximos passos:</p>
          <p className="text-[13.5px] leading-relaxed text-nxi2">{copy.nextSteps}</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="flex justify-center"
        >
          <button
            onClick={props.onGoToDashboard}
            className="h-12 rounded-xl bg-nxp px-8 text-[14.5px] font-bold text-white shadow-[0_1px_2px_hsl(237_49%_33%/0.3)] transition-[transform,background-color] hover:bg-nxp/90 active:scale-[0.99]"
          >
            {copy.buttonLabel}
          </button>
        </motion.div>
      </div>
    </motion.div>
  )
}
