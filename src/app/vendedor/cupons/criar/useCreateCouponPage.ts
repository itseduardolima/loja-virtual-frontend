'use client'

import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToastContext } from '@/contexts/ToastContext'
import { createCouponSchema, CreateCouponFormData } from '@/schemas'

export function useCreateCouponPage() {
  const router = useRouter()
  const queryClient = useQueryClient()
  const { user, isLoading: authLoading } = useAuth()
  const { success, error: showError } = useToastContext()

  const form = useForm<CreateCouponFormData>({
    resolver: yupResolver(createCouponSchema) as any,
    defaultValues: {
      code: '',
      type: 'percent',
      value: undefined,
      min_order: undefined,
      max_uses: undefined,
      expires_at: undefined,
    },
  })

  const { register, handleSubmit, formState: { errors }, control, watch, setValue } = form

  const createMutation = useMutation({
    mutationFn: async (data: CreateCouponFormData) => {
      const response = await api.post('/coupons', {
        code: data.code.toUpperCase().trim(),
        type: data.type,
        value: data.value,
        min_order: data.min_order ?? undefined,
        max_uses: data.max_uses ?? undefined,
        expires_at: data.expires_at ? (data.expires_at as Date).toISOString() : undefined,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      success('Cupom criado com sucesso!', 'Sucesso')
      router.push('/vendedor/cupons')
    },
    onError: (err: AxiosError<{ message?: string }>) => {
      showError(err.response?.data?.message || err.message || 'Erro ao criar cupom', 'Erro')
    },
  })

  const onSubmit = (data: CreateCouponFormData) => {
    createMutation.mutate(data)
  }

  const handleCancel = () => {
    router.push('/vendedor/cupons')
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
    control,
    watch,
    setValue,
    onSubmit,

    // Mutation
    isCreating: createMutation.isPending,

    // Actions
    handleCancel,
  }
}
