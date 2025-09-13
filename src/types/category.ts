export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  status: number
  created_at: string
  updated_at: string
  store_id: number
  _count?: {
    products: number
  }
}

export interface CreateCategoryData {
  name: string
  description?: string
  image?: File
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: number
}

export interface CategoryFilters {
  page?: number
  limit?: number
  search?: string
  status?: number
  sort?: string
}
