import { useState } from 'react'
import { useAdminUsers, useAdminToggleUserStatus } from '@/hooks/useAdminUsers'
import { AdminUser, PaginatedMeta } from '@/types/admin'
import { useToastContext } from '@/contexts/ToastContext'

interface AdminUsersResponse {
  data: AdminUser[]
  meta: PaginatedMeta
}

export function useUsuariosPage() {
  const { success, error } = useToastContext()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [profileFilter, setProfileFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading, isError, refetch } = useAdminUsers({
    page,
    limit: 10,
    search: search || undefined,
    profile: profileFilter || undefined,
    status: statusFilter || undefined,
  })

  const toggleStatus = useAdminToggleUserStatus()

  const handleToggleStatus = async (user: AdminUser) => {
    try {
      await toggleStatus.mutateAsync(user.id)
      success('Status atualizado com sucesso')
    } catch {
      error('Erro ao atualizar status')
    }
  }

  const response = data as AdminUsersResponse | undefined
  const users = response?.data ?? []
  const rawMeta = response?.meta
  const meta = rawMeta
    ? {
        total: rawMeta.total ?? 0,
        currentPage: rawMeta.currentPage ?? page,
        perPage: rawMeta.perPage ?? 10,
        lastPage: rawMeta.lastPage ?? 1,
        prev: rawMeta.prev ?? null,
        next: rawMeta.next ?? null,
      }
    : null

  const hasActiveFilters = !!(search || profileFilter || statusFilter)

  const clearFilters = () => {
    setSearch('')
    setProfileFilter('')
    setStatusFilter('')
    setPage(1)
  }

  return {
    users,
    meta,
    isLoading,
    isError,
    refetch,
    page,
    setPage,
    search,
    setSearch,
    profileFilter,
    setProfileFilter,
    statusFilter,
    setStatusFilter,
    selectedUserId,
    setSelectedUserId,
    handleToggleStatus,
    hasActiveFilters,
    clearFilters,
  }
}
