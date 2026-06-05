import type { SubscriptionPlan, NormalizedPlan } from '@/types'
import { formatBRL } from '@/lib/utils'

export type { NormalizedPlan }
export { formatBRL }

export const parsePrice = (value: string | null | undefined): number => {
  if (!value) return 0
  const n = Number(String(value).replace(',', '.'))
  return Number.isFinite(n) ? n : 0
}

export const formatYearlyTotal = (n: number): string =>
  Number.isInteger(n)
    ? n.toLocaleString('pt-BR')
    : n.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })

export const buildPlanFeatures = (plan: SubscriptionPlan): string[] => {
  const f: string[] = []
  f.push(plan.max_products ? `Até ${plan.max_products} produtos` : 'Produtos ilimitados')
  f.push('Gestão de pedidos')
  f.push('Pagamentos integrados (Pix, cartão, boleto)')
  if (plan.feature_coupons) f.push('Cupons de desconto')
  if (plan.feature_advanced_dashboard) f.push('Dashboard avançado')
  if (plan.feature_product_questions) f.push('Perguntas e respostas')
  if (plan.feature_order_export) f.push('Exportar pedidos em Excel')
  if (plan.feature_bling_integration) f.push('Integração Bling ERP')
  if (plan.trial_days) f.push(`${plan.trial_days} dias grátis pra testar`)
  return f
}

export const normalizePlans = (plans: SubscriptionPlan[]): NormalizedPlan[] => {
  if (!plans?.length) return []
  const sorted = [...plans].sort((a, b) => a.sort_order - b.sort_order)
  const featuredIdx = sorted.length === 1 ? -1 : Math.floor(sorted.length / 2)
  return sorted.map((p, i) => {
    const monthly = parsePrice(p.price_monthly)
    const yearly = parsePrice(p.price_yearly)
    return {
      ...p,
      monthly,
      yearly,
      yearlyPerMonth: yearly > 0 ? yearly / 12 : monthly,
      featured: i === featuredIdx,
      features: buildPlanFeatures(p),
      cta: i === 0 ? 'Começar agora' : `Assinar ${p.name}`,
    }
  })
}

export const calcYearlyDiscount = (plans: NormalizedPlan[]): number => {
  const sample = plans.find((p) => p.monthly > 0 && p.yearly > 0)
  if (!sample) return 0
  const total = sample.monthly * 12
  return Math.max(0, Math.round(((total - sample.yearly) / total) * 100))
}
