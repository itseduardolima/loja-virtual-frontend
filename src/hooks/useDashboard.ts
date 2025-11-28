import { useQuery } from '@tanstack/react-query'
import { api } from '@/lib/axios'

export interface DashboardSummary {
  today: {
    orders: number
    revenue: number
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
    images: string[]
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

export interface DashboardData {
  summary: DashboardSummary
  recentOrders: RecentOrder[]
  topProducts: TopProduct[]
  revenue: RevenueData[]
}

export function useDashboard(period: 'day' | 'week' | 'month' = 'month') {
  const summaryQuery = useQuery({
    queryKey: ['dashboard', 'summary'],
    queryFn: async (): Promise<DashboardSummary> => {
      const response = await api.get('/dashboard/summary')
      return response.data.data
    },
    staleTime: 30000, // 30 segundos
  })

  const recentOrdersQuery = useQuery({
    queryKey: ['dashboard', 'recent-orders'],
    queryFn: async (): Promise<RecentOrder[]> => {
      const response = await api.get('/dashboard/recent-orders')
      return response.data.data
    },
    staleTime: 30000,
  })

  const topProductsQuery = useQuery({
    queryKey: ['dashboard', 'top-products'],
    queryFn: async (): Promise<TopProduct[]> => {
      const response = await api.get('/dashboard/top-products')
      return response.data.data
    },
    staleTime: 30000,
  })

  const revenueQuery = useQuery({
    queryKey: ['dashboard', 'revenue', period],
    queryFn: async (): Promise<RevenueData[]> => {
      const response = await api.get(`/dashboard/revenue?period=${period}`)
      return response.data.data
    },
    staleTime: 30000,
  })

  return {
    summary: summaryQuery.data,
    recentOrders: recentOrdersQuery.data || [],
    topProducts: topProductsQuery.data || [],
    revenue: revenueQuery.data || [],
    isLoading: summaryQuery.isLoading || recentOrdersQuery.isLoading || topProductsQuery.isLoading || revenueQuery.isLoading,
    isError: summaryQuery.isError || recentOrdersQuery.isError || topProductsQuery.isError || revenueQuery.isError,
    error: summaryQuery.error || recentOrdersQuery.error || topProductsQuery.error || revenueQuery.error,
  }
}

