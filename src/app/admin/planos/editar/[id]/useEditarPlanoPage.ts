import { useParams, useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAdminPlans, useAdminUpdatePlan } from '@/hooks/useAdminPlans'
import { createPlanSchema } from '@/schemas/planSchemas'
import { useToastContext } from '@/contexts/ToastContext'

export function useEditarPlanoPage() {
  const { id } = useParams()
  const router = useRouter()
  const { success, error } = useToastContext()
  const updatePlan = useAdminUpdatePlan()

  const { data } = useAdminPlans({ page: 1, limit: 100 })
  const plan = data?.data?.find((p) => p.id === Number(id))

  const { register, handleSubmit, setValue, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createPlanSchema),
  })

  useEffect(() => {
    if (plan) {
      reset({
        name: plan.name,
        slug: plan.slug,
        description: plan.description ?? '',
        price: Number(plan.price),
        billing_cycle: plan.billing_cycle as 'monthly' | 'yearly',
        max_products: plan.max_products ?? undefined,
        max_stores: plan.max_stores,
        features: plan.features ?? '',
        status: plan.status,
        sort_order: plan.sort_order,
      })
    }
  }, [plan, reset])

  const onSubmit = async (formData: any) => {
    try {
      await updatePlan.mutateAsync({ id: Number(id), data: formData })
      success('Plano atualizado com sucesso')
      router.push('/admin/planos')
    } catch {
      error('Erro ao atualizar plano')
    }
  }

  return { plan, register, handleSubmit, setValue, errors, isSubmitting, onSubmit, router }
}
