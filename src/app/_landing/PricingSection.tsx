'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Lock } from 'lucide-react'
import s from '../landing.module.css'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { derivePlanFeaturesComparison, computeYearlySavings } from '@/lib/planUtils'
import type { BillingCycle } from '@/types/subscription'

function formatBRL(value: string | number | null | undefined): string {
  if (value == null) return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export const PricingSection = () => {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const { data: plans, isLoading } = useSubscriptionPlans()

  const annual = billing === 'yearly'

  const savingsPercent =
    plans?.length ? computeYearlySavings(plans[0].price_monthly, plans[0].price_yearly) : 17

  return (
    <section className={`${s.sec} ${s.bgWht}`} id="precos">
      <div className={s.wrap}>
        <div className={s.secHead} data-rev>
          <div className={s.eyebrow}>Preços</div>
          <h2 className={s.h2}>Escolha seu plano</h2>
          <p className={s.lead}>
            Sem taxa por venda — o dinheiro das vendas cai direto na sua conta.
          </p>
          <div className={s.billingToggleWrap}>
            <div className={s.billingToggle}>
              <button
                className={billing === 'monthly' ? s.on : ''}
                onClick={() => setBilling('monthly')}
                type="button"
              >
                Mensal
              </button>
              <button
                className={billing === 'yearly' ? s.on : ''}
                onClick={() => setBilling('yearly')}
                type="button"
              >
                Anual
                {savingsPercent > 0 && (
                  <span className={s.savePill}>-{savingsPercent}%</span>
                )}
              </button>
            </div>
          </div>
        </div>
        <div className={s.plans}>
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.plan} style={{ opacity: 0.4, minHeight: 400 }} data-rev />
            ))}
          {plans?.map((plan, index) => {
            const isReco = index === 1 && plans.length >= 2
            const features = derivePlanFeaturesComparison(plan)

            const yearlyTotal =
              plan.price_yearly != null ? parseFloat(plan.price_yearly) : null
            const yearlyPerMonth = yearlyTotal != null ? yearlyTotal / 12 : null

            const displayPrice =
              annual && yearlyPerMonth != null
                ? formatBRL(yearlyPerMonth)
                : formatBRL(plan.price_monthly)

            const displaySub =
              annual && yearlyTotal != null
                ? `${formatBRL(yearlyTotal)} cobrados 1× ao ano`
                : 'cobrança mensal'

            return (
              <div
                key={plan.slug}
                className={isReco ? `${s.plan} ${s.reco}` : s.plan}
                data-rev
              >
                {isReco && <span className={s.planTag}>Mais popular</span>}
                <div className={s.planName}>{plan.name}</div>
                <div className={s.planDesc}>{plan.description}</div>
                <div className={s.planPrice}>
                  {displayPrice}
                  <small>/mês</small>
                </div>
                <div className={s.planSub}>{displaySub}</div>
                <ul className={s.planFeats}>
                  {features.map((f) => (
                    <li key={f.label} className={f.included ? '' : s.off}>
                      {f.included ? (
                        <Check size={17} color="#10B981" />
                      ) : (
                        <X size={17} color="#CBD5E1" />
                      )}
                      {f.label}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/assinatura?plano=${plan.slug}&cycle=${billing}`}
                  className={isReco ? `${s.btn} ${s.btnPri}` : `${s.btn} ${s.btnOutline}`}
                  style={{
                    width: '100%',
                    height: '48px',
                    justifyContent: 'center',
                    marginTop: 'auto',
                    color: isReco ? 'var(--wht)' : 'var(--t1)',
                  }}
                >
                  Assinar {plan.name}
                </Link>
              </div>
            )
          })}
        </div>
        <div className={s.pricingFoot}>
          <Lock size={16} color="#64748B" />
          Sem taxa de transação em nenhum plano. Cancele quando quiser.
        </div>
      </div>
    </section>
  )
}
