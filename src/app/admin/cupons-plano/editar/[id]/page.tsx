'use client'

import { useParams, useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
import { useToastContext } from '@/contexts/ToastContext'
import { useAdminPlanCoupon, useAdminUpdatePlanCoupon } from '@/hooks/useAdminPlanCoupons'
import { PlanCouponForm } from '../../components/PlanCouponForm'
import { LoadingPage } from '@/components/Layout'

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
    return (
      <div className="flex items-center justify-center py-16">
        <LoadingPage />
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-5">
      <button
        type="button"
        onClick={() => router.back()}
        className="flex w-fit items-center gap-1.5 text-[13px] font-medium text-nxi2 hover:text-nxi1"
      >
        <ChevronLeft className="h-4 w-4" />
        Voltar
      </button>
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Editar cupom</h1>
        <p className="mt-0.5 text-[13px] text-nxi2">
          Atualizando o cupom{' '}
          <span className="font-mono font-bold text-nxi1">{coupon.code}</span>
        </p>
      </div>

      <PlanCouponForm
        initial={coupon}
        isSubmitting={isPending}
        submitLabel="Salvar alterações"
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </div>
  )
}
