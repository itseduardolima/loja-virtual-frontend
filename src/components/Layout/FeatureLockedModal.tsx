'use client'

import { useRouter } from 'next/navigation'
import { CheckCircle2, Lock, Sparkles } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <div className="relative w-12 h-12 rounded-2xl bg-gradient-to-br from-primary/10 to-primary/5 flex items-center justify-center shrink-0">
              <Icon className="h-5 w-5 text-primary" />
              <div className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-gray-900 flex items-center justify-center border-2 border-white">
                <Lock className="h-2.5 w-2.5 text-white" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <DialogTitle className="text-lg font-bold text-gray-900 text-left">{meta.title}</DialogTitle>
              <p className="text-xs text-gray-500 mt-0.5">Disponível em planos superiores</p>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 pt-1">
          <p className="text-sm text-gray-700 leading-relaxed">{meta.description}</p>

          <div className="border-t border-gray-100 pt-4">
            <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">Disponível nos planos</p>
            {plansWithFeature.length > 0 ? (
              <div className="space-y-2">
                {plansWithFeature.map((plan) => (
                  <div
                    key={plan.id}
                    className="flex items-center justify-between px-3 py-2.5 rounded-lg border border-gray-200 bg-gray-50/50"
                  >
                    <div className="flex items-center gap-2 min-w-0">
                      <CheckCircle2 className="h-4 w-4 text-green-600 shrink-0" />
                      <span className="text-sm font-medium text-gray-900 truncate">{plan.name}</span>
                    </div>
                    <span className="text-sm font-semibold text-gray-700 shrink-0 ml-2">
                      {formatPrice(plan.price_monthly)}
                      <span className="text-xs font-normal text-gray-400">/mês</span>
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-gray-400">Nenhum plano ativo inclui esta funcionalidade no momento.</p>
            )}
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row gap-2 sm:justify-end pt-4">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={handleSeePlans} className="gap-2">
            <Sparkles className="h-4 w-4" />
            Ver planos
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
