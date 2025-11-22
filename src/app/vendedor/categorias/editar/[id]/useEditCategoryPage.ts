'use client'

import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'
import { useToastContext } from '@/contexts/ToastContext'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { Category } from '@/types/category'
import { useAuth } from '@/contexts/AuthContext'
import { useEffect } from 'react'

export function useEditCategoryPage() {
  const router = useRouter()
  const params = useParams()
  const categoryId = params?.id ? parseInt(params.id as string) : null
  const { success, error: showError } = useToastContext()
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  // Buscar categoria específica
  const { data: category, isLoading, error } = useQuery<Category>({
    queryKey: ['category', categoryId],
    queryFn: async () => {
      const response = await api.get(`/categories/${categoryId}`)
      return response.data
    },
    enabled: !!categoryId,
  })

  const form = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      name: '',
      description: undefined
    }
  })

  const { register, handleSubmit, formState: { errors }, setValue } = form

  useEffect(() => {
    if (category) {
      setValue('name', category.name)
      setValue('description', category.description || '')
    }
  }, [category, setValue])

  // Atualizar categoria
  const updateCategoryMutation = useMutation({
    mutationFn: async (data: { id: number; name: string; description?: string }) => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)

      const response = await api.patch(`/categories/${data.id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      queryClient.invalidateQueries({ queryKey: ['category', categoryId] })
      success('Categoria atualizada com sucesso!', 'Sucesso')
      router.push('/vendedor/categorias')
    },
    onError: () => {
      showError('Erro ao atualizar categoria', 'Erro')
    }
  })

  const isUpdating = updateCategoryMutation.isPending

  const onSubmit = (data: CreateCategoryFormData) => {
    if (!categoryId) return

    updateCategoryMutation.mutate({
      id: categoryId,
      name: data.name,
      description: data.description
    })
  }

  const handleCancel = () => {
    router.push('/vendedor/categorias')
  }

  return {
    // Auth
    user,
    authLoading,

    // Category data
    category,
    categoryId,
    isLoading,
    error,

    // Form
    form,
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Mutation
    isUpdating,

    // Actions
    handleCancel,
  }
}

