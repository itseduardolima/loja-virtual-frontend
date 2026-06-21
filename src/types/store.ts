export interface StorePage {
  page_type: string
  title: string
  content: string
  enabled: boolean
  updated_at?: string | null
  /** Label padrão do tipo (preenchido pelo frontend) */
  label?: string
}

export interface StoreNiche {
  id: number
  store_id: number
  niche_id: number
  is_primary: number
  niche?: {
    id: number
    name: string
    slug: string
  }
}

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
  tiktok?: string
  youtube?: string
  website?: string
  email?: string
  phone?: string
  cnpj?: string
  cpf?: string
  pickup_enabled?: number
  status?: number
  updated_at?: string
  user_id?: number
  business_hours?: Record<string, string>
  address?: string
  city?: string
  state?: string
  zipcode?: string
  neighborhood?: string
  number?: string
  complement?: string
  payment_methods?: string[]
  delivery_fee?: string | number | null
  free_delivery_min?: string | number | null
  delivery_time?: string
  hero_eyebrow?: string
  hero_title?: string
  hero_subtitle?: string
  announcement_text?: string
  campaign_title?: string
  campaign_text?: string
  campaign_image?: string
  created_at: string
  store_niches?: StoreNiche[]
  store_pages?: Array<{ page_type: string; title: string }>
  _count?: {
    products: number
    orders: number
  }
  categories?: Array<{
    id: number
    name: string
  }>
}

export interface UpdateStoreData {
  name?: string
  description?: string
  niche_ids?: string[]
  primary_niche_id?: number
  logo?: File
  banner?: File
  whatsapp?: string
  instagram?: string
  facebook?: string
  tiktok?: string
  youtube?: string
  website?: string
  email?: string
  phone?: string
  cnpj?: string
  cpf?: string
  address?: string
  city?: string
  state?: string
  zipcode?: string
  neighborhood?: string
  number?: string
  complement?: string
  delivery_fee?: number
  free_delivery_min?: number
  delivery_time?: string
  pickup_enabled?: boolean
  payment_methods?: string[]
  business_hours?: Record<string, string>
  hero_eyebrow?: string
  hero_title?: string
  hero_subtitle?: string
  announcement_text?: string
  campaign_title?: string
  campaign_text?: string
  campaign_image?: File
  remove_campaign_image?: boolean
}

export interface StoreInfoResponse {
  data: StoreInfo
}

export interface StoreCategory {
  id: number
  name: string
  description: string
  niche_id?: number
  _count: {
    products: number
  }
}

export interface StoreCategoriesResponse {
  data: StoreCategory[]
}

export type CollectionSort = 'relevancia' | 'menor' | 'maior' | 'avaliados' | 'nome'
export type CollectionView = 'grid' | 'list'

export interface StoreProductsParams {
  slug: string
  page?: number
  limit?: number
  cursor?: number
  sort?: 'ASC' | 'DESC'
  sort_field?: string
  featured?: boolean
  promo?: boolean
  max_price?: number
  min_price?: number
  category_id?: number
  category_ids?: number[]
  niche_id?: number
  search?: string
  dynamic_filters?: Record<string, string | string[]> | string
  min_rating?: number
}

export interface UseStoreProductsReturn {
  products: import('./product').Product[]
  loading: boolean
  isFetchingMore: boolean
  error: string | null
  loadMoreError: string | null
  /** Page-path retorna meta completo; cursor-path retorna só { total } */
  meta: {
    total: number
    lastPage?: number
    currentPage?: number
    perPage?: number
    prev?: number | null
    next?: number | null
  } | null
  nextCursor: number | null
  refetch: () => void
  updateParams: (newParams: Partial<StoreProductsParams>) => void
  loadMore: () => void
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
