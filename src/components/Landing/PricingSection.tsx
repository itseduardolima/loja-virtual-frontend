'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { SectionHeader } from './SectionHeader'
import { PricingCard } from './PricingCard'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { derivePlanFeaturesComparison } from '@/lib/planUtils'
import { SubscriptionPlan, BillingCycle } from '@/types/subscription'
import { computeYearlySavings } from '@/lib/planUtils'
import { cn } from '@/lib/utils'

const FEATURED_SLUG = 'plano-pro'

function formatPrice(price: string | number | null): string {
  if (price == null) return '—'
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toFixed(2).replace('.', ',')
}

function ctaText(plan: SubscriptionPlan): string {
  if (plan.slug === 'plano-basico') return 'Começar Agora'
  return `Assinar ${plan.name.replace(/^Plano\s+/i, '')}`
}

export function PricingSection() {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const { data, isLoading } = useSubscriptionPlans()

  const cycle: BillingCycle = searchParams.get('cycle') === 'yearly' ? 'yearly' : 'monthly'

  const setCycle = (next: BillingCycle) => {
    const params = new URLSearchParams(searchParams.toString())
    if (next === 'monthly') params.delete('cycle')
    else params.set('cycle', next)
    const qs = params.toString()
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
  }

  const plans = (data ?? [])
    .filter((p) => p.status === 1)
    .sort((a, b) => a.sort_order - b.sort_order)

  // Calcula maior % de desconto entre planos para exibir no badge do toggle
  const maxYearlySavings = Math.max(
    0,
    ...plans.map((p) => computeYearlySavings(p.price_monthly, p.price_yearly)),
  )

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionHeader
          title="Planos Simples e Transparentes"
          description="Compare os planos e escolha o que melhor se encaixa no seu negócio."
        />

        {/* Toggle Mensal/Anual */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center bg-gray-100 rounded-full p-1 border border-gray-200">
            <button
              type="button"
              onClick={() => setCycle('monthly')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all',
                cycle === 'monthly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Mensal
            </button>
            <button
              type="button"
              onClick={() => setCycle('yearly')}
              className={cn(
                'px-5 py-2 rounded-full text-sm font-semibold transition-all flex items-center gap-1.5',
                cycle === 'yearly' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-700',
              )}
            >
              Anual
              {maxYearlySavings > 0 && (
                <span className="inline-flex items-center bg-green-100 text-green-700 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                  -{maxYearlySavings}%
                </span>
              )}
            </button>
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
            {[0, 1, 2].map((i) => (
              <div key={i} className="h-[480px] rounded-2xl border-2 border-gray-100 bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto px-2">
            {plans.map((plan) => {
              const features = derivePlanFeaturesComparison(plan).map((f) => ({
                text: f.label,
                included: f.included,
              }))
              const price = cycle === 'yearly' ? plan.price_yearly : plan.price_monthly
              const period = cycle === 'yearly' ? 'ano' : 'mês'
              return (
                <PricingCard
                  key={plan.id}
                  name={plan.name}
                  description={plan.description ?? ''}
                  price={formatPrice(price)}
                  period={period}
                  features={features}
                  ctaText={ctaText(plan)}
                  ctaHref={`/assinatura?plano=${plan.slug}&cycle=${cycle}`}
                  featured={plan.slug === FEATURED_SLUG}
                  trialDays={plan.trial_days}
                  trialHref={
                    plan.trial_days != null && plan.trial_days > 0
                      ? `/assinatura?plano=${plan.slug}&trial=true&cycle=${cycle}`
                      : undefined
                  }
                />
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
