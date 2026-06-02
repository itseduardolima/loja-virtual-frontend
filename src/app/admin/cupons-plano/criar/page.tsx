'use client'

import { useRouter } from 'next/navigation'
import { ChevronLeft } from 'lucide-react'
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
    <div className="flex flex-col gap-5">
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-[13px] font-medium text-nxi2 hover:text-nxi1"
        >
          <ChevronLeft className="h-4 w-4" />
          Voltar
        </button>
      </div>
      <div>
        <h1 className="text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">Novo cupom de plano</h1>
        <p className="mt-0.5 text-[13px] text-nxi2">Configure um desconto promocional para assinaturas</p>
      </div>

      <PlanCouponForm
        isSubmitting={isPending}
        submitLabel="Criar cupom"
        onSubmit={onSubmit}
        onCancel={() => router.back()}
      />
    </div>
  )
}
