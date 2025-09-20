export interface OrderItem {
  id: number
  quantity: number
  price: string
  size: string
  color: string
  notes: string
  created_at: string
  order_id: number
  product_id: number
  product: {
    id: number
    name: string
    price: string
    images: string[]
  }
}

export interface Order {
  id: number
  order_number: string
  order_code: string
  status: number
  total: string
  notes: string
  customer_name: string
  customer_phone: string
  customer_email: string
  whatsapp_sent: number
  whatsapp_sent_at: string | null
  created_at: string
  updated_at: string
  store_id: number
  user_id: number | null
  items: OrderItem[]
  user: any | null
}

export interface OrdersResponse {
  data: Order[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
}

export interface OrdersFilters {
  page?: number
  limit?: number
  status?: number
  search?: string
  sort?: string
}

export const ORDER_STATUS = {
  1: { label: 'Pendente', color: 'yellow', icon: 'clock' },
  2: { label: 'Confirmado', color: 'blue', icon: 'check-circle' },
  3: { label: 'Entregue', color: 'green', icon: 'truck' },
  4: { label: 'Cancelado', color: 'red', icon: 'x-circle' }
} as const

export const SORT_OPTIONS = {
  'DATE_DESC': 'Mais recentes',
  'DATE_ASC': 'Mais antigos',
  'TOTAL_DESC': 'Maior valor',
  'TOTAL_ASC': 'Menor valor',
  'CUSTOMER_ASC': 'Cliente A-Z',
  'CUSTOMER_DESC': 'Cliente Z-A'
} as const
