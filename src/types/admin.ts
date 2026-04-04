export interface AdminStats {
  total_users: number
  total_sellers: number
  active_stores: number
  monthly_revenue: number
  total_revenue: number
}

export interface AdminPlan {
  id: number
  name: string
  slug: string
  description: string | null
  price: number
  billing_cycle: string
  max_products: number | null
  max_stores: number
  features: string
  status: number
  sort_order: number
  created_at: string
  updated_at: string
}

export interface AdminSubscription {
  id: number
  status: string
  payment_provider: string
  current_period_start: string
  current_period_end: string
  cancel_at_period_end: number
  created_at: string
  user: { id: number; name: string; email: string }
  plan: { id: number; name: string; price: number; billing_cycle: string }
}

export interface AdminRefund {
  id: number
  amount: number
  status: string
  payment_method: string
  payment_id: string | null
  paid_at: string | null
  updated_at: string
  subscription: {
    id: number
    user: { id: number; name: string; email: string }
    plan: { id: number; name: string }
  }
}

export interface AdminStore {
  id: number
  name: string
  slug: string
  status: number
  city: string | null
  state: string | null
  created_at: string
  user: { id: number; name: string; email: string }
}

export interface AdminUser {
  id: number
  name: string
  email: string
  phone: string | null
  status: number
  profile_id: number
  created_at: string
  profile?: { name: string; identifier: string }
}

export interface PaginatedMeta {
  total: number
  lastPage: number
  currentPage: number
  perPage: number
  prev: number | null
  next: number | null
}

export interface PaginatedResponse<T> {
  data: T[]
  meta: PaginatedMeta
}
