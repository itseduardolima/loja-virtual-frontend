export interface CartItem {
  id: number
  quantity: number
  size: string
  color: string
  notes: string
  created_at: string
  updated_at: string
  product: {
    id: number
    name: string
    price: string
    images: string[]
    stock: number
    sizes: string[]
    colors: string[]
  }
  subtotal: number
}

export interface CartResponse {
  data: {
    session_id: string
    items: CartItem[]
    total: number
    item_count: number
  }
  message: string
  session_id: string
}

export interface AddToCartResponse {
  data: CartItem
  message: string
  session_id: string
}
