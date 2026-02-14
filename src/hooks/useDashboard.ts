import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface DashboardSummary {
  today: {
    orders: number
    revenue: number
    products_sold: number
    new_customers: number
    revenue_growth: number
    orders_growth: number
    products_growth: number
    customers_growth: number
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
  price: number
  stock: number
  images: string[]
}

export interface RevenueData {
  period: string
  revenue: number
}

export interface ComparativeStats {
  orders: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
  revenue: {
    current: number
    previous: number
    change: number
    trend: 'up' | 'down'
  }
}

export interface DashboardData {
  summary: DashboardSummary
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  revenue: RevenueData[]
  comparativeStats: ComparativeStats
}

export interface DashboardDateFilter {
  dateFrom?: string
  dateTo?: string
}

export function useDashboard(dateFilter?: DashboardDateFilter) {
  const params = dateFilter?.dateFrom && dateFilter?.dateTo
    ? { dateFrom: dateFilter.dateFrom, dateTo: dateFilter.dateTo }
    : {}

  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary', params],
    queryFn: async (): Promise<DashboardSummary> => {
      const response = await api.get('/dashboard/summary', { params })
      
      // Verifica se a resposta tem a estrutura esperada
      if (response.data?.data?.summary) {
        return response.data.data.summary
      }
      
      // Se não tiver summary dentro de data.data, tenta diretamente
      if (response.data?.summary) {
        return response.data.summary
      }
      
      // Se não tiver data.data, tenta response.data diretamente
      if (response.data?.today) {
        return response.data as DashboardSummary
      }
      
      // Retorna o que vier em data.data
      return response.data.data || response.data
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
  })

  const comparativeStatsQuery = useQuery({
    queryKey: ['dashboard', 'comparative-stats', params],
    queryFn: async (): Promise<ComparativeStats> => {
      const response = await api.get('/dashboard/comparative-stats', { params })
      return response.data.data
    },
    staleTime: 30000,
  })

  return {
    summary: summaryQuery.data,
    recentOrders: recentOrdersQuery.data || [],
    topProducts: topProductsQuery.data || [],
    comparativeStats: comparativeStatsQuery.data,
    isLoading: summaryQuery.isLoading || recentOrdersQuery.isLoading || topProductsQuery.isLoading || comparativeStatsQuery.isLoading,
    isError: summaryQuery.isError || recentOrdersQuery.isError || topProductsQuery.isError || comparativeStatsQuery.isError,
    error: summaryQuery.error || recentOrdersQuery.error || topProductsQuery.error || comparativeStatsQuery.error,
  }
}

