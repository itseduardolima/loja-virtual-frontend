'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  variant?: 'primary' | 'accent' | 'success' | 'danger' | 'warning'
}

const variantStyles = {
  primary: { bg: 'bg-nxp/[0.07]',  iconBg: 'bg-nxp',  iconText: 'text-white' },
  accent:  { bg: 'bg-nxa/[0.07]',  iconBg: 'bg-nxa',  iconText: 'text-white' },
  success: { bg: 'bg-nxs/[0.07]',  iconBg: 'bg-nxs',  iconText: 'text-white' },
  danger:  { bg: 'bg-nxd/[0.07]',  iconBg: 'bg-nxd',  iconText: 'text-white' },
  warning: { bg: 'bg-nxw/[0.07]',  iconBg: 'bg-nxw',  iconText: 'text-white' },
  // legacy aliases
  pink:    { bg: 'bg-nxd/[0.07]',  iconBg: 'bg-nxd',  iconText: 'text-white' },
  orange:  { bg: 'bg-nxa/[0.07]',  iconBg: 'bg-nxa',  iconText: 'text-white' },
  green:   { bg: 'bg-nxs/[0.07]',  iconBg: 'bg-nxs',  iconText: 'text-white' },
  purple:  { bg: 'bg-nxp/[0.07]',  iconBg: 'bg-nxp',  iconText: 'text-white' },
} as const

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'primary',
}: DashboardStatsCardProps) {
  const s = variantStyles[variant as keyof typeof variantStyles] ?? variantStyles.primary

  return (
    <div className={cn(
      'rounded-2xl border border-nxborder p-5 shadow-[0_1px_2px_hsl(0_0%_0%/0.04)]',
      s.bg,
    )}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.04em] text-nxi3">
            {title}
          </p>
          <p className="mt-1.5 text-2xl font-extrabold tracking-[-0.02em] text-nxi1">
            {value}
          </p>
          {subtitle && (
            <p className="mt-0.5 text-[11.5px] text-nxi3">{subtitle}</p>
          )}
        </div>
        <div className={cn(
          'flex h-9 w-9 shrink-0 items-center justify-center rounded-xl',
          s.iconBg,
        )}>
          <Icon className={cn('h-4 w-4', s.iconText)} />
        </div>
      </div>
    </div>
  )
}
