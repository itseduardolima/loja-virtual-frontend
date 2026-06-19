'use client'

import { useState } from 'react'
import { Check, X, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import s from '../landing.module.css'

type Billing = 'monthly' | 'yearly'

interface Feature { label: string; included: boolean }

interface Plan {
  id: string
  name: string
  slug: string
  monthlyPrice: number
  yearlyPrice: number
  description: string
  featured: boolean
  features: Feature[]
}

const PLANS: Plan[] = [
  {
    id: 'basico',
    name: 'Básico',
    slug: 'plano-basico',
    monthlyPrice: 29.90,
    yearlyPrice: 24.92,
    description: 'Ideal pra começar. Loja no ar, pedidos organizados e Pix na conta.',
    featured: false,
    features: [
      { label: 'Até 30 produtos', included: true },
      { label: 'Pix, cartão e boleto (Asaas)', included: true },
      { label: 'Suporte em português seg–sex', included: true },
      { label: 'Cupons de desconto', included: false },
      { label: 'Dashboard avançado', included: false },
      { label: 'Exportar pedidos (XLS)', included: false },
      { label: 'Integração Bling ERP', included: false },
      { label: 'Domínio próprio', included: false },
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    slug: 'plano-pro',
    monthlyPrice: 79.90,
    yearlyPrice: 66.58,
    description: 'Pra quem vende de verdade. Todos os recursos pra escalar sem limites.',
    featured: true,
    features: [
      { label: 'Até 100 produtos', included: true },
      { label: 'Pix, cartão e boleto (Asaas)', included: true },
      { label: 'Suporte em português seg–sex', included: true },
      { label: 'Cupons de desconto', included: true },
      { label: 'Dashboard avançado', included: true },
      { label: 'Exportar pedidos (XLS)', included: true },
      { label: 'Integração Bling ERP', included: true },
      { label: 'Domínio próprio', included: false },
    ],
  },
  {
    id: 'max',
    name: 'Max',
    slug: 'plano-max',
    monthlyPrice: 149.90,
    yearlyPrice: 124.92,
    description: 'Sem limite de produtos, domínio próprio e suporte 24/7.',
    featured: false,
    features: [
      { label: 'Produtos ilimitados', included: true },
      { label: 'Pix, cartão e boleto (Asaas)', included: true },
      { label: 'Suporte 24/7', included: true },
      { label: 'Cupons de desconto', included: true },
      { label: 'Dashboard avançado', included: true },
      { label: 'Exportar pedidos (XLS)', included: true },
      { label: 'Integração Bling ERP', included: true },
      { label: 'Domínio próprio', included: true },
    ],
  },
]

function formatBRL(val: number) {
  return val.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })
}

export function PricingSection() {
  const [billing, setBilling] = useState<Billing>('yearly')

  return (
    <section id="precos" className={s.section}>
      <div className={s.container}>
        <div className={s.pricingHeading} data-rev>
          <span className={s.eyebrow}><span className={s.dot} />Planos</span>
          <h2 className={`${s.hSection} ${s.sectionTitle}`}>
            Preço justo, sem letra miúda
          </h2>
          <p className={`${s.lede} ${s.sectionSubtitle}`}>
            Sem taxa de transação. Sem contrato. Cancele quando quiser.
          </p>
        </div>

        <div className={s.billingToggleWrap}>
          <div className={s.toggle}>
            <button
              className={`${s.toggleBtn} ${billing === 'monthly' ? s.on : ''}`}
              onClick={() => setBilling('monthly')}
            >
              Mensal
            </button>
            <button
              className={`${s.toggleBtn} ${billing === 'yearly' ? s.on : ''}`}
              onClick={() => setBilling('yearly')}
            >
              Anual <span className={s.toggleSave}>−17%</span>
            </button>
          </div>
        </div>

        <div className={s.plans} data-rev>
          {PLANS.map((plan) => {
            const price = billing === 'yearly' ? plan.yearlyPrice : plan.monthlyPrice
            const ctaClass = plan.featured ? s.btnPrimary : s.btnGhost
            return (
              <div key={plan.id} className={`${s.plan} ${plan.featured ? s.planFeatured : ''}`}>
                {plan.featured && <span className={s.planBadge}>Mais popular</span>}
                <div>
                  <div className={s.planName}>{plan.name}</div>
                  <div className={`${s.price} ${s.priceMt}`}>
                    <span className={s.priceNum}>R${formatBRL(price)}</span>
                    <span className={s.pricePer}>/mês</span>
                  </div>
                  <div className={s.priceSub}>
                    {billing === 'yearly'
                      ? `cobrado R$ ${formatBRL(plan.yearlyPrice * 12)} por ano`
                      : 'cobrado mensalmente'}
                  </div>
                </div>
                <p className={s.pitch}>{plan.description}</p>
                <ul className={s.planFeatures}>
                  {plan.features.map((f, j) => (
                    <li key={j} className={s.planFeatureItem}>
                      {f.included
                        ? <Check size={15} className={`${s.planFeatureCheck} ${plan.featured ? s.planCheckIndigo : s.planCheckGreen}`} />
                        : <X size={15} className={s.planXIcon} />}
                      <span className={f.included ? '' : s.muted}>{f.label}</span>
                    </li>
                  ))}
                </ul>
                <div className={s.planCtaWrap}>
                  <Link href={`/assinatura?plan=${plan.slug}`} className={`${s.planCta} ${s.btn} ${ctaClass}`}>
                    {plan.featured ? 'Começar com Pro' : `Escolher ${plan.name}`}
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
            )
          })}
        </div>

        <p className={s.compFootnote}>
          Todos os planos incluem Pix, cartão e boleto via Asaas — sem custo adicional da Nexo.
        </p>
      </div>
    </section>
  )
}
