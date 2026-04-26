'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { useToastContext } from '@/contexts/ToastContext'
import { useAdminPlanCoupon, useAdminUpdatePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import { PlanCouponForm } from '../../components/PlanCouponForm'

export default function AdminEditarPlanCouponPage() {
  const router = useRouter()
  const { id } = useParams()
  const { success, error } = useToastContext()
  const couponId = Number(id)

  const { data: coupon, isLoading } = useAdminPlanCoupon(couponId)
  const { mutateAsync, isPending } = useAdminUpdatePlanCoupon()

  const onSubmit = async (values: any) => {
    try {
      await mutateAsync({ id: couponId, data: values })
      success('Cupom atualizado')
      router.push('/admin/cupons-plano')
    } catch (err: any) {
      const msg = err?.response?.data?.message
      error(Array.isArray(msg) ? msg[0] : msg || 'Erro ao atualizar cupom')
    }
  }

  if (isLoading || !coupon) {
    return <div className="text-center py-16 text-gray-400">Carregando...</div>
  }

  return (
    <div className="max-w-[1380px] mx-auto sm:py-4 md:py-6 lg:py-8 space-y-3 sm:space-y-4 md:space-y-6">
      <Button
        variant="ghost"
        onClick={() => router.back()}
        className="shrink-0 px-0 hover:bg-transparent text-base font-medium"
      >
        <ChevronLeft className="h-6 w-6 mr-2" />
        Voltar
      </Button>
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Editar Cupom</h1>
        <p className="text-gray-600 mt-1">
          Atualize o cupom <span className="font-mono font-bold">{coupon.code}</span>
        </p>
      </div>

      <PlanCouponForm
        initial={coupon}
        isSubmitting={isPending}
        submitLabel="Salvar Alterações"
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </div>
  )
}
