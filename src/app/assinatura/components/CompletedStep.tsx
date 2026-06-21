import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Check, Package, Share2, Sparkles, Store, Ticket, type LucideIcon } from 'lucide-react'
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
  iconBg: string
  iconColor: string
  title: string
  subtitle: string
  nextSteps: { icon: LucideIcon; text: string }[]
  buttonLabel: string
}

function getCopy(props: CompletedStepProps): StepCopy {
  const { reason, trialDays, couponCode, freeAccessUntil } = props

  if (reason === 'trial') {
    const days = trialDays ?? null
    return {
      icon: Sparkles,
      iconBg: 'bg-nxp/[0.08]',
      iconColor: 'text-nxp',
      title: 'Trial ativado!',
      subtitle: days
        ? `Você tem ${days} dias de acesso completo, sem cartão de crédito.`
        : 'Seu acesso gratuito está liberado.',
      nextSteps: [
        { icon: Store, text: 'Monte sua loja e comece a vender' },
        {
          icon: Calendar,
          text: freeAccessUntil
            ? `Aproveite até ${formatDateLong(freeAccessUntil)} · depois escolha um plano`
            : 'Quando o trial acabar, escolha um plano em "Meu Plano"',
        },
      ],
      buttonLabel: 'Criar minha loja',
    }
  }

  if (reason === 'coupon') {
    return {
      icon: Ticket,
      iconBg: 'bg-nxs/10',
      iconColor: 'text-nxs',
      title: 'Acesso liberado!',
      subtitle: couponCode
        ? `Cupom ${couponCode} aplicado — acesso gratuito durante o período do desconto.`
        : 'Seu cupom foi aplicado e você tem acesso gratuito durante o período do desconto.',
      nextSteps: [
        { icon: Store, text: 'Sua conta agora é de vendedor' },
        {
          icon: Calendar,
          text: freeAccessUntil
            ? `Acesso até ${formatDateLong(freeAccessUntil)} · depois assine para continuar`
            : 'Crie sua loja e comece a vender agora',
        },
      ],
      buttonLabel: 'Criar minha loja',
    }
  }

  return {
    icon: Check,
    iconBg: 'bg-nxs/[0.12]',
    iconColor: 'text-nxs',
    title: 'Assinatura confirmada!',
    subtitle: 'Seu pagamento foi confirmado e sua conta agora é de vendedor.',
    nextSteps: [
      { icon: Store, text: 'Crie sua loja e defina o link (/loja/sua-loja)' },
      { icon: Package, text: 'Cadastre seus produtos com foto e variação' },
      { icon: Share2, text: 'Compartilhe o link e receba pedidos' },
    ],
    buttonLabel: 'Criar minha loja',
  }
}

export function CompletedStep(props: CompletedStepProps) {
  const copy = getCopy(props)
  const Icon = copy.icon

  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex items-center gap-3"
      >
        <span
          className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[11px] ${copy.iconBg} ${copy.iconColor}`}
        >
          <Icon className="h-[22px] w-[22px]" strokeWidth={2.5} />
        </span>
        <h2 className="text-[24px] font-extrabold tracking-tight text-nxi1">{copy.title}</h2>
      </motion.div>

      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.18 }}
        className="mt-2.5 text-[14px] font-semibold text-nxi2"
      >
        {copy.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.26 }}
        className="mt-5 flex flex-col gap-3"
      >
        {copy.nextSteps.map((s, i) => {
          const ItemIcon = s.icon
          return (
            <div key={i} className="flex items-center gap-2.5">
              <span className="flex h-[30px] w-[30px] shrink-0 items-center justify-center rounded-lg bg-nxbg">
                <ItemIcon className="h-4 w-4 text-nxp" />
              </span>
              <span className="text-[13.5px] font-bold text-nxi2">{s.text}</span>
            </div>
          )
        })}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.34 }}
        className="mt-6"
      >
        <button
          onClick={props.onGoToDashboard}
          className="flex h-11 items-center gap-2 rounded-lg bg-nxp px-5 text-[14px] font-bold text-white transition-colors hover:bg-nxp/90 active:scale-[0.99]"
        >
          <ArrowRight className="h-4 w-4" />
          {copy.buttonLabel}
        </button>
      </motion.div>
    </motion.div>
  )
}
