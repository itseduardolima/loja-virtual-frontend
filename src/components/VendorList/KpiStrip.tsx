'use client'

import { LucideIcon } from 'lucide-react'

export type KpiTone = 'nxp' | 'nxs' | 'nxa' | 'nxw' | 'nxd'

export interface KpiItem {
  label: string
  value: number | string
  icon: LucideIcon
  tone: KpiTone
}

const TONES: Record<KpiTone, string> = {
  nxp: 'bg-nxp/[0.10] text-nxp',
  nxs: 'bg-nxs/[0.10] text-nxs',
  nxa: 'bg-nxa/[0.10] text-nxa',
  nxw: 'bg-nxw/[0.16] text-[#9a6a16]',
  nxd: 'bg-nxd/[0.08] text-nxd',
}

interface KpiStripProps {
  items: KpiItem[]
}

const GRID_COLS: Record<number, string> = {
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

export function KpiStrip({ items }: KpiStripProps) {
  const cols = GRID_COLS[Math.min(Math.max(items.length, 2), 4)]
  return (
    <div className={`grid grid-cols-2 gap-3 ${cols}`}>
      {items.map(({ label, value, icon: Icon, tone }) => (
        <div
          key={label}
          className="rounded-xl border border-nxborder bg-white p-3 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)] sm:rounded-2xl sm:p-4"
        >
          <span className={`flex h-6 w-6 items-center justify-center rounded-lg sm:h-8 sm:w-8 ${TONES[tone]}`}>
            <Icon size={14} />
          </span>
          <div className="mt-2 text-[16px] font-extrabold tracking-[-0.02em] text-nxi1 sm:mt-2.5 sm:text-[20px]">
            {value}
          </div>
          <div className="text-[11px] font-medium text-nxi3 sm:text-[11.5px]">{label}</div>
        </div>
      ))}
    </div>
  )
}
