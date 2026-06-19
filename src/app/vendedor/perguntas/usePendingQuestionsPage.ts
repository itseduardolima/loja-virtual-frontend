import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Meta } from '@/types/api'

export interface StoreQuestion {
  id: number
  asker_name: string
  question: string
  answer: string | null
  answered_at: string | null
  created_at: string
  product: {
    id: number
    name: string
    image: string | null
  }
}

export type QuestionStatus = 1 | 2

export function useStoreQuestions() {
  const [page, setPage] = useState(1)
  const [status, setStatus] = useState<QuestionStatus>(1)
  const queryClient = useQueryClient()

  const { data, isLoading, error } = useQuery({
    queryKey: ['store-questions', status, page],
    queryFn: async () => {
      const response = await api.get<{ data: StoreQuestion[]; meta: Meta }>(
        '/product-questions',
        { params: { page, limit: 10, status } }
      )
      return response.data
    },
  })

  const { data: pendingCountData } = useQuery({
    queryKey: ['store-questions-count', 1],
    queryFn: async () => {
      const response = await api.get<{ data: StoreQuestion[]; meta: Meta }>(
        '/product-questions',
        { params: { page: 1, limit: 1, status: 1 } }
      )
      return response.data
    },
  })

  const { data: answeredCountData } = useQuery({
    queryKey: ['store-questions-count', 2],
    queryFn: async () => {
      const response = await api.get<{ data: StoreQuestion[]; meta: Meta }>(
        '/product-questions',
        { params: { page: 1, limit: 1, status: 2 } }
      )
      return response.data
    },
  })

  const answerMutation = useMutation({
    mutationFn: async ({ id, answer }: { id: number; answer: string }) => {
      const response = await api.patch(`/product-questions/${id}/answer`, { answer })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['store-questions'] })
    },
  })

  const handleStatusChange = (s: QuestionStatus) => {
    setStatus(s)
    setPage(1)
  }

  return {
    questions: data?.data ?? [],
    meta: data?.meta,
    isLoading,
    error,
    status,
    setStatus: handleStatusChange,
    page,
    setPage,
    answerQuestion: answerMutation.mutate,
    isAnswering: answerMutation.isPending,
    pendingTotal: pendingCountData?.meta?.total ?? 0,
    answeredTotal: answeredCountData?.meta?.total ?? 0,
  }
}
