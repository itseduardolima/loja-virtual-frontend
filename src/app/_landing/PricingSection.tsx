'use client'
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { animate } from 'animejs'
import { Check, X, Lock } from 'lucide-react'
import s from '../landing.module.css'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { derivePlanFeaturesComparison, computeYearlySavings } from '@/lib/planUtils'
import type { BillingCycle } from '@/types/subscription'
import { fadeUp, staggerContainer, viewportOnce } from './motion'

function formatBRL(value: string | number | null | undefined): string {
  if (value == null) return '—'
  const num = typeof value === 'string' ? parseFloat(value) : value
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

function PriceValue({ value }: { value: number | null }) {
  const ref = useRef<HTMLSpanElement>(null)
  const prevValue = useRef<number | null>(null)

  useEffect(() => {
    const el = ref.current
    if (!el || value == null) return
    const from = prevValue.current ?? value
    prevValue.current = value
    const counter = { v: from }
    animate(counter, {
      v: value,
      duration: 500,
      ease: 'outExpo',
      onUpdate: () => {
        el.textContent = counter.v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
      },
    })
  }, [value])

  return <span ref={ref}>{value != null ? formatBRL(value) : '—'}</span>
}

export const PricingSection = () => {
  const [billing, setBilling] = useState<BillingCycle>('monthly')
  const { data: plans, isLoading } = useSubscriptionPlans()

  const annual = billing === 'yearly'

  const savingsPercent = plans?.length
    ? computeYearlySavings(plans[0].price_monthly, plans[0].price_yearly)
    : 17

  return (
    <section className={s.sec} id="precos">
      <div className={s.wrap}>
        <motion.div
          className={s.secHead}
          variants={fadeUp}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          <span className={s.eyebrow}>
            <span className={s.dot} />
            Planos
          </span>
          <h2 className={s.display}>Um plano pra cada fase da loja.</h2>
          <p className={s.lead}>Sem taxa por venda. O dinheiro cai direto na sua conta.</p>
        </motion.div>

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
              {savingsPercent > 0 && <span className={s.savePill}>-{savingsPercent}%</span>}
            </button>
          </div>
        </div>

        <motion.div
          className={s.plans}
          variants={staggerContainer}
          initial="hidden"
          whileInView="show"
          viewport={viewportOnce}
        >
          {isLoading &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className={s.plan} style={{ opacity: 0.4, minHeight: 400 }} />
            ))}
          {plans?.map((plan, index) => {
            const isReco = index === 1 && plans.length >= 2
            const features = derivePlanFeaturesComparison(plan)

            const yearlyTotal = plan.price_yearly != null ? parseFloat(plan.price_yearly) : null
            const yearlyPerMonth = yearlyTotal != null ? yearlyTotal / 12 : null

            const monthlyValue = plan.price_monthly != null ? parseFloat(plan.price_monthly) : null
            const displayValue = annual && yearlyPerMonth != null ? yearlyPerMonth : monthlyValue

            const displaySub =
              annual && yearlyTotal != null
                ? `${formatBRL(yearlyTotal)} cobrados 1× ao ano`
                : 'cobrança mensal'

            return (
              <motion.div
                key={plan.slug}
                className={isReco ? `${s.plan} ${s.reco}` : s.plan}
                variants={fadeUp}
              >
                <div className={s.planNameRow}>
                  <div className={s.planName}>{plan.name}</div>
                  {isReco && <span className={s.planTag}>Mais popular</span>}
                </div>
                <div className={s.planDesc}>{plan.description}</div>
                <div className={s.planPrice}>
                  <PriceValue value={displayValue} />
                  <small>/mês</small>
                </div>
                <div className={s.planSub}>{displaySub}</div>
                {plan.trial_days != null && plan.trial_days > 0 && (
                  <div className={s.planTrial}>Teste grátis por {plan.trial_days} dias</div>
                )}
                <ul className={s.planFeats}>
                  {features.map((f) => (
                    <li key={f.label} className={f.included ? '' : 'off'}>
                      {f.included ? <Check size={16} color="#2e8a5a" /> : <X size={16} color="#8f8f8f" />}
                      {f.label}
                    </li>
                  ))}
                </ul>
                <Link
                  href={`/assinatura?plano=${plan.slug}&cycle=${billing}`}
                  className={isReco ? `${s.btn} ${s.btnPri}` : `${s.btn} ${s.btnGhost}`}
                >
                  Assinar {plan.name}
                </Link>
              </motion.div>
            )
          })}
        </motion.div>
        <div className={s.pricingFoot}>
          <Lock size={14} color="#8f8f8f" />
          Sem taxa de transação em nenhum plano. Cancele quando quiser.
        </div>
      </div>
    </section>
  )
}
