import { MessageCircle, BarChart3, FileDown, Tag, type LucideIcon } from 'lucide-react'
import { SubscriptionPlan } from '@/types/subscription'
import { AdminPlan } from '@/types/admin'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

type AnyPlan = Pick<
  SubscriptionPlan | AdminPlan,
  | 'max_products'
  | 'price_monthly'
  | 'price_yearly'
  | 'feature_product_questions'
  | 'feature_advanced_dashboard'
  | 'feature_order_export'
  | 'feature_coupons'
>

export interface PlanFeatureRow {
  label: string
  included: boolean
}

interface FeatureMeta {
  title: string
  description: string
  icon: LucideIcon
}

export const FEATURE_METADATA: Record<keyof PlanFeatures, FeatureMeta> = {
  feature_product_questions: {
    title: 'Perguntas e respostas',
    description:
      'Receba perguntas dos clientes diretamente nos seus produtos e responda pelo painel. Aumenta a confiança e a conversão da sua loja.',
    icon: MessageCircle,
  },
  feature_advanced_dashboard: {
    title: 'Dashboard avançado',
    description:
      'Gráfico de receita ao longo do tempo, top produtos mais vendidos, top categorias e alertas de estoque baixo. Tome decisões com base em dados.',
    icon: BarChart3,
  },
  feature_order_export: {
    title: 'Exportar pedidos',
    description:
      'Baixe seus pedidos em planilha Excel para análise externa, contabilidade ou backup. Inclui todos os filtros aplicados.',
    icon: FileDown,
  },
  feature_coupons: {
    title: 'Cupons de desconto',
    description:
      'Crie cupons de desconto (percentual ou valor fixo) com data de expiração, limite de uso e valor mínimo de pedido para impulsionar suas vendas.',
    icon: Tag,
  },
}

const productLabel = (max: number | null | undefined): string =>
  max == null ? 'Produtos ilimitados' : `Até ${max} produtos`

/**
 * Calcula a % de economia ao escolher anual em vez de 12 meses do mensal.
 * Retorna 0 se não houver economia ou se yearly não estiver definido.
 */
export function computeYearlySavings(
  monthly: string | number | null | undefined,
  yearly: string | number | null | undefined,
): number {
  if (yearly == null || monthly == null) return 0
  const monthlyNum = typeof monthly === 'string' ? parseFloat(monthly) : monthly
  const yearlyNum = typeof yearly === 'string' ? parseFloat(yearly) : yearly
  if (!monthlyNum || !yearlyNum) return 0
  const fullPrice = monthlyNum * 12
  if (yearlyNum >= fullPrice) return 0
  return Math.round((1 - yearlyNum / fullPrice) * 100)
}

/**
 * Lista apenas as funcionalidades inclusas no plano (para exibição em "recursos").
 */
export function derivePlanFeaturesList(plan: AnyPlan): string[] {
  const features: string[] = [productLabel(plan.max_products), 'Gestão de pedidos']
  if (plan.feature_coupons) features.push('Cupons de desconto')
  if (plan.feature_advanced_dashboard) features.push('Dashboard avançado')
  if (plan.feature_product_questions) features.push('Perguntas e respostas')
  if (plan.feature_order_export) features.push('Exportar pedidos')
  return features
}

/**
 * Lista todas as funcionalidades com flag de inclusão (para comparativo de planos).
 */
export function derivePlanFeaturesComparison(plan: AnyPlan): PlanFeatureRow[] {
  return [
    { label: productLabel(plan.max_products), included: true },
    { label: 'Gestão de pedidos', included: true },
    { label: 'Cupons de desconto', included: !!plan.feature_coupons },
    { label: 'Dashboard avançado', included: !!plan.feature_advanced_dashboard },
    { label: 'Perguntas e respostas', included: !!plan.feature_product_questions },
    { label: 'Exportar pedidos', included: !!plan.feature_order_export },
  ]
}
