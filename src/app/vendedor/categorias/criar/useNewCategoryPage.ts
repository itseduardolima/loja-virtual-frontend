'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { createCategorySchema, CreateCategoryFormData } from '@/schemas'
import { useToastContext } from '@/contexts/ToastContext'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/axios'
import { useAuth } from '@/contexts/AuthContext'

export function useNewCategoryPage() {
  const router = useRouter()
  const { success, error: showError } = useToastContext()
  const { user, isLoading: authLoading } = useAuth()
  const queryClient = useQueryClient()

  const form = useForm<CreateCategoryFormData>({
    resolver: yupResolver(createCategorySchema) as any,
    defaultValues: {
      name: '',
      description: undefined
    }
  })

  const { register, handleSubmit, formState: { errors } } = form

  // Criar categoria
  const createCategoryMutation = useMutation({
    mutationFn: async (data: { name: string; description?: string }) => {
      const formData = new FormData()
      formData.append('name', data.name)
      if (data.description) formData.append('description', data.description)

      const response = await api.post('/categories', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      success('Categoria criada com sucesso!', 'Sucesso')
      router.push('/vendedor/categorias')
    },
    onError: () => {
      showError('Erro ao criar categoria', 'Erro')
    }
  })

  const isCreating = createCategoryMutation.isPending

  const onSubmit = (data: CreateCategoryFormData) => {
    createCategoryMutation.mutate({
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

    // Form
    form,
    register,
    handleSubmit,
    errors,
    onSubmit,

    // Mutation
    isCreating,

    // Actions
    handleCancel,
  }
}

