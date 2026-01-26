import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { PaginatedResponse, Meta } from '@/types/api'
import { Category, CreateCategoryData, UpdateCategoryData, CategoryFilters } from '@/types/category'

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
      if (filters?.niche_id !== undefined) params.append('niche_id', filters.niche_id.toString())

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

      const response = await api.patch(`/categories/${data.id}`, formData, {
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

  const deleteCategory = (id: number, options?: { onSuccess?: () => void; onError?: (error: any) => void }) => {
    deleteCategoryMutation.mutate(id, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: ['categories'] })
        options?.onSuccess?.()
      },
      onError: options?.onError
    })
  }

  // Atualizar status da categoria
  const updateCategoryStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: number, status: number }) => {
      const response = await api.patch(`/categories/${id}/status`, { status })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    }
  })

  // Inicializar categorias padrão
  const initializeDefaultCategoriesMutation = useMutation({
    mutationFn: async () => {
      const response = await api.post('/categories/initialize-defaults')
      return response.data
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
    deleteCategory,
    updateCategoryStatus: updateCategoryStatusMutation.mutate,
    initializeDefaultCategories: initializeDefaultCategoriesMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
    isUpdatingStatus: updateCategoryStatusMutation.isPending,
    isInitializingDefaults: initializeDefaultCategoriesMutation.isPending
  }
}
