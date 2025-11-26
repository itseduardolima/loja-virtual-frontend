export interface DynamicField {
  field_name: string
  value: string
}

export interface DeliveryInfo {
  delivery_fee: string
  free_delivery_min: string
  delivery_time: string
}

export interface Product {
  id: number
  name: string
  description: string
  price: string
  images: string[]
  stock: number
  status: number
  featured: number
  created_at: string
  updated_at: string
  store_id: number
  category_id: number
  dynamic_fields: DynamicField[]
  delivery_info: DeliveryInfo
  payment_methods: string[]
  colors?: string[]
  sizes?: string[]
  category?: {
    id: number
    name: string
  }
  store?: {
    id: number
    name: string
    slug: string
  }
}

export interface ProductsResponse {
  data: Product[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
  stats?: {
    total: number
    total_active: number
    total_featured: number
    total_in_stock: number
  }
}

export interface ProductFilters {
  page?: number
  limit?: number
  sort?: string
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
  size?: string
  color?: string
  status?: number
  featured?: boolean
}