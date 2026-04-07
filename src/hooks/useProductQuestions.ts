import { useState, useEffect } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { Meta } from '@/types/api'

export interface ProductQuestion {
  id: number
  asker_name: string
  question: string
  answer: string
  answered_at: string
  created_at: string
}

interface ProductQuestionsResponse {
  data: ProductQuestion[]
  meta: Meta
}

/** Busca apenas o total de perguntas respondidas — usado para o badge da aba.
 *  Reutiliza o cache da página 1 do hook principal para evitar chamada duplicada. */
export function useProductQuestionsCount(slug: string, productId: string) {
  const { data } = useQuery({
    queryKey: ['product-questions', slug, productId, 1],
    queryFn: async (): Promise<ProductQuestionsResponse> => {
      const response = await api.get<ProductQuestionsResponse>(
        `/catalog/store/${slug}/products/${productId}/questions`,
        { params: { page: 1, limit: 10 } }
      )
      return response.data
    },
    enabled: !!slug && !!productId,
    staleTime: 60 * 1000,
    select: (res) => res.meta.total,
  })

  return data ?? 0
}

/** Busca e pagina perguntas — usado dentro do componente ProductQuestions */
export function useProductQuestions(slug: string, productId: string, enabled = true) {
  const [page, setPage] = useState(1)
  const [allQuestions, setAllQuestions] = useState<ProductQuestion[]>([])
  const queryClient = useQueryClient()

  const { isLoading, data } = useQuery({
    queryKey: ['product-questions', slug, productId, page],
    queryFn: async (): Promise<ProductQuestionsResponse> => {
      const response = await api.get<ProductQuestionsResponse>(
        `/catalog/store/${slug}/products/${productId}/questions`,
        { params: { page, limit: 10 } }
      )
      return response.data
    },
    enabled: enabled && !!slug && !!productId,
  })

  useEffect(() => {
    if (!data) return
    setAllQuestions((prev) =>
      page === 1 ? data.data : [...prev, ...data.data]
    )
  }, [data, page])

  const loadMore = () => setPage((p) => p + 1)

  const createMutation = useMutation({
    mutationFn: async (payload: { asker_name: string; question: string }) => {
      const response = await api.post('/product-questions', {
        product_id: Number(productId),
        asker_name: payload.asker_name,
        question: payload.question,
      })
      return response.data
    },
    onSuccess: () => {
      setPage(1)
      queryClient.invalidateQueries({ queryKey: ['product-questions', slug, productId] })
    },
  })

  const meta = data?.meta

  return {
    questions: allQuestions,
    meta,
    isLoading,
    loadMore,
    hasMore: meta ? meta.currentPage < meta.lastPage : false,
    createQuestion: createMutation.mutate,
    isCreating: createMutation.isPending,
    isSuccess: createMutation.isSuccess,
    resetForm: () => createMutation.reset(),
  }
}
