'use client'

import { useState } from 'react'
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import { useOrdersPage } from './useOrdersPage'
import {
  OrderKpis,
  OrdersFilterBar,
  OrderViewToggle,
  OrderExportButton,
  OrderListView,
  OrderBoardView,
  OrderDetailDrawer,
  OrdersLoadingState,
  OrdersEmptyState,
  OrdersFilteredEmptyState,
  OrdersErrorState,
  CancelReasonModal,
  CancellationRequestModal,
  NewOrderToast,
  MobileOrdersView,
  OrderKanbanCardPreview,
  parseOrderIdFromDraggableId,
  parseStatusFromDroppableId,
} from '@/components/Order'
import { FeatureLockedModal, LoadingPage } from '@/components/Layout'

export default function OrdersPage() {
  const p = useOrdersPage()
  const [activeDragId, setActiveDragId] = useState<number | null>(null)
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 8 } }))
  const activeOrder = activeDragId != null ? (p.orderById.get(activeDragId) ?? null) : null

  const handleDragStart = (e: DragStartEvent) => {
    const id = parseOrderIdFromDraggableId(String(e.active.id))
    if (id != null) setActiveDragId(id)
  }
  const handleDragEnd = (e: DragEndEvent) => {
    setActiveDragId(null)
    const id = parseOrderIdFromDraggableId(String(e.active.id))
    const over = e.over?.id
    if (id == null || over == null) return
    const status = parseStatusFromDroppableId(String(over))
    if (status != null) p.moveOrder(id, status)
  }

  if (p.authLoading || !p.isVendor) return <LoadingPage />

  const subtitle = `${p.filteredOrders.length} de ${p.total} pedido${p.total !== 1 ? 's' : ''} · atualizado agora`
  const hasActiveFilters = !!p.search || p.statusFilter !== 'all' || !!p.dateRange
  const emptyAbsolute = !p.isLoading && !p.error && p.allOrders.length === 0 && !hasActiveFilters
  const filteredEmpty =
    !p.isLoading &&
    !p.error &&
    (p.allOrders.length === 0
      ? hasActiveFilters
      : p.filteredOrders.length === 0)

  const clearAllFilters = () => {
    p.clearSearch()
    p.setStatusFilter('all')
    p.onRangeChange(null)
  }

  return (
    <>
      {/* ===== Desktop (lg+) ===== */}
      <div className="hidden lg:flex lg:flex-col lg:gap-[16px]">
        <header className="flex items-start gap-[16px]">
          <div className="min-w-0">
            <h1 className="font-integral text-[26px] font-extrabold tracking-[-0.03em] text-nxi1">
              Pedidos
            </h1>
            <p className="mt-[4px] text-[13px] font-semibold text-nxi3">{subtitle}</p>
          </div>
          <div className="ml-auto flex items-center gap-[10px]">
            <OrderViewToggle view={p.view} onChange={p.setView} />
            <OrderExportButton
              onExport={p.handleExport}
              exporting={p.isExporting}
              locked={p.exportLocked}
            />
          </div>
        </header>

        {p.isLoading ? (
          <OrdersLoadingState />
        ) : p.error ? (
          <OrdersErrorState onRetry={p.refetchOrders} />
        ) : emptyAbsolute ? (
          <OrdersEmptyState />
        ) : (
          <>
            <OrderKpis kpis={p.kpis} />
            <OrdersFilterBar
              search={p.search}
              onSearchChange={p.setSearch}
              onClearSearch={p.clearSearch}
              sortKey={p.sort}
              onSortChange={p.setSort}
              dateRange={p.dateRange}
              onRangeChange={p.onRangeChange}
              statusFilter={p.statusFilter}
              onStatusFilterChange={p.setStatusFilter}
              counts={p.counts}
            />
            {filteredEmpty ? (
              <OrdersFilteredEmptyState onClear={clearAllFilters} />
            ) : p.view === 'list' ? (
              <OrderListView
                orders={p.filteredOrders}
                selectedId={p.selectedOrderId}
                sortKey={p.sort}
                onOpen={p.openOrder}
                onSortBy={p.setSort}
                onAdvance={p.advanceOrder}
                onWhatsApp={p.handleWhatsApp}
              />
            ) : (
              <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
                <OrderBoardView
                  orders={p.filteredOrders}
                  selectedId={p.selectedOrderId}
                  columnLimits={p.columnLimits}
                  cancelCount={p.counts[5]}
                  onOpen={p.openOrder}
                  onShowMore={p.showMoreColumn}
                  onViewCancelled={p.viewCancelled}
                />
                <DragOverlay>
                  {activeOrder ? <OrderKanbanCardPreview order={activeOrder} /> : null}
                </DragOverlay>
              </DndContext>
            )}
          </>
        )}
      </div>

      {/* ===== Mobile (<lg) ===== */}
      <div className="lg:hidden">
        {p.isLoading ? (
          <div className="-mx-4 -mt-4">
            <OrdersLoadingState />
          </div>
        ) : p.error ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <OrdersErrorState onRetry={p.refetchOrders} />
          </div>
        ) : emptyAbsolute ? (
          <div className="flex min-h-[60vh] items-center justify-center px-4">
            <OrdersEmptyState />
          </div>
        ) : (
          <div className="-mx-4 -mt-4">
            <MobileOrdersView
              orders={p.sortedOrders}
              kpis={p.kpis}
              selectedId={p.selectedOrderId}
              onSelect={(id) => (id == null ? p.closeDrawer() : p.openOrder(id))}
              search={p.search}
              onSearchChange={p.setSearch}
              statusFilter={p.statusFilter}
              onStatusFilterChange={p.setStatusFilter}
              counts={p.counts}
              onExport={p.handleExport}
              exporting={p.isExporting}
              exportLocked={p.exportLocked}
              onAcceptCancelReq={p.acceptCancelRequest}
              onDenyCancelReq={p.denyCancelRequest}
              acceptDenyLoading={p.acceptDenyLoading}
            />
          </div>
        )}
      </div>

      {/* Drawer de detalhe — desktop */}
      <div className="hidden lg:block">
        <OrderDetailDrawer
          orderId={p.selectedOrderId}
          onClose={p.closeDrawer}
          onAdvance={p.advanceOrder}
          onCancel={p.requestCancel}
          onAcceptCancelReq={p.acceptCancelRequest}
          onDenyCancelReq={p.denyCancelRequest}
          acceptDenyLoading={p.acceptDenyLoading}
        />
      </div>

      {/* Modais + toast */}
      <CancelReasonModal
        open={p.pendingCancel}
        onClose={p.closeCancelReason}
        onConfirm={p.confirmCancel}
      />
      <CancellationRequestModal
        open={!!p.cancelRequestOrder}
        order={p.cancelRequestOrder}
        onClose={p.closeCancelRequest}
        onAccept={() => p.cancelRequestOrder && p.acceptCancelRequest(p.cancelRequestOrder.id)}
        onDeny={() => p.cancelRequestOrder && p.denyCancelRequest(p.cancelRequestOrder.id)}
        loading={p.acceptDenyLoading}
      />
      <FeatureLockedModal
        feature={p.lockedFeature}
        open={!!p.lockedFeature}
        onOpenChange={(open) => !open && p.closeFeatureModal()}
      />
      {p.toast && (
        <div className="fixed right-[18px] top-[18px] z-[70]">
          <NewOrderToast
            customerName={p.toast.customerName}
            totalFmt={p.toast.totalFmt}
            onDismiss={p.dismissToast}
          />
        </div>
      )}
    </>
  )
}
