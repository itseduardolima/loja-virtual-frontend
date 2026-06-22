import { useState } from 'react'
import { useAdminStores, useAdminToggleStoreStatus } from '@/hooks/useAdminStores'
import { AdminStore } from '@/types/admin'
import { useToastContext } from '@/contexts/ToastContext'

export function useLojasPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const { success, error } = useToastContext()

  const { data, isLoading, isError, refetch } = useAdminStores({
    page,
    limit: 20,
    search: search || undefined,
    status: statusFilter || undefined,
  })

  const toggleStatus = useAdminToggleStoreStatus()

  const handleToggle = async (store: AdminStore) => {
    try {
      await toggleStatus.mutateAsync(store.id)
      success('Status atualizado')
    } catch {
      error('Erro ao atualizar status')
    }
  }

  const stores = data?.data ?? []
  const meta = data?.meta ?? null
  const hasActiveFilters = !!(search || statusFilter)

  const clearFilters = () => {
    setSearch('')
    setStatusFilter('')
    setPage(1)
  }

  return {
    stores,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
    statusFilter,
    setStatusFilter,
    handleToggle,
    hasActiveFilters,
    clearFilters,
  }
}
