export interface ProductReview {
  id: number
  product_id: number
  rating: number
  comment: string | null
  images?: string[]
  created_at: string
  user: {
    id: number
    name: string
  }
}

export interface ProductReviewsResponse {
  data: ProductReview[]
  meta: {
    total: number
    lastPage: number
    currentPage: number
    perPage: number
    prev: number | null
    next: number | null
  }
  summary: {
    average_rating: number
    total_reviews: number
  }
}

export interface CreateReviewRequest {
  product_id: number
  rating: number
  comment?: string
  images?: File[]
}

export interface UpdateReviewRequest {
  rating?: number
  comment?: string
  keep_images?: string[]
  images?: File[]
}
