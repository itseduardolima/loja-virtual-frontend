export interface DynamicField {
  field_name: string
  value: string
}

export interface DeliveryInfo {
  delivery_fee: string
  free_delivery_min: string
  delivery_time: string
}

export interface StockVariant {
  color: string
  size: string
  stock: number
}

export interface Product {
  id: number
  name: string
  description: string
  price: string
  discount_price?: string | null
  final_price?: number
  discount_percentage?: number
  promo_price?: number | null
  promo_starts_at?: string | null
  promo_ends_at?: string | null
  promo_active?: boolean
  meta_title?: string | null
  meta_description?: string | null
  meta_keywords?: string | null
  tags?: string[]
  images: string[] | Record<string, string[]>
  images_by_color?: Record<string, string[]>
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
  stock_variants?: StockVariant[]
  category?: {
    id: number
    name: string
  }
  store?: {
    id: number
    name: string
    slug: string
  }
  average_rating?: number
  total_reviews?: number
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
  images: string[] | Record<string, string[]>
  images_by_color?: Record<string, string[]>
  sizes: string[]
  colors: string[]
  stock: number
  variant_stocks?: Array<{ color: string; size: string; stock: number }>
  featured: boolean
  created_at: string
  updated_at: string
  color?: string
  specifications?: string
  niche?: {
    id: number
    name: string
  }
  dynamic_fields: Array<{
    field_id?: number
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