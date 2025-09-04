export interface StoreCategory {
  id: number
  name: string
  description: string
  image: string | null
  status: number
  created_at: string
  updated_at: string
  store_id: number
}

export interface StoreCounts {
  products: number
  orders: number
}

export interface Store {
  id: number
  name: string
  slug: string
  description: string
  logo: string
  banner: string
  whatsapp: string
  instagram: string
  status: number
  created_at: string
  updated_at: string
  user_id: number
  categories: StoreCategory[]
  _count: StoreCounts
}
