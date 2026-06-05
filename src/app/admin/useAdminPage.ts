import { useAdminStats } from '@/hooks/useAdminStats'
import { useAdminRevenue } from '@/hooks/useAdminRevenue'
import { formatBRL } from '@/lib/utils'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

export function useAdminPage() {
  const { data: stats, isLoading: loadingStats } = useAdminStats()
  const { data: revenue, isLoading: loadingRevenue } = useAdminRevenue(6)

  const formatCurrency = formatBRL

  const chartData = revenue?.map(item => ({
    name: format(new Date(item.month + '-01'), 'MMM', { locale: ptBR }),
    receita: item.revenue,
  })) || []

  return { stats, loadingStats, loadingRevenue, formatCurrency, chartData }
}
