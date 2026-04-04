export interface CustomerOrderItem {
  id: number
  quantity: number
  price: string
  size: string | null
  color: string | null
  notes: string | null
  created_at: string
  order_id: number
  product_id: number
  product: {
    id: number
    name: string
    price: string
    images: string[]
    dynamic_fields?: Array<{
      field_name: string
      value: string
    }>
  }
}

export interface CustomerOrder {
  id: number
  order_number: string
  order_code: string
  status: number
  total: string
  notes: string | null
  customer_name: string
  customer_phone: string
  customer_email: string
  whatsapp_sent: number
  whatsapp_sent_at: string | null
  created_at: string
  updated_at: string
  store_id: number
  user_id: number | null
  items: CustomerOrderItem[]
  store: {
    id: number
    name: string
    logo: string | null
    whatsapp: string | null
    instagram: string | null
    facebook?: string | null
    email?: string | null
    phone?: string | null
    address?: string | null
    city?: string | null
    state?: string | null
    zipcode?: string | null
  }
}

export interface CustomerOrdersResponse {
  data: CustomerOrder[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export interface CustomerOrdersFilters {
  page?: number
  limit?: number
  status?: number
  search?: string
  sort?: 'ASC' | 'DESC' | 'DATE_ASC' | 'DATE_DESC'
}

export interface OrderStatusResponse {
  data: {
    order_code: string
    order_number: string
    status: number
    status_text: string
    status_description: string
    total: string
    created_at: string
    updated_at: string
    customer_name: string
    store: {
      id: number
      name: string
    }
  }
}

export interface UpdateCustomerProfileDto {
  name?: string
  email?: string
  phone?: string
}

export interface CustomerProfile {
  id: number
  name: string
  email: string
  phone: string | null
  updated_at: string
}

export interface UpdateProfileResponse {
  data: CustomerProfile
  message: string
}

export interface CancelOrderDto {
  reason?: string
}

export interface CancelOrderResponse {
  data: CustomerOrder
  message: string
}

export interface CustomerStats {
  total_orders: number
  total_value: number
  status_breakdown: Array<{
    status: number
    status_text: string
    count: number
  }>
}

export interface CustomerStatsResponse {
  data: CustomerStats
}

export const CUSTOMER_ORDER_STATUS = {
  1: { label: 'Pendente', color: 'yellow', icon: 'clock', description: 'Aguardando pagamento' },
  2: { label: 'Confirmado', color: 'blue', icon: 'check-circle', description: 'Pagamento confirmado' },
  3: { label: 'Enviado', color: 'purple', icon: 'truck', description: 'Pedido enviado para entrega' },
  4: { label: 'Entregue', color: 'green', icon: 'check-circle', description: 'Pedido entregue ao cliente' },
  5: { label: 'Cancelado', color: 'red', icon: 'x-circle', description: 'Pedido cancelado' }
} as const

