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
          className="rounded-2xl border border-nxborder bg-white p-4 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]"
        >
          <span className={`flex h-8 w-8 items-center justify-center rounded-lg ${TONES[tone]}`}>
            <Icon size={16} />
          </span>
          <div className="mt-2.5 text-[20px] font-extrabold tracking-[-0.02em] text-nxi1">
            {value}
          </div>
          <div className="text-[11.5px] font-medium text-nxi3">{label}</div>
        </div>
      ))}
    </div>
  )
}
