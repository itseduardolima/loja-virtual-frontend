'use client'

import { useState } from 'react'
import { useSearchParams } from 'next/navigation'
import { motion } from 'framer-motion'
import { Check, X, Zap, Flame, Star } from 'lucide-react'
import { SubscriptionPlan, BillingCycle } from '@/types/subscription'
import { derivePlanFeaturesComparison, computeYearlySavings } from '@/lib/planUtils'
import { cn } from '@/lib/utils'

interface PlanSelectionStepProps {
  plans: SubscriptionPlan[]
  onSelectPlan: (plan: SubscriptionPlan, cycle: BillingCycle) => void
  onStartTrial?: (plan: SubscriptionPlan, cycle: BillingCycle) => void
}

const PLAN_ICONS: Record<string, React.ReactNode> = {
  'plano-basico': <Zap className="h-3.5 w-3.5" />,
  'plano-pro': <Flame className="h-3.5 w-3.5" />,
  'plano-max': <Star className="h-3.5 w-3.5" />,
}

function parsePrice(value: string | number | null): number {
  if (value == null) return 0
  return typeof value === 'string' ? parseFloat(value) : value
}

const FEATURED_SLUG = 'plano-pro'

export function PlanSelectionStep({ plans, onSelectPlan, onStartTrial }: PlanSelectionStepProps) {
  const searchParams = useSearchParams()
  const initialSlug = searchParams.get('plano') ?? FEATURED_SLUG
  const initialCycle = (
    searchParams.get('cycle') === 'yearly' ? 'yearly' : 'monthly'
  ) as BillingCycle
  const [selectedSlug, setSelectedSlug] = useState<string>(initialSlug)
  const [cycle, setCycle] = useState<BillingCycle>(initialCycle)

  const maxYearlySavings = Math.max(
    0,
    ...plans.map((p) => computeYearlySavings(p.price_monthly, p.price_yearly)),
  )

  return (
    <motion.div
      key="plan"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 20 }}
      transition={{ duration: 0.3 }}
    >
      {/* Header + toggle */}
      <div className="mb-6 flex items-end justify-between">
        <div>
          <h1 className="text-[24px] font-extrabold tracking-[-0.02em] text-nxi1">
            Escolha seu plano
          </h1>
          <p className="mt-1 text-[13.5px] font-semibold text-nxi2">
            Compare os planos e escolha o ideal para o seu negócio
          </p>
        </div>

        {/* Segmented control */}
        <div className="flex rounded-[10px] border border-nxborder bg-nxbg p-[3px]">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={cn(
              'h-8 rounded-[7px] px-4 text-[13px] font-extrabold transition-all',
              cycle === 'monthly'
                ? 'bg-white text-nxi1 shadow-[0_1px_2px_rgba(0,0,0,.06)]'
                : 'text-nxi3 hover:text-nxi2',
            )}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setCycle('yearly')}
            className={cn(
              'flex h-8 items-center gap-1.5 rounded-[7px] px-4 text-[13px] font-extrabold transition-all',
              cycle === 'yearly'
                ? 'bg-white text-nxi1 shadow-[0_1px_2px_rgba(0,0,0,.06)]'
                : 'text-nxi3 hover:text-nxi2',
            )}
          >
            Anual
            {maxYearlySavings > 0 && (
              <span className="text-[10px] font-extrabold text-nxs">-{maxYearlySavings}%</span>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-3.5 md:grid-cols-3">
        {plans.map((plan, i) => {
          const rawPrice = cycle === 'yearly' ? plan.price_yearly : plan.price_monthly
          const price = parsePrice(rawPrice)
          const priceStr = price.toFixed(2).replace('.', ',')
          const [priceInt, priceDec] = priceStr.split(',')
          const features = derivePlanFeaturesComparison(plan)
          const isFeatured = plan.slug === FEATURED_SLUG
          const isSelected = plan.slug === selectedSlug
          const yearlyUnavailable = cycle === 'yearly' && plan.price_yearly == null
          const icon = PLAN_ICONS[plan.slug] ?? <Zap className="h-3.5 w-3.5" />

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.07 }}
              onClick={() => !yearlyUnavailable && setSelectedSlug(plan.slug)}
              className={cn(
                'relative flex flex-col rounded-2xl p-5 transition-all',
                yearlyUnavailable && 'cursor-not-allowed opacity-55',
                !yearlyUnavailable && 'cursor-pointer',
                isSelected && !yearlyUnavailable
                  ? 'border-2 border-nxp bg-nxp/[0.03]'
                  : 'border border-nxborder bg-white hover:border-nxi3',
              )}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-nxborder bg-white px-3 py-1 text-[11.5px] font-extrabold text-nxi1 shadow-sm">
                    <Flame className="h-3 w-3 text-nxa" />
                    Mais popular
                  </span>
                </div>
              )}

              {/* Badge do plano */}
              <div
                className={cn(
                  'mb-3.5 inline-flex items-center gap-1.5 self-start rounded-lg px-2.5 py-1 text-[12px] font-extrabold',
                  isSelected && !yearlyUnavailable
                    ? 'bg-nxp text-white'
                    : 'bg-nxbg text-nxi2',
                )}
              >
                {icon}
                {plan.name}
              </div>

              {/* Preço */}
              {yearlyUnavailable ? (
                <p className="mb-2 text-[13.5px] italic text-nxi3">Sem cobrança anual</p>
              ) : (
                <div className="flex items-start gap-0.5">
                  <span className="mt-1.5 text-[14px] font-bold text-nxi3">R$</span>
                  <span
                    className={cn(
                      'text-[38px] font-extrabold leading-none tracking-tight',
                      isSelected ? 'text-nxp' : 'text-nxi1',
                    )}
                  >
                    {priceInt}
                  </span>
                  <div className="ml-0.5 mt-0.5 flex flex-col">
                    <span
                      className={cn(
                        'text-[17px] font-extrabold leading-none',
                        isSelected ? 'text-nxp' : 'text-nxi1',
                      )}
                    >
                      ,{priceDec}
                    </span>
                    <span className="mt-0.5 text-[11px] font-bold text-nxi3">
                      /{cycle === 'yearly' ? 'ano' : 'mês'}
                    </span>
                  </div>
                </div>
              )}

              <p className="mt-2 text-[12px] font-semibold text-nxi3">{plan.description}</p>

              {/* Features */}
              <div className="my-4 flex flex-1 flex-col gap-2.5">
                {features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    {feat.included ? (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nxp">
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </span>
                    ) : (
                      <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nxbg">
                        <X className="h-2.5 w-2.5 text-nxi3" strokeWidth={3} />
                      </span>
                    )}
                    <span
                      className={cn(
                        'text-[13px] font-semibold',
                        feat.included ? 'text-nxi2' : 'text-nxi3 line-through',
                      )}
                    >
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA */}
              {plan.trial_days != null &&
              plan.trial_days > 0 &&
              onStartTrial &&
              !yearlyUnavailable ? (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onStartTrial(plan, cycle)
                  }}
                  className="mt-auto flex h-11 w-full items-center justify-center gap-1.5 rounded-lg bg-nxp text-[13.5px] font-bold text-white transition-colors hover:bg-nxp/90 active:scale-[0.99]"
                >
                  Começar grátis por {plan.trial_days} dias
                </button>
              ) : (
                <button
                  type="button"
                  disabled={yearlyUnavailable}
                  onClick={(e) => {
                    e.stopPropagation()
                    if (yearlyUnavailable) return
                    onSelectPlan(plan, cycle)
                  }}
                  className={cn(
                    'mt-auto h-11 w-full rounded-lg text-[13.5px] font-bold transition-all active:scale-[0.99]',
                    yearlyUnavailable
                      ? 'cursor-not-allowed bg-nxbg text-nxi3'
                      : isSelected
                        ? 'bg-nxp text-white hover:bg-nxp/90'
                        : 'border border-nxborder bg-white text-nxi2 hover:border-nxp hover:text-nxp',
                  )}
                >
                  {yearlyUnavailable ? 'Indisponível' : `Escolher ${plan.name}`}
                </button>
              )}
            </motion.div>
          )
        })}
      </div>
    </motion.div>
  )
}
