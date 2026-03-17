import { useState } from 'react'
import { useAdminRefunds } from '@/hooks/useAdminRefunds'
import { AdminRefund } from '@/types/admin'
import { useToastContext } from '@/contexts/ToastContext'
import { api } from '@/lib/axios'
import { useQueryClient } from '@tanstack/react-query'

export function useEstornosPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [confirmAction, setConfirmAction] = useState<{ refund: AdminRefund; action: 'approve' | 'reject' } | null>(null)
  const { success, error } = useToastContext()
  const qc = useQueryClient()

  const { data, isLoading } = useAdminRefunds({
    page,
    limit: 20,
    search: search || undefined,
  })

  const handleAction = async () => {
    if (!confirmAction) return
    try {
      const res = await api.post(`/admin/refunds/${confirmAction.refund.id}/${confirmAction.action}`)
      success(res.data?.message ?? (confirmAction.action === 'approve' ? 'Estorno aprovado' : 'Estorno rejeitado'))
      qc.invalidateQueries({ queryKey: ['admin', 'refunds'] })
    } catch (e: any) {
      error(e?.response?.data?.message ?? 'Erro ao processar estorno')
    } finally {
      setConfirmAction(null)
    }
  }

  const methodMap: Record<string, string> = {
    credit_card: 'Cartão de Crédito',
    pix: 'PIX',
    boleto: 'Boleto',
  }

  const refunds = data?.data ?? []
  const meta = data?.meta ?? null

  return { refunds, meta, isLoading, page, setPage, search, setSearch, confirmAction, setConfirmAction, handleAction, methodMap }
}
