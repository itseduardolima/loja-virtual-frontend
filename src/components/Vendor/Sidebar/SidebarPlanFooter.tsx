'use client'

import { useRouter } from 'next/navigation'
import { Crown } from 'lucide-react'
import { cn } from '@/lib/utils'
import { daysRemaining, planProgress } from '@/lib/vendor'

interface SidebarPlanFooterProps {
  planName: string
  status: string
  startDate?: string | null
  endDate?: string | null
  collapsed: boolean
}

export function SidebarPlanFooter({
  planName,
  status,
  startDate,
  endDate,
  collapsed,
}: SidebarPlanFooterProps) {
  const router = useRouter()
  const days = daysRemaining(endDate)
  const progress = planProgress(startDate, endDate)
  const isActive = status === 'active'

  if (collapsed) {
    return (
      <div className="border-t border-nxborder px-2.5 pt-2.5 pb-3.5">
        <button
          onClick={() => router.push('/vendedor/plano')}
          title="Gerenciar plano"
          className="flex w-full cursor-pointer items-center justify-center rounded-[10px] border-none bg-transparent py-2.5 text-nxp"
        >
          <Crown size={17} />
        </button>
      </div>
    )
  }

  return (
    <div className="border-t border-nxborder px-2.5 pt-2.5 pb-3.5">
      <div className="rounded-xl bg-nxp/[0.07] px-3 py-2.5">
        <div className="mb-1 flex items-center gap-1.5">
          <span
            className={cn('h-[7px] w-[7px] shrink-0 rounded-full', isActive ? 'bg-nxs' : 'bg-nxw')}
          />
          <span className="text-[12.5px] font-bold text-nxi1">{planName}</span>
        </div>
        <div className="mb-2 text-[11.5px] text-nxi2">
          {days > 0 ? `${days} dias restantes` : 'Expira hoje'}
        </div>
        <div className="mb-2.5 h-1 overflow-hidden rounded-full bg-nxp/[0.15]">
          <div
            className="h-full rounded-full bg-nxp transition-[width] duration-500 ease-in-out"
            style={{ width: `${progress}%` }}
          />
        </div>
        <button
          onClick={() => router.push('/vendedor/plano')}
          className="w-full cursor-pointer rounded-lg border border-nxp/30 bg-transparent py-1.5 text-xs font-semibold text-nxp"
        >
          Gerenciar plano
        </button>
      </div>
    </div>
  )
}
