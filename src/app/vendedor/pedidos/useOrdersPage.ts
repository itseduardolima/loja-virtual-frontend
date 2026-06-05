'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { useDebounce } from '@/hooks/useDebounce'
import { useMarkOrderAsRead } from '@/hooks/useMarkOrderAsRead'
import { ORDER_STATUS, SORT_OPTIONS, type OrdersFilters, type Order } from '@/types/order'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'
import { type Column } from '@/components/Table'

const PANEL_ORDERS_LIMIT = 100
const COLUMN_PAGE_SIZE = 10
const DEFAULT_COLUMN_LIMITS: Record<number, number> = { 1: COLUMN_PAGE_SIZE, 2: COLUMN_PAGE_SIZE, 3: COLUMN_PAGE_SIZE, 4: COLUMN_PAGE_SIZE, 5: COLUMN_PAGE_SIZE }

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0)
const endOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999)


export function useOrdersPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const { mutate: markAsRead } = useMarkOrderAsRead()

  const [selectedOrderId, setSelectedOrderIdRaw] = useState<number | null>(() => {
    const id = searchParams.get('orderId')
    return id ? Number(id) : null
  })

  const [filters, setFilters] = useState<OrdersFilters>({
    page: 1,
    limit: 10,
    sort: 'DATE_DESC'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)
  const [dateRange, setDateRange] = useState<{ dateFrom: string; dateTo: string } | null>(() => {
    // Se veio de um redirect com orderId, remove o filtro de data para garantir que o pedido apareça
    if (searchParams.get('orderId')) return null
    const to = new Date()
    const from = new Date()
    from.setDate(from.getDate() - 6)
    return {
      dateFrom: from.toISOString().slice(0, 10),
      dateTo: to.toISOString().slice(0, 10),
    }
  })
  const [columnLimits, setColumnLimits] = useState<Record<number, number>>(DEFAULT_COLUMN_LIMITS)

  const { data, isLoading, error } = useOrders({
    ...filters,
    search: debouncedSearchTerm || undefined
  })

  const activeDateRange = useMemo((): { date_from?: string; date_to?: string } => {
    if (!dateRange) return {}
    return {
      date_from: startOfDay(new Date(dateRange.dateFrom + 'T12:00:00')).toISOString(),
      date_to: endOfDay(new Date(dateRange.dateTo + 'T12:00:00')).toISOString(),
    }
  }, [dateRange])

  // Query principal do painel — sempre últimos 7 dias (ou filtro manual)
  const { data: panelData } = useOrders({
    page: 1,
    limit: PANEL_ORDERS_LIMIT,
    sort: 'DATE_DESC',
    search: debouncedSearchTerm || undefined,
    ...activeDateRange,
  })

  // Marcar como lido ao selecionar pedido (só chama se ainda não lido)
  const setSelectedOrderId = (id: number | null) => {
    setSelectedOrderIdRaw(id)
    if (id !== null) {
      const order = panelOrders.find((o) => o.id === id)
      if (order?.read === 0) markAsRead(id)
    }
  }

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.profile !== 'Vendedor') {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router, authLoading])

  // Remove ?orderId da URL após abrir o drawer, sem causar novo render
  useEffect(() => {
    if (searchParams.get('orderId')) {
      const params = new URLSearchParams(searchParams.toString())
      params.delete('orderId')
      const newUrl = params.size > 0 ? `?${params.toString()}` : window.location.pathname
      router.replace(newUrl, { scroll: false })
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearchTerm])

  // Reset column limits when filters change
  useEffect(() => {
    setColumnLimits(DEFAULT_COLUMN_LIMITS)
  }, [dateRange, debouncedSearchTerm])

  const handleFilterChange = (key: keyof OrdersFilters, value: any) => {
    setFilters(prev => ({
      ...prev,
      [key]: value,
      page: 1
    }))
  }

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }))
  }

  const handleRangeSelect = (range: { dateFrom: string; dateTo: string } | null) => {
    setDateRange(range)
  }

  const handleShowMore = (status: number) => {
    setColumnLimits(prev => ({
      ...prev,
      [status]: (prev[status] ?? COLUMN_PAGE_SIZE) + COLUMN_PAGE_SIZE,
    }))
  }

  const getStatusInfo = (status: number) => {
    return ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
  }

  const orders = data?.data || []
  const meta = data?.meta
  const hasFilters = !!debouncedSearchTerm || !!filters.status

  const panelOrders = panelData?.data || []
  const panelTotal = panelData?.meta?.total ?? 0
  const ordersByStatus = useMemo(() => {
    const grouped: Record<number, Order[]> = { 1: [], 2: [], 3: [], 4: [], 5: [] }
    panelOrders.forEach((order) => {
      const status = order.status as 1 | 2 | 3 | 4 | 5
      if (status >= 1 && status <= 5) grouped[status].push(order)
    })
    // Não lidos aparecem primeiro em cada coluna
    for (const s of [1, 2, 3, 4, 5]) {
      grouped[s].sort((a, b) => (a.read === 0 ? -1 : 1) - (b.read === 0 ? -1 : 1))
    }
    return grouped
  }, [panelOrders])

  const visibleOrdersByStatus = useMemo(() => {
    const result: Record<number, Order[]> = {}
    for (const s of [1, 2, 3, 4, 5]) {
      result[s] = ordersByStatus[s].slice(0, columnLimits[s] ?? COLUMN_PAGE_SIZE)
    }
    return result
  }, [ordersByStatus, columnLimits])

  const columnHasMore = useMemo(() => {
    const result: Record<number, boolean> = {}
    for (const s of [1, 2, 3, 4, 5]) {
      result[s] = ordersByStatus[s].length > (columnLimits[s] ?? COLUMN_PAGE_SIZE)
    }
    return result
  }, [ordersByStatus, columnLimits])

  const columns: Column<any>[] = useMemo(() => [
    {
      key: 'order_code',
      header: 'Código',
      accessor: 'order_code',
      type: 'text' as const,
    },
    {
      key: 'customer_name',
      header: 'Cliente',
      accessor: 'customer_name',
      type: 'text' as const,
    },
    {
      key: 'customer_phone',
      header: 'Telefone',
      accessor: 'customer_phone',
      type: 'phone' as const,
    },
    {
      key: 'status',
      header: 'Status',
      accessor: (row: any) => getStatusInfo(row.status),
      type: 'badge' as const,
      options: {
        badgeColors: {
          yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' },
          blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
          purple: { bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200' },
          green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
          red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
        },
      },
    },
    {
      key: 'total',
      header: 'Total',
      accessor: (row: any) => formatPrice(parseFloat(row.total)),
      type: 'price' as const,
      options: {
        align: 'right' as const,
      },
    },
    {
      key: 'created_at',
      header: 'Data',
      accessor: (row: any) => formatDate(row.created_at),
      type: 'date' as const,
    },
    {
      key: 'actions',
      header: 'Ações',
      accessor: 'id',
      type: 'button' as const,
      options: {
        buttonIcon: EyeIcon,
        buttonVariant: 'ghost' as const,
        buttonOnClick: (row: any) => router.push(`/vendedor/pedidos/${row.id}`),
        align: 'right' as const,
      },
    },
  ], [router, getStatusInfo])

  return {
    // Auth
    isAuthenticated,
    user,
    authLoading,
    // Panel (lista por status + detalhe)
    selectedOrderId,
    setSelectedOrderId,
    panelOrders,
    panelTotal,
    ordersByStatus,
    visibleOrdersByStatus,
    columnHasMore,
    handleShowMore,
    // Date filter
    dateRange,
    handleRangeSelect,
    hasDateFilter: !!dateRange,
    dateFromInput: dateRange?.dateFrom ?? '',
    dateToInput: dateRange?.dateTo ?? '',
    // Filters
    filters,
    searchTerm,
    setSearchTerm,
    handleFilterChange,
    // Data
    orders,
    meta,
    isLoading,
    error,
    // Pagination
    handlePageChange,
    // Table
    columns,
    hasFilters,
    getStatusInfo,
    // Export
    exportFilters: {
      search: debouncedSearchTerm || undefined,
      ...activeDateRange,
      status: filters.status,
      sort: filters.sort,
    },
    // Utils
    ORDER_STATUS,
    SORT_OPTIONS,
    router,
  }
}
