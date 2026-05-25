import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/api'

export interface CartConversionStats {
  total_sessions: number
  converted_sessions: number
  abandoned_sessions: number
  conversion_rate: number
}

export interface ComparisonMetric {
  current: number
  previous: number
  delta: number
  delta_percent: number | null
  dir: 'up' | 'down' | 'flat'
}

export interface DashboardComparison {
  revenue: ComparisonMetric
  orders: ComparisonMetric
  products_sold: ComparisonMetric
  conversion: ComparisonMetric
}

export interface DashboardSummary {
  today: {
    orders: number
    revenue: number
    products_sold: number
  }
  week: {
    orders: number
    revenue: number
  }
  month: {
    orders: number
    revenue: number
  }
  products: {
    total: number
    low_stock: number
  }
  orders: {
    pending: number
    total: number
  }
  revenue: {
    total: number
  }
  cart_conversion?: CartConversionStats
  comparison?: DashboardComparison
  comparison_range?: { from: string; to: string }
}

export interface RecentOrder {
  id: number
  order_number: string
  order_code: string
  status: number
  status_text: string
  total: number
  customer_name: string
  customer_phone: string
  items_count: number
  created_at: string
  items: Array<{
    id: number
    product_name: string
    quantity: number
    price: number
    images: string[] | Record<string, string[]>
  }>
}

export interface TopProduct {
  product_id: number
  product_name: string
  total_sold: number
  total_orders: number
  revenue: number
  price: number
  stock: number
  images: string[]
}

export interface RevenueData {
  period: string
  revenue: number
}

export interface DashboardData {
  summary: DashboardSummary
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  revenue: RevenueData[]
}

export interface DashboardDateFilter {
  dateFrom?: string
  dateTo?: string
}

export interface UseDashboardOptions {
  enableAdvanced?: boolean
}

export function useDashboard(dateFilter?: DashboardDateFilter, options: UseDashboardOptions = {}) {
  const { enableAdvanced = true } = options
  const params =
    dateFilter?.dateFrom && dateFilter?.dateTo
      ? { dateFrom: dateFilter.dateFrom, dateTo: dateFilter.dateTo }
      : {}

  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary', params],
    queryFn: async (): Promise<DashboardSummary> => {
      const response = await api.get('/dashboard/summary', { params })

      return response.data.data.summary
    },
    staleTime: 30000, // 30 segundos
  })

  const recentOrdersQuery = useQuery({
    queryKey: ['dashboard', 'recent-orders', params],
    queryFn: async (): Promise<RecentOrder[]> => {
      const response = await api.get('/dashboard/recent-orders', { params })
      return response.data.data
    },
    staleTime: 30000,
  })

  const topProductsQuery = useQuery({
    queryKey: ['dashboard', 'top-products', params],
    queryFn: async (): Promise<TopProduct[]> => {
      const response = await api.get('/dashboard/top-products', { params })
      return response.data.data
    },
    staleTime: 30000,
    enabled: enableAdvanced,
  })

  return {
    summary: summaryQuery.data,
    recentOrders: recentOrdersQuery.data || [],
    topProducts: topProductsQuery.data || [],
    isLoading: summaryQuery.isLoading || recentOrdersQuery.isLoading,
    isError: summaryQuery.isError || recentOrdersQuery.isError,
    error: summaryQuery.error || recentOrdersQuery.error,
  }
}
