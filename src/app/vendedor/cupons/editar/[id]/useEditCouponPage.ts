'use client'

import { useEffect } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { api } from '@/lib/api'
import { useAuth } from '@/contexts/AuthContext'
import { useToastContext } from '@/contexts/ToastContext'
import { updateCouponSchema, UpdateCouponFormData } from '@/schemas'
import type { Coupon } from '../../useCuponsPage'

export function useEditCouponPage() {
  const router = useRouter()
  const params = useParams()
  const id = Number(params.id)
  const queryClient = useQueryClient()
  const { user, isLoading: authLoading } = useAuth()
  const { success, error: showError } = useToastContext()

  const form = useForm<UpdateCouponFormData>({
    resolver: yupResolver(updateCouponSchema) as any,
    defaultValues: {
      type: 'percent',
      value: undefined,
      min_order: undefined,
      max_uses: undefined,
      expires_at: undefined,
    },
  })

  const { register, handleSubmit, formState: { errors }, control, watch, setValue, reset } = form

  const { data: coupon, isLoading: isFetching, error: fetchError } = useQuery<Coupon>({
    queryKey: ['coupon', id],
    queryFn: async () => {
      const res = await api.get<{ data: Coupon }>(`/coupons/${id}`)
      return res.data.data
    },
    enabled: !!id,
  })

  useEffect(() => {
    if (!coupon) return
    reset({
      type: coupon.type,
      value: parseFloat(coupon.value),
      min_order: coupon.min_order
        ? (parseFloat(coupon.min_order).toFixed(2).replace('.', ',') as any)
        : undefined,
      max_uses: coupon.max_uses ?? undefined,
      expires_at: coupon.expires_at ? new Date(coupon.expires_at) : undefined,
    })
  }, [coupon, reset])

  const updateMutation = useMutation({
    mutationFn: async (data: UpdateCouponFormData) => {
      const response = await api.patch(`/coupons/${id}`, {
        type: data.type,
        value: data.value,
        min_order: data.min_order ?? null,
        max_uses: data.max_uses ?? null,
        expires_at: data.expires_at ? (data.expires_at as Date).toISOString() : null,
      })
      return response.data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['coupons'] })
      queryClient.invalidateQueries({ queryKey: ['coupon', id] })
      success('Cupom atualizado com sucesso!', 'Sucesso')
      router.push('/vendedor/cupons')
    },
    onError: (err: any) => {
      showError(err?.response?.data?.message || 'Erro ao atualizar cupom', 'Erro')
    },
  })

  const onSubmit = (data: UpdateCouponFormData) => {
    updateMutation.mutate(data)
  }

  const handleCancel = () => {
    router.push('/vendedor/cupons')
  }

  return {
    // Auth
    user,
    authLoading,

    // Coupon data
    coupon,
    isFetching,
    fetchError,

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
    isUpdating: updateMutation.isPending,

    // Actions
    handleCancel,
  }
}
