'use client'

import { useState, useEffect, useMemo, useCallback } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/contexts/AuthContext'
import { useOrders } from '@/hooks/useOrders'
import { useUpdateOrderStatus } from '@/hooks/useUpdateOrderStatus'
import { useExportOrders } from '@/hooks/useExportOrders'
import { usePlanFeatures } from '@/hooks/usePlanFeatures'
import { useFeatureLockedModal } from '@/hooks/useFeatureLockedModal'
import { useMarkOrderAsRead } from '@/hooks/useMarkOrderAsRead'
import { useAcceptCancellationRequest } from '@/hooks/useAcceptCancellationRequest'
import { useDenyCancellationRequest } from '@/hooks/useDenyCancellationRequest'
import { useOrderNotifications } from '@/hooks/useOrderNotifications'
import {
  computeKpis,
  applyOrderFilters,
  sortOrders,
  nextStatus,
  formatPrice,
  type OrderSortKey,
  type OrderViewMode,
  type StatusFilter,
} from '@/lib/orderVendorMeta'
import { generateWhatsAppMessage, formatWhatsAppNumber } from '@/lib/orderPanelUtils'
import type { Order, OrdersResponse } from '@/types/order'

const PANEL_LIMIT = 100
const COLUMN_PAGE_SIZE = 10
const DEFAULT_COLUMN_LIMITS: Record<number, number> = {
  1: COLUMN_PAGE_SIZE,
  2: COLUMN_PAGE_SIZE,
  3: COLUMN_PAGE_SIZE,
  4: COLUMN_PAGE_SIZE,
}

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)

export function useOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const pathname = usePathname()
  const queryClient = useQueryClient()
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()

  const isVendor = isAuthenticated && user?.profile === 'Vendedor'

  // ─── Estado de UI ─────────────────────────────────────────────────────────
  const [view, setView] = useState<OrderViewMode>('list')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('all')
  const [sort, setSort] = useState<OrderSortKey>('recent')
  const [dateRange, setDateRange] = useState<{ from: string; to: string } | null>(null)
  const [columnLimits, setColumnLimits] = useState<Record<number, number>>(DEFAULT_COLUMN_LIMITS)
  const [selectedOrderId, setSelectedOrderIdRaw] = useState<number | null>(() => {
    const id = searchParams.get('orderId')
    return id ? Number(id) : null
  })
  const [pendingCancelId, setPendingCancelId] = useState<number | null>(null)
  const [cancelRequestOrder, setCancelRequestOrder] = useState<Order | null>(null)
  const [dismissedToastId, setDismissedToastId] = useState<string | null>(null)

  // ─── Hooks de dados / mutações ────────────────────────────────────────────
  const activeDateRange = useMemo((): { date_from?: string; date_to?: string } => {
    if (!dateRange) return {}
    return {
      date_from: startOfDay(new Date(dateRange.from + 'T12:00:00')).toISOString(),
      date_to: endOfDay(new Date(dateRange.to + 'T12:00:00')).toISOString(),
    }
  }, [dateRange])

  const { data, isLoading, error } = useOrders({
    page: 1,
    limit: PANEL_LIMIT,
    sort: 'DATE_DESC',
    ...activeDateRange,
  })

  const { exportOrders, isExporting } = useExportOrders()
  const { features } = usePlanFeatures()
  const { lockedFeature, showFeatureModal, closeFeatureModal } = useFeatureLockedModal()
  const { mutate: markAsRead } = useMarkOrderAsRead()
  const { mutate: updateOrderStatus } = useUpdateOrderStatus()
  const { mutate: acceptRequest, isPending: isAccepting } = useAcceptCancellationRequest()
  const { mutate: denyRequest, isPending: isDenying } = useDenyCancellationRequest()
  const { notifications } = useOrderNotifications(!!isVendor)

  const allOrders: Order[] = useMemo(() => data?.data ?? [], [data])
  const total = data?.meta?.total ?? allOrders.length

  const orderById = useMemo(() => {
    const m = new Map<number, Order>()
    allOrders.forEach((o) => m.set(o.id, o))
    return m
  }, [allOrders])

  // ─── Derivados ────────────────────────────────────────────────────────────
  const kpis = useMemo(() => computeKpis(allOrders, total), [allOrders, total])

  const counts = useMemo(() => {
    const cnt = (s: number) => allOrders.filter((o) => o.status === s).length
    return {
      all: allOrders.length,
      1: cnt(1),
      2: cnt(2),
      3: cnt(3),
      4: cnt(4),
      5: cnt(5),
    } as Record<'all' | 1 | 2 | 3 | 4 | 5, number>
  }, [allOrders])

  /** Lista/Quadro (desktop): filtra por status + busca e ordena. */
  const filteredOrders = useMemo(
    () => applyOrderFilters(allOrders, { statusFilter, search, sort }),
    [allOrders, statusFilter, search, sort],
  )

  /** Mobile recebe só ordenado (filtra status + busca internamente). */
  const sortedOrders = useMemo(() => sortOrders(allOrders, sort), [allOrders, sort])

  // ─── Toast de novo pedido (tempo real) ────────────────────────────────────
  const latestUnread = useMemo(() => notifications.find((n) => !n.read) ?? null, [notifications])
  const toast = useMemo(() => {
    if (!latestUnread || latestUnread.id === dismissedToastId) return null
    return {
      id: latestUnread.id,
      customerName: latestUnread.customerName ?? 'Novo cliente',
      totalFmt: formatPrice(latestUnread.total),
    }
  }, [latestUnread, dismissedToastId])

  useEffect(() => {
    if (!toast) return
    const t = setTimeout(() => setDismissedToastId(toast.id), 6000)
    return () => clearTimeout(t)
  }, [toast])

  // ─── Auth guard ───────────────────────────────────────────────────────────
  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) router.push('/login')
      else if (user?.profile !== 'Vendedor') router.push('/')
    }
  }, [isAuthenticated, user, router, authLoading])

  // Abre o drawer via ?orderId e limpa a query string
  useEffect(() => {
    if (searchParams.get('orderId')) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('orderId')
      router.replace(params.size > 0 ? `?${params.toString()}` : pathname, { scroll: false })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Reset dos limites de coluna ao mudar filtros
  useEffect(() => {
    setColumnLimits(DEFAULT_COLUMN_LIMITS)
  }, [dateRange, search, statusFilter])

  // ─── Ações ────────────────────────────────────────────────────────────────
  const openOrder = useCallback(
    (id: number) => {
      setSelectedOrderIdRaw(id)
      const o = orderById.get(id)
      if (o?.read === 0) markAsRead(id)
    },
    [orderById, markAsRead],
  )

  const closeDrawer = useCallback(() => setSelectedOrderIdRaw(null), [])

  const applyOptimisticStatus = useCallback(
    (orderId: number, status: number) => {
      queryClient.setQueriesData({ queryKey: ['orders'] }, (old: OrdersResponse | undefined) => {
        if (!old?.data) return old
        return { ...old, data: old.data.map((o) => (o.id === orderId ? { ...o, status } : o)) }
      })
    },
    [queryClient],
  )

  /** Aplica a mudança de status (com optimistic). */
  const doSetStatus = useCallback(
    (orderId: number, status: number, cancellation_reason?: string) => {
      applyOptimisticStatus(orderId, status)
      updateOrderStatus({ orderId, status, cancellation_reason })
    },
    [applyOptimisticStatus, updateOrderStatus],
  )

  /** Avança para o próximo status (ou intercepta solicitação de cancelamento). */
  const advanceOrder = useCallback(
    (id: number) => {
      const o = orderById.get(id)
      if (!o) return
      if (o.cancellation_requested === 1) {
        setCancelRequestOrder(o)
        return
      }
      const ns = nextStatus(o.status)
      if (ns != null) doSetStatus(id, ns)
    },
    [orderById, doSetStatus],
  )

  /** Move no Quadro (drag-and-drop) para um status alvo (1–4). */
  const moveOrder = useCallback(
    (id: number, status: number) => {
      const o = orderById.get(id)
      if (!o || o.status === status) return
      if (o.cancellation_requested === 1) {
        setCancelRequestOrder(o)
        return
      }
      doSetStatus(id, status)
    },
    [orderById, doSetStatus],
  )

  const requestCancel = useCallback((id: number) => setPendingCancelId(id), [])

  const confirmCancel = useCallback(
    (reason: string) => {
      if (pendingCancelId == null || !reason.trim()) return
      doSetStatus(pendingCancelId, 5, reason.trim())
      setPendingCancelId(null)
    },
    [pendingCancelId, doSetStatus],
  )

  const acceptCancelRequest = useCallback(
    (id: number) => {
      acceptRequest(id, { onSuccess: () => setCancelRequestOrder(null) })
    },
    [acceptRequest],
  )

  const denyCancelRequest = useCallback(
    (id: number) => {
      denyRequest(id, { onSuccess: () => setCancelRequestOrder(null) })
    },
    [denyRequest],
  )

  const handleWhatsApp = useCallback((order: Order) => {
    if (!order.customer_phone) return
    const num = formatWhatsAppNumber(order.customer_phone)
    const msg = generateWhatsAppMessage(order)
    window.open(`https://wa.me/${num}?text=${msg}`, '_blank', 'noopener,noreferrer')
  }, [])

  const showMoreColumn = useCallback((status: number) => {
    setColumnLimits((prev) => ({
      ...prev,
      [status]: (prev[status] ?? COLUMN_PAGE_SIZE) + COLUMN_PAGE_SIZE,
    }))
  }, [])

  const viewCancelled = useCallback(() => {
    setView('list')
    setStatusFilter(5)
  }, [])

  // Período: aplicado pelo calendário de range (OrdersFilterBar).
  const onRangeChange = useCallback((range: { from: string; to: string } | null) => {
    setDateRange(range)
  }, [])

  const exportFilters = useMemo(
    () => ({
      search: search || undefined,
      ...activeDateRange,
      status: statusFilter === 'all' ? undefined : statusFilter,
    }),
    [search, activeDateRange, statusFilter],
  )

  const handleExport = useCallback(() => {
    if (!features.feature_order_export) {
      showFeatureModal('feature_order_export')
      return
    }
    exportOrders(exportFilters)
  }, [features.feature_order_export, showFeatureModal, exportOrders, exportFilters])

  return {
    // auth
    authLoading,
    isAuthenticated,
    isVendor,
    user,
    // dados
    isLoading,
    error,
    allOrders,
    filteredOrders,
    sortedOrders,
    orderById,
    kpis,
    counts,
    total,
    refetchOrders: () => queryClient.invalidateQueries({ queryKey: ['orders'] }),
    // view / filtros
    view,
    setView,
    search,
    setSearch,
    clearSearch: () => setSearch(''),
    statusFilter,
    setStatusFilter,
    sort,
    setSort,
    dateRange,
    onRangeChange,
    // quadro
    columnLimits,
    showMoreColumn,
    viewCancelled,
    // seleção / drawer
    selectedOrderId,
    openOrder,
    closeDrawer,
    // ações de status
    advanceOrder,
    moveOrder,
    requestCancel,
    confirmCancel,
    pendingCancel: pendingCancelId != null,
    closeCancelReason: () => setPendingCancelId(null),
    // solicitação de cancelamento do cliente
    cancelRequestOrder,
    closeCancelRequest: () => setCancelRequestOrder(null),
    acceptCancelRequest,
    denyCancelRequest,
    acceptDenyLoading: isAccepting || isDenying,
    // whatsapp
    handleWhatsApp,
    // export
    handleExport,
    isExporting,
    exportLocked: !features.feature_order_export,
    // feature lock modal
    lockedFeature,
    closeFeatureModal,
    // toast tempo real
    toast,
    dismissToast: () => toast && setDismissedToastId(toast.id),
  }
}
