import { useState } from 'react'
import { useAdminUsers, useAdminToggleUserStatus } from '@/hooks/useAdminUsers'
import { AdminUser } from '@/types/admin'
import { useToastContext } from '@/contexts/ToastContext'

export function useUsuariosPage() {
  const { success, error } = useToastContext()
  const [selectedUserId, setSelectedUserId] = useState<number | null>(null)
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [profileFilter, setProfileFilter] = useState('')
  const [statusFilter, setStatusFilter] = useState('')

  const { data, isLoading } = useAdminUsers({
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

  const profileNames: Record<number, string> = { 1: 'Administrador', 2: 'Vendedor', 3: 'Cliente' }

  const users = (data as any)?.data ?? []
  const rawMeta = (data as any)?.meta
  const meta = rawMeta ? {
    total: rawMeta.total ?? 0,
    currentPage: rawMeta.currentPage ?? page,
    perPage: rawMeta.perPage ?? 10,
    lastPage: rawMeta.lastPage ?? 1,
    prev: rawMeta.prev ?? null,
    next: rawMeta.next ?? null,
  } : null

  return {
    users,
    meta,
    isLoading,
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
    profileNames,
  }
}
