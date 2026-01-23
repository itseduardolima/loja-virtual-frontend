'use client'

import { LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

interface DashboardStatsCardProps {
  title: string
  value: string | number
  subtitle?: string
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  variant?: 'pink' | 'orange' | 'green' | 'purple'
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'pink',
}: DashboardStatsCardProps) {
  const variantStyles = {
    pink: {
      bg: 'bg-gradient-to-br from-pink-50 to-pink-100',
      iconBg: 'bg-pink-500',
      icon: 'text-white',
      value: 'text-gray-900',
      title: 'text-gray-600',
      subtitle: 'text-gray-500',
      trend: 'text-pink-600',
    },
    orange: {
      bg: 'bg-gradient-to-br from-orange-50 to-orange-100',
      iconBg: 'bg-orange-500',
      icon: 'text-white',
      value: 'text-gray-900',
      title: 'text-gray-600',
      subtitle: 'text-gray-500',
      trend: 'text-orange-600',
    },
    green: {
      bg: 'bg-gradient-to-br from-green-50 to-green-100',
      iconBg: 'bg-green-500',
      icon: 'text-white',
      value: 'text-gray-900',
      title: 'text-gray-600',
      subtitle: 'text-gray-500',
      trend: 'text-green-600',
    },
    purple: {
      bg: 'bg-gradient-to-br from-purple-50 to-purple-100',
      iconBg: 'bg-purple-500',
      icon: 'text-white',
      value: 'text-gray-900',
      title: 'text-gray-600',
      subtitle: 'text-gray-500',
      trend: 'text-purple-600',
    },
  }

  const styles = variantStyles[variant]

  return (
    <div className={cn(
      'rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20',
      styles.bg
    )}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0 pr-1 sm:pr-2 md:pr-3">
          <h3 className={cn('text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1 md:mb-2 leading-tight', styles.title)}>
            {title}
          </h3>
          <div className={cn('text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 md:mb-3 leading-tight', styles.value)}>
            {value}
          </div>
          {subtitle && (
            <p className={cn('text-[10px] sm:text-xs mb-0.5 sm:mb-1 md:mb-2 leading-tight', styles.subtitle)}>
              {subtitle}
            </p>
          )}
          {trend && (
            <div className={cn('text-[10px] sm:text-xs font-semibold leading-tight', styles.trend)}>
              {trend.value > 0 ? '+' : ''}{trend.value}% {trend.label}
            </div>
          )}
        </div>
        <div className={cn(
          'rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 flex items-center justify-center flex-shrink-0',
          styles.iconBg
        )}>
          <Icon className={cn('h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6', styles.icon)} />
        </div>
      </div>
    </div>
  )
}

