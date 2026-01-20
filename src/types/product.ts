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
  discount_price?: string | null
  final_price?: number
  discount_percentage?: number
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
  color?: string
  specifications?: string
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

export interface ProductDetail {
  id: number
  name: string
  description: string
  price: string
  discount_price: string | null
  final_price: number
  discount_percentage: number
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  featured: boolean
  created_at: string
  updated_at: string
  color?: string
  specifications?: string
  dynamic_fields: Array<{
    field_name: string
    value: string
  }>
  delivery_info?: {
    delivery_fee: string
    free_delivery_min: string
    delivery_time: string
  }
  payment_methods?: string[]
  category: {
    id: number
    name: string
    description: string
  }
  store: {
    id: number
    name: string
    slug: string
    description: string
    logo: string
  }
}

export interface ProductDetailResponse {
  data: ProductDetail
}