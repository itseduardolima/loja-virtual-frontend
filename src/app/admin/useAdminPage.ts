import { useAdminStats } from '@/hooks/useAdminStats'
import { useAdminRevenue } from '@/hooks/useAdminRevenue'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useAdminPage() {
  const {
    data: stats,
    isLoading: loadingStats,
    isError: isErrorStats,
    refetch: refetchStats,
  } = useAdminStats()

  const {
    data: revenue,
    isLoading: loadingRevenue,
    isError: isErrorRevenue,
    refetch: refetchRevenue,
  } = useAdminRevenue(6)

  const chartData =
    revenue?.map((item) => ({
      name: format(new Date(item.month + '-01'), 'MMM', { locale: ptBR }),
      receita: item.revenue,
    })) ?? []

  return {
    stats,
    loadingStats,
    isErrorStats,
    refetchStats,
    loadingRevenue,
    isErrorRevenue,
    refetchRevenue,
    chartData,
  }
}
