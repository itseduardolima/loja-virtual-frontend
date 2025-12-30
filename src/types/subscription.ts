export interface SubscriptionPlan {
  id: number
  name: string
  slug: string
  description: string
  price: string
  billing_cycle: string
  max_products: number | null
  max_stores: number
  features: string
  status: number
  sort_order: number
  created_at: string
  updated_at: string
}

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

export interface Subscription {
  id: number
  user_id: number
  plan_id: number
  status: SubscriptionStatus
  payment_provider: string
  payment_id: string | null
  subscription_id: string
  current_period_start: string
  current_period_end: string
  canceled_at: string | null
  cancel_at_period_end: number
  created_at: string
  updated_at: string
  plan?: SubscriptionPlan
  payments?: any[]
}

export interface CreateSubscriptionRequest {
  billing_type: 'CREDIT_CARD' | 'PIX' | 'BOLETO'
  cpf?: string
  cnpj?: string
}

export interface CreateSubscriptionResponse {
  subscription: Subscription
  payment_url: string
  qr_code: string | null
}

export type BillingType = 'CREDIT_CARD' | 'PIX' | 'BOLETO'

