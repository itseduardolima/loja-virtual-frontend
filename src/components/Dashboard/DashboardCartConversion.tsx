'use client'

import { ShoppingCart } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { CartConversionStats } from '@/hooks/useDashboard'

interface DashboardCartConversionProps {
  data?: CartConversionStats
}

export function DashboardCartConversion({ data }: DashboardCartConversionProps) {
  const rate = Number.isFinite(data?.conversion_rate) ? Math.min(data!.conversion_rate, 100) : 0
  const total = data?.total_sessions ?? 0
  const converted = data?.converted_sessions ?? 0
  const abandoned = Math.max(0, data?.abandoned_sessions ?? 0)

  return (
    <div className={cn(
      'rounded-xl sm:rounded-2xl p-3 sm:p-4 md:p-5 lg:p-6 border border-white/20',
      'bg-gradient-to-br from-blue-50 to-blue-100'
    )}>
      <div className="flex items-start justify-between gap-2 sm:gap-3">
        <div className="flex-1 min-w-0 pr-1 sm:pr-2 md:pr-3">
          <h3 className="text-[10px] sm:text-xs md:text-sm font-medium mb-0.5 sm:mb-1 md:mb-2 leading-tight text-gray-600">
            Carrinhos que viraram pedido
          </h3>
          <div className="text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold mb-1 sm:mb-2 leading-tight text-gray-900">
            {total === 0 ? '—' : `${converted} de ${total}`}
          </div>
          {total > 0 && (
            <>
              <div className="mt-2 h-1.5 bg-blue-200 rounded-full overflow-hidden">
                <div
                  className="h-full bg-blue-500 rounded-full transition-all duration-300"
                  style={{ width: `${rate}%` }}
                />
              </div>
              <p className="text-[10px] sm:text-xs text-gray-500 leading-tight mt-1.5">
                {converted} finalizaram · {abandoned} desistiram
              </p>
            </>
          )}
          {total === 0 && (
            <p className="text-[10px] sm:text-xs text-gray-400 leading-tight">
              Nenhum carrinho ainda
            </p>
          )}
        </div>
        <div className="rounded-lg sm:rounded-xl p-1.5 sm:p-2 md:p-2.5 lg:p-3 flex items-center justify-center flex-shrink-0 bg-blue-500">
          <ShoppingCart className="h-4 w-4 sm:h-5 sm:w-5 md:h-6 md:w-6 text-white" />
        </div>
      </div>
    </div>
  )
}
