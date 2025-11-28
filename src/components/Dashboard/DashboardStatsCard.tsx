'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { LucideIcon } from 'lucide-react'
import { formatPrice } from '@/lib/utils'
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
  variant?: 'default' | 'success' | 'warning' | 'danger'
}

export function DashboardStatsCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  variant = 'default',
}: DashboardStatsCardProps) {
  const variantStyles = {
    default: 'border-gray-200',
    success: 'border-green-200 bg-green-50/50',
    warning: 'border-yellow-200 bg-yellow-50/50',
    danger: 'border-red-200 bg-red-50/50',
  }

  const iconStyles = {
    default: 'text-gray-600',
    success: 'text-green-600',
    warning: 'text-yellow-600',
    danger: 'text-red-600',
  }

  return (
    <Card className={cn('border-0 shadow-sm hover:shadow-md transition-shadow', variantStyles[variant])}>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
        <Icon className={cn('h-4 w-4', iconStyles[variant])} />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold text-gray-900">{value}</div>
        {subtitle && (
          <p className="text-xs text-gray-500 mt-1">{subtitle}</p>
        )}
        {trend && (
          <p className={cn(
            'text-xs mt-2',
            trend.value > 0 ? 'text-green-600' : trend.value < 0 ? 'text-red-600' : 'text-gray-500'
          )}>
            {trend.value > 0 ? '↑' : trend.value < 0 ? '↓' : '→'} {trend.label}
          </p>
        )}
      </CardContent>
    </Card>
  )
}

