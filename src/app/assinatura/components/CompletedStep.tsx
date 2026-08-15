import { motion } from 'framer-motion'
import { ArrowRight, Calendar, Package, Share2, Store, type LucideIcon } from 'lucide-react'
import { formatDateLong } from '@/lib/utils'
import { TicketCard, TicketDivider, TicketEyebrow, TicketStamp, type StampTone } from './TicketUI'
import type { BillingCycle } from '@/types/subscription'

export type CompletedReason = 'paid' | 'trial' | 'coupon'

interface CompletedStepProps {
  onGoToDashboard: () => void
  reason?: CompletedReason
  trialDays?: number | null
  couponCode?: string | null
  freeAccessUntil?: string | null
  planName?: string
  planPrice?: number
  billingCycle?: BillingCycle
}

interface StepCopy {
  stampLabel: string
  stampTone: StampTone
  priceLine: string
  title: string
  subtitle: string
  nextSteps: { icon: LucideIcon; text: string }[]
  buttonLabel: string
}

function getCopy(props: CompletedStepProps): StepCopy {
  const { reason, trialDays, couponCode, freeAccessUntil, planPrice, billingCycle } = props
  const priceStr = planPrice != null ? planPrice.toFixed(2).replace('.', ',') : null
  const priceSuffix = billingCycle === 'yearly' ? '/ano' : '/mês'

  if (reason === 'trial') {
    const days = trialDays ?? null
    return {
      stampLabel: 'Trial ativo',
      stampTone: 'brand',
      priceLine: days ? `${days} dias grátis · sem cartão` : 'Acesso gratuito liberado',
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
      stampLabel: 'Cupom aplicado',
      stampTone: 'accent',
      priceLine: couponCode ? `Cupom ${couponCode} · R$ 0,00` : 'Acesso gratuito · R$ 0,00',
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
    stampLabel: 'Pago',
    stampTone: 'confirmed',
    priceLine: priceStr ? `R$ ${priceStr} ${priceSuffix}` : 'Pagamento confirmado',
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

  return (
    <motion.div
      key="completed"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
      className="mx-auto w-full max-w-[380px]"
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <TicketCard>
          <TicketEyebrow>Nexo · comprovante</TicketEyebrow>
          {props.planName && <p className="mt-2 text-[15px] font-extrabold text-nxi1">{props.planName}</p>}
          <p className="mt-1 font-mono text-[12.5px] font-bold text-nxi2">{copy.priceLine}</p>

          <TicketDivider />

          <motion.div
            initial={{ scale: 1.6, rotate: 6, opacity: 0 }}
            animate={{ scale: 1, rotate: -2, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 340, damping: 16, delay: 0.15 }}
          >
            <TicketStamp label={copy.stampLabel} tone={copy.stampTone} />
          </motion.div>

          {/* Linha de corte — o comprovante "destaca" para os próximos passos */}
          <div className="relative -mx-6 mt-6">
            <span className="absolute left-0 top-0 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <span className="absolute right-0 top-0 h-4 w-4 translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
            <div className="border-t-2 border-dashed border-nxborder" />
          </div>

          <div className="mt-5 flex flex-col gap-3 text-left">
            {copy.nextSteps.map((s, i) => {
              const ItemIcon = s.icon
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -6 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.28 + i * 0.08 }}
                  className="flex items-center gap-2.5"
                >
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-[5px] border border-nxborder bg-white font-mono text-[9.5px] font-bold text-nxi3">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <ItemIcon className="h-3.5 w-3.5 shrink-0 text-nxp" />
                  <span className="text-[13px] font-bold text-nxi2">{s.text}</span>
                </motion.div>
              )
            })}
          </div>
        </TicketCard>
      </motion.div>

      <motion.h2
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.22 }}
        className="mt-6 text-center text-[21px] font-extrabold tracking-tight text-nxi1"
      >
        {copy.title}
      </motion.h2>
      <motion.p
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
        className="mt-1.5 text-center text-[13.5px] font-semibold text-nxi2"
      >
        {copy.subtitle}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-5 flex justify-center"
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
