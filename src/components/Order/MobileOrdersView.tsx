'use client'

import { useState } from 'react'
import { type Order, ORDER_STATUS } from '@/types/order'
import { formatDate, formatPrice, cn } from '@/lib/utils'
import {
  STATUS_ORDER,
  STATUS_HEADER_COLORS,
  STATUS_FLOW,
} from '@/lib/orderPanelUtils'
import { getStatusIcon } from './OrderStatusIcon'
import { OrderDetailPanel } from './OrderDetailPanel'
import { ArrowRight, ChevronLeft, FileDown, Lock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SearchInput } from '@/components/ui/search-input'
import { DashboardDateRangeFilter } from '@/components/Dashboard'

interface MobileOrdersViewProps {
  ordersByStatus: Record<number, Order[]>
  totalCount: number
  selectedOrderId: number | null
  onSelectOrder: (id: number | null) => void
  onMoveOrder: (orderId: number, newStatus: number) => void
  searchTerm: string
  setSearchTerm: (v: string) => void
  dateFromInput: string
  dateToInput: string
  hasDateFilter: boolean
  onRangeSelect: (range: { dateFrom: string; dateTo: string } | null) => void
  onExport?: () => void
  isExportLocked?: boolean
  isExporting: boolean
}

export function MobileOrdersView({
  ordersByStatus,
  totalCount,
  selectedOrderId,
  onSelectOrder,
  onMoveOrder,
  searchTerm,
  setSearchTerm,
  dateFromInput,
  dateToInput,
  hasDateFilter,
  onRangeSelect,
  onExport,
  isExportLocked = false,
  isExporting,
}: MobileOrdersViewProps) {
  const [activeTab, setActiveTab] = useState<number>(1)

  // Tela de detalhes do pedido
  if (selectedOrderId !== null) {
    return (
      <div className="flex flex-col bg-white rounded-2xl border border-gray-200 shadow-sm">
        <div className="sticky top-0 px-3 py-2.5 z-10 bg-white border-b border-gray-100 flex items-center gap-2">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
            onClick={() => onSelectOrder(null)}
            aria-label="Voltar"
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <h2 className="text-base font-bold text-gray-900 font-integral">Detalhes do pedido</h2>
        </div>
        <div className="p-3 overflow-y-auto bg-gray-50/50">
          <OrderDetailPanel orderId={selectedOrderId} />
        </div>
      </div>
    )
  }

  const orders = ordersByStatus[activeTab] ?? []

  return (
    <div className="flex flex-col">
      {/* Cabeçalho */}
      <div className="p-4">
        <h1 className="text-xl font-bold text-gray-900 font-integral">Quadro de pedidos</h1>
        <p className="text-sm text-gray-500 mt-0.5">
          {totalCount} pedido{totalCount !== 1 ? 's' : ''}
        </p>

        {/* Filtro de data + Exportar */}
        <div className="flex items-center justify-end gap-2 mt-3">
          <DashboardDateRangeFilter
            dateFromInput={dateFromInput}
            dateToInput={dateToInput}
            hasDateFilter={hasDateFilter}
            onRangeSelect={onRangeSelect}
            compact
          />
          {onExport && (
            <Button
              variant="outline"
              size="sm"
              disabled={isExporting}
              onClick={onExport}
              className={cn(
                'shrink-0 gap-1.5 h-10 rounded-xl px-3',
                isExportLocked && 'text-gray-500 hover:text-gray-700'
              )}
            >
              {isExporting ? (
                <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              ) : (
                <FileDown className="h-4 w-4" />
              )}
              {isExporting ? 'Exportando...' : 'Exportar Excel'}
              {isExportLocked && <Lock className="h-3 w-3 ml-0.5 text-gray-400" />}
            </Button>
          )}
        </div>

        <SearchInput
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onClear={() => setSearchTerm('')}
          placeholder="Buscar pedidos..."
          className="mt-3 w-full"
        />
      </div>

      {/* Abas de status */}
      <div className="flex gap-2 px-3 pt-3 pb-2 overflow-x-auto border-b border-gray-100" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
        {STATUS_ORDER.map((statusKey) => {
          const c = STATUS_HEADER_COLORS[statusKey]
          const count = (ordersByStatus[statusKey] ?? []).length
          const isActive = activeTab === statusKey
          return (
            <button
              key={statusKey}
              onClick={() => setActiveTab(statusKey)}
              className={cn(
                'flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0',
                isActive
                  ? cn(c.bg.split(' ')[0], c.icon)
                  : 'bg-gray-100 text-gray-500 hover:bg-gray-200'
              )}
            >
              <span className={cn('shrink-0', isActive ? c.icon : 'text-gray-400')}>
                {getStatusIcon(statusKey)}
              </span>
              {ORDER_STATUS[statusKey as keyof typeof ORDER_STATUS].label}
              {count > 0 && (
                <span
                  className={cn(
                    'text-xs font-bold px-1.5 py-0.5 rounded-full',
                    isActive ? c.badge : 'bg-gray-200 text-gray-600'
                  )}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      {/* Lista de pedidos */}
      <div className="flex-1 p-3 space-y-2">
        {orders.length === 0 ? (
          <div className="flex items-center justify-center h-32 text-sm text-gray-400">
            {hasDateFilter ? 'Nenhum pedido no período' : 'Nenhum pedido neste status'}
          </div>
        ) : (
          orders.map((order) => {
            const nextStatuses = STATUS_FLOW[order.status] ?? []
            return (
              <div
                key={order.id}
                className="rounded-xl border border-gray-200 bg-white p-3 shadow-sm"
              >
                <button
                  className="w-full text-left"
                  onClick={() => onSelectOrder(order.id)}
                >
                  <p className="font-bold text-sm text-gray-900">#{order.order_code}</p>
                  <p className="text-sm text-gray-600 mt-0.5">{order.customer_name}</p>
                  <div className="mt-2 flex items-center justify-between text-xs text-gray-500">
                    <span>{formatDate(order.created_at)}</span>
                    <span className="font-semibold text-gray-900">
                      {formatPrice(parseFloat(order.total))}
                    </span>
                  </div>
                </button>

                {nextStatuses.length > 0 && (
                  <div className="mt-2.5 pt-2.5 border-t border-gray-100 flex flex-wrap gap-1.5">
                    <span className="text-xs text-gray-400 self-center mr-0.5">Mover para:</span>
                    {nextStatuses.map((nextStatus) => {
                      const nc = STATUS_HEADER_COLORS[nextStatus]
                      const nlabel =
                        ORDER_STATUS[nextStatus as keyof typeof ORDER_STATUS].label
                      return (
                        <button
                          key={nextStatus}
                          onClick={() => onMoveOrder(order.id, nextStatus)}
                          className={cn(
                            'flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold transition-opacity hover:opacity-75',
                            nc.badge
                          )}
                        >
                          <ArrowRight className="h-3 w-3" />
                          {nlabel}
                        </button>
                      )
                    })}
                  </div>
                )}
              </div>
            )
          })
        )}
      </div>
    </div>
  )
}
