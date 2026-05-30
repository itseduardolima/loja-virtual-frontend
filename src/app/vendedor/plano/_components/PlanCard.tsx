'use client'

import { useRouter } from 'next/navigation'
import { Check, X, ArrowUpRight } from 'lucide-react'
import { cn } from '@/lib/utils'
import { derivePlanFeaturesComparison, computeYearlySavings } from '@/lib/planUtils'
import { SubscriptionPlan } from '@/types/subscription'
import { fmtBRL } from '../_utils'

interface PlanCardProps {
  plan: SubscriptionPlan
  isCurrent: boolean
  isUpgrade: boolean
  isDowngrade: boolean
  isFeatured: boolean
  cycle: 'monthly' | 'yearly'
  onUpgrade: () => void
  onDowngrade: () => void
}

export function PlanCard({ plan, isCurrent, isUpgrade, isDowngrade, isFeatured, cycle, onUpgrade, onDowngrade }: PlanCardProps) {
  const router = useRouter()
  const priceRaw = cycle === 'yearly' && plan.price_yearly ? plan.price_yearly : plan.price_monthly
  const price = typeof priceRaw === 'string' ? parseFloat(priceRaw) : Number(priceRaw)
  const savings = computeYearlySavings(plan.price_monthly, plan.price_yearly)
  const features = derivePlanFeaturesComparison(plan)

  const handleAction = () => {
    if (isCurrent) return
    if (isUpgrade) { onUpgrade(); return }
    if (isDowngrade) { onDowngrade(); return }
    router.push(`/assinatura?plano=${plan.slug}&cycle=${cycle}`)
  }

  return (
    <article className={cn(
      'relative flex flex-col rounded-2xl border bg-white p-6 transition',
      isFeatured
        ? 'border-nxp ring-2 ring-nxp/20 shadow-[0_4px_24px_hsl(var(--nxp)/0.12)]'
        : 'border-nxborder shadow-[0_1px_3px_hsl(0_0%_0%/0.04)]',
    )}>
      {isFeatured && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 inline-flex items-center gap-1 rounded-full bg-nxp px-3 py-0.5 text-[11px] font-bold text-white">
          ★ Mais popular
        </span>
      )}

      <h3 className="text-[15px] font-extrabold tracking-tight text-nxi1">{plan.name}</h3>
      {plan.description && (
        <p className="mt-1 text-[12px] leading-snug text-nxi3">{plan.description}</p>
      )}

      <div className="mt-4 flex items-baseline gap-1">
        <span className="text-[26px] font-bold tracking-tight text-nxi1">
          {price.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', minimumFractionDigits: 0, maximumFractionDigits: 0 })}
        </span>
        <span className="text-[12px] text-nxi3">/{cycle === 'yearly' ? 'ano' : 'mês'}</span>
      </div>
      {cycle === 'yearly' && savings > 0 ? (
        <div className="mt-0.5 text-[11.5px] font-semibold text-green-700">
          equivale a {fmtBRL(price / 12)}/mês · {savings}% de desconto
        </div>
      ) : (
        <div className="mt-0.5 text-[11.5px] text-nxi3">cobrado mensalmente</div>
      )}

      <div className="my-4 border-t border-nxborder" />

      <ul className="flex-1 space-y-2">
        {features.map((f, i) => (
          <li key={i} className={cn('flex items-start gap-2 text-[12.5px]', f.included ? 'text-nxi1' : 'text-nxi3')}>
            <span className={cn(
              'mt-px flex h-4 w-4 shrink-0 items-center justify-center rounded-full',
              f.included ? 'bg-green-50 text-green-700' : 'bg-nxbg text-nxi3',
            )}>
              {f.included
                ? <Check className="h-2.5 w-2.5" strokeWidth={3} />
                : <X className="h-2.5 w-2.5" strokeWidth={2.5} />}
            </span>
            {f.label}
          </li>
        ))}
      </ul>

      <div className="mt-5">
        {isCurrent ? (
          <button disabled className="flex w-full items-center justify-center gap-1.5 rounded-xl border border-nxborder bg-nxbg py-2.5 text-[13px] font-bold text-nxi3">
            <Check className="h-4 w-4" strokeWidth={2.5} />
            Plano atual
          </button>
        ) : isUpgrade ? (
          <button onClick={handleAction} className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-nxa py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px hover:opacity-90">
            Fazer upgrade
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        ) : isDowngrade ? (
          <button onClick={handleAction} className="flex w-full items-center justify-center rounded-xl border border-nxborder bg-white py-2.5 text-[13px] font-semibold text-nxi1 transition hover:border-nxi3">
            Fazer downgrade
          </button>
        ) : (
          <button
            onClick={handleAction}
            className={cn(
              'flex w-full items-center justify-center gap-1.5 rounded-xl py-2.5 text-[13px] font-bold text-white shadow-sm transition hover:-translate-y-px',
              isFeatured ? 'bg-nxp hover:bg-nxp/90' : 'bg-nxa hover:opacity-90',
            )}
          >
            Escolher {plan.name}
            <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={2.5} />
          </button>
        )}
      </div>
    </article>
  )
}
