import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as Yup from 'yup'
import { useAdminCreatePlan } from '@/hooks/useAdminPlans'
import { createPlanSchema } from '@/schemas/planSchemas'
import { useToastContext } from '@/contexts/ToastContext'

type CreatePlanFormData = Yup.InferType<typeof createPlanSchema>

export function useCriarPlanoPage() {
  const router = useRouter()
  const { success, error } = useToastContext()
  const createPlan = useAdminCreatePlan()

  const { register, handleSubmit, setValue, watch, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createPlanSchema),
    defaultValues: {
      status: 1,
      sort_order: 0,
      feature_product_questions: false,
      feature_advanced_dashboard: false,
      feature_order_export: false,
      feature_coupons: false,
    },
  })

  const onSubmit = async (data: CreatePlanFormData) => {
    try {
      await createPlan.mutateAsync(data as unknown as Partial<import('@/types/admin').AdminPlan>)
      success('Plano criado com sucesso')
      router.push('/admin/planos')
    } catch {
      error('Erro ao criar plano')
    }
  }

  return { register, handleSubmit, setValue, watch, errors, isSubmitting, onSubmit, router }
}
