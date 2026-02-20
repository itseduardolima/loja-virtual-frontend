'use client'

import { useState, useMemo, useEffect } from 'react'
import { ErrorState } from '@/components/Layout/ErrorState'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useOrdersPage } from './useOrdersPage'
import { OrderDetailPanel } from '@/components/Order/OrderDetailPanel'
import { formatDate, formatPrice, cn } from '@/lib/utils'
import { STATUS_ORDER, STATUS_HEADER_COLORS, getStatusIcon } from '@/lib/orderPanelUtils'
import { Search, ChevronDown, ChevronRight } from 'lucide-react'

export default function OrdersPage() {
  const {
    authLoading,
    isAuthenticated,
    user,
    searchTerm,
    setSearchTerm,
    ordersByStatus,
    isLoading,
    error,
    selectedOrderId,
    setSelectedOrderId,
    ORDER_STATUS: STATUS_MAP,
  } = useOrdersPage()

  const [openSections, setOpenSections] = useState<Record<number, boolean>>(() => {
    const initial: Record<number, boolean> = {}
    STATUS_ORDER.forEach((s) => { initial[s] = true })
    return initial
  })

  const toggleSection = (status: number) => {
    setOpenSections((prev) => ({ ...prev, [status]: !prev[status] }))
  }

  const totalCount = useMemo(() => {
    return STATUS_ORDER.reduce((acc, s) => acc + (ordersByStatus[s]?.length ?? 0), 0)
  }, [ordersByStatus])

  // Selecionar o primeiro pedido da listagem ao carregar
  useEffect(() => {
    if (selectedOrderId !== null) return
    for (const status of STATUS_ORDER) {
      const orders = ordersByStatus[status] ?? []
      if (orders.length > 0) {
        setSelectedOrderId(orders[0].id)
        break
      }
    }
  }, [ordersByStatus, selectedOrderId, setSelectedOrderId])

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (!isAuthenticated || user?.profile !== 'Vendedor') {
    return null
  }

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingPage />
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ErrorState
          message="Erro ao carregar pedidos"
          onRetry={() => window.location.reload()}
        />
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col lg:flex-row gap-0 lg:gap-6 -mx-4 lg:mx-0">
      {/* Painel de pedidos */}
      <div className="w-full lg:w-[35%] lg:max-w-[500px] lg:shrink-0 flex flex-col bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 font-integral">Painel de pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} pedido{totalCount !== 1 ? 's' : ''} no total
          </p>
          <div className="relative mt-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="search"
              placeholder="Pesquisar pedido"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 bg-gray-50 text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-200 focus:border-gray-300"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-1">
          {STATUS_ORDER.map((statusKey) => {
            const orders = ordersByStatus[statusKey] ?? []
            const label = STATUS_MAP[statusKey as keyof typeof STATUS_MAP]?.label ?? 'Pedidos'
            const isOpen = openSections[statusKey] ?? true
            const count = orders.length
            const colors = STATUS_HEADER_COLORS[statusKey] ?? STATUS_HEADER_COLORS[1]

            return (
              <div key={statusKey} className="rounded-xl border border-gray-200 overflow-hidden">
                <button
                  type="button"
                  onClick={() => toggleSection(statusKey)}
                  className={cn(
                    'w-full flex items-center gap-3 px-4 py-3 text-left transition-colors',
                    colors.bg
                  )}
                >
                  {isOpen ? (
                    <ChevronDown className={cn('h-4 w-4 shrink-0', colors.icon)} />
                  ) : (
                    <ChevronRight className={cn('h-4 w-4 shrink-0', colors.icon)} />
                  )}
                  <span className={cn('shrink-0', colors.icon)}>{getStatusIcon(statusKey)}</span>
                  <span className={cn('font-medium flex-1', colors.icon)}>{label}</span>
                  <span className={cn('text-sm font-medium px-2 py-0.5 rounded-full', colors.badge)}>
                    {count} pedido{count !== 1 ? 's' : ''}
                  </span>
                </button>
                {isOpen && (
                  <div className="border-t border-gray-200 bg-white">
                    {orders.length === 0 ? (
                      <div className="px-4 py-6 text-center text-sm text-gray-400">
                        Nenhum pedido neste status
                      </div>
                    ) : (
                      <ul className="divide-y divide-gray-100">
                        {orders.map((order) => (
                          <li key={order.id}>
                            <button
                              type="button"
                              onClick={() => setSelectedOrderId(order.id)}
                              className={cn(
                                'w-full flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 px-4 py-3 text-left transition-colors',
                                selectedOrderId === order.id ? colors.selectedRow : 'hover:bg-gray-50'
                              )}
                            >
                              <div className="flex-1 min-w-0">
                                <p className="font-semibold text-gray-900 truncate">
                                  #{order.order_code}
                                </p>
                                <p className="text-sm text-gray-600 truncate">
                                  {order.customer_name}
                                </p>
                              </div>
                              <div className="flex items-center gap-3 shrink-0 text-sm">
                                <span className="text-gray-500">
                                  Feito às {formatDate(order.created_at)}
                                </span>
                                <span className="font-semibold text-gray-900">
                                  {formatPrice(parseFloat(order.total))}
                                </span>
                              </div>
                            </button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>

      {/* Detalhes do pedido */}
      <div className="w-full flex-1 min-w-0 lg:rounded-2xl lg:shadow-sm overflow-hidden">
        <div className="sticky top-0 px-4 py-3 z-10">
          <h2 className="text-2xl font-bold text-gray-900 font-integral">Detalhes do pedido</h2>
        </div>
        <div className="p-4 max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-180px)] overflow-y-auto">
          <OrderDetailPanel orderId={selectedOrderId} />
        </div>
      </div>
    </div>
  )
}
