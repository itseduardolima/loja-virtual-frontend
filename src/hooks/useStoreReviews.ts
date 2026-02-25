import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { StoreReviewsResponse } from '@/types/review'

export function useStoreReviews(slug: string, limit = 20, minRating = 4) {
  const { data, isLoading, error } = useQuery({
    queryKey: ['store-reviews', slug, limit, minRating],
    queryFn: async (): Promise<StoreReviewsResponse> => {
      const response = await api.get<StoreReviewsResponse>(
        `/catalog/store/${slug}/reviews`,
        { params: { limit, min_rating: minRating } }
      )
      return response.data
    },
    enabled: !!slug,
  })

  return {
    reviews: data?.data ?? [],
    total: data?.meta.total ?? 0,
    isLoading,
    error,
  }
}

