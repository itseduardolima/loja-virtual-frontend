import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface Category {
  id: number
  name: string
  description?: string
  image?: string
  created_at: string
  updated_at: string
}

export interface CreateCategoryData {
  name: string
  description?: string
  image?: File
}

export interface UpdateCategoryData extends CreateCategoryData {
  id: number
}

export function useCategories() {
  const queryClient = useQueryClient()

  // Buscar todas as categorias
  const { data: categories = [], isLoading, error } = useQuery({
    queryKey: ['categories'],
    queryFn: async (): Promise<Category[]> => {
      const response = await api.get('/categories')
      return response.data
    }
  })

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
