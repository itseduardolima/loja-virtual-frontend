export interface Product {
  id: number
  name: string
  description: string
  price: string
  images: string[]
  stock: number
  sizes: string[]
  colors: string[]
  status: number
  featured: boolean
  created_at: string
  updated_at: string
  store_id: number
  category_id: number
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
}

export interface ProductFilters {
  page?: number
  limit?: number
  sort?: 'price_asc' | 'price_desc' | 'name_asc' | 'name_desc' | 'newest'
  search?: string
  category_id?: number
  min_price?: number
  max_price?: number
  size?: string
  color?: string
  status?: number
  featured?: boolean
}