'use client'

import { useMemo, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import s from '../landing.module.css'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { EASE } from './motion'
import { SimpleSectionHeader } from './SectionHeader'
import { PlansSkeletonGrid } from './PlanSkeleton'
import { IcArrow, IcCheck } from './icons'
import { PRICING_COPY } from './data'
import {
  formatBRL,
  formatYearlyTotal,
  normalizePlans,
  calcYearlyDiscount,
  type NormalizedPlan,
} from './price'

type Billing = 'monthly' | 'yearly'

const planVariant = {
  hidden: { opacity: 0, y: 32 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: EASE } },
}

/* ─── Toggle ─────────────────────────────────────────────────── */
interface BillingToggleProps {
  billing: Billing
  setBilling: (v: Billing) => void
  discount: number
}

const BillingToggle = ({ billing, setBilling, discount }: BillingToggleProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.9 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5, ease: EASE, delay: 0.1 }}
    style={{ display: 'flex', justifyContent: 'center', marginBottom: 64, paddingTop: 8 }}
  >
    <div className={s.toggle}>
      <button
        className={`${s.toggleBtn} ${billing === 'monthly' ? s.active : ''}`}
        onClick={() => setBilling('monthly')}
      >
        Mensal
      </button>
      <button
        className={`${s.toggleBtn} ${billing === 'yearly' ? s.active : ''}`}
        onClick={() => setBilling('yearly')}
      >
        Anual{discount > 0 && <span className={s.toggleSave}>−{discount}%</span>}
      </button>
    </div>
  </motion.div>
)

/* ─── Plan Card ──────────────────────────────────────────────── */
interface PlanCardProps {
  plan: NormalizedPlan
  billing: Billing
}

const PlanCard = ({ plan, billing }: PlanCardProps) => {
  const showYearly = billing === 'yearly' && plan.yearly > 0
  const displayPrice = showYearly ? plan.yearlyPerMonth : plan.monthly

  return (
    <motion.div
      variants={planVariant}
      whileHover={{ y: plan.featured ? -12 : -4 }}
      transition={{ duration: 0.3, ease: 'easeOut' }}
      className={`${s.plan} ${plan.featured ? s.planFeatured : ''}`}
    >
      {plan.featured && <span className={s.planBadge}>Mais popular</span>}
      <div>
        <div className={s.planName}>{plan.name}</div>
        <div className={s.price} style={{ marginTop: 10 }}>
          <AnimatePresence mode="wait" initial={false}>
            <motion.span
              key={billing + String(plan.id)}
              className={s.priceNum}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.25, ease: EASE }}
            >
              R$ {formatBRL(displayPrice)}
            </motion.span>
          </AnimatePresence>
          <span className={s.pricePer}>/mês</span>
        </div>
        <div style={{ fontSize: 12, color: 'var(--ink-3)', fontFamily: 'monospace', marginTop: 4 }}>
          {showYearly
            ? `cobrado R$ ${formatYearlyTotal(plan.yearly)} por ano`
            : 'cobrado mensalmente'}
        </div>
      </div>
      <p className={s.pitch}>{plan.description}</p>
      <ul className={s.planFeatures}>
        {plan.features.map((f, j) => (
          <motion.li
            key={j}
            className={s.planFeatureItem}
            initial={{ opacity: 0, x: -8 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.05 * j + 0.2 }}
          >
            <IcCheck size={16} style={{ color: plan.featured ? '#4F46E5' : '#10B981', flexShrink: 0, marginTop: 2 }} />
            <span style={{ color: 'var(--ink-2)' }}>{f}</span>
          </motion.li>
        ))}
      </ul>
      <motion.a
        href={`/assinatura?plan=${plan.slug}`}
        whileHover={{ y: -2, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        className={`${s.btn} ${s.btnLg} ${plan.featured ? s.btnPrimary : s.btnGhost}`}
        style={{ marginTop: 'auto', width: '100%', justifyContent: 'center' }}
      >
        {plan.cta}<IcArrow size={16} />
      </motion.a>
    </motion.div>
  )
}

/* ─── Empty State ────────────────────────────────────────────── */
const PlansMessage = ({ children }: { children: React.ReactNode }) => (
  <div style={{ textAlign: 'center', padding: '48px 24px', color: 'var(--ink-3)' }}>
    {children}
  </div>
)

/* ─── Section ────────────────────────────────────────────────── */
export const PricingSection = () => {
  const [billing, setBilling] = useState<Billing>('yearly')
  const { data: rawPlans, isLoading, isError } = useSubscriptionPlans()

  const plans = useMemo(() => normalizePlans(rawPlans ?? []), [rawPlans])
  const yearlyDiscount = useMemo(() => calcYearlyDiscount(plans), [plans])
  const hasAnyYearly = plans.some((p) => p.yearly > 0)

  return (
    <section id="pricing" className={s.section}>
      <div className={s.container}>
        <SimpleSectionHeader
          eyebrow={PRICING_COPY.eyebrow}
          title={PRICING_COPY.title}
          titleHighlight={PRICING_COPY.titleHighlight}
          marginBottom={40}
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.6, ease: EASE }}
          className={s.lede}
          style={{ margin: '-32px auto 40px', textAlign: 'center' }}
        >
          {PRICING_COPY.subtitle}
        </motion.p>

        {hasAnyYearly && (
          <BillingToggle billing={billing} setBilling={setBilling} discount={yearlyDiscount} />
        )}

        {isLoading ? (
          <PlansSkeletonGrid />
        ) : isError ? (
          <PlansMessage>Não foi possível carregar os planos. Tente recarregar a página.</PlansMessage>
        ) : plans.length === 0 ? (
          <PlansMessage>Em breve, novos planos por aqui.</PlansMessage>
        ) : (
          <motion.div
            className={s.plans}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.15 }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }}
          >
            {plans.map((plan) => (
              <PlanCard key={plan.id} plan={plan} billing={billing} />
            ))}
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.4 }}
          style={{ textAlign: 'center', marginTop: 36, fontSize: 14, color: 'var(--ink-3)' }}
        >
          {PRICING_COPY.trialNote}{' '}
          <a href={PRICING_COPY.trialLink.href} style={{ color: '#4F46E5', fontWeight: 500 }}>
            {PRICING_COPY.trialLink.label}
          </a>
        </motion.div>
      </div>
    </section>
  )
}
