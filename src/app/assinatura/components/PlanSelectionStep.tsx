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
  'plano-basico': <Zap className="h-4 w-4" />,
  'plano-pro': <Flame className="h-4 w-4" />,
  'plano-max': <Star className="h-4 w-4" />,
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
      <div className="mb-8 text-center">
        <h1 className="mb-3 text-[28px] font-extrabold tracking-[-0.02em] text-nxi1 sm:text-[34px]">
          Escolha seu plano
        </h1>
        <p className="mx-auto max-w-xl text-[15px] text-nxi2">
          Compare os planos e escolha o que melhor se encaixa no seu negócio
        </p>
      </div>

      {/* Toggle Mensal/Anual */}
      <div className="mb-8 flex justify-center">
        <div className="inline-flex items-center rounded-full border border-nxborder bg-nxbg p-1">
          <button
            type="button"
            onClick={() => setCycle('monthly')}
            className={cn(
              'rounded-full px-5 py-2 text-[13.5px] font-semibold transition-all',
              cycle === 'monthly' ? 'bg-white text-nxi1 shadow-sm' : 'text-nxi3 hover:text-nxi1',
            )}
          >
            Mensal
          </button>
          <button
            type="button"
            onClick={() => setCycle('yearly')}
            className={cn(
              'flex items-center gap-1.5 rounded-full px-5 py-2 text-[13.5px] font-semibold transition-all',
              cycle === 'yearly' ? 'bg-white text-nxi1 shadow-sm' : 'text-nxi3 hover:text-nxi1',
            )}
          >
            Anual
            {maxYearlySavings > 0 && (
              <span className="inline-flex items-center rounded-full bg-nxs/10 px-1.5 py-0.5 text-[10px] font-bold text-nxs">
                -{maxYearlySavings}%
              </span>
            )}
          </button>
        </div>
      </div>

      <div className="mx-auto grid max-w-5xl grid-cols-1 gap-5 md:grid-cols-3">
        {plans.map((plan, i) => {
          const rawPrice = cycle === 'yearly' ? plan.price_yearly : plan.price_monthly
          const price = parsePrice(rawPrice)
          const priceStr = price.toFixed(2).replace('.', ',')
          const [priceInt, priceDec] = priceStr.split(',')
          const features = derivePlanFeaturesComparison(plan)
          const isFeatured = plan.slug === FEATURED_SLUG
          const isSelected = plan.slug === selectedSlug
          const yearlyUnavailable = cycle === 'yearly' && plan.price_yearly == null
          const icon = PLAN_ICONS[plan.slug] ?? <Zap className="h-4 w-4" />

          return (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.07 }}
              onClick={() => !yearlyUnavailable && setSelectedSlug(plan.slug)}
              className={cn(
                'relative flex flex-col rounded-2xl border p-6 transition-all',
                yearlyUnavailable && 'cursor-not-allowed opacity-50',
                !yearlyUnavailable && 'cursor-pointer',
                isSelected && !yearlyUnavailable
                  ? 'border-nxp bg-nxp text-white shadow-xl shadow-nxp/20'
                  : 'border-nxborder bg-white text-nxi1 hover:border-nxi3',
              )}
            >
              {isFeatured && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                  <span className="inline-flex items-center gap-1 rounded-full border border-nxborder bg-white px-3 py-1 text-[11.5px] font-semibold text-nxi1 shadow-sm">
                    <Flame className="h-3 w-3 text-nxa" />
                    Mais popular
                  </span>
                </div>
              )}

              {/* Header */}
              <div className="mb-5">
                <div
                  className={cn(
                    'mb-3 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-[11.5px] font-semibold',
                    isSelected ? 'bg-white/15 text-white' : 'bg-nxbg text-nxi2',
                  )}
                >
                  {icon}
                  {plan.name}
                </div>

                {yearlyUnavailable ? (
                  <p className="mt-2 text-[13.5px] italic text-nxi3">Sem cobrança anual</p>
                ) : (
                  <div className="flex items-start gap-0.5">
                    <span
                      className={cn(
                        'mt-1.5 text-[13.5px] font-medium',
                        isSelected ? 'text-white/70' : 'text-nxi3',
                      )}
                    >
                      R$
                    </span>
                    <span className="text-4xl font-extrabold leading-none tracking-tight">
                      {priceInt}
                    </span>
                    <div className="ml-0.5 mt-1 flex flex-col">
                      <span className="text-lg font-extrabold leading-none">,{priceDec}</span>
                      <span
                        className={cn(
                          'mt-1 text-[11.5px]',
                          isSelected ? 'text-white/60' : 'text-nxi3',
                        )}
                      >
                        /{cycle === 'yearly' ? 'ano' : 'mês'}
                      </span>
                    </div>
                  </div>
                )}

                <p
                  className={cn(
                    'mt-2 text-[12px] leading-relaxed',
                    isSelected ? 'text-white/60' : 'text-nxi3',
                  )}
                >
                  {plan.description}
                </p>
              </div>

              {/* Features */}
              <div className="mb-6 flex-1 space-y-2.5">
                {features.map((feat, j) => (
                  <div key={j} className="flex items-center gap-2.5">
                    {feat.included ? (
                      <div
                        className={cn(
                          'flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
                          isSelected ? 'bg-white/20' : 'bg-nxp',
                        )}
                      >
                        <Check className="h-2.5 w-2.5 text-white" strokeWidth={3} />
                      </div>
                    ) : (
                      <div className="flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-nxbg">
                        <X className="h-2.5 w-2.5 text-nxi3" strokeWidth={3} />
                      </div>
                    )}
                    <span
                      className={cn(
                        'text-[13.5px]',
                        feat.included
                          ? isSelected
                            ? 'text-white/90'
                            : 'text-nxi2'
                          : 'text-nxi3 line-through',
                      )}
                    >
                      {feat.label}
                    </span>
                  </div>
                ))}
              </div>

              {/* CTA — único: trial OU paid */}
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
                  className={cn(
                    'h-11 w-full rounded-xl text-[13.5px] font-bold transition-all active:scale-[0.99]',
                    isSelected
                      ? 'bg-white text-nxp hover:bg-white/90'
                      : 'bg-nxp text-white hover:bg-nxp/90',
                  )}
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
                    'h-11 w-full rounded-xl text-[13.5px] font-bold transition-all active:scale-[0.99]',
                    yearlyUnavailable && 'cursor-not-allowed bg-nxbg text-nxi3',
                    !yearlyUnavailable &&
                      (isSelected
                        ? 'bg-white text-nxp hover:bg-white/90'
                        : 'bg-nxp text-white hover:bg-nxp/90'),
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
