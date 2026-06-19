'use client'

import { useRouter } from 'next/navigation'
import { Lock } from 'lucide-react'
import { Dialog, DialogContent, DialogTitle } from '@/components/ui/dialog'
import { useSubscriptionPlans } from '@/hooks/useSubscriptionPlans'
import { FEATURE_METADATA } from '@/lib/planUtils'
import type { PlanFeatures } from '@/hooks/usePlanFeatures'

interface FeatureLockedModalProps {
  feature: keyof PlanFeatures | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

function formatPrice(price: string | number): string {
  const num = typeof price === 'string' ? parseFloat(price) : price
  return num.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })
}

export function FeatureLockedModal({ feature, open, onOpenChange }: FeatureLockedModalProps) {
  const router = useRouter()
  const { data: plans } = useSubscriptionPlans()

  if (!feature) return null

  const meta = FEATURE_METADATA[feature]
  if (!meta) return null
  const Icon = meta.icon

  const plansWithFeature =
    plans?.filter((p) => p.status === 1 && p[feature])?.sort((a, b) => a.sort_order - b.sort_order) ?? []

  const handleSeePlans = () => {
    onOpenChange(false)
    router.push('/vendedor/plano')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[440px] rounded-[20px] p-[32px] gap-0">
        {/* Icon box with lock badge */}
        <div className="relative inline-flex h-[52px] w-[52px] items-center justify-center rounded-[14px] bg-[#EEF0FB]">
          <Icon className="h-[26px] w-[26px] text-nxp" />
          <span className="absolute -bottom-[4px] -right-[4px] flex h-[20px] w-[20px] items-center justify-center rounded-full border-2 border-white bg-nxborder">
            <Lock className="h-[10px] w-[10px] text-nxi3" />
          </span>
        </div>

        {/* Title + subtitle */}
        <DialogTitle className="mt-[16px] text-[20px] font-extrabold tracking-[-0.02em] text-nxi1">
          {meta.title}
        </DialogTitle>
        <p className="mt-[5px] text-[13.5px] font-semibold leading-[1.5] text-nxi2">
          {meta.description}
        </p>

        {/* Plans */}
        <div className="mt-[20px] text-[12px] font-extrabold uppercase tracking-[0.04em] text-nxi3">
          Disponível nos planos
        </div>
        <div className="mt-[10px] flex flex-col gap-[8px]">
          {plansWithFeature.map((plan) => (
            <div
              key={plan.id}
              className="flex h-[44px] items-center rounded-[10px] border border-nxborder bg-white px-[14px]"
            >
              <span className="text-[13.5px] font-bold text-nxi1">{plan.name}</span>
              <span className="ml-auto text-[14px] font-extrabold text-nxp">
                {formatPrice(plan.price_monthly)}
                <span className="text-[12px] font-normal text-nxi3">/mês</span>
              </span>
            </div>
          ))}
          {plansWithFeature.length === 0 && (
            <p className="text-[13.5px] text-nxi3">Nenhum plano ativo inclui esta funcionalidade.</p>
          )}
        </div>

        {/* Buttons */}
        <button
          onClick={handleSeePlans}
          className="mt-[20px] flex h-[48px] w-full items-center justify-center rounded-[12px] bg-nxp text-[14px] font-extrabold text-white"
        >
          Ver planos
        </button>
        <button
          onClick={() => onOpenChange(false)}
          className="mt-[8px] flex h-[40px] w-full items-center justify-center text-[13.5px] font-extrabold text-nxi3"
        >
          Agora não
        </button>
      </DialogContent>
    </Dialog>
  )
}
