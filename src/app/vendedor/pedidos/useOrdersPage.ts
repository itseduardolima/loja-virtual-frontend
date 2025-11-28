'use client'

import { useState, useEffect, useMemo } from 'react'
import { useRouter } from 'next/navigation'
import { useOrders } from '@/hooks/useOrders'
import { useDebounce } from '@/hooks/useDebounce'
import { ORDER_STATUS, SORT_OPTIONS, type OrdersFilters } from '@/types/order'
import { useAuth } from '@/contexts/AuthContext'
import { EyeIcon } from 'lucide-react'
import { formatDate, formatPrice } from '@/lib/utils'
import { type Column } from '@/components/Table/Table'

export function useOrdersPage() {
  const router = useRouter()
  const { isAuthenticated, user, isLoading: authLoading } = useAuth()
  const [filters, setFilters] = useState<OrdersFilters>({
    page: 1,
    limit: 10,
    sort: 'DATE_DESC'
  })
  const [searchTerm, setSearchTerm] = useState('')
  const debouncedSearchTerm = useDebounce(searchTerm, 1000)

  const { data, isLoading, error } = useOrders({
    ...filters,
    search: debouncedSearchTerm || undefined
  })

  useEffect(() => {
    if (!authLoading) {
      if (!isAuthenticated) {
        router.push('/login')
      } else if (user?.profile !== 'Vendedor') {
        router.push('/')
      }
    }
  }, [isAuthenticated, user, router, authLoading])

  useEffect(() => {
    setFilters(prev => ({ ...prev, page: 1 }))
  }, [debouncedSearchTerm])

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

  const getStatusInfo = (status: number) => {
    return ORDER_STATUS[status as keyof typeof ORDER_STATUS] || ORDER_STATUS[1]
  }

  const orders = data?.data || []
  const meta = data?.meta
  const hasFilters = !!debouncedSearchTerm || !!filters.status

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
    
    // Utils
    ORDER_STATUS,
    SORT_OPTIONS,
    router,
  }
}

