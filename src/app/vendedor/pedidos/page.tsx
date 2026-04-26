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
import { useAcceptCancellationRequest } from '@/hooks/useAcceptCancellationRequest'
import { useDenyCancellationRequest } from '@/hooks/useDenyCancellationRequest'
import type { OrdersResponse } from '@/types/order'
import { Search, X, FileDown, MessageCircle, User, Lock } from 'lucide-react'
import { DashboardDateRangeFilter } from '@/components/Dashboard/DashboardDateRangeFilter'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'
import { MobileOrdersView } from '@/components/Order/MobileOrdersView'
import { useExportOrders } from '@/hooks/useExportOrders'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { FeatureLockedModal } from '@/components/Layout/FeatureLockedModal'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog'

export default function OrdersPage() {
  const {
    authLoading,
    isAuthenticated,
    user,
    searchTerm,
    setSearchTerm,
    visibleOrdersByStatus,
    panelOrders,
    panelTotal,
    isLoading,
    error,
    selectedOrderId,
    setSelectedOrderId,
    columnHasMore,
    handleShowMore,
    hasDateFilter,
    dateFromInput,
    dateToInput,
    handleRangeSelect,
    exportFilters,
    ORDER_STATUS: STATUS_MAP,
  } = useOrdersPage()

  const { exportOrders, isExporting } = useExportOrders()
  const { features } = usePlanFeatures()
  const { lockedFeature, showFeatureModal, closeFeatureModal } = useFeatureLockedModal()

  const handleExportClick = () => {
    if (!features.feature_order_export) {
      showFeatureModal('feature_order_export')
      return
    }
    exportOrders(exportFilters)
  }

  const queryClient = useQueryClient()
  const { mutate: updateOrderStatus } = useUpdateOrderStatus()
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptCancellationRequest()
  const { mutate: denyRequest, isPending: isDenying } = useDenyCancellationRequest()
  const [activeOrderId, setActiveOrderId] = useState<number | null>(null)
  const [pendingCancel, setPendingCancel] = useState<{ orderId: number } | null>(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelRequestOrder, setCancelRequestOrder] = useState<(typeof panelOrders)[0] | null>(null)

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

  const doMoveOrder = (orderId: number, newStatus: number, cancellation_reason?: string) => {
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
    updateOrderStatus({ orderId, status: newStatus, cancellation_reason })
  }

  const handleMoveOrder = (orderId: number, newStatus: number) => {
    const order = orderById.get(orderId)
    if (order?.cancellation_requested === 1) {
      setCancelRequestOrder(order)
      return
    }
    if (newStatus === 5) {
      setPendingCancel({ orderId })
      setCancellationReason('')
      return
    }
    doMoveOrder(orderId, newStatus)
  }

  const handleConfirmCancel = () => {
    if (!pendingCancel || !cancellationReason.trim()) return
    doMoveOrder(pendingCancel.orderId, 5, cancellationReason.trim())
    setPendingCancel(null)
    setCancellationReason('')
  }

  const handleDragEnd = (event: DragEndEvent) => {
    const orderId = parseOrderIdFromDraggableId(String(event.active.id))
    const overId = event.over?.id
    setActiveOrderId(null)
    if (orderId == null || overId == null) return
    const newStatus = parseStatusFromDroppableId(String(overId))
    if (newStatus == null) return
    const order = orderById.get(orderId)
    if (!order || order.status === newStatus) return

    if (order.cancellation_requested === 1) {
      setCancelRequestOrder(order)
      return
    }

    if (newStatus === 5) {
      setPendingCancel({ orderId })
      setCancellationReason('')
      return
    }

    doMoveOrder(orderId, newStatus)
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
          ordersByStatus={visibleOrdersByStatus}
          totalCount={panelTotal}
          selectedOrderId={selectedOrderId}
          onSelectOrder={setSelectedOrderId}
          onMoveOrder={handleMoveOrder}
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          dateFromInput={dateFromInput}
          dateToInput={dateToInput}
          hasDateFilter={hasDateFilter}
          onRangeSelect={handleRangeSelect}
          onExport={handleExportClick}
          isExportLocked={!features.feature_order_export}
          isExporting={isExporting}
        />
      </div>

      {/* Quadro Kanban — visível apenas em lg+ */}
      <div className="hidden lg:flex w-full flex-1 min-w-0 flex-col bg-white lg:rounded-2xl lg:border lg:border-gray-200 lg:shadow-sm overflow-hidden">
        <div className="p-4 border-b border-gray-100">
          <h1 className="text-xl font-bold text-gray-900 font-integral">Quadro de pedidos</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {panelTotal} pedido{panelTotal !== 1 ? 's' : ''} — Arraste os cards para alterar o status
          </p>

          <div className="flex items-center gap-3 mt-4">
            {/* Campo de busca */}
            <div className="relative flex-1 max-w-md">
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

            {/* Filtro de data */}
            <div className="ml-auto shrink-0 flex items-center gap-2">
              <DashboardDateRangeFilter
                dateFromInput={dateFromInput}
                dateToInput={dateToInput}
                hasDateFilter={hasDateFilter}
                onRangeSelect={handleRangeSelect}
              />

              <Button
                variant="outline"
                disabled={isExporting}
                onClick={handleExportClick}
                className={cn(
                  'shrink-0 gap-2 h-12 rounded-xl',
                  !features.feature_order_export && 'text-gray-500 hover:text-gray-700'
                )}
              >
                {isExporting ? (
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                ) : (
                  <FileDown className="h-4 w-4" />
                )}
                {isExporting ? 'Exportando...' : 'Exportar Excel'}
                {!features.feature_order_export && <Lock className="h-3.5 w-3.5 ml-1 text-gray-400" />}
              </Button>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-4">
          <DndContext
            sensors={sensors}
            onDragStart={handleDragStart}
            onDragEnd={handleDragEnd}
          >
            <div className="flex gap-4 w-full pb-2">
              {STATUS_ORDER.map((statusKey) => {
                const orders = visibleOrdersByStatus[statusKey] ?? []
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
                    hasMore={columnHasMore[statusKey]}
                    onShowMore={() => handleShowMore(statusKey)}
                    hasDateFilter={hasDateFilter}
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

      {/* Dialog de solicitação de cancelamento pelo cliente */}
      <Dialog
        open={!!cancelRequestOrder}
        onOpenChange={(open) => {
          if (!open) setCancelRequestOrder(null)
        }}
      >
        <DialogContent className="sm:max-w-md p-0 overflow-hidden">
          {/* Header */}
          <div className="px-6 pt-6 pb-4 border-b border-gray-100">
            <DialogTitle className="text-base font-bold text-gray-900">
              Solicitação de cancelamento
            </DialogTitle>
            <div className="flex items-center gap-2 mt-2">
              <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                <User className="h-3.5 w-3.5 text-gray-500" />
              </div>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-gray-900 truncate">
                  {cancelRequestOrder?.customer_name}
                </p>
                <p className="text-xs text-gray-400">Pedido #{cancelRequestOrder?.order_code}</p>
              </div>
            </div>
          </div>

          {/* Mensagem do cliente */}
          <div className="px-6 py-5">
            {cancelRequestOrder?.cancellation_request_reason ? (
              <div className="flex items-end gap-2.5">
                <div className="w-7 h-7 rounded-full bg-gray-100 flex items-center justify-center shrink-0 mb-0.5">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                </div>
                <div className="flex-1 min-w-0 overflow-hidden">
                  <div className="bg-gray-100 rounded-2xl rounded-bl-sm px-4 py-3 max-w-[90%]">
                    <p className="text-sm text-gray-800 break-words whitespace-pre-wrap leading-relaxed" style={{ overflowWrap: 'anywhere' }}>
                      {cancelRequestOrder.cancellation_request_reason}
                    </p>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1 ml-1">Motivo informado pelo cliente</p>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-3 py-2 text-sm text-gray-400">
                <MessageCircle className="h-4 w-4 shrink-0" />
                Nenhum motivo informado pelo cliente.
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-6 pb-6 flex flex-col-reverse sm:flex-row gap-2 sm:justify-end">
            <Button
              variant="outline"
              disabled={isAccepting || isDenying}
              onClick={() => {
                if (!cancelRequestOrder) return
                denyRequest(cancelRequestOrder.id, {
                  onSuccess: () => setCancelRequestOrder(null),
                })
              }}
            >
              {isDenying ? 'Recusando...' : 'Recusar solicitação'}
            </Button>
            <Button
              variant="destructive"
              disabled={isAccepting || isDenying}
              onClick={() => {
                if (!cancelRequestOrder) return
                acceptRequest(cancelRequestOrder.id, {
                  onSuccess: () => setCancelRequestOrder(null),
                })
              }}
            >
              {isAccepting ? 'Cancelando pedido...' : 'Aceitar e cancelar pedido'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog de motivo de cancelamento */}
      <Dialog
        open={!!pendingCancel}
        onOpenChange={(open) => {
          if (!open) {
            setPendingCancel(null)
            setCancellationReason('')
          }
        }}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Motivo do cancelamento</DialogTitle>
            <DialogDescription>
              Informe o motivo para cancelar este pedido. Este registro ficará visível nos detalhes do pedido.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-1">
            <Textarea
              placeholder="Descreva o motivo do cancelamento..."
              value={cancellationReason}
              onChange={(e) => setCancellationReason(e.target.value)}
              maxLength={500}
              rows={4}
              className="resize-none"
              autoFocus
            />
            <p className="text-xs text-gray-400 mt-1.5 text-right">
              {cancellationReason.length}/500
            </p>
          </div>
          <DialogFooter className="gap-2 sm:gap-0">
            <Button
              variant="ghost"
              onClick={() => {
                setPendingCancel(null)
                setCancellationReason('')
              }}
            >
              Voltar
            </Button>
            <Button
              variant="destructive"
              disabled={!cancellationReason.trim()}
              onClick={handleConfirmCancel}
            >
              Confirmar cancelamento
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <FeatureLockedModal
        feature={lockedFeature}
        open={!!lockedFeature}
        onOpenChange={(open) => !open && closeFeatureModal()}
      />
    </div>
  )
}
