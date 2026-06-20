'use client'
import { useState } from 'react'
import Link from 'next/link'
import { Check, X, Lock } from 'lucide-react'
import s from '../landing.module.css'

type Billing = 'monthly' | 'annual'

const PLANS = [
  {
    slug: 'plano-basico',
    name: 'Básico',
    desc: 'Pra começar a vender online',
    monthly: 'R$ 29,90',
    annual: 'R$ 24,92',
    subMonthly: 'cobrança mensal',
    subAnnual: 'R$ 299,00 cobrados 1× ao ano',
    reco: false,
    features: [
      { label: 'Até 30 produtos', on: true },
      { label: 'Gestão de pedidos (Kanban e lista)', on: true },
      { label: 'Pagamentos Pix, cartão e boleto', on: true },
      { label: 'Cupons de desconto', on: false },
      { label: 'Dashboard avançado', on: false },
      { label: 'Perguntas e respostas', on: false },
      { label: 'Exportar pedidos · Bling ERP', on: false },
    ],
  },
  {
    slug: 'plano-pro',
    name: 'Pro',
    desc: 'Pra loja que está crescendo',
    monthly: 'R$ 79,90',
    annual: 'R$ 66,58',
    subMonthly: 'cobrança mensal',
    subAnnual: 'R$ 799,00 cobrados 1× ao ano',
    reco: true,
    features: [
      { label: 'Até 100 produtos', on: true },
      { label: 'Tudo do Básico', on: true },
      { label: 'Cupons de desconto', on: true },
      { label: 'Dashboard avançado', on: true },
      { label: 'Perguntas e respostas nos produtos', on: true },
      { label: 'Exportar pedidos em Excel', on: true },
      { label: 'Bling ERP · NF-e automática', on: true },
    ],
  },
  {
    slug: 'plano-max',
    name: 'Max',
    desc: 'Pra quem vende em escala',
    monthly: 'R$ 149,90',
    annual: 'R$ 124,92',
    subMonthly: 'cobrança mensal',
    subAnnual: 'R$ 1.499,00 cobrados 1× ao ano',
    reco: false,
    features: [
      { label: 'Produtos ilimitados', on: true },
      { label: 'Tudo do Pro', on: true },
      { label: 'Domínio próprio (sualoja.com.br)', on: true },
      { label: 'Suporte prioritário 24/7', on: true },
    ],
  },
]

export const PricingSection = () => {
  const [billing, setBilling] = useState<Billing>('monthly')
  const annual = billing === 'annual'

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
                className={billing === 'annual' ? s.on : ''}
                onClick={() => setBilling('annual')}
                type="button"
              >
                Anual<span className={s.savePill}>-17%</span>
              </button>
            </div>
          </div>
        </div>
        <div className={s.plans}>
          {PLANS.map((plan) => (
            <div key={plan.slug} className={plan.reco ? `${s.plan} ${s.reco}` : s.plan} data-rev>
              {plan.reco && <span className={s.planTag}>Mais popular</span>}
              <div className={s.planName}>{plan.name}</div>
              <div className={s.planDesc}>{plan.desc}</div>
              <div className={s.planPrice}>
                {annual ? plan.annual : plan.monthly}
                <small>/mês</small>
              </div>
              <div className={s.planSub}>{annual ? plan.subAnnual : plan.subMonthly}</div>
              <ul className={s.planFeats}>
                {plan.features.map((f) => (
                  <li key={f.label} className={f.on ? '' : s.off}>
                    {f.on ? <Check size={17} color="#10B981" /> : <X size={17} color="#CBD5E1" />}
                    {f.label}
                  </li>
                ))}
              </ul>
              <Link
                href={`/assinatura?plan=${plan.slug}`}
                className={plan.reco ? `${s.btn} ${s.btnPri}` : `${s.btn} ${s.btnOutline}`}
                style={{
                  width: '100%',
                  height: '48px',
                  justifyContent: 'center',
                  marginTop: 'auto',
                  color: plan.reco ? 'var(--wht)' : 'var(--t1)',
                }}
              >
                Assinar {plan.name}
              </Link>
            </div>
          ))}
        </div>
        <div className={s.pricingFoot}>
          <Lock size={16} color="#64748B" />
          Sem taxa de transação em nenhum plano. Cancele quando quiser.
        </div>
      </div>
    </section>
  )
}
