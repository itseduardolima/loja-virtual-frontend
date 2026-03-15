import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { useAdminCreatePlan } from '@/hooks/useAdminPlans'
import { createPlanSchema } from '@/schemas/planSchemas'
import { useToastContext } from '@/contexts/ToastContext'

export function useCriarPlanoPage() {
  const router = useRouter()
  const { success, error } = useToastContext()
  const createPlan = useAdminCreatePlan()

  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm({
    resolver: yupResolver(createPlanSchema),
    defaultValues: { billing_cycle: 'monthly', status: 1, sort_order: 0, max_stores: 1 },
  })

  const onSubmit = async (data: any) => {
    try {
      await createPlan.mutateAsync(data)
      success('Plano criado com sucesso')
      router.push('/admin/planos')
    } catch {
      error('Erro ao criar plano')
    }
  }

  return { register, handleSubmit, setValue, errors, isSubmitting, onSubmit, router }
}
