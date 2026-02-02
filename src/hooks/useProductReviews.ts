import { useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useToastContext } from '@/contexts/ToastContext'
import {
  ProductReviewsResponse,
  CreateReviewRequest,
  UpdateReviewRequest,
} from '@/types/review'

export type ReviewSort = 'latest' | 'highest' | 'images'

interface UseProductReviewsOptions {
  page?: number
  sort?: ReviewSort
  onCreateSuccess?: () => void
}

export function useProductReviews(
  slug: string,
  productId: string,
  options: UseProductReviewsOptions | number = {}
) {
  const { page = 1, sort = 'latest', onCreateSuccess } =
    typeof options === 'number'
      ? { page: options, sort: 'latest' as ReviewSort, onCreateSuccess: undefined }
      : options
  const queryClient = useQueryClient()
  const { toast } = useToastContext()

  const { data, isLoading, error } = useQuery({
    queryKey: ['product-reviews', slug, productId, page, sort],
    queryFn: async (): Promise<ProductReviewsResponse> => {
      const response = await api.get<ProductReviewsResponse>(
        `/catalog/store/${slug}/products/${productId}/reviews`,
        { params: { page, limit: 6, sort } }
      )
      return response.data
    },
    enabled: !!slug && !!productId,
  })

  const createReviewMutation = useMutation({
    mutationFn: async (payload: CreateReviewRequest) => {
      const hasImages = payload.images && payload.images.length > 0

      if (hasImages) {
        const formData = new FormData()
        formData.append('product_id', payload.product_id.toString())
        formData.append('rating', payload.rating.toString())
        if (payload.comment) {
          formData.append('comment', payload.comment)
        }
        payload.images!.forEach((file) => {
          formData.append('images', file)
        })
        const response = await api.post('/reviews', formData)
        return response.data
      }

      const response = await api.post('/reviews', payload)
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product-reviews', slug, productId],
      })
      onCreateSuccess?.()
      toast({
        title: 'Avaliação enviada!',
        description: 'Sua avaliação foi publicada com sucesso.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Não foi possível enviar sua avaliação. Tente novamente.'
      toast({
        title: 'Erro!',
        description: message,
        variant: 'destructive',
      })
    },
  })

  const createReview = (payload: CreateReviewRequest) => {
    createReviewMutation.mutate(payload)
  }

  const updateReviewMutation = useMutation({
    mutationFn: async ({
      reviewId,
      payload,
    }: {
      reviewId: number
      payload: UpdateReviewRequest
    }) => {
      const hasImages =
        (payload.images && payload.images.length > 0) ||
        (payload.keep_images !== undefined)

      if (hasImages) {
        const formData = new FormData()
        if (payload.rating !== undefined) {
          formData.append('rating', payload.rating.toString())
        }
        if (payload.comment !== undefined) {
          formData.append('comment', payload.comment)
        }
        if (payload.keep_images !== undefined) {
          formData.append('keep_images', JSON.stringify(payload.keep_images))
        }
        if (payload.images?.length) {
          payload.images.forEach((file) => formData.append('images', file))
        }
        const response = await api.patch(`/reviews/${reviewId}`, formData)
        return response.data
      }

      const response = await api.patch(`/reviews/${reviewId}`, {
        rating: payload.rating,
        comment: payload.comment,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ['product-reviews', slug, productId],
      })
      toast({
        title: 'Avaliação atualizada!',
        description: 'Sua avaliação foi atualizada com sucesso.',
        variant: 'success',
      })
    },
    onError: (error: any) => {
      const message =
        error.response?.data?.message ||
        'Não foi possível atualizar sua avaliação. Tente novamente.'
      toast({
        title: 'Erro!',
        description: message,
        variant: 'destructive',
      })
    },
  })

  const updateReview = (reviewId: number, payload: UpdateReviewRequest) => {
    updateReviewMutation.mutate({ reviewId, payload })
  }

  const reviews = useMemo(() => data?.data ?? [], [data?.data])

  return {
    reviews,
    summary: data?.summary,
    meta: data?.meta,
    isLoading,
    error,
    createReview,
    updateReview,
    isCreating: createReviewMutation.isPending,
    isUpdating: updateReviewMutation.isPending,
  }
}
