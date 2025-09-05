import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PaginatedResponse, Meta } from '@/types/api'

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

export function useCategories(filters?: CategoryFilters) {
  const queryClient = useQueryClient()

  // Buscar categorias com filtros
  const { data: categoriesResponse, isLoading, error } = useQuery({
    queryKey: ['categories', filters],
    queryFn: async (): Promise<PaginatedResponse<Category>> => {
      const params = new URLSearchParams()
      
      if (filters?.page) params.append('page', filters.page.toString())
      if (filters?.limit) params.append('limit', filters.limit.toString())
      if (filters?.search) params.append('search', filters.search)
      if (filters?.status !== undefined) params.append('status', filters.status.toString())
      if (filters?.sort) params.append('sort', filters.sort)

      const response = await api.get(`/categories?${params.toString()}`)
      return response.data
    }
  })

  const categories = categoriesResponse?.data || []
  const meta = categoriesResponse?.meta

  // Criar categoria
  const createCategoryMutation = useMutation({
    mutationFn: async (data: CreateCategoryData) => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.image) formData.append('image', data.image)

      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  // Atualizar categoria
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: UpdateCategoryData) => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)
      if (data.image) formData.append('image', data.image)

      const response = await api.put(`/categories/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  // Deletar categoria
  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await api.delete(`/categories/${id}`)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  return {
    categories,
    meta,
    isLoading,
    error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending
  }
}
