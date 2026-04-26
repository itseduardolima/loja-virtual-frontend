'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToastContext } from '@/contexts/ToastContext'
import { useAdminCreatePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import { PlanCouponForm } from '../components/PlanCouponForm'

export default function AdminCriarPlanCouponPage() {
  const router = useRouter()
  const { success, error } = useToastContext()
  const { mutateAsync, isPending } = useAdminCreatePlanCoupon()

  const onSubmit = async (values: any) => {
    try {
      await mutateAsync(values)
      success('Cupom criado com sucesso')
      router.push('/admin/cupons-plano')
    } catch (err: any) {
      const msg = err?.response?.data?.message
      error(Array.isArray(msg) ? msg[0] : msg || 'Erro ao criar cupom')
    }
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="sm" onClick={() => router.back()} className="shrink-0">
          <ChevronLeft className="h-4 w-4 mr-2" />
          Voltar
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Criar Cupom de Plano</h1>
          <p className="text-gray-600 mt-1">Configure um desconto promocional para assinaturas</p>
        </div>
      </div>

      <PlanCouponForm
        isSubmitting={isPending}
        submitLabel="Criar Cupom"
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </div>
  )
}
