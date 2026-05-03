'use client'

import { ArrowDownRight, ArrowUpRight, type LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export type KpiTone = 'primary' | 'accent' | 'warning' | 'success'

interface KpiCardProps {
  label: string
  value: string
  delta?: string
  deltaDir?: 'up' | 'down'
  icon: LucideIcon
  tone: KpiTone
}

const ICON_BG: Record<KpiTone, string> = {
  primary: 'bg-nxp/10 text-nxp',
  accent: 'bg-nxa/10 text-nxa',
  warning: 'bg-nxw/[0.12] text-nxw',
  success: 'bg-nxs/10 text-nxs',
}

export function KpiCard({ label, value, delta, deltaDir = 'up', icon: Icon, tone }: KpiCardProps) {
  return (
    <div
      className={cn(
        'flex flex-col gap-1.5 rounded-2xl border border-nxborder bg-white px-4 pt-4 pb-3.5',
        'shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] transition-[transform,box-shadow] duration-150',
        'hover:-translate-y-0.5 hover:shadow-[0_6px_16px_hsl(0_0%_0%/0.08)]',
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold tracking-[0.01em] text-nxi3">{label}</span>
        <span
          className={cn(
            'flex h-7 w-7 shrink-0 items-center justify-center rounded-lg',
            ICON_BG[tone],
          )}
        >
          <Icon size={14} strokeWidth={2} />
        </span>
      </div>

      <div className="text-[22px] font-extrabold leading-[1.1] tracking-[-0.03em] text-nxi1">
        {value}
      </div>

      {delta && (
        <div
          className={cn(
            'flex items-center gap-0.5 text-base font-semibold',
            deltaDir === 'up' ? 'text-nxs' : 'text-nxd',
          )}
        >
          {deltaDir === 'up' ? (
            <ArrowUpRight size={12} strokeWidth={2.5} />
          ) : (
            <ArrowDownRight size={12} strokeWidth={2.5} />
          )}
          {delta}
          <span className="font-normal text-nxi3">vs ontem</span>
        </div>
      )}
    </div>
  )
}
