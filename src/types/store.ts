export interface StoreInfo {
  id: number
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  whatsapp?: string
  instagram?: string
  facebook?: string
  website?: string
  email?: string
  phone?: string
  address?: string
  city?: string
  state?: string
  zipcode?: string
  neighborhood?: string
  number?: string
  complement?: string
  payment_methods?: string[]
  created_at: string
  _count?: {
    products: number
    orders: number
  }
  categories?: Array<{
    id: number
    name: string
  }>
}

export interface StoreInfoResponse {
  data: StoreInfo
}

export interface StoreCategory {
  id: number
  name: string
  description: string
  _count: {
    products: number
  }
}

export interface StoreCategoriesResponse {
  data: StoreCategory[]
}

export interface StoreProductsParams {
  slug: string
  page?: number
  limit?: number
  sort?: 'ASC' | 'DESC'
  sort_field?: string
  featured?: boolean
  color?: string
  size?: string
  max_price?: number
  min_price?: number
  category_id?: number
  search?: string
  dynamic_filters?: Record<string, string> | string
}

export interface UseStoreProductsReturn {
  products: import('./product').Product[]
  loading: boolean
  error: string | null
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  } | null
  refetch: () => void
  updateParams: (newParams: Partial<StoreProductsParams>) => void
}

export interface UseStoreInfoReturn {
  storeInfo: StoreInfo | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export interface UseStoreCategoriesReturn {
  categories: StoreCategory[]
  loading: boolean
  error: string | null
  refetch: () => void
}