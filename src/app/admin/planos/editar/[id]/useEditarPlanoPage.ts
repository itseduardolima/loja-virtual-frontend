import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useAdminPlans, useAdminUpdatePlan } from '@/hooks/useAdminPlans'
import { createPlanSchema } from '@/schemas/planSchemas'
import { useToastContext } from '@/contexts/ToastContext'

type CreatePlanFormData = Yup.InferType<typeof createPlanSchema>

export function useEditarPlanoPage() {
  const { id } = useParams() as { id: string }
  const router = useRouter()
  const { success, error } = useToastContext()
  const updatePlan = useAdminUpdatePlan()

  const { data } = useAdminPlans({ page: 1, limit: 100 })
  const plan = data?.data?.find((p) => p.id === Number(id))

  const { register, handleSubmit, setValue, watch, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createPlanSchema),
  })

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        description: plan.description ?? '',
        price_monthly: Number(plan.price_monthly),
        price_yearly: plan.price_yearly != null ? Number(plan.price_yearly) : undefined,
        max_products: plan.max_products ?? undefined,
        feature_bling_integration: !!plan.feature_bling_integration,
        feature_product_questions: !!plan.feature_product_questions,
        feature_advanced_dashboard: !!plan.feature_advanced_dashboard,
        feature_order_export: !!plan.feature_order_export,
        feature_coupons: !!plan.feature_coupons,
        trial_days: plan.trial_days,
        status: plan.status,
        sort_order: plan.sort_order,
      })
    }
  }, [plan, reset])

  const onSubmit = async (formData: CreatePlanFormData) => {
    try {
      await updatePlan.mutateAsync({ id: Number(id), data: formData as unknown as Partial<import('@/types/admin').AdminPlan> })
      success('Plano atualizado com sucesso')
      router.push('/admin/planos')
    } catch {
      error('Erro ao atualizar plano')
    }
  }

  return { plan, register, handleSubmit, setValue, watch, errors, isSubmitting, onSubmit, router }
}
