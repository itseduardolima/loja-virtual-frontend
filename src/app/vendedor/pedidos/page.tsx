'use client'

import { useState, useMemo } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { ErrorState } from '@/components/Layout/ErrorState'
import LoadingPage from '@/components/Layout/LoadingPage'
import { useOrdersPage } from './useOrdersPage'
import { OrderDetailPanel } from '@/components/Order/OrderDetailPanel'
import { KanbanColumn } from '@/components/Order/KanbanColumn'
import {
  OrderKanbanCard,
  OrderKanbanCardPreview,
  parseOrderIdFromDraggableId,
} from '@/components/Order/OrderKanbanCard'
import { parseStatusFromDroppableId } from '@/components/Order/KanbanColumn'
import { STATUS_ORDER, STATUS_HEADER_COLORS } from '@/lib/orderPanelUtils'
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus'
import type { OrdersResponse } from '@/types/order'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'
import { MobileOrdersView } from '@/components/Order/MobileOrdersView'

export default function OrdersPage() {
  const {
    authLoading,
    isAuthenticated,
    user,
    searchTerm,
    setSearchTerm,
    ordersByStatus,
    panelOrders,
    isLoading,
    error,
    selectedOrderId,
    setSelectedOrderId,
    ORDER_STATUS: STATUS_MAP,
  } = useOrdersPage()

  const queryClient = useQueryClient()
  const { mutate: updateOrderStatus } = useUpdateOrderStatus()
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null)

  const totalCount = useMemo(() => {
    return STATUS_ORDER.reduce((acc, s) => acc + (ordersByStatus[s]?.length ?? 0), 0)
  }, [ordersByStatus])

  const orderById = useMemo(() => {
    const map = new Map<number, (typeof panelOrders)[0]>()
    panelOrders.forEach((o) => map.set(o.id, o))
    return map
  }, [panelOrders])

  const activeOrder = activeOrderId != null ? orderById.get(activeOrderId) ?? null : null

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    })
  )

  const handleDragStart = (event: DragStartEvent) => {
    const id = parseOrderIdFromDraggableId(String(event.active.id))
    if (id != null) setActiveOrderId(id)
  }

  const handleMoveOrder = (orderId: number, newStatus: number) => {
    queryClient.setQueriesData(
      { queryKey: ['orders'] },
      (old: OrdersResponse | undefined) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        }
      }
    )
    updateOrderStatus({ orderId, status: newStatus })
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const orderId = parseOrderIdFromDraggableId(String(event.active.id))
    const overId = event.over?.id
    if (orderId == null || overId == null) {
      setActiveOrderId(null)
      return
    }
    const newStatus = parseStatusFromDroppableId(String(overId))
    if (newStatus == null) {
      setActiveOrderId(null)
      return
    }
    const order = orderById.get(orderId)
    if (!order || order.status === newStatus) {
      setActiveOrderId(null)
      return
    }

    queryClient.setQueriesData(
      { queryKey: ['orders'] },
      (old: OrdersResponse | undefined) => {
        if (!old?.data) return old
        return {
          ...old,
          data: old.data.map((o) =>
            o.id === orderId ? { ...o, status: newStatus } : o
          ),
        }
      }
    )
    setActiveOrderId(null)
    updateOrderStatus({ orderId, status: newStatus })
  }

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
    <div className="h-full flex flex-col lg:flex-row gap-4 lg:gap-6 -mx-4 lg:mx-0">
      {/* View mobile — visível apenas em telas pequenas */}
      <div className="lg:hidden w-full">
        <MobileOrdersView
          ordersByStatus={ordersByStatus}
          totalCount={totalCount}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onMoveOrder={handleMoveOrder}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
        />
      </div>

      {/* Quadro Kanban — visível apenas em lg+ */}
      <div className="hidden lg:flex w-full flex-1 min-w-0 flex-col bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 font-integral">Quadro de pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {totalCount} pedido{totalCount !== 1 ? 's' : ''} — Arraste os cards para alterar o status
          </p>
          <div className="relative mt-4 flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 sm:w-5 sm:h-5 z-10" />
            <Input
              type="text"
              placeholder="Buscar pedidos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                'pl-9 sm:pl-10 py-2 sm:py-2.5 bg-muted rounded-full text-sm h-9 sm:h-10 w-full',
                searchTerm ? 'pr-9 sm:pr-10' : 'pr-3 sm:pr-4'
              )}
            />
            {searchTerm && (
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 rounded-full text-gray-400 hover:text-gray-600 hover:bg-gray-200/80 z-10"
                onClick={() => setSearchTerm('')}
                aria-label="Limpar busca"
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 min-w-max pb-2">
              {STATUS_ORDER.map((statusKey) => {
                const orders = ordersByStatus[statusKey] ?? []
                const label = STATUS_MAP[statusKey as keyof typeof STATUS_MAP]?.label ?? 'Pedidos'
                const colors = STATUS_HEADER_COLORS[statusKey] ?? STATUS_HEADER_COLORS[1]
                return (
                  <KanbanColumn
                    key={statusKey}
                    statusKey={statusKey}
                    label={label}
                    orders={orders}
                    colors={colors}
                    selectedOrderId={selectedOrderId}
                    onSelectOrder={setSelectedOrderId}
                  />
                )
              })}
            </div>

            <DragOverlay>
              {activeOrder ? (
                <OrderKanbanCardPreview order={activeOrder} />
              ) : null}
            </DragOverlay>
          </DndContext>
        </div>
      </div>

      {/* Detalhes do pedido — só em desktop (lg+), mobile usa MobileOrdersView */}
      {selectedOrderId !== null && (
        <div className="hidden lg:flex w-full lg:w-[360px] xl:w-[400px] lg:shrink-0 flex-col min-w-0 lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden bg-white">
          <div className="sticky top-0 px-3 py-2.5 z-10 bg-white border-b border-gray-100 flex items-center justify-between gap-2">
            <h2 className="text-base font-bold text-gray-900 font-integral">Detalhes do pedido</h2>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 rounded-full text-gray-500 hover:text-gray-700 hover:bg-gray-100"
              onClick={() => setSelectedOrderId(null)}
              aria-label="Fechar detalhes do pedido"
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="p-3 max-h-[calc(100vh-220px)] lg:max-h-[calc(100vh-180px)] overflow-y-auto overflow-x-hidden bg-gray-50/50 lg:rounded-b-2xl">
            <OrderDetailPanel orderId={selectedOrderId} />
          </div>
        </div>
      )}
    </div>
  )
}
