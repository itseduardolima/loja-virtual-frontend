import { useMySubscription } from './useMySubscription'
import { useAuth } from '@/contexts/AuthContext'

/**
 * Keys idênticas às colunas booleanas do PLAN no backend.
 * Mantém um único nome por feature em todo o frontend.
 */
export interface PlanFeatures {
  feature_bling_integration: boolean
  feature_product_questions: boolean
  feature_advanced_dashboard: boolean
  feature_order_export: boolean
  feature_coupons: boolean
}

export type PlanFeatureKey = keyof PlanFeatures

const DEFAULT_FEATURES: PlanFeatures = {
  feature_bling_integration: false,
  feature_product_questions: false,
  feature_advanced_dashboard: false,
  feature_order_export: false,
  feature_coupons: false,
}

const ALL_FEATURES_ON: PlanFeatures = {
  feature_bling_integration: true,
  feature_product_questions: true,
  feature_advanced_dashboard: true,
  feature_order_export: true,
  feature_coupons: true,
}

export function usePlanFeatures(): {
  features: PlanFeatures
  isLoading: boolean
  isSubscriptionActive: boolean
} {
  const { user } = useAuth()
  const { data: subscription, isLoading } = useMySubscription({
    enabled: user?.profile === 'Vendedor',
  })

  if (user?.profile === 'Administrador') {
    return { features: ALL_FEATURES_ON, isLoading: false, isSubscriptionActive: true }
  }

  const isActive = subscription?.status === 'active'
  const plan = subscription?.plan

  if (!isActive || !plan) {
    return { features: DEFAULT_FEATURES, isLoading, isSubscriptionActive: false }
  }

  return {
    features: {
      feature_bling_integration: !!plan.feature_bling_integration,
      feature_product_questions: !!plan.feature_product_questions,
      feature_advanced_dashboard: !!plan.feature_advanced_dashboard,
      feature_order_export: !!plan.feature_order_export,
      feature_coupons: !!plan.feature_coupons,
    },
    isLoading: false,
    isSubscriptionActive: true,
  }
}
