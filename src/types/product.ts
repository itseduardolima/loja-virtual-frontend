import { PaginatedResponse } from './api'

export interface Product {
  id: number
  name: string
  description: string
  price: string
  images: string[]
  sizes: string[]
  colors: string[]
  stock: number
  status: number
  featured: number
  created_at: string
  updated_at: string
  store_id: number
  category_id: number
  category: {
    id: number
    name: string
  }
  store: {
    id: number
    name: string
    slug: string
  }
}

export interface ProductsResponse extends PaginatedResponse<Product> {}
