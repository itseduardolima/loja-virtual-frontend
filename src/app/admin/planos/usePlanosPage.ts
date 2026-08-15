import { useState } from 'react'
import { useAdminPlans, useAdminDeletePlan } from '@/hooks/useAdminPlans'
import { AdminPlan } from '@/types/admin'
import { useToastContext } from '@/contexts/ToastContext'

export function usePlanosPage() {
  const { success, error } = useToastContext()
  const [page, setPage] = useState(1)
  const [confirmDelete, setConfirmDelete] = useState<AdminPlan | null>(null)

  const { data, isLoading, isError, refetch } = useAdminPlans({ page, limit: 20 })
  const deletePlan = useAdminDeletePlan()

  const handleDelete = async () => {
    if (!confirmDelete) return
    try {
      await deletePlan.mutateAsync(confirmDelete.id)
      success('Plano desativado com sucesso')
    } catch {
      error('Erro ao desativar plano')
    } finally {
      setConfirmDelete(null)
    }
  }

  const plans = data?.data ?? []
  const meta = data?.meta ?? null

  return { plans, meta, isLoading, isError, refetch, page, setPage, confirmDelete, setConfirmDelete, handleDelete }
}
