export interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  description: string
  price_monthly: string
  price_yearly: string | null
  max_products: number | null
  feature_bling_integration: boolean
  feature_product_questions: boolean
  feature_advanced_dashboard: boolean
  feature_order_export: boolean
  feature_coupons: boolean
  status: number
  sort_order: number
  created_at: string
  updated_at: string
}

export type BillingCycle = 'monthly' | 'yearly'

/**
 * Status da assinatura:
 * - pending: Assinatura criada, aguardando confirmação de pagamento
 *   Quando: ao criar a assinatura
 *   Ação: usuário ainda é "cliente"
 * 
 * - active: Assinatura ativa e pagamento confirmado
 *   Quando: webhook PAYMENT_CONFIRMED ou PAYMENT_RECEIVED
 *   Ação: perfil atualizado para "vendedor"
 * 
 * - expired: Pagamento vencido
 *   Quando: webhook PAYMENT_OVERDUE
 *   Ação: perfil revertido para "cliente"
 * 
 * - canceled: Assinatura cancelada
 *   Quando: webhook PAYMENT_DELETED ou cancelamento manual
 *   Ação: perfil revertido para "cliente"
 */
export type SubscriptionStatus = 'pending' | 'active' | 'expired' | 'canceled'

export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'refund_requested'

export interface Payment {
  id: number
  subscription_id: number
  amount: string
  currency: string
  status: PaymentStatus
  payment_provider: string
  payment_id: string | null
  payment_method: string | null
  paid_at: string | null
  created_at: string
  updated_at: string
}

export interface Subscription {
  id: number
  user_id: number
  plan_id: number
  billing_cycle: BillingCycle
  status: SubscriptionStatus
  payment_provider: string
  subscription_id: string
  current_period_start: string
  current_period_end: string
  canceled_at: string | null
  cancel_at_period_end: number
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
  payments?: Payment[]
}

export interface CreateSubscriptionRequest {
  billing_type: 'CREDIT_CARD' | 'PIX' | 'BOLETO'
  cpf?: string
  cnpj?: string
  plan_slug?: string
  billing_cycle?: BillingCycle
}

export interface CreateSubscriptionResponse {
  subscription: Subscription
  payment_url: string
  qr_code: string | null
}

export type BillingType = 'CREDIT_CARD' | 'PIX' | 'BOLETO'

